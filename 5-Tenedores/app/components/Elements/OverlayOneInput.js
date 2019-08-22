import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";

export default class OverlayOneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
    //console.log(this.state);
  }

  onChangeInput = inputData => {
    this.setState({
      inputValue: inputData
    });
  };

  update = () => {
    const newValue = this.state.inputValue;
    this.state.updateFunction(newValue);
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
    const { isVisibleOverlay, placeholder, inputValue } = this.state;
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
            placeholder={placeholder}
            onChangeText={value => this.onChangeInput(value)}
            value={inputValue}
          />
          <Button
            buttonStyle={styles.buttonUpdate}
            title="Actualizar"
            onPress={() => this.update()}
          />
          <Icon
            containerStyle={styles.containerStyleIconClose}
            type="material-community"
            name="close-circle-outline"
            size={30}
            color="#b3b3b3"
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
    right: -2,
    top: -3
  }
});
