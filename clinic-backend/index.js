const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'clinic_app'
});

db.connect(err => {
    if (err) {
        console.log('Gabim lidhjeje me DB:', err);
    } else {
        console.log('Lidhje me DB e suksesshme');
    }
});


app.get('/', (req, res) => res.send('Serveri funksionon!'));

// --- 


app.post('/doctor/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Plotësoni të gjitha fushat!' });
  }

  const query = `SELECT * FROM doctors WHERE username = ? AND password = ? LIMIT 1`;
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.log("SQL Error:", err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Username ose password gabim!' });
    }

    const doctor = results[0];
    return res.json({
      success: true,
      doctor: {
        username: doctor.username,
        full_name: doctor.full_name
      }
    });
  });
});


const makeUniqueUsername = (baseUsername, callback) => {
    let username = baseUsername.toLowerCase().trim();
    const tryUsername = (suffix = 0) => {
        const finalUsername = suffix === 0 ? username : username + suffix;
        db.query('SELECT id FROM patients WHERE username = ?', [finalUsername], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, finalUsername);
            tryUsername(suffix + 1);
        });
    };
    tryUsername();
};

app.post('/register-patient', async (req, res) => {
    let { username, password, full_name, email, city, phone, date_of_birth } = req.body;
    if (!full_name || !password) return res.status(400).json({ success: false, message: 'Fut full_name dhe password' });

    username = username ? username.toLowerCase().trim() : full_name.split(' ').slice(0,2).join('.').toLowerCase();
    console.log("Dërgohet për regjistrim:", { username, full_name, password, email, city, phone, date_of_birth });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        makeUniqueUsername(username, (err, uniqueUsername) => {
            if (err) {
                console.log("Gabim unique username:", err);
                return res.status(500).json({ success: false, message: 'Gabim serveri' });
            }

            const query = `
                INSERT INTO patients 
                (username, password, full_name, email, city, phone, date_of_birth)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(query, [
                uniqueUsername,
                hashedPassword,
                full_name,
                email || null,
                city || null,
                phone || null,
                date_of_birth || null
            ], (err, result) => {
                if (err) {
                    console.log("SQL Error insert patient:", err);
                    return res.status(500).json({ success: false, message: 'Gabim serveri' });
                }
                console.log("Pacienti u regjistrua me sukses:", uniqueUsername);
                return res.json({ success: true, message: 'Pacienti u regjistrua me sukses', username: uniqueUsername });
            });
        });
    } catch (error) {
        console.log("Error bcrypt:", error);
        return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }
});


app.post('/login-patient', async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Fut username dhe password' });

    username = username.trim().toLowerCase();
    const query = 'SELECT * FROM patients WHERE LOWER(username) = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.log("SQL Error login patient:", err);
            return res.status(500).json({ success: false, message: 'Gabim serveri' });
        }
        if (results.length === 0) return res.status(401).json({ success: false, message: 'Username ose password gabim' });

        const patient = results[0];
        const match = await bcrypt.compare(password, patient.password);
        if (match) return res.json({ success: true, full_name: patient.full_name });
        return res.status(401).json({ success: false, message: 'Username ose password gabim' });
    });
});


app.get('/patient/:username', (req, res) => {
    const username = req.params.username.trim().toLowerCase();
    const query = `SELECT username, full_name, email, city, phone, date_of_birth FROM patients WHERE LOWER(username) = ?`;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.log("SQL Error get patient:", err);
            return res.status(500).json({ success: false, message: 'Gabim serveri' });
        }
        if (results.length > 0) return res.json({ success: true, patient: results[0] });
        return res.status(404).json({ success: false, message: 'Pacienti nuk u gjet' });
    });
});

app.put('/update-patient/:username', async (req, res) => {
    const username = req.params.username.trim().toLowerCase();
    const { field, value } = req.body;

   
    const allowedFields = ['full_name', 'email', 'city', 'phone', 'date_of_birth'];
    if (!allowedFields.includes(field)) return res.status(400).json({ success: false, message: 'Fusha jo e lejuar' });

    const query = `UPDATE patients SET ${field} = ? WHERE LOWER(username) = ?`;
    db.query(query, [value, username], (err, result) => {
        if (err) {
            console.log("SQL Error update patient:", err);
            return res.status(500).json({ success: false, message: 'Gabim serveri' });
        }
        return res.json({ success: true, message: `${field} u ndryshua me sukses` });
    });
});


app.post('/appointments', (req, res) => {
    const { patient_username, doctor_username, name, age, symptoms, date } = req.body;

    if (!patient_username || !doctor_username || !name || !age || !symptoms || !date) {
        return res.status(400).json({ success: false, message: 'Plotesoni te gjitha fushat' });
    }

    const query = `
        INSERT INTO appointments (patient_username, doctor_username, name, age, symptoms, date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [patient_username, doctor_username, name, age, symptoms, date], (err, result) => {
        if (err) {
            console.log("SQL Error insert appointment:", err);
            return res.status(500).json({ success: false, message: 'Gabim serveri' });
        }
        return res.json({ success: true, message: 'Formulari u dergua me sukses' });
    });
});


app.get('/doctor/appointments/:username', (req, res) => {
  const doctorUsername = req.params.username;

  const query = `
    SELECT * FROM appointments
    WHERE doctor_username = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [doctorUsername], (err, results) => {
    if (err) {
      console.log("SQL Error fetch appointments:", err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }

    return res.json({ success: true, appointments: results });
  });
});



app.put('/appointments/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // pranon "confirmed" ose "cancelled"

  const query = `UPDATE appointments SET status = ? WHERE id = ?`;
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.log("SQL Error update appointment:", err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }
    return res.json({ success: true, message: 'Rezervimi u përditësua', status });
  });
});

// Dërgo mesazh
app.post('/messages', (req, res) => {
  const { sender_username, receiver_username, message, type } = req.body;
  if (!sender_username || !receiver_username || !message || !type) {
    return res.status(400).json({ success: false, message: 'Të dhëna të paplota!' });
  }

  const query = `
    INSERT INTO messages (sender_username, receiver_username, message, type)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [sender_username, receiver_username, message, type], (err, result) => {
    if (err) {
      console.log("SQL Error insert message:", err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }
    res.json({ success: true, message: 'Mesazhi u dërgua!' });
  });
});

// Merr mesazhet për një user
app.get('/messages/:username', (req, res) => {
  const username = req.params.username;
  const query = `
    SELECT * FROM messages 
    WHERE sender_username = ? OR receiver_username = ? 
    ORDER BY created_at ASC
  `;
  db.query(query, [username, username], (err, results) => {
    if (err) {
      console.log("SQL Error fetch messages:", err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }
    res.json({ success: true, messages: results });
  });
});




app.get('/doctors', (req, res) => {
  const query = 'SELECT username, full_name FROM doctors';
  db.query(query, (err, results) => {
    if (err) {
      console.log('SQL Error fetch doctors:', err);
      return res.status(500).json({ success: false, message: 'Gabim serveri' });
    }
    return res.json({ success: true, doctors: results });
  });
});







app.listen(3000, () => console.log('Serveri në port 3000'));
