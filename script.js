document.addEventListener("DOMContentLoaded", function () {
    const breachApiUrl = 'http://185.25.207.191:3510/api/breaches'; 
    const cveApiUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0'; 

    let breachData = []; 
    let cveData = []; 

    function fetchBreachData() {
        fetch(breachApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                return response.json();
            })
            .then(data => {
                breachData = data; 
                updateDashboard(data);
                updateChart(data);
                displayBreachTable(data);
                setupSortingListeners(); 
            })
            .catch(error => {
                console.error('Errore durante il recupero dei dati:', error);
                displayErrorState();
            });
    }

    const attackData = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024 (H1)'],
        data: [133, 145, 153, 160, 176, 273], 
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    };

const attackTypesData = {
    labels: [
        'Malware (34%)',
        'Phishing (8%)',
        'DDoS (6%)',
        'Furto di Identità (12%)',
        'Exploiting Vulnerabilities (14%)',
        'Multiple Techniques (26%)'
    ],
    datasets: [{
        label: 'Tipi di Attacchi',
        data: [34, 8, 6, 12, 14, 26], 
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverOffset: 4
    }]
};

const ctxAttackTypes = document.getElementById('attack-types-chart').getContext('2d');
new Chart(ctxAttackTypes, {
    type: 'doughnut',
    data: attackTypesData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Distribuzione Percentuale dei Tipi di Attacco (H1 2024)'
            }
        }
    }
});

const severityData = {
    labels: ['2023', 'H1 2024'],
    datasets: [
        {
            label: 'Critical',
            data: [38, 31],
            backgroundColor: '#ff6347'
        },
        {
            label: 'High',
            data: [42, 50],
            backgroundColor: '#FFCE56'
        },
        {
            label: 'Medium',
            data: [20, 19],
            backgroundColor: '#36A2EB'
        }
    ]
};

const ctxSeverity = document.getElementById('severity-trends-chart').getContext('2d');
new Chart(ctxSeverity, {
    type: 'bar',
    data: severityData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Evoluzione della Gravità degli Attacchi'
            }
        },
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Percentuale (%)'
                }
            }
        }
    }
});

const geoData = {
    labels: ['America', 'Europa', 'Asia', 'Africa', 'Oceania', 'Multiple Locations'],
    datasets: [{
        label: 'Percentuale Attacchi',
        data: [41, 29, 8, 1, 4, 17],
        backgroundColor: [
            '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#607D8B'
        ],
        borderWidth: 1
    }]
};

const ctxGeo = document.getElementById('geo-distribution-chart').getContext('2d');
new Chart(ctxGeo, {
    type: 'bar',
    data: geoData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Distribuzione Geografica degli Attacchi (H1 2024)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Percentuale (%)'
                }
            }
        }
    }
});

const sectorData = {
    labels: [
        'Sanità (18%)',
        'Governativo/Militare (13%)',
        'Finance/Insurance (8%)',
        'ICT (7%)',
        'Education (6%)',
        'Manifatturiero (5%)',
        'Altro (43%)'
    ],
    datasets: [{
        label: 'Distribuzione Attacchi per Settore',
        data: [18, 13, 8, 7, 6, 5, 43],
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
        ],
        hoverOffset: 4
    }]
};

const ctxSector = document.getElementById('sector-distribution-chart').getContext('2d');
new Chart(ctxSector, {
    type: 'pie',
    data: sectorData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Distribuzione degli Attacchi per Settore (H1 2024)'
            }
        }
    }
});

    const ctx = document.getElementById('attack-trends-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: attackData.labels,
            datasets: [{
                label: 'Media Mensile Attacchi',
                data: attackData.data,
                backgroundColor: attackData.backgroundColor,
                borderColor: attackData.borderColor,
                borderWidth: attackData.borderWidth,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Andamento degli Attacchi Cyber (Media Mensile)'
                }
            }
        }
    });

    document.getElementById('daily-attacks').textContent = '9';
    document.getElementById('critical-high-attacks').textContent = '81%';
    document.getElementById('attack-growth').textContent = '+23%';

function fetchCVEData() {
    fetch(cveApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero dei CVE');
            }
            return response.json();
        })
        .then(data => {
            console.log("Risposta completa dei CVE:", data);

            const totalResults = data.totalResults;
            const totalCveElement = document.getElementById("total-cve");
            if (totalCveElement) {
                totalCveElement.textContent = totalResults.toLocaleString();
            }

            const currentDate = new Date();

            const recentCves = data.vulnerabilities.filter(cve => {
                const publishedDate = new Date(cve.cve.published);
                return publishedDate <= currentDate && (currentDate - publishedDate) <= (30 * 24 * 60 * 60 * 1000);
            });

            const sortedRecentCves = recentCves.sort((a, b) => 
                new Date(b.cve.published) - new Date(a.cve.published)
            );

            const topRecentCves = sortedRecentCves.slice(0, 5);

            const latestCveList = document.getElementById("latest-cve-list");
            if (latestCveList) {
                latestCveList.innerHTML = ""; 
                topRecentCves.forEach(cve => {
                    const listItem = document.createElement("li");
                    const cveId = cve.cve.id;
                    const description = cve.cve.descriptions[0]?.value || "Descrizione non disponibile";
                    const publishedDate = new Date(cve.cve.published).toLocaleDateString();

                    listItem.innerHTML = `
                        <strong>${cveId}</strong>: ${description} <em>(Pubblicato: ${publishedDate})</em>
                    `;
                    latestCveList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Errore durante il recupero dei CVE:', error);
            displayCVEErrorState();
        });
}

function displayCVEErrorState() {
    const totalCveElement = document.getElementById("total-cve");
    if (totalCveElement) {
        totalCveElement.textContent = "Errore nel caricamento dei CVE.";
    }
}

    function updateDashboard(data) {
        const totalBreaches = data.length;
        const affectedCompanies = new Set(data.map(breach => breach.name)).size;
        const totalPwnedAccounts = data.reduce((total, breach) => total + breach.pwnCount, 0);

        document.getElementById("total-breaches").textContent = totalBreaches.toLocaleString();

        document.getElementById("total-pwned-accounts").textContent = totalPwnedAccounts.toLocaleString();
    }

    function updateCveDashboard(cveData, totalCves) {
        const affectedCveCompanies = new Set(cveData.map(cve => cve.cve.affects.vendor.vendorName)).size;

        document.getElementById("total-cves").textContent = totalCves.toLocaleString();
        document.getElementById("affected-cve-companies").textContent = affectedCveCompanies.toLocaleString();
    }

    function updateChart(data) {
        const breachesByYear = data.reduce((acc, breach) => {
            const year = new Date(breach.breachDate).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        const years = Object.keys(breachesByYear);
        const breachCounts = Object.values(breachesByYear);

        const ctx = document.getElementById("breach-chart").getContext("2d");
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Data Breaches per Anno',
                    data: breachCounts,
                    backgroundColor: '#4CAF50',
                    borderColor: '#388E3C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function displayBreachTable(data) {
        const tableBody = document.querySelector("#breach-table tbody");
        tableBody.innerHTML = ''; 

        data.forEach(breach => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${breach.name}</td>
                <td>${new Date(breach.breachDate).toLocaleDateString()}</td>
                <td>${breach.pwnCount.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function displayCveTable(cveData) {
        const tableBody = document.querySelector("#cve-table tbody");
        tableBody.innerHTML = ''; 

        cveData.forEach(cve => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cve.cve.CVE_data_meta.ID}</td>
                <td>${cve.cve.description.description_data[0].value}</td>
                <td>${cve.cve.affects.vendor.vendorName}</td>
                <td>${new Date(cve.lastModifiedDate).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function setupSortingListeners() {
        const sortingOptions = {
            "sort-date-asc": (a, b) => new Date(a.breachDate) - new Date(b.breachDate),
            "sort-date-desc": (a, b) => new Date(b.breachDate) - new Date(a.breachDate),
            "sort-size-asc": (a, b) => a.pwnCount - b.pwnCount,
            "sort-size-desc": (a, b) => b.pwnCount - a.pwnCount
        };

        Object.keys(sortingOptions).forEach(buttonId => {
            document.getElementById(buttonId).addEventListener("click", () => {
                const sortedData = [...breachData].sort(sortingOptions[buttonId]);
                displayBreachTable(sortedData);
            });
        });
    }

    function setupNavigation() {
        const buttons = {
            "data-breach-btn": { section: "data-breach-section", title: "Dashboard Cybersecurity: Data Breaches" },
            "vulnerabilities-btn": { section: "vulnerabilities-section", title: "Dashboard Cybersecurity: Vulnerabilità" },
            "attacks-btn": { section: "attacks-section", title: "Dashboard Cybersecurity: Attacchi in Italia" },
            "networks-btn": { section: "networks-section", title: "Dashboard Cybersecurity: Networks" },
            "cyber_incident-btn": { section: "cyber_incident-section", title: "Dashboard Cybersecurity: Cyber Incident" },
            "living_labs-btn": { section: "living_labs-section", title: "Dashboard Cybersecurity: Living Labs in Puglia" }
        };

        Object.keys(buttons).forEach(buttonId => {
            const buttonElement = document.getElementById(buttonId);
            if (!buttonElement) {
                console.error(`Pulsante mancante: ${buttonId}`);
                return;
            }

            buttonElement.addEventListener("click", () => {
                document.querySelectorAll('.content-container > div').forEach(section => {
                    section.style.display = "none";
                });

                const sectionId = buttons[buttonId].section;
                const sectionElement = document.getElementById(sectionId);
                if (sectionElement) {
                    sectionElement.style.display = "block";
                } else {
                    console.error(`Sezione mancante: ${sectionId}`);
                }

                document.getElementById("dashboard-title").textContent = buttons[buttonId].title;
            });
        });
    }

    const ctx_si = document.getElementById('livingLabsChart').getContext('2d');

    const livingLabsChart = new Chart(ctx_si, {
        type: 'bar',
        data: {
            labels: ['ASTT', 'BCUT', 'ENER', 'GEPA', 'INCR', 'ISED', 'ISIA', 'TRMO'],
            datasets: [{
                label: 'Percentage of Projects',
                data: [17.95, 16.67, 1.28, 7.69, 14.10, 14.10, 25.64, 2.56],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Percentage Distribution of Living Labs Projects'
                }
            }
        }
    });

        const numberOfProjects = [14, 13, 1, 6, 11, 11, 20, 2];

    const totalLivingLabs = numberOfProjects.reduce((total, num) => total + num, 0);

    document.getElementById("total-living-labs").textContent = totalLivingLabs;

    fetchBreachData();
    fetchCVEData();
    setupNavigation();
});