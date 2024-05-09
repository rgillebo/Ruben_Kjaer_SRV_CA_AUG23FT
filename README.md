# Census application 
A simple application for manually capturing participants details.

## TECHNOLOGIES USED
- **Node.js:** JavaScript runtime used for server-side development. This app uses version "v20.12.2".
- **Swagger:** Used for creating dynamic API documentation that can be interacted with in the browser. 
- **Express:** Web framework for building the server and handling routes.
- **dotenv:** For managing environment variables.
- **Basic-auth** For simple user/admin authentication
- **Other dependencies** listed in the [package.json] file.

## USAGE

### Environment variables 


- Create environment variables by creating a ".env" file in the root of the project and add the following data: 

    ```bash
    PORT=3000
    ```
### Deployment
The application is hosted on Render. Access the API here: [https://ruben-kjaer-srv-ca-aug23ft.onrender.com](https://ruben-kjaer-srv-ca-aug23ft.onrender.com/participants)

**Please Note** - "Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more." Meaning on first load, please be patient for the server to activate. 

### Testing & API Documentation 

**API Documentation** and **testing** can be found by visiting: [https://ruben-kjaer-srv-ca-aug23ft.onrender.com/docs/](https://ruben-kjaer-srv-ca-aug23ft.onrender.com/docs/)

**Testing** can also be done through Postman. 

## ADDITINOAL INFORMATION

- `/routes`: Server-side code for routes & authentication.
- `swagger.js`: Setup for generating API documentation. 
- `auth.json`: Admin user details.

## CONTRIBUTORS

- [Ruben Gillebo Kjær]

---

