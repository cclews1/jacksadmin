import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyCbGNzD7c7TXQOQmHjrd5p-iwggWNApVk8',
  authDomain: 'jacks-c1db1.firebaseapp.com',
  databaseURL: 'https://jacks-c1db1.firebaseio.com',
  projectId: 'jacks-c1db1',
  storageBucket: 'jacks-c1db1.appspot.com',
  messagingSenderId: '1070700048057',
  appId: '1:1070700048057:web:de9c31c300a2d15fe4f568',
  measurementId: 'G-J6Z3L0EKE8',
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();
