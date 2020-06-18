import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {styles} from './styles.js';
import Geolocation from '@react-native-community/geolocation';
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
} from './svgs';

export const App = () => {
  const [searchValue, setSearchValue] = useState('');

  if (!searchValue) {
    Geolocation.getCurrentPosition(({coords}) =>
      coords
        ? setUrl(
            `http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`,
          )
        : generateUrl('London'),
    );
  }

  const generateUrl = (key) =>
    `http://api.openweathermap.org/data/2.5/weather?q=${key}&APPID=${API_KEY}`;

  const [url, setUrl] = useState('');
  const {data, error, isLoading} = useFetch(url);

  const onSearch = (key) => {
    setUrl(generateUrl(key));
  };

  const SVG = ({weather}) => {
    switch (weather) {
      case 'clear sky':
        return <Sun width={120} height={80} />;
      case 'few clouds':
        return <Cloud width={120} height={80} />;
      case 'scattered clouds':
        return <Overcast width={120} height={80} />;
      case 'broken clouds':
        return <Overcast width={120} height={80} />;
      case 'shower rain':
        return <Rain width={120} height={80} />;
      case 'rain':
        return <HeavyRain width={120} height={80} />;
      case 'thunderstorm':
        return <Bolt width={120} height={80} />;
      case 'snow':
        return <Snow width={120} height={80} />;
      case 'mist':
        return <Fog width={120} height={80} />;
      default:
        return <Cloud width={120} height={80} />;
    }
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
        <TextInput
          style={styles.inputField}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          onEndEditing={() => onSearch(searchValue)}
        />
        <Text style={styles.title}>{cityName}</Text>
        <View style={styles.image}>
          <SVG weather={data.weather[0].description} />
        </View>
        <Text style={styles.header}>
          {weather} currently. It's {temp}&#8451; and the high will be {maxTemp}
          &#8451;.
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
