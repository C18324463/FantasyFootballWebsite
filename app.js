require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('players.db');


const bcrypt = require('bcrypt');
const saltRounds = 10;

const { body, validationResult } = require('express-validator');

//prepared queries
const findPlayersStats = "SELECT * FROM players;";
const findUsers = 'SELECT user_id, user_email, user_first, user_second FROM USERS;'
const findPlayers = "SELECT player_id , p_name, p_position, p_team FROM PLAYERS;";
const findTeam = "SELECT player_id, player_n, player_p FROM team;";
const finUserByEmail = "SELECT user_email FROM USERS WHERE user_email = $1;";
const findPasswordByUserId = "SELECT user_email, password FROM USERS WHERE user_email = $1;";
const findPlayerbyName = "SELECT player_n FROM TEAM WHERE player_n = $1;";
const insertPlayer = 'INSERT INTO TEAM (player_n, player_p) VALUES ($1, $2);';
const removePlayer = 'DELETE FROM TEAM WHERE player_n = $1;';
//const filterSearch = 'SELECT player_id, p_name, p_position, p_team FROM PLAYERS WHERE p_name = $1 ORDER BY p_name ASC;';
const insertNewUser = 'INSERT INTO users (user_email, user_first, user_second, password) VALUES ($1, $2, $3, $4);';
const getUserName = 'SELECT user_first FROM USERS;'
const deleteUser = 'DELETE FROM USERS WHERE user_email = $1;';
const updateUser = 'UPDATE USERS SET user_email = $1 WHERE user_email = $2;';

// constants representing error messages for responses
//const unknownError = 'Unknown error. Please try again later or contact our support.';
//const emailNotFound = 'Email not found!';
const userNotFound = 'Username not found!';
const incorrectPassword = 'Incorrect password!';


//get body elements
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

//verify user securely
passport.use(new LocalStrategy(function(username, password, done) {
    const userQuery = db.prepare(findPasswordByUserId);
    userQuery.get(username, function(error, row) {
        if (error) { return done(err); }// error with query
        if (!row) return done(null, false, { message: userNotFound });
        bcrypt.compare(password, row.password, function(err, res) {
            if (res == true) {
                done(null, { username: row.user_email });
            }
            else  {
            return done(null, false, { message: incorrectPassword });
            }

        });
    });
}));
//
passport.serializeUser(function(user, done) {
    return done(null, user.username);
});


//
passport.deserializeUser(function(username, done) {
    const userQuery = db.prepare(finUserByEmail);
    userQuery.get(username, function(err, row) {
        if (!row) {
            return done(null, false);
        }
        return done(null, row);
    });
});

//sending html file to server
app.get('/', function (req, res) { 	
    res.sendFile(__dirname + '/index.html');
});

//log user out 
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


//load login page
app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});


//login form 
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log(err)
            return next(err);
        }
        //if user not valid log where error is
        if (!user) {
            console.log(info);
            return res.redirect('/login');
        }
        //if user valid redirect to team page
        req.login(user, function(err) {
            if (err) { return next(err); }
            if(user.username == 'admin@fantasy.ie'){
                return res.redirect('/admin');
            }else {
                return res.redirect('/team');
            }
            
        });
    })(req, res, next);
});



//Get data for the Stats table
app.get("/retrieveData", function(req, res){
    const query = db.prepare(findPlayersStats);
    query.all(function(error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });

});

//require users to log into certain pages
function isAuthenticated() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            
            return next()
        }
        res.redirect('/login')
    }
}

//load team page ( Have to log in to use team page)
app.get("/team", isAuthenticated(), function(req, res) {
        res.sendFile(__dirname + "/team.html");
});

//getting data for team/player tables
app.get("/retrieveTables", function(req, res){
    const query = db.prepare(findPlayers);
    //const query1 = db.prepare(findTeam);

    query.all(function(error, rows) { 
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }  
    });
    
});

//getting data for team/player tables
app.get("/retrieveTeam", function(req, res){
    const query = db.prepare(findTeam);

    query.all(function(error, rows) { 
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }  
    });
    
});

app.post("/addPlayer", isAuthenticated(), function(req, res) {
    const player_n = req.body.player_n;
    const player_p = req.body.player_p;

    const validErrors = validationResult(req);
    if (!validErrors.isEmpty()) {
        console.log(validErrors);
        res.status(400).json({ errors: validErrors.array()});
        
    }
    const playerQ = db.prepare(findPlayerbyName);
    playerQ.get(player_n, function(error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json({ error: unknownError });
        } else {
            if(rows){
                const errorMsg = 'Player Already added to your team!'; 
                console.log(errorMsg);
                //msg.innerHTML = res.status(400).json({ error: errorMsg});
            } else {
                const insert = db.prepare(insertPlayer);
                insert.run(player_n, player_p);
                insert.finalize();

                const query = db.prepare(findTeam);
                query.all(function(error, rows) {
                    if (error) {
                        console.log(error);
                        res.status(400).json(error);
                    } else {
                        console.log(rows);
                        res.status(200).json(rows);
                    }
                });
            }
        }
    });
});


app.post("/removePlayer", isAuthenticated(), function(req, res) {

    const player_n = req.body.player_n;
    const removeStmt = db.prepare(removePlayer);

    removeStmt.run(player_n);
    removeStmt.finalize(function() {

    });

    const query = db.prepare(findTeam);
    query.all(function(error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });

});

//profile page 
app.get("/profile", isAuthenticated(), function(req, res) {
    res.sendFile(__dirname + "/profile.html");
});

//register page 
app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});


app.post("/register", [
    body('email').isLength({ min: 3, max: 50 }).isEmail(),
    body('fName').isLength({ min: 3, max: 50 }),
    body('lName').isLength({ min: 3, max: 50 }),
    body('password').isLength({ min: 3, max: 10 }),
],function(req, res) {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
        console.log(validErrors);
    } else {

        const email = req.body.email;
        const fName = req.body.fName;
        const lName = req.body.lName;
        const password = req.body.password;
        console.log(`Subscribing: ${email}, ${fName}, ${lName}, ${password}`);

        const emailQuery = db.prepare(finUserByEmail);
        emailQuery.get(email, function(error, rows) {
            if (error) {
                console.log(error);
            } else {
                if (rows) {
                    const errorMsg = 'Email already subscribed.';
                    console.log(errorMsg);
                    res.status(400).json({ error: errorMsg });
                } else {
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        // Now we can store the password hash in db.
                        const insert = db.prepare(insertNewUser);
                        insert.run(email, fName, lName, hash);
                        insert.finalize(function (error){
                            if (error) {
                                console.log("fail");
                                console.log(error);
                                res.status(400).json(error);
                            } else {
                                res.redirect('/login');
                            }
                        });
                    }); //end b
                }//end else
            }
        });
    }
});

app.get("/admin", isAuthenticated(), function(req, res) {
    res.sendFile(__dirname + "/admin.html");
});

app.post("/deleteUser", isAuthenticated(), function(req, res) {
    const validErrors = validationResult(req);
    if (!validErrors.isEmpty()) {
        console.log(validErrors);
        res.status(400).json({ errors: validErrors.array() });
    } else {
        const email = req.body.email;
        const deleteStmt = db.prepare(deleteUser);
        deleteStmt.run(email);
        deleteStmt.finalize(function (error){
            if (error) {
                console.log("fail");
                console.log(error);
                res.status(400).json(error);
            } else {
                res.redirect('/admin');
            }
        });
        
    }
});

app.get("/showusers", function(req, res){
    const query = db.prepare(findUsers);
    query.all(function(error, rows) {
        if (error) {
            console.log(error);
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

app.get("/update", isAuthenticated(), function(req, res) {
    res.sendFile(__dirname + "/update.html");
});

app.post('/updateuser', isAuthenticated(), function(req, res) {
    const validErrors = validationResult(req);
    if (!validErrors.isEmpty()) {
        console.log(validErrors);
        res.status(400).json({ errors: validErrors.array() });
    } 
    else {
        const email = req.body.email;
        const emailNew = req.body.emailNew;
        const update = db.prepare(updateUser);
        update.run(emailNew, email);
        update.finalize();

        res.redirect('/update');
    }
});

app.get("/help", function(req, res) {
    res.sendFile(__dirname + "/help.html");
});

//use port 3030 to run server and display success message!
app.listen(3030, function () {  
    console.log('Server running on port 3030');
});

