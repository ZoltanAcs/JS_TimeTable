let timetableData = {}; // Globális változó

// Az API-ból lekérjük az adatokat
fetch('http://localhost:3000/api/timetable')
    .then(response => response.json())
    .then(data => {
        timetableData = data;

        const daySelector = document.getElementById('daySelector');

        // Az esemény, amikor a felhasználó másik napot választ
        daySelector.addEventListener('change', function() {
            updateTimetable();
        });

        // Kezdeti nap és órarend betöltése
        updateTimetable();
    })
    .catch(error => {
        console.error('Hiba történt az API kérés közben:', error);
    });

// Frissíti az órarendet
function updateTimetable() {
    const timetable = document.getElementById('timetable').getElementsByTagName('tbody')[0];
    const daySelector = document.getElementById('daySelector');
    const selectedDay = daySelector.value;
    let lessons = timetableData[selectedDay];

    timetable.innerHTML = ''; // Az előző táblázat törlése

    // Ha van tanóra, rendezzük az órákat
    if (lessons && lessons.length > 0) {
        // Rendezzük az órákat növekvő óraszám szerint
        lessons = lessons.sort((a, b) => a.hour - b.hour);

        lessons.forEach(item => {
            const row = document.createElement('tr');
            
            const hourCell = document.createElement('td');
            hourCell.textContent = item.hour;
            row.appendChild(hourCell);
            
            const subjectCell = document.createElement('td');
            subjectCell.textContent = item.subject;
            row.appendChild(subjectCell);

            const actionsCell = document.createElement('td');
            
            // Törlés gomb
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteLesson(selectedDay, item.hour));
            actionsCell.appendChild(deleteButton);

            // Szerkesztés gomb
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editLesson(selectedDay, item.hour));
            actionsCell.appendChild(editButton);

            row.appendChild(actionsCell);
            
            timetable.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'No lessons available for this day.';
        row.appendChild(cell);
        timetable.appendChild(row);
    }
}

// Óra törlése
function deleteLesson(day, hour) {
    fetch(`http://localhost:3000/api/timetable/${day}/${hour}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Óra törölve');
        // Újra lekérjük az adatokat, hogy naprakész legyen
        refreshTimetableData();
    })
    .catch(error => console.error('Hiba a törlésnél:', error));
}

// Óra szerkesztése
function editLesson(day, hour) {
    const newSubject = prompt('Enter new subject:');
    if (newSubject) {
        fetch(`http://localhost:3000/api/timetable/${day}/${hour}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject: newSubject })
        })
        .then(response => response.json())
        .then(data => {
            alert('Óra szerkesztve');
            refreshTimetableData();
        })
        .catch(error => console.error('Hiba a szerkesztésnél:', error));
    }
}

// Hozzáad egy új órát
document.getElementById('addForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newHour = document.getElementById('newHour').value;
    const newSubject = document.getElementById('newSubject').value;
    const selectedDay = document.getElementById('daySelector').value;

    // Ellenőrizzük, hogy létezik-e már ilyen óraszám a napon
    if (timetableData[selectedDay] && timetableData[selectedDay].some(item => item.hour === newHour)) {
        alert('Foglalt óra!');
        return;
    }

    fetch(`http://localhost:3000/api/timetable/${selectedDay}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hour: newHour, subject: newSubject })
    })
    .then(response => response.json())
    .then(data => {
        alert('Új óra hozzáadva');
        refreshTimetableData();
    })
    .catch(error => console.error('Hiba az óra hozzáadásakor:', error));
});

// Segédfüggvény: újra lekéri az adatokat az API-ból, és frissíti a táblázatot
function refreshTimetableData() {
    fetch('http://localhost:3000/api/timetable')
        .then(response => response.json())
        .then(data => {
            timetableData = data;
            updateTimetable();
        })
        .catch(error => console.error('Hiba a frissítés közben:', error));
}
