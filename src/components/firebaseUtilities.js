import firebase from '../firebase';
import uuid from 'uuid/dist/v4';

const fileExt = '_1500x1000';

const storage = firebase.storage();
const database = firebase.database();
const carDB = firebase.database().ref('cars/');

export async function imageGet(imageName) {
  let imgUrl;
  await storage
    .ref(`${imageName}`)
    .getDownloadURL()
    .then((url) => {
      imgUrl = url;
    })
    .catch((err) => {
      console.log(err);
    });
  return imgUrl;
}

export async function pullInventory(context) {
  const [inventory, setInventory] = context.inventory;
  const [editVehicle, setEditVehicle] = context.editVehicle;
  return await firebase
    .database()
    .ref('cars/')
    .get()
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const data = snapshot.val();
        function getJsonData(data) {
          const carsArray = Object.entries(data).map((entry) => {
            return {
              ...entry[1],
              id: entry[0],
            };
          });
          const carsArraywithImages = carsArray.map((car) => {
            if (!car.images || car.images === []) {
              return car;
            } else {
              const imagesArray = Object.values(car.images);
              return {
                ...car,
                images: imagesArray,
              };
            }
          });
          return carsArraywithImages;
        }
        const jsonData = getJsonData(data);
        await setInventory(jsonData);
        await setEditVehicle(() => {
          if (!editVehicle) return jsonData[0];
          const vehicle = jsonData.find((car) => car.id === editVehicle.id);
          if (vehicle === undefined) {
            return jsonData[0];
          } else return vehicle;
        });
      } else {
        setInventory([]);
        setEditVehicle({});
        console.log(inventory);
      }
    })
    .catch((err) => {
      console.log(err.message);
      setInventory([]);
    });
}

export async function update(newImages, editValues, prevImages, editVehicle) {
  let messages = [];
  try {
    // Check if the form data and images are completely unchanged, then return a 'No changes' message if it is unchanged.
    if (
      editValues === editVehicle &&
      (!newImages.length || !Array.isArray(newImages)) &&
      prevImages === editVehicle.images
    ) {
      return {
        severity: 'warning',
        message: 'No changes made.',
      };
    }

    // Check for changes to the Form Data portion of the car's data, then update the database if there are changes.
    await updateFormData(editValues, editVehicle, messages);

    // Check for changes (deletes) of the previous files, then delete from storage bucket and remove reference from database.
    await deleteRemovedPreviousImages(prevImages, editVehicle, messages);

    await uploadFiles(editVehicle.id, newImages, messages);

    return {
      severity: 'success',
      message: messageBuilder(messages),
    };
  } catch (err) {
    return {
      severity: 'error',
      message: err,
    };
  }
}

function getDifference(a1, a2) {
  var a = [],
    diff = [];

  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (var k in a) {
    diff.push(k);
  }

  return diff;
}

async function deleteRemovedPreviousImages(prevImages, editVehicle, messages) {
  if (prevImages === editVehicle.images) {
    return;
  }
  const imagesToDelete = getDifference(prevImages, editVehicle.images);

  // Get the database keys for all images related to the vehicle.
  await database
    .ref('cars/' + editVehicle.id + '/images')
    .get()
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        let imageRefs = Object.entries(snapshot.val()).map((image) => {
          return {
            id: image[0],
            image: image[1],
          };
        });

        // Get the keys for all images to be deleted.
        const deleteKeys = imagesToDelete.map((image) => {
          return imageRefs.find((ref) => ref.image === image);
        });

        // Construct an object to send as "update" payload in firebase.database.ref().update({payload}) function. This prevents sending multiple "remove" api calls.
        let deleteObj = {};
        deleteKeys.forEach((obj) => (deleteObj[obj.id] = null));

        // Delete image refs via the update function.
        await database
          .ref('cars/' + editVehicle.id + '/images/')
          .update(deleteObj, (err) => {
            if (err) throw err.message;
          });
      }
    });

  // Delete each appropriate file from the Storage Bucket by mapping over the array of files to delete. (There is currently no method for deleting multiple files at once from a firebase storage bucket.)
  await Promise.all(
    imagesToDelete.map((imageName) =>
      storage
        .ref(imageName)
        .delete()
        .catch((err) => {
          if (err) throw err.message;
        })
    )
  );

  messages.push('edited previous images');
}

async function updateFormData(editValues, editVehicle, messages) {
  const { id, images, ...newData } = editValues;
  const { id: currentId, images: currentImages, ...currentData } = editVehicle;

  console.log('datas');
  console.log(currentData);
  console.log(newData);
  if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
    await database
      .ref('cars/')
      .child(editVehicle.id)
      .update(newData, (err) => {
        if (err) {
          throw err.message;
        }
      });
    messages.push('updated form data');
  }
}

function messageBuilder(messageArray) {
  const message = new Intl.ListFormat().format(messageArray);
  const uppercaseMessage =
    message.charAt(0).toUpperCase() + message.slice(1) + '.';
  return uppercaseMessage;
}

async function uploadFile(carId, image) {
  const imgId = uuid();
  try {
    const fileRef = storage.ref().child(imgId);
    await fileRef
      .put(image, (err) => {
        if (err) throw err;
      })
      .then((upload) => {
        console.log(upload);
      });
    await carDB.child(carId + '/images').push(imgId + fileExt, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    throw err;
  }
}

export async function uploadFiles(carId, newImages, messages) {
  if (!newImages.length || !Array.isArray(newImages)) return;
  await Promise.all(
    newImages.map((newFile) => {
      return uploadFile(carId, newFile);
    })
  );
  if (messages) {
    messages.push('uploaded new images');
  }
}

export async function handleSubmit(e, uploadForm, images) {
  const newKey = carDB.push().key;
  const newDateObj = () => {
    let newDate = new Date(Date.now());
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    let formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  };
  uploadForm.date = newDateObj();
  return await carDB
    .child(newKey)
    .set(uploadForm, async (err) => {
      if (err) {
        throw err.message;
      }
    })
    .then(async () => {
      if (images) {
        await Promise.all(
          images.map((image) => uploadFile(newKey, image))
        ).catch((err) => {
          if (err) {
            throw err.message;
          }
        });
      } else return;
    })
    .then(() => {
      return {
        message: 'Successful upload!',
        severity: 'success',
      };
    })
    .catch((err) => {
      return {
        message: err,
        severity: 'error',
      };
    });
}

export async function removeVehicle(editVehicle) {
  try {
    await carDB.update(
      {
        [editVehicle.id]: null,
      },
      (err) => {
        if (err) throw err.message;
      }
    );
    // Check if vehicle has images, then delete if it does.
    if (Array.isArray(editVehicle.images) && editVehicle.images[0]) {
      await Promise.all(
        editVehicle.images.map((imageName) =>
          storage
            .ref(imageName)
            .delete()
            .catch((err) => {
              if (err) throw err.message;
            })
        )
      );
    }
    return {
      message: `Successfully deleted ${editVehicle.make} ${editVehicle.model}`,
      severity: 'success',
    };
  } catch (err) {
    return { message: err.message, severity: 'error' };
  }
}
