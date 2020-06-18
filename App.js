import React, {useState, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';
import {styles} from './styles.js';
import Geolocation from '@react-native-community/geolocation';
// import * as data from './mockData.json';
import {useFetch} from './utils/useFetch.js';
import moment from 'moment';
import windrose from 'windrose';
import {API_KEY} from 'react-native-dotenv';
import {
  Bolt,
  Cloud,
  CloudNight,
  Fog,
  HeavyRain,
  Moon,
  Overcast,
  Rain,
  RainNight,
  Snow,
  Sun,
  Wind,
} from './svgs';

export const App = () => {
  const [searchValue, setSearchValue] = useState('');

  if (!searchValue) {
    Geolocation.getCurrentPosition(({coords: {latitude, longitude}}) =>
      setUrl(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`,
      ),
    );
  }

  const generateUrl = (key) =>
    `http://api.openweathermap.org/data/2.5/weather?q=${key}&APPID=${API_KEY}`;

  const [url, setUrl] = useState('');
  const {data, error, isLoading} = useFetch(url);

  const onSearch = (key) => {
    setUrl(generateUrl(key));
  };

  if (error) {
    <View style={styles.container}>
      <Text style={styles.header}>What's the weather in...</Text>
      <TextInput
        style={styles.inputField}
        value={searchValue}
        onChangeText={(text) => setSearchValue(text)}
        onEndEditing={() => onSearch(searchValue)}
      />
      <Text style={styles.header}>No city match</Text>
    </View>;
  }

  if (isLoading) {
    return <Text style={styles.header}>Loading...</Text>;
  }

  if (data) {
    const cityName = `${data.name}, ${data.sys.country}`;
    const feelsLikeTemp = (data.main.feels_like - 273.15).toFixed();
    const maxTemp = (data.main.temp_max - 273.15).toFixed();
    const temp = (data.main.temp - 273.15).toFixed();
    const sunrise = moment.unix(data.sys.sunrise).format('LT');
    const sunset = moment.unix(data.sys.sunset).format('LT');
    const windSpeed = (data.wind.speed * 2.23694).toFixed();
    const windDirection = windrose.getPoint(data.wind.deg.toFixed(), {
      depth: 1,
    });
    const pressure = data.main.pressure.toFixed();
    const weather = data.weather[0].description.replace(
      data.weather[0].description[0],
      (x) => x.toUpperCase(),
    );
    return (
      <View style={styles.container}>
        <Text style={styles.header}>What's the weather in...</Text>
        {/* <TouchableOpacity onPress={() => console.log('Pressed')}> */}
        <TextInput
          style={styles.inputField}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          onEndEditing={() => onSearch(searchValue)}
        />
        {/* </TouchableOpacity> */}
        <Text style={styles.header}>{cityName}</Text>
        <Sun width={120} height={40} />
        <Wind width={120} height={40} />
        <Text style={styles.header}>
          Today: {weather} currently. It's {temp}&#8451; the high will be{' '}
          {maxTemp}&#8451;.
        </Text>
        <Text style={styles.header}>
          {windDirection.symbol} {windSpeed} mph
        </Text>
        <Text style={styles.header}>{feelsLikeTemp}&#8451;</Text>
        <Text style={styles.header}>{sunrise}</Text>
        <Text style={styles.header}>{sunset}</Text>
        <Text style={styles.header}>{pressure} hPa</Text>
      </View>
    );
  }

  return null;
};
