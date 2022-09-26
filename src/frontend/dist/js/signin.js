WildRydes.authToken()
    .then(() => {
        window.location.replace('ride.html');
    })
    .catch((error) => {
        // Nothing to do here, the user will need to sign in then
    });