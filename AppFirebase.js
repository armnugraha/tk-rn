import React, { Component } from 'react';

import {
  View,
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';

import firebase from 'react-native-firebase';

export default class FireBaseScreen extends Component {
  
  constructor(props) {super(props);
    this.state = {
      torchOn: false
    }
  }

  componentDidMount(){
  	firebase.auth()
	  .signInAnonymously()
	  .then(credential => {
	    if (credential) {
	      alert(JSON.stringify(credential))
	    }
	  });
  }

  render() {
    return (
      <View>
      </View>
    )

  }
}