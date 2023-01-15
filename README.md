<div align="center">

<img src="/app/assets/logos/banner.png" alt="banner" width="800"/>

![](https://img.shields.io/github/license/wusteven815/uwaterloo-hub)
![](https://img.shields.io/github/v/release/wusteven815/uwaterloo-hub)
![](https://img.shields.io/github/last-commit/wusteven815/uwaterloo-hub)

![](https://img.shields.io/badge/apk-ready-success)
![](https://img.shields.io/badge/play%20store-soon-blue)
![](https://img.shields.io/badge/app%20store-too%20expensive-red)

</div>

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Weather Notes](#weather-notes)
- [Planned Features](#planned-features)
- [Installation/Usage](#installationusage)
  - [Source Code](#source-code)
  - [Android](#android)
  - [iOS](#ios)

# Features

UWaterloo Hub is an unofficial React Native app that provides important day-to-day information to students. Currently, weather and open classroom data is completed, but we have many [planned features](#planned-features).

<div align="center">

<img src="/app/assets/demo.png" alt="banner" height="600"/>

</div>


## Weather Notes

- Thank you to [Open-Meteo](https://open-meteo.com/) for the weather data
- All temperatures are the "Feels like" value

# Planned Features

- 7-day weather forecast, with details about morning/afternoon/evening
- Map of UWaterloo
  - Room level detail
  - Navigation
- Bus schedule
- Filter options on open classrooms
- Pin classrooms on open classrooms
- App themes
- Custom time and weather format

# Installation/Usage

## Source Code

This project uses Node.js, React Native, and Expo.

1. Clone the repository

```bash
git clone https://github.com/wusteven815/uwaterloo-hub.git
```

2. Install dependencies

```bash
cd uwaterloo-hub
npm install
```

3. Run the program

```bash
npm start
```

4. Connect with Expo Go

On your mobile device, download the Expo Go app. If you're on Android, scan the QR code with Expo Go. If you're on iOS, scan the QR code with the camera app.

## Android

Install the `.apk` from our [releases page](https://github.com/wusteven815/uwaterloo-hub/releases). Or, follow the [source code](#source-code) guide and build your open `.apk` with Expo EAS.

We do plan on releasing to the Google Play Store once a more feature-rich version of the app is ready.

## iOS

If there is enough demand, we might consider releasing to the App store once a more feature-rich version of the app is ready.
