import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";

import ActionButton from "react-native-action-button";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default class Restaurants extends Component {
  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  constructor() {
    super();
    this.state = {
      login: false,
      restaurants: null,
      startRestaurants: null,
      limitRestaurant: 7,
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.loadRestaurant();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  };

  loadActionButon = () => {
    const { login } = this.state;
    if (login) {
      return (
        <ActionButton
          buttonColor="#00a680"
          title="New Task"
          onPress={() => this.goToScreen("AddRestaurant")}
        />
      );
    }
    return null;
  };

  loadRestaurant = async () => {
    const { limitRestaurant } = this.state;
    let resultRestaurants = [];

    const restaurants = db
      .collection("restaurants")
      .orderBy("createdAt", "desc")
      .limit(limitRestaurant);

    await restaurants.get().then(response => {
      this.setState({
        startRestaurants: response.docs[response.docs.length - 1]
      });

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push(restaurant);
      });
      this.setState({
        restaurants: resultRestaurants
      });
    });
  };

  loadHandleMore = async () => {
    const { limitRestaurant, startRestaurants } = this.state;
    let resultRestaurants = [];

    this.state.restaurants.forEach(doc => {
      resultRestaurants.push(doc);
    });

    const restaurantsDb = db
      .collection("restaurants")
      .orderBy("createdAt", "desc")
      .startAfter(startRestaurants.data().createdAt)
      .limit(limitRestaurant);

    await restaurantsDb.get().then(response => {
      if (response.docs.length > 0) {
        this.setState({
          startRestaurants: response.docs[response.docs.length - 1]
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
      //console.log(restaurants)
      console.log(response.docs.length);
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push(restaurant);
        console.log(doc.data());
      });
      this.setState({
        restaurants: resultRestaurants
      });
    });
    //console.log(this.state.restaurants)
    //console.log(resultRestaurants);
  };

  renderRow = restaurants => {
    const { name, city, address, description, image } = restaurants.item;
    //console.log(restaurants.item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.clicRestaurant(restaurants);
        }}
      >
        <View style={styles.viewRestaurants}>
          <View style={styles.viewRestaurantImage}>
            <Image
              resizeMode="cover"
              source={{ uri: image }}
              style={styles.imageRestaurant}
            />
          </View>
          <View>
            <Text style={styles.flatListRestaurantName}>{name}</Text>
            <Text style={styles.flatListRestaurantAddress}>
              {city}, {address}
            </Text>
            <Text style={styles.flatListRestaurantDescription}>
              {description.substr(0, 60)}...
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundRestaurants}>
          <Text>No quedan restaurantes por cargar</Text>
        </View>
      );
    }
  };

  renderFlatList = restaurants => {
    if (restaurants) {
      return (
        <FlatList
          data={restaurants}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.loadHandleMore()}
          onEndReachedThreshold={0}
          ListFooterComponent={this.renderFooter}
        />
      );
    } else {
      return (
        <View style={styles.startLoadRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando restaurantes</Text>
        </View>
      );
    }
  };

  clicRestaurant = restaurant => {
    console.log(`Has realizado clic en el sig restaurante`, { restaurant });
  };

  render() {
    const { restaurants } = this.state;
    return (
      <View style={styles.viewBody}>
        {this.renderFlatList(restaurants)}
        {this.loadActionButon()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  startLoadRestaurants: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRestaurants: {
    flexDirection: "row",
    margin: 10
  },
  viewRestaurantImage: {
    marginRight: 30
  },
  imageRestaurant: {
    width: 80,
    height: 80
  },
  flatListRestaurantName: {
    fontWeight: "bold"
  },
  flatListRestaurantAddress: {
    paddingTop: 2,
    color: "grey",
    width: "80%"
  },
  flatListRestaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 250
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10
  },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  }
});
