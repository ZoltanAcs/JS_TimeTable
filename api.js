const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());


app.use(express.json()); // Lehetővé teszi a JSON adatokat

let timetable = {
  Monday: [
    { hour: 1, subject: "Math" },
    { hour: 2, subject: "English" },
    { hour: 3, subject: "Biology" }
  ],
  Tuesday: [
    { hour: 1, subject: "History" },
    { hour: 2, subject: "Chemistry" },
    { hour: 3, subject: "Art" }
  ],
  Wednesday: [
    { hour: 1, subject: "Physics" },
    { hour: 2, subject: "Geography" },
    { hour: 3, subject: "Music" }
  ],
  Thursday: [
    { hour: 1, subject: "Literature" },
    { hour: 2, subject: "Computer Science" },
    { hour: 3, subject: "Economics" }
  ],
  Friday: [
    { hour: 1, subject: "Philosophy" },
    { hour: 2, subject: "Physical Education" },
    { hour: 3, subject: "Sociology" }
  ]
};

// GET – Órarend lekérése
app.get('/api/timetable', (req, res) => {
  res.json(timetable);
});

// POST – Új óra hozzáadása
app.post('/api/timetable/:day', (req, res) => {
  const { day } = req.params;
  const { hour, subject } = req.body;

  if (!timetable[day]) timetable[day] = [];
  timetable[day].push({ hour, subject });

  res.status(201).json({ message: "Lesson added", timetable });
});

// DELETE – Óra törlése
app.delete('/api/timetable/:day/:hour', (req, res) => {
  const { day, hour } = req.params;
  timetable[day] = timetable[day].filter(lesson => lesson.hour != hour);

  res.json({ message: "Lesson deleted", timetable });
});

// PUT – Óra szerkesztése
app.put('/api/timetable/:day/:hour', (req, res) => {
  const { day, hour } = req.params;
  const { subject } = req.body;

  const lesson = timetable[day].find(lesson => lesson.hour == hour);
  if (lesson) {
    lesson.subject = subject;
    res.json({ message: "Lesson updated", timetable });
  } else {
    res.status(404).json({ message: "Lesson not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
