const express = require('express');
const cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = require('./db')
const port = 3400;
const app = express();

app.use(express.json())
app.use(cors());


app.get('/getroles', (req, res, next) => {
    pool.query('SELECT * FROM roles', (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result.rows);
    })
})

app.get('/getreguser', (req, res, next) => {
    pool.query('SELECT registration.id,registration.name,registration.emailid,registration.gender,registration.mobile,roles.rolename FROM registration join roles on roles.id = registration.designation ', (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result.rows);
    })
});

app.get('/get-staff', (req, res, next) => {
    pool.query('SELECT registration.id,registration.name,registration.emailid,registration.gender,registration.mobile,roles.rolename FROM registration join roles on roles.id = registration.designation where roles.id =3', (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result.rows);
    })
});


app.post('/post', async (req, res, next) => {
    const n = req.body.name;
    const g = req.body.gender;
    const m = req.body.mobile;
    const em = req.body.emailid;
    const ds = req.body.desinstion;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    pool.query(`
    insert into registration(name, gender,mobile,emailid,designation,password
  ) values($1,$2,$3,$4,$5,$6)`, [n, g, m, em, ds, hash], (error, result) => {
        res.send(result.rows)
    });
})

app.post('/loginpost', (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body);
    console.log(username);
    pool.query(`select * from registration where emailid = $1 or mobile = $1`, [username], async (error, result) => {


        for (let i = 0; i < result.rows.length; i++) {
            bcrypt.compare(password, result.rows[i].password, function (err, passwordMatchResult) {
                console.log(`passwordMatchResult : ${passwordMatchResult}`);
                if (passwordMatchResult) {
                    res.send([result.rows[i]])
                }
            });
        }
    });
})


app.delete('/delete/:id', (req, res) => {
    pool.query('delete from registration where id=$1', [req.params.id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result.rows);
    })
});



app.listen(port, () => {
    console.log(`app running on port ${port}`)
})