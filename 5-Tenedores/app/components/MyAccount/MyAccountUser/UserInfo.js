import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import UpdateUserInfo from "./UpdateUserInfo";
import SolucionTimer from "../../../lib/SolucionTimer";
import PreLoeader from "../../Elements/PreLoader";

import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      userInfo: {},
      loaded: false
    };
  }

  componentDidMount = async () => {
    await this.getUserInfo();
    this.setState({
      loaded: true
    });
  };

  getUserInfo = () => {
    const user = firebase.auth().currentUser;

    user.providerData.forEach(userInfo => {
      this.setState({
        userInfo
      });
    });
  };

  reauthenticate = currentPassword => {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credentials);
  };

  checkuserAvatar = photoURL => {
    return photoURL
      ? { uri: photoURL }
      : require("../../../../assets/img/ninja-simple.png");
    //"https://api.adorable.io/avatars/285/abott@adorable.png";
  };

  updateUserDisplayName = async newDisplayName => {
    const update = {
      displayName: newDisplayName
    };
    await firebase.auth().currentUser.updateProfile(update);
    //this.getUserInfo();
    this.setState({
      infoUser: {
        ...this.state.infoUser,
        displayName: newDisplayName
      }
    });
  };

  updateUserEmail = async (newEmail, password) => {
    this.reauthenticate(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            this.refs.toast.show(
              "Email actualizado, vuelve a iniciar sesion",
              100,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toast.show(err, 1500);
          });
      })
      .catch(err => {
        this.refs.toast.show("Tu contraseña no es correcta", 1500);
      });
  };

  updateUserPassword = async (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            this.refs.toast.show(
              "Contraseña Actualizada correctamente, vielve a iniciar sesion",
              100,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(() => {
            this.refs.toast.show(
              "Error del servidor, intentelo mas tarde",
              1500
            );
          });
      })
      .catch(() => {
        this.refs.toast.show("Tu contraseña no es correcta", 1500);
      });
  };

  returnUpdateUserInfoComponent = userInfoData => {
    if (userInfoData.hasOwnProperty("uid")) {
      return (
        <UpdateUserInfo
          userInfo={this.state.userInfo}
          updateUserDisplayName={this.updateUserDisplayName}
          updateUserEmail={this.updateUserEmail}
          updateUserPassword={this.updateUserPassword}
        />
      );
    }
  };

  updateUserPhotoUrl = async photoUri => {
    const update = {
      photoURL: photoUri
    };
    await firebase.auth().currentUser.updateProfile(update);
    //this.getUserInfo();
    this.setState({
      infoUser: {
        ...this.state.infoUser,
        photoURL: photoUri
      }
    });
  };

  changeAvatarUser = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermission.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galeria",
        250
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (result.cancelled == "true") {
        this.refs.toast.show("has cancelado la galeria de imagenes", 250);
      } else {
        this.uploadImage(result.uri, this.state.userInfo.uid);
      }
    }
  };

  uploadImage = async (uri, uid) => {
    this.setState({
      loaded: false
    });
    await fetch(uri)
      .then(async resul => {
        elStorage = firebase
          .storage()
          .ref()
          .child("avatar/" + uid);
        await elStorage.put(resul._bodyBlob);

        this.refs.toast.show("Imagen subida!", 1500);

        firebase
          .storage()
          .ref("avatar/" + uid)
          .getDownloadURL()
          .then(resolve => {
            this.updateUserPhotoUrl(resolve);
            //console.log(resolve);
          })
          .catch(err => {
            this.refs.toast.show("Error al recuperar el avatar del servidor");
          });
      })
      .catch(error => {
        this.refs.toast.show("Ocurrio un error, inténtalo nuevamente.", 1500);
      });
    this.setState({
      loaded: true
    });
  };

  render() {
    const { displayName, email, photoURL } = this.state.userInfo;
    const { loaded } = this.state;
    //console.log(this.checkuserAvatar(photoURL));
    if (!loaded) {
      return (
        <View style={styles.viewPreloader}>
          <PreLoeader />
          <Toast
            ref="toast"
            position="bottom"
            positionValue={250}
            fadeInDuration={1000}
            fadeoutDuration={1000}
            opacity={0.8}
            tectStyle={{ color: "#fff" }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.viewUserInfo}>
            <Avatar
              rounded
              size="large"
              source={this.checkuserAvatar(photoURL)}
              containerStyle={styles.userInfoAvatar}
              showEditButton
              onEditPress={() => this.changeAvatarUser()}
            />
            <View>
              <Text style={styles.displayName}>{displayName}</Text>
              <Text>{email}</Text>
            </View>
          </View>
          {this.returnUpdateUserInfoComponent(this.state.userInfo)}
          <Button
            buttonStyle={styles.buttonSignOut}
            titleStyle={styles.buttonSignOutText}
            title="Logout"
            onPress={() => firebase.auth().signOut()}
          />
          <Toast
            ref="toast"
            position="bottom"
            positionValue={250}
            fadeInDuration={1000}
            fadeoutDuration={1000}
            opacity={0.8}
            tectStyle={{ color: "#fff" }}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#f2f2f2"
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  },
  buttonSignOut: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e3e3e3",
    paddingTop: 13,
    paddingBottom: 13
  },
  buttonSignOutText: {
    color: "#00a680"
  },
  viewPreloader:{
    flex:1
  }
});
