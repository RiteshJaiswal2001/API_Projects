import axios from "axios";
import dotenv from "dotenv";
import client from "./db.js";

dotenv.config();

const base_url = "http://api.weatherapi.com/v1";
const API_method = "current.json";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const api = `${base_url}/${API_method}`;

const place = "Patna";

async function weatherResponseFetch() {
  console.log(`${api}?key=${WEATHER_API_KEY}&q=${place}`);

  //   try {
  //     const response = await fetch(`${api}?key=${WEATHER_API_KEY}&q=${place}`);
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.log(`Error:${error.message}`);

  //   }
  const params = new URLSearchParams({
    key: WEATHER_API_KEY,
    q: place,
  });
  try {
    const response = await fetch(`${api}?${params}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
}

// weatherResponseFetch();

async function weatherResponseAxios() {
  try {
    const response = await axios(`${api}`, {
      params: {
        key: WEATHER_API_KEY,
        q: place,
      },
    });

    // console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
}

async function getWeatherRedisDetils() {
  const res = await client.hGetAll(`${place}`);

  // console.log(res);

  if (Object.keys(res).length > 0) {
    const data = JSON.parse(res.data);
    console.log("Response is found in database.");

    console.log(data);

    return data;
  }

  console.log("Response is not available in database.");

  const WeatherData = await weatherResponseAxios();

  // console.log(WeatherData);

  await client.hSet(place, { data: JSON.stringify(WeatherData) });
  await client.expire(place, 60);
  console.log(WeatherData);
  
  return WeatherData;
}

getWeatherRedisDetils();
