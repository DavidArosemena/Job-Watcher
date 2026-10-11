# Job Watcher

**Live site:** https://davidarosemena.github.io/Job-Watcher/

## Overview

Job Watcher is a job market forecasting web application built by a team of students as our senior capstone project at Kean University. Using real economic data and machine learning, the application predicts employment trends across different industries, highlighting which sectors are growing, remaining stable, or experiencing a decline.

The application combines economic indicators, employment data, and machine learning models to generate forecasts and present them through an interactive dashboard. Users can explore individual sectors, view projected growth rates, and see how economic conditions relate to changes in employment.

Our goal is to make job market information more accessible and useful for people exploring their career options. By providing a clearer picture of industry trends and potential employment opportunities, Job Watcher encourages users to make more informed decisions about their professional futures while recognizing that forecasts are estimates, not guarantees.

## Key Features

* **Industry Trend Analysis:** Explore employment trends across different sectors of the economy.
* **Job Market Forecasting:** See the predicted growth rate for each sector, along with a trend label of Rising, Stable, or Declining.
* **Real Economic Data:** The dashboard shows the latest unemployment rate, CPI, federal funds rate, and labor force participation from FRED, plus how each one changed since the month before.
* **Interactive Dashboard:** Pick a sector and the forecast, trend indicators, monthly job growth chart, and summary cards all update to match.
* **Career Context:** Each sector lists common jobs and typical wage ranges, so the numbers connect to real careers.
* **Transparent Predictions:** The site explains which inputs the model uses and reminds users that forecasts are estimates, not guarantees.
* **Responsive Interface:** A clean, organized layout that makes industry information easy to explore.

## How It Works

1. Economic data is pulled from FRED (Federal Reserve Economic Data) and cleaned into a training dataset.
2. Two machine learning models were trained on that data. One predicts how much employment in a sector will grow, and the other classifies the overall trend.
3. The models run as Python CGI scripts on Kean's Obi server.
4. The React frontend calls those scripts to display live forecasts.
5. GitHub Actions builds the site and publishes it to GitHub Pages on every push and again every morning. Each build downloads the newest FRED numbers, so the indicator cards and job growth chart stay current.

The models use past values of employment growth, unemployment, CPI, the federal funds rate, and labor force participation, along with three month rolling averages to smooth out short term noise.

## My Role

I served as the **Frontend Lead** on the ByteForce development team, helping design and develop the user interface and the overall user experience. My work included building and refining the React interface, organizing the industry forecasts into clear dashboard components, and improving how job market trends are presented.

I also helped connect the frontend to the project's data and forecasting features, making sure the information came across clearly and consistently. This project strengthened my skills in frontend development, collaborative software engineering, data visualization, and building practical applications around real problems.

## Technology Stack

* **Frontend:** React, JavaScript, Vite, HTML, CSS
* **Data and Forecasting:** FRED economic data, Python, machine learning models for growth prediction and trend classification
* **Backend:** Python CGI scripts hosted on Kean's Obi server
* **Deployment:** GitHub Actions and GitHub Pages
* **Development Tools:** Git, GitHub, Visual Studio Code

## Running It Locally

You'll need Node.js installed. Then:

```bash
git clone https://github.com/DavidArosemena/Job-Watcher.git
cd Job-Watcher
npm install
npm run dev
```

Run `npm run fetch-data` to download the latest FRED numbers for local testing. If the data or the backend can't be reached, the site still runs and clearly labels anything it shows as demo data.

## Team

**ByteForce**
Senior Capstone Project | Kean University
