import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";

export default class OverlayThreeInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
    //console.log(this.state);
  }

  onChangeInputOne = inputData => {
    this.setState({
      inputValueOne: inputData
    });
  };
  onChangeInputTwo = inputData => {
    this.setState({
      inputValueTwo: inputData
    });
  };
  onChangeInputThree = inputData => {
    this.setState({
      inputValueThree: inputData
    });
  };

  update = () => {
    const newValueOne = this.state.inputValueOne;
    const newValueTwo = this.state.inputValueTwo;
    const newValueThree = this.state.inputValueThree;

    this.state.updateFunction(newValueOne, newValueTwo, newValueThree);

    this.setState({
      isVisibleOverlay: false
    });
  };

  close = () => {
    this.setState({
      isVisibleOverlay: false
    });
    this.state.updateFunction(null);
  };

  render() {
    const {
      isVisibleOverlay,
      placeholderOne,
      placeholderTwo,
      placeholderThree,
      inputValueOne,
      inputValueTwo,
      inputValueThree,
      isPassword
    } = this.state;
    //console.log(this.state.isVisibleOverlay);
    return (
      <Overlay
        isVisible={isVisibleOverlay}
        //overlayBackgroundColor="transparent"
        overlayStyle={styles.overlayStyle}
        onBackdropPress={() => this.close()}
      >
        <View style={styles.viewOverlay}>
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderOne}
            onChangeText={value => this.onChangeInputOne(value)}
            value={inputValueOne}
            password={isPassword}
            secureTextEntry={isPassword}
          />
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderTwo}
            onChangeText={value => this.onChangeInputTwo(value)}
            value={inputValueTwo}
            password={isPassword}
            secureTextEntry={isPassword}
          />
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderThree}
            onChangeText={value => this.onChangeInputThree(value)}
            value={inputValueThree}
            password={isPassword}
            secureTextEntry={isPassword}
          />
          <Button
            buttonStyle={styles.buttonUpdate}
            title="Actualizar Contraseña"
            onPress={() => this.update()}
          />
          <Icon
            containerStyle={styles.containerStyleIconClose}
            type="material-community"
            name="close-circle"
            size={35}
            color="#f00"
            onPress={() => this.close()}
          />
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  overlayStyle: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: "auto"
  },
  viewOverlay: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderColor: "#00a680",
    borderWidth: 2,
    margin: 0
  },
  inputContainer: {
    marginBottom: 20
  },
  buttonUpdate: {
    backgroundColor: "#00a680"
  },
  containerStyleIconClose: {
    position: "absolute",
    right: -15,
    top: -16
  }
});
