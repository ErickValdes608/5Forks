import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Image, Button, Divider, SocialIcon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import t from "tcomb-form-native";
const Form = t.form.Form;
import { LoginStruct, LoginOptions } from "../../forms/Login";

import * as firebase from "firebase";
import { FacebookApi } from "../../utils/Social";
import * as Facebook from "expo-facebook";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      loginStruct: LoginStruct,
      loginOptions: LoginOptions,
      loginData: {
        email: "",
        password: ""
      },
      loginErrorMessage: ""
    };
  }

  login = () => {
    const validate = this.refs.loginForm.getValue();

    if (!validate) {
      this.setState({
        loginErrorMessage: "Los datos del formulario son erroneos"
      });
    } else {
      this.setState({
        loginErrorMessage: ""
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(validate.email, validate.password)
        .then(() => {
          console.log("Login correcto");
          this.refs.toastLogin.show("Login Correcto", 200, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(erro => {
          this.refs.toastLogin.show("Login Incorrecto revise sus datos", 2500);
        });
    }
  };

  loginFacebook = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );
    if (type == "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      console.log(credentials);
      firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          this.refs.toastLogin.show("Inicio de sesion correcto", 100, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(erro => {
          this.refs.toastLogin.show("Error al iniciar sesion con FB", 300);
        });
    } else if (type == "cancel") {
      this.refs.toastLogin.show("Inicio de sesion cancelado", 300);
    } else {
      this.refs.toastLogin.show("Error desconocido", 300);
    }
  };

  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  onChangeFormLogin = loginValue => {
    this.setState({
      loginData: loginValue
    });
  };
  render() {
    const { loginStruct, loginOptions, loginErrorMessage } = this.state;
    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          containerStyle={styles.containerLogo}
          style={styles.logo}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
        />
        <View style={styles.viewForm}>
          <Form
            ref="loginForm"
            type={loginStruct}
            options={loginOptions}
            value={this.state.loginData}
            onChange={loginValue => this.onChangeFormLogin(loginValue)}
          />
          <Button
            buttonStyle={styles.buttonLoginContainer}
            title="Login"
            onPress={() => this.login()}
          />
          <Text style={styles.textRegister}>
            ¿Aún no tienes cuenta?{" "}
            <Text style={styles.btnRegister} onPress={() => this.goToScreen("Register")}>Registrate</Text>
          </Text>

          <Text style={styles.loginErrorMessage}>{loginErrorMessage}</Text>
          <Divider style={styles.divider} />
          <SocialIcon
            title="Sign In With Facebook"
            button
            type="facebook"
            onPress={() => this.loginFacebook()}
          />
        </View>
        <Toast
          ref="toastLogin"
          position="bottom"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30
    //alignItems: "center"
  },
  containerLogo: {
    alignItems: "center"
  },
  logo: {
    width: 300,
    height: 150
  },
  viewForm: {
    marginTop: 50
  },
  buttonLoginContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  loginErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  divider: {
    backgroundColor: "#00a680",
    marginBottom: 20
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
