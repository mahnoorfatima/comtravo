# Comtravo Coding Challenge

## Requirements

* [node package manager]

## How to run

1. Install dependencies
   ```bash
   npm install
   ```
1. Update .env file with following
    ```bash
      COMTRAVO_USER_NAME, COMTRAVO_PASSWORD
    ```
1. Start the service   
    ```bash
    npm start
    ```
1. Please see the responseApi.yml file to make request to the server

1. To check the health of app 
    ```bash
      localhost:3000/api/check
    ```  

## Description 

- [x] src
    - [x] config 
        - [x] Contains configuration headers for api calls.
        - [x] Since it was requirement to return response in 1 second, otherwise due to unstable behaviour of api i have included retry handling. 
              Config will specify n retries, delay between retries
        - [x] Timeout to return response for race promises
    - [x] service
        - [x] Flight Service to fetch flights
        - [x] Response Service to handle the response of API
    - [x] util
        - [x] http-util to read from api. Here we could have used express but I prefered to use Request to keep my code organized.
        - [x] Logger. In future, this class can be extended to a package and beign used globally in the app as a Logger.
        - [x] Retry Handling: In case of retrying for unstable api
    - [x] controller
    - [x] routers
        - [x] express app router
- [x] Build pipeline (CI/CD) to deploy on heroku
- [x] ResponseApi.yml 

## Improvements
If i had more time, i'd also have implemented

- [x] Deploy the working solution on any serverless or Heroku
- [x] Code quality improvement (moving to Typescript) and More error handling