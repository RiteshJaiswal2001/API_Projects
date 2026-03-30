import axios from "axios";
import dotenv from "dotenv";
import client from "./db.js";
import express from "express";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const base_url = "http://api.weatherapi.com/v1/current.json";

async function fetchWeatherResponse(city) {
  try {
    const response = await axios(base_url, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
      },
    });

    return response.data;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
}

async function getWeatherDetils(city) {
  const res = await client.hGetAll(city);

  // console.log(res);

  if (Object.keys(res).length > 0) {
    const data = JSON.parse(res.data);
    console.log("Response is found in database.");

    console.log(data);

    return data;
  }

  console.log("Response is not available in database.");

  const WeatherData = await fetchWeatherResponse(city);

  // console.log(WeatherData);

  await client.hSet(city, { data: JSON.stringify(WeatherData) });
  await client.expire(city, 3600);
  // console.log(WeatherData);

  return WeatherData;
}

// getWeatherRedisDetils();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use(limiter);

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({
      error: "City query parameter is required",
    });
  }

  try {
    const data = await getWeatherDetils(city);

    res.json({
      success: true,
      source: "weatherapi + redis",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
