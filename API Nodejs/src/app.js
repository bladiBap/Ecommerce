const express = require('express');
const cors = require('cors');
const app = express();

//middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false},{limit: '50mb'}));
app.use(cors());

// routes 
app.use(require('./routes/route'));

app.listen(3000);
console.log('Server en el puerto',3000);
































// const express = require('express');
// const app = express();

// const { Client } = require('pg');
// const connectionData = {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'Webdb',
//     password: 'root',
//     port: 5432,
//   }
// const client = new Client(connectionData);
// client.connect()
// client.query('SELECT * FROM productos')
//     .then(response => {
//         console.log(response.rows)
//         client.end()
//     })
//     .catch(err => {
//         client.end()
//     });


// app.use(express.json());

// const students = [
//     {"id": 1, "name":"Hugo", "age":20, "enroll": true},
//     {"id": 2, "name":"Paco", "age":33, "enroll": false},
//     {"id": 3, "name":"Luis", "age":23, "enroll": true},
//     {"id": 4, "name":"Hugox2", "age":54, "enroll": false}
// ];

// app.get('/', (req, res)=> {
//     res.send('Node js api');
// });

// app.get('/api/students', (req, res)=> {
//     res.send(students);
// });

// app.get('/api/students/:id', (req, res)=> {
//     const student = students.find(s => s.id === parseInt(req.params.id));
//     if(!student) res.status(404).send('Student not found');
//     res.send(student);
// });

// app.post('/api/students', (req, res)=> {
//     const student = {
//         id: students.length + 1,
//         name: req.body.name,
//         age: req.body.age,
//         enroll: req.body.enroll
//     };
//     students.push(student);
//     res.send(student);
// });

// app.delete('/api/students/:id', (req, res)=> {
//     const student = students.find(s => s.id === parseInt(req.params.id));
//     if(!student) res.status(404).send('Student not found');

//     const index = students.indexOf(student);
//     students.splice(index, 1);

//     res.send(student);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, ()=> console.log(`Listening on port ${port}...`));