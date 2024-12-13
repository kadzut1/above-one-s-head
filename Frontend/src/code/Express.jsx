const express = require('express');
const app = express();

const events = [
  { id: 1, name: 'Концерт 1', description: 'Описание концерта 1', date: '2024-10-30' },
  { id: 2, name: 'Театр 1', description: 'Описание театра 1', date: '2024-11-15' },
  // Другие события
];

// Получить все события
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Получить событие по ID
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (event) {
    res.json(event);
  } else {
    res.status(404).send('Событие не найдено');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
