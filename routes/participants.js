let participants = {};

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const fs = require('fs');

// Load admin credentials
const adminCredentials = JSON.parse(fs.readFileSync('auth.json'));

// Middleware to handle basic authentication
const authenticateUser = (req, res, next) => {
    const user = auth(req);
    if (!user || user.name !== adminCredentials.admin.login || user.pass !== adminCredentials.admin.password) {
        res.status(401).json({ error: "Unauthorized" });
    } else {
        next();
    }
};

// Validation of date
const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
};

// Validation of email 
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Add participant data
router.post('/add', authenticateUser, (req, res) => {
    /* #swagger.tags = ['Participants']
       #swagger.security = [{ "BasicAuth": [] }]
       #swagger.path = '/participants/add'
       #swagger.description = 'Endpoint to add a new participant'
       #swagger.parameters['obj'] = {
           in: 'body',
           description: 'Participant information',
           required: true,
           schema: { $ref: '#/definitions/Participant' }
        }
    */
    const { email, firstname, lastname, dob, work, home, status } = req.body;
    
    // Validate required fields
    if (!email || !firstname || !lastname || !dob || !status || !work || !home || !work.companyname || !work.salary || !work.currency || !home.country || !home.city) {
        return res.status(400).json({ error: "All fields are required and must be correctly formatted." });
    }

    // Validate email and date formats
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    if (!isValidDate(dob)) {
        return res.status(400).json({ error: "Date of birth must be in YYYY-MM-DD format." });
    }

    // Check if participant already exists
    if (participants[email]) {
        return res.status(409).json({ error: "Participant already exists." });
    }

    // Add participant
    participants[email] = { 
        firstname, 
        lastname, 
        dob, 
        work: {
            companyname: work.companyname,
            salary: work.salary,
            currency: work.currency
        },
        home: {
            country: home.country,
            city: home.city
        },
        status: "active"
    };
    res.status(201).json(participants[email]);
});

// Get all participants data
router.get('/', authenticateUser, (req, res) => {
    /* #swagger.tags = ['Participants']
       #swagger.security = [{ "BasicAuth": [] }]
       #swagger.path = '/participants'
       #swagger.description = 'Endpoint to retrieve all participants'
    */
    const summary = {};
    for (const email in participants) {
        summary[email] = { status: participants[email].status };
    }
    res.json(summary);
});

// Get specific participant details
router.get('/details', authenticateUser, (req, res) => {
    /*  #swagger.tags = ['Participants']
        #swagger.security = [{ "BasicAuth": [] }]
        #swagger.path = '/participants/details'
        #swagger.description = 'Endpoint to retrieve details of all active participants'
    */
    const details = {};
    for (const email in participants) {
        if (participants[email].status === "active") {
            details[email] = {
                firstname: participants[email].firstname,
                lastname: participants[email].lastname,
                dob: participants[email].dob,
                status: participants[email].status
            };
        }
    }
    res.json(details);
});

// Get specific participant details
router.get('/details/:email', authenticateUser, (req, res) => {
    //  #swagger.tags = ['Participants']
    //  #swagger.security = [{ "BasicAuth": [] }]
    /*
        #swagger.path = '/participants/details/{email}'
    */
    //  #swagger.description = 'Endpoint to retrieve details of a specific active participant'
    const participant = participants[req.params.email];
    if (!participant || participant.status !== "active") {
        return res.status(404).json({ error: "Active participant not found" });
    }
    res.json({
        firstname: participant.firstname,
        lastname: participant.lastname,
        status: participant.status
    });
});

// Get specific participant work details
router.get('/work/:email', authenticateUser, (req, res) => {
    //  #swagger.tags = ['Participants']
    //  #swagger.security = [{ "BasicAuth": [] }]
    /*
        #swagger.path = '/participants/work/{email}'
    */    
    //  #swagger.description = 'Endpoint to retrieve work details of a specific active participant'
    
    const participant = participants[req.params.email];
    if (!participant || participant.status !== "active") {
        return res.status(404).json({ error: "Active participant not found" });
    }
    res.json(participant.work);
});

// Get specific participant home details
router.get('/home/:email', authenticateUser, (req, res) => {
    //  #swagger.tags = ['Participants']
    //  #swagger.security = [{ "BasicAuth": [] }]
    /*    
        #swagger.path = '/participants/home/{email}'
    */
    //   #swagger.description = 'Endpoint to retrieve home details of a specific active participant'
    
    const participant = participants[req.params.email];
    if (!participant || participant.status !== "active") {
        return res.status(404).json({ error: "Active participant not found" });
    }
    res.json(participant.home);
});

// Update specific participant details
router.put('/:email', authenticateUser, (req, res) => {
    //    #swagger.tags = ['Participants']
    //    #swagger.security = [{ "BasicAuth": [] }]
    /*    
          #swagger.path = '/participants/{email}'
    */
    //    #swagger.description = 'Endpoint to update a specific participant'
    /*    #swagger.parameters['obj'] = {
           in: 'body',
           description: 'Participant information',
           required: true,
           schema: { $ref: '#/definitions/Participant' }
        }
    */
    const email = req.params.email;  // Get the email from the URL parameter
    const participant = participants[email];
    
    if (!participant || participant.status === "deleted") {
        return res.status(404).json({ error: "Participant not found or is deleted" });
    }

    // Extract data from request body
    const { firstname, lastname, dob, work, home } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !dob || !work || !home || !work.companyname || !work.salary || !work.currency || !home.country || !home.city) {
        return res.status(400).json({ error: "All fields are required and must be correctly formatted." });
    }

    // Validate email and date formats
    if (!isValidDate(dob)) {
        return res.status(400).json({ error: "Date of birth must be in YYYY-MM-DD format." });
    }

    // Update participant
    participants[email] = {
        firstname, 
        lastname, 
        dob, 
        work: {
            companyname: work.companyname,
            salary: work.salary,
            currency: work.currency
        },
        home: {
            country: home.country,
            city: home.city
        },
        status: participant.status  // Preserve the original status
    };

    res.json(participants[email]);
});


// Delete specific participant details
router.delete('/:email', authenticateUser, (req, res) => {
    //  #swagger.tags = ['Participants']
    //  #swagger.security = [{ "BasicAuth": [] }]
    /* 
        #swagger.path = '/participants/{email}'
    */
    //    #swagger.description = 'Endpoint to delete (deactivate) a specific participant'
    
    const participant = participants[req.params.email];
    if (!participant || participant.status === "deleted") {
        return res.status(404).json({ error: "Participant not found or already deleted" });
    }
    // Set status to deleted instead of deleting
    participant.status = "deleted";
    res.status(204).send();
});


module.exports = router;
