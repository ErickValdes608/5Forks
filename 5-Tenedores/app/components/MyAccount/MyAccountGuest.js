import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, Image } from "react-native-elements";

export default class MyAccountGuest extends Component {
  constructor(props) {
    //Al no ser una screen no tiene navegacion
    super(props); //Por lo cual se carga la funcion de MyAccount
  }
  render() {
    const { goToScreen } = this.props; //Se guarda como constante para acceder dentro del render
    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/image-my-account-guest-01.jpg")}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
        />
        <Text style={styles.title}> Consulta tu perfil de 5 Tenedores</Text>
        <Text style={styles.description}>
          ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores
          restaurantes de una forma sensilla, vota cual te ha gustado más y
          comenta como ha sido tu experiencia.
        </Text>
        <View>
          <Button
            buttonStyle={styles.btnViewProfile}
            title="Ver tu perfil"
            onPress={() => goToScreen("Login")}
            titleStyle={{
              textShadowColor: "black",
              //textAlign: "left",
              textShadowRadius: 10
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    height: 300,
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10
  },
  description: {
    textAlign: "center",
    marginBottom: 20
  },
  btnViewProfile: {
    width: "100%",
    backgroundColor: "#00a680",
    borderColor: "black"
  }
});
