let mapData = {
    70: { num_maps: 0, num_portals: 0 },
    80: { num_maps: 0, num_portals: 0 },
    90: { num_maps: 0, num_portals: 0 },
    100: { num_maps: 0, num_portals: 0 }
};

const totalMapsElement = document.getElementById('total-maps');
const totalPortalsElement = document.getElementById('total-portals');
const mapsWithoutPortalsElement = document.getElementById('maps-without-portals');
const percentageWithoutPortalsElement = document.getElementById('percentage-without-portals');
const ctx = document.getElementById('charts').getContext('2d');
const dataTableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];

const colors = {
    70: 'rgba(75, 192, 192, 0.6)',
    80: 'rgba(153, 102, 255, 0.6)',
    90: 'rgba(255, 159, 64, 0.6)',
    100: 'rgba(255, 99, 132, 0.6)'
};

let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Maps', 'Portals', 'Without Portals'],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Translations
const translations = {
    PL: {
        title: "FFXIV Map Tracker",
        totalMaps: "Razem Mapy",
        totalPortals: "Razem Portale",
        mapsWithoutPortals: "Mapy bez Portali",
        percentageWithoutPortals: "Procent Map bez Portali",
        addDataBtn: "Dodaj Dane",
        editDataBtn: "Edytuj Dane",
        deleteDataBtn: "Usuń Wybrane Dane",
        loadCsvBtn: "Załaduj CSV",
        saveCsvBtn: "Zapisz jako CSV",
        loadExcelBtn: "Załaduj Excel",
        saveExcelBtn: "Zapisz jako Excel",
        language: "Wybór języka",
        date: "Wybierz datę",
        mapLevel: "Poziom Mapy",
        numMaps: "Liczba Map",
        numPortals: "Liczba Portali",
        tableHeaderLevel: "Poziom Mapy",
        tableHeaderMaps: "Liczba Map",
        tableHeaderPortals: "Liczba Portali",
        tableHeaderPercentage: "Procent Map bez Portali" // Nowy nagłówek
    },
    ENG: {
        title: "FFXIV Map Tracker",
        totalMaps: "Total Maps",
        totalPortals: "Total Portals",
        mapsWithoutPortals: "Maps Without Portals",
        percentageWithoutPortals: "Percentage of Maps Without Portals",
        addDataBtn: "Add Data",
        editDataBtn: "Edit Data",
        deleteDataBtn: "Delete Selected Data",
        loadCsvBtn: "Load CSV",
        saveCsvBtn: "Save as CSV",
        loadExcelBtn: "Load Excel",
        saveExcelBtn: "Save as Excel",
        language: "Language Selection",
        date: "Select Date",
        mapLevel: "Map Level",
        numMaps: "Number of Maps",
        numPortals: "Number of Portals",
        tableHeaderLevel: "Map Level",
        tableHeaderMaps: "Number of Maps",
        tableHeaderPortals: "Number of Portals",
        tableHeaderPercentage: "Percentage Without Portals" // Nowy nagłówek
    },
    FR: {
        title: "Suivi de carte FFXIV",
        totalMaps: "Cartes totales",
        totalPortals: "Total des portails",
        mapsWithoutPortals: "Cartes sans portails",
        percentageWithoutPortals: "Pourcentage de cartes sans portails",
        addDataBtn: "Ajouter des données",
        editDataBtn: "Modifier les données",
        deleteDataBtn: "Supprimer les données sélectionnées",
        loadCsvBtn: "Charger CSV",
        saveCsvBtn: "Enregistrer en tant que CSV",
        loadExcelBtn: "Charger Excel",
        saveExcelBtn: "Enregistrer en tant qu'Excel",
        language: "Sélection de la langue",
        date: "Sélectionner une date",
        mapLevel: "Niveau de la carte",
        numMaps: "Nombre de cartes",
        numPortals: "Nombre de portails",
        tableHeaderLevel: "Niveau de la carte",
        tableHeaderMaps: "Nombre de cartes",
        tableHeaderPortals: "Nombre de portails",
        tableHeaderPercentage: "Pourcentage sans portails" // Nowy nagłówek
    }
};

// Function to update summary and chart
function updateSummary() {
    const totalMaps = Object.values(mapData).reduce((sum, level) => sum + level.num_maps, 0);
    const totalPortals = Object.values(mapData).reduce((sum, level) => sum + level.num_portals, 0);
    const mapsWithoutPortals = totalMaps - totalPortals;

    totalMapsElement.textContent = totalMaps;
    totalPortalsElement.textContent = totalPortals;
    mapsWithoutPortalsElement.textContent = mapsWithoutPortals;

    const percentage = totalMaps > 0 ? ((mapsWithoutPortals / totalMaps) * 100).toFixed(2) : 0;
    percentageWithoutPortalsElement.textContent = percentage + "%";

    chart.data.datasets = []; // Clear previous datasets

    for (const level in mapData) {
        chart.data.datasets.push({
            label: `Level ${level}`,
            data: [
                mapData[level].num_maps,
                mapData[level].num_portals,
                mapData[level].num_maps - mapData[level].num_portals
            ],
            backgroundColor: colors[level],
        });
    }

    chart.update();
    updateDataTable();
}

// Function to update data table
function updateDataTable() {
    dataTableBody.innerHTML = ''; // Clear the table
    for (const level in mapData) {
        const maps = mapData[level].num_maps;
        const portals = mapData[level].num_portals;
        const withoutPortals = maps - portals;
        const percentage = maps > 0 ? ((withoutPortals / maps) * 100).toFixed(2) : 0;

        const row = dataTableBody.insertRow();
        row.innerHTML = `
            <td>${level}</td>
            <td>${maps}</td>
            <td>${portals}</td>
            <td>${percentage}%</td> <!-- Dodano kolumnę dla % -->
        `;
    }
}

// Function to change language
function changeLanguage(lang) {
    document.title = translations[lang].title;
    document.getElementById('main-title').textContent = translations[lang].title;
    document.getElementById('summary-maps').textContent = translations[lang].totalMaps + ": " + totalMapsElement.textContent;
    document.getElementById('summary-portals').textContent = translations[lang].totalPortals + ": " + totalPortalsElement.textContent;
    document.getElementById('summary-without-portals').textContent = translations[lang].mapsWithoutPortals + ": " + mapsWithoutPortalsElement.textContent;
    document.getElementById('summary-percentage').textContent = translations[lang].percentageWithoutPortals + ": " + percentageWithoutPortalsElement.textContent;

    // Update table headers
    document.getElementById("table-header-level").innerText = translations[lang].tableHeaderLevel;
    document.getElementById("table-header-maps").innerText = translations[lang].tableHeaderMaps;
    document.getElementById("table-header-portals").innerText = translations[lang].tableHeaderPortals;
    document.getElementById("table-header-percentage").innerText = translations[lang].tableHeaderPercentage; // Uaktualnienie nagłówka dla %

    document.getElementById('language').previousElementSibling.textContent = translations[lang].language;
    document.getElementById('calendar').previousElementSibling.textContent = translations[lang].date;
    document.getElementById('map-level').previousElementSibling.textContent = translations[lang].mapLevel;
    document.getElementById('num-maps').previousElementSibling.textContent = translations[lang].numMaps;
    document.getElementById('num-portals').previousElementSibling.textContent = translations[lang].numPortals;

    document.getElementById('add-data').textContent = translations[lang].addDataBtn;
    document.getElementById('edit-data').textContent = translations[lang].editDataBtn;
    document.getElementById('delete-data').textContent = translations[lang].deleteDataBtn;
    document.getElementById('load-csv').textContent = translations[lang].loadCsvBtn;
    document.getElementById('save-csv').textContent = translations[lang].saveCsvBtn;
    document.getElementById('load-excel').textContent = translations[lang].loadExcelBtn;
    document.getElementById('save-excel').textContent = translations[lang].saveExcelBtn;
}

// Event listener for language change
document.getElementById('language').onchange = (event) => {
    const lang = event.target.value;
    changeLanguage(lang);
};

// Function to add data
document.getElementById('add-data').onclick = () => {
    const mapLevel = document.getElementById('map-level').value;
    const numMaps = parseInt(document.getElementById('num-maps').value);
    const numPortals = parseInt(document.getElementById('num-portals').value);
    
    if (!isNaN(numMaps) && !isNaN(numPortals)) {
        mapData[mapLevel].num_maps += numMaps;
        mapData[mapLevel].num_portals += numPortals;
        updateSummary();
    } else {
        alert("Proszę wprowadzić poprawne liczby."); // 'Please enter valid numbers.'
    }
};

// Function to edit data
document.getElementById('edit-data').onclick = () => {
    const mapLevel = document.getElementById('map-level').value;
    const numMaps = prompt("Podaj nową liczbę map:", mapData[mapLevel].num_maps);
    const numPortals = prompt("Podaj nową liczbę portali", mapData[mapLevel].num_portals);
    
    const newNumMaps = parseInt(numMaps);
    const newNumPortals = parseInt(numPortals);
    
    if (!isNaN(newNumMaps) && !isNaN(newNumPortals)) {
        mapData[mapLevel].num_maps = newNumMaps;
        mapData[mapLevel].num_portals = newNumPortals;
        updateSummary();
    } else {
        alert("Proszę wprowadzić poprawne liczby."); // 'Please enter valid numbers.'
    }
};

// Function to delete data
document.getElementById('delete-data').onclick = () => {
    const mapLevel = document.getElementById('map-level').value;
    if (confirm("Czy na pewno chcesz usunąć dane dla poziomu mapy " + mapLevel + "?")) {
        mapData[mapLevel].num_maps = 0;
        mapData[mapLevel].num_portals = 0;
        updateSummary();
    }
};

// Load CSV
document.getElementById('load-csv').onclick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.onchange = e => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: results => {
                results.data.forEach(entry => {
                    const level = parseInt(entry.level);
                    const num_maps = parseInt(entry.num_maps);
                    const num_portals = parseInt(entry.num_portals);
                    if (mapData[level]) {
                        mapData[level].num_maps = num_maps;
                        mapData[level].num_portals = num_portals;
                    }
                });
                updateSummary();
            }
        });
    };

    fileInput.click();
};

// Save CSV
document.getElementById('save-csv').onclick = () => {
    const rows = [['level', 'num_maps', 'num_portals']];
    for (const level in mapData) {
        const data = mapData[level];
        rows.push([level, data.num_maps, data.num_portals]);
    }

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'map_data.csv');
    a.click();
};

// Load Excel
document.getElementById('load-excel').onclick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    
    fileInput.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const dataRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Clear existing map data before loading new data
            for (const level in mapData) {
                mapData[level].num_maps = 0;
                mapData[level].num_portals = 0;
            }

            dataRows.forEach(row => {
                const level = parseInt(row[0]);
                const num_maps = parseInt(row[1]);
                const num_portals = parseInt(row[2]);
                if (mapData[level]) {
                    mapData[level].num_maps = num_maps;
                    mapData[level].num_portals = num_portals;
                }
            });
            updateSummary();
        };
        reader.readAsArrayBuffer(file);
    };

    fileInput.click();
};

// Save Excel
document.getElementById('save-excel').onclick = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
        Object.keys(mapData).map(level => ({
            level: level,
            num_maps: mapData[level].num_maps,
            num_portals: mapData[level].num_portals
        }))
    );

    XLSX.utils.book_append_sheet(wb, ws, 'MapData');
    XLSX.writeFile(wb, 'map_data.xlsx');
};
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Initialize default values and language
changeLanguage('PL'); // Set initial language
updateSummary();