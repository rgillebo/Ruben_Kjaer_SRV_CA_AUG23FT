const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Census API',
        description: 'API for managing census participants',
    },
    host: 'ruben-kjaer-srv-ca-aug23ft.onrender.com',
    schemes: ['https'],
    securityDefinitions: {
        BasicAuth: {  
            type: "basic",
            description: "Enter username and password to access this API"
        }
    },
    security: [{  // Apply Basic Auth globally to all operations
        BasicAuth: []
    }],
    tags: [
        {
            name: "Participants",
            description: "Endpoints related to participant operations"
        }
    ],
    definitions: {
        Participant: {
            email: "john.doe@example.com",
            firstname: "John",
            lastname: "Doe",
            dob: "1980-01-01",
            work: {
                companyname: "Tech Solutions",
                salary: 55000,
                currency: "USD"
            },
            home: {
                country: "USA",
                city: "New York"
            },
            status: "active"
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/participants.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
