import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {styles} from './styles.js';
import Geolocation from '@react-native-community/geolocation';
import {useFetch} from './utils/useFetch.js';
import moment from 'moment';
import windrose from 'windrose';
import {API_KEY} from 'react-native-dotenv';
import {Bolt, Cloud, Fog, HeavyRain, Overcast, Rain, Snow, Sun} from './svgs';

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  // const [coords, setCoords] = useState(null);
  const [url, setUrl] = useState(
    `http://api.openweathermap.org/data/2.5/weather?q=London&APPID=${API_KEY}`,
  );

  // Geolocation.getCurrentPosition(({geoCoords}) => setCoords(geoCoords));

  const generateUrl = (key) =>
    `http://api.openweathermap.org/data/2.5/weather?q=${key}&APPID=${API_KEY}`;

  // if (!coords) {
  //   setUrl(generateUrl('London'));
  // } else {
  //   setUrl(
  //     `http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`,
  //   );
  // }

  const {data, error, isLoading} = useFetch(url);

  const onSearch = (key) => {
    key.toLowerCase();
    setUrl(generateUrl(key));
  };

  const SVG = ({weather}) => {
    if (weather === 'clear sky') {
      return <Sun width={120} height={80} />;
    }
    if (weather === 'few clouds') {
      return <Cloud width={120} height={80} />;
    }
    if (weather === 'scattered clouds') {
      return <Overcast width={120} height={80} />;
    }
    if (weather === 'broken clouds') {
      return <Overcast width={120} height={80} />;
    }
    if (weather === 'shower rain' || weather === 'light rain') {
      return <Rain width={120} height={80} />;
    }
    if (weather === 'rain') {
      return <HeavyRain width={120} height={80} />;
    }
    if (weather === 'thunderstorm') {
      return <Bolt width={120} height={80} />;
    }
    if (weather === 'snow') {
      return <Snow width={120} height={80} />;
    }
    if (weather === 'mist') {
      return <Fog width={120} height={80} />;
    }
    return null;
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>What's the weather in...</Text>
        <TextInput
          style={styles.inputField}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          onEndEditing={() => onSearch(searchValue)}
        />
        <Text style={styles.header}>No city match</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
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
