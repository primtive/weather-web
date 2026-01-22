# Home Weather Station Website

A web application built with Next.js and MongoDB to display data from a homemade ESP32-based weather station.

## Overview

This project serves as the web interface for a DIY weather station. It fetches, stores, and visualizes meteorological data collected by an ESP32 microcontroller. The companion hardware project can be found at [weather-esp](https://github.com/primtive/weather-esp).

## Features

- Real-time weather data display
- Historical data visualization with charts
- Responsive design for desktop and mobile devices
- Historical data export

## Technology Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Hardware**: ESP32 (see the [weather-esp](https://github.com/primtive/weather-esp) repository)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/primtive/weather-web.git
   cd weather-web
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add the variables from `.env.example`:

   ```
   LAT=16.156416
   LONG=46.795544
   DATABASE_URL=mongodb://localhost:27017/weather
   other variables...
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Hardware Setup

This web application is designed to work with the ESP32-based weather station from the [weather-esp](https://github.com/primtive/weather-esp) repository. Please refer to that project for hardware setup instructions.
