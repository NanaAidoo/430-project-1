//default values for the app and where the POST data is stored
const users = {
    Nana: {
        name: 'Nana',
        age: '21',
        description: 'Basic Workout',
        workout: {
            monday: 'jogging/stamina training',
            wednesday: 'arm training',
            friday: 'leg training'
        },
    },
    Walt: {
        name: 'Walt',
        age: '50',
        description: 'Reflexology',
        workout: {
            tuesday:'Yoga',
            wednesday: 'jogging/stamina training',
            thurday: 'leg training',
            saturday: 'Yoga',
            sunday: 'Tai Chi',
        },
    },
};

//this method is used to send data as a response after it's requested
const respondJSON = (request, response, status, object) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    response.writeHead(status, headers);
    response.write(JSON.stringify(object));
    response.end();
};
//this method is used to send the meta data from a HEAD request
const respondJSONMeta = (request, response, status) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    response.writeHead(status, headers);
    response.end();
};
//Data from the user object is sent to the client and displayed
const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };
    return respondJSON(request, response, 200, responseJSON);
};
//the meta data from the GET request. The user does not see this data
const getUsersMeta = (request, response) => respondJSON(request, response, 200);

//gets the data from from client and based on what data is sent adds the data to the user's array in the server and sends the appropriate post code
const addUser = (request, response, body) => {
    const responseJSON = {
        message: 'Name and age are both required',
    };

    if (!body.name || !body.age) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }
    if (!body.description) {
        responseJSON.id = 'missingParams';
        responseJSON.message = 'Please add a title for your workout'
        return respondJSON(request, response, 400, responseJSON);
    }
    if (!body.monday&&!body.tuesday&&!body.wednesday&&!body.thursday&&!body.friday&&!body.saturday&&!body.sunday) {
        responseJSON.id = 'missingParams';
        responseJSON.message = 'Please at least one daily exercise'
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if (users[body.name]) {
        responseCode = 204;
    } else {
        users[body.name] = {};
    }
    users[body.name].name = body.name;
    users[body.name].age = body.age;
    users[body.name].description = body.description;
    users[body.name].workout = {
        monday: body.monday,
        tuesday: body.tuesday,
        wednesday: body.wednesday,
        thursday: body.thursday,
        friday: body.friday,
        saturday: body.saturday,
        sunday: body.sunday,

    }
    if (responseCode === 201) {
        responseJSON.message = 'You are now in our database!';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    return respondJSONMeta(request, response, responseCode);
};

//gets the data from the request sets the data for it  and then returns it along with the code.
const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found!',
        id: 'notFound',
    };
    return respondJSON(request, response, 404, responseJSON);
};

//gets the meta data that of the request and returns a 404 code
const notRealMeta = (request, response) => {
    respondJSONMeta(request, response, 404);
};

module.exports = {
    getUsers,
    getUsersMeta,
    addUser,
    notReal,
    notRealMeta,
};
