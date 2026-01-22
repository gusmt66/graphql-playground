// API Configurations
const APIs = {
    countries: {
        name: 'Countries API',
        endpoint: 'https://countries.trevorblades.com/graphql',
        examples: [
            {
                title: 'List All Countries',
                description: 'Get country names and codes',
                query: `query GetCountries {
  countries {
    code
    name
    capital
    currency
    emoji
  }
}`
            },
            {
                title: 'Country Details',
                description: 'Query a specific country',
                query: `query GetCountry {
  country(code: "US") {
    name
    native
    capital
    currency
    languages {
      code
      name
    }
    states {
      name
    }
  }
}`
            },
            {
                title: 'Continents & Countries',
                description: 'Nested continent data',
                query: `query GetContinents {
  continents {
    code
    name
    countries {
      name
      capital
      emoji
    }
  }
}`
            },
            {
                title: 'Filter by Continent',
                description: 'Countries in Europe',
                query: `query EuropeanCountries {
  countries(filter: { continent: { eq: "EU" } }) {
    name
    capital
    currency
    emoji
  }
}`
            }
        ]
    },
    rickmorty: {
        name: 'Rick & Morty API',
        endpoint: 'https://rickandmortyapi.com/graphql',
        examples: [
            {
                title: 'Character List',
                description: 'Get characters with pagination',
                query: `query GetCharacters {
  characters(page: 1) {
    info {
      count
      pages
      next
    }
    results {
      id
      name
      status
      species
      image
    }
  }
}`
            },
            {
                title: 'Filter Characters',
                description: 'Search by name and status',
                query: `query FilterCharacters {
  characters(filter: { name: "Rick", status: "Alive" }) {
    results {
      id
      name
      status
      origin {
        name
      }
      location {
        name
      }
    }
  }
}`
            },
            {
                title: 'Episodes List',
                description: 'Get episode information',
                query: `query GetEpisodes {
  episodes(page: 1) {
    results {
      id
      name
      air_date
      episode
      characters {
        name
      }
    }
  }
}`
            },
            {
                title: 'Locations',
                description: 'Explore different locations',
                query: `query GetLocations {
  locations(page: 1) {
    results {
      id
      name
      type
      dimension
      residents {
        name
      }
    }
  }
}`
            }
        ]
    },
    spacex: {
        name: 'SpaceX API',
        endpoint: 'https://spacex-production.up.railway.app/graphql',
        examples: [
            {
                title: 'Past Launches',
                description: 'Recent SpaceX launches',
                query: `query PastLaunches {
  launchesPast(limit: 5) {
    mission_name
    launch_date_local
    launch_site {
      site_name_long
    }
    rocket {
      rocket_name
    }
    links {
      video_link
    }
  }
}`
            },
            {
                title: 'Rocket Details',
                description: 'Information about rockets',
                query: `query GetRockets {
  rockets {
    id
    name
    type
    active
    cost_per_launch
    success_rate_pct
    description
  }
}`
            },
            {
                title: 'Company Info',
                description: 'SpaceX company details',
                query: `query CompanyInfo {
  company {
    name
    founder
    founded
    employees
    vehicles
    launch_sites
    valuation
    summary
  }
}`
            },
            {
                title: 'Ships',
                description: 'SpaceX fleet vessels',
                query: `query GetShips {
  ships {
    name
    type
    active
    home_port
    year_built
    missions {
      name
    }
  }
}`
            }
        ]
    }
};

// State
let currentAPI = 'countries';

// DOM Elements
const apiSelector = document.getElementById('apiSelector');
const examplesGrid = document.getElementById('examplesGrid');
const queryEditor = document.getElementById('queryEditor');
const variablesEditor = document.getElementById('variablesEditor');
const resultDisplay = document.getElementById('resultDisplay');
const executeBtn = document.getElementById('executeBtn');
const prettifyBtn = document.getElementById('prettifyBtn');
const copyBtn = document.getElementById('copyBtn');
const variablesToggle = document.getElementById('variablesToggle');
const variablesPanel = document.getElementById('variablesPanel');
const endpointDisplay = document.getElementById('endpointDisplay');
const responseMeta = document.getElementById('responseMeta');

// Initialize
function init() {
    loadAPI(currentAPI);
    setupEventListeners();
}

// Load API
function loadAPI(apiKey) {
    currentAPI = apiKey;
    const api = APIs[apiKey];

    // Update active card
    document.querySelectorAll('.api-card').forEach(card => {
        card.classList.toggle('active', card.dataset.api === apiKey);
    });

    // Update endpoint display
    endpointDisplay.textContent = api.endpoint;

    // Load examples
    examplesGrid.innerHTML = api.examples.map((example, index) => `
        <div class="example-card" data-index="${index}">
            <h4>${example.title}</h4>
            <p>${example.description}</p>
        </div>
    `).join('');

    // Load first example
    loadExample(0);
}

// Load Example
function loadExample(index) {
    const example = APIs[currentAPI].examples[index];
    queryEditor.value = example.query;
    resultDisplay.innerHTML = '<span style="color: var(--text-secondary)">// Click "Execute Query" to see results</span>';
    responseMeta.textContent = '';
}

// Execute Query
async function executeQuery() {
    const query = queryEditor.value.trim();
    if (!query) {
        showError('Please enter a GraphQL query');
        return;
    }

    let variables = {};
    try {
        const varsText = variablesEditor.value.trim();
        if (varsText) {
            variables = JSON.parse(varsText);
        }
    } catch (e) {
        showError('Invalid JSON in variables: ' + e.message);
        return;
    }

    // Show loading state
    resultDisplay.innerHTML = '<div class="spinner"></div>';
    resultDisplay.classList.add('loading');
    responseMeta.textContent = 'Loading...';

    const startTime = performance.now();

    try {
        const response = await fetch(APIs[currentAPI].endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        const data = await response.json();

        resultDisplay.classList.remove('loading');
        resultDisplay.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));

        const status = data.errors ? '⚠️ With Errors' : '✓ Success';
        responseMeta.innerHTML = `${status} <span>${duration}ms</span>`;

    } catch (error) {
        resultDisplay.classList.remove('loading');
        showError('Network error: ' + error.message);
        responseMeta.textContent = '✗ Failed';
    }
}

// Show Error
function showError(message) {
    resultDisplay.innerHTML = `<span style="color: var(--error)">Error: ${message}</span>`;
}

// Syntax Highlighting for JSON
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Prettify Query
function prettifyQuery() {
    const query = queryEditor.value;
    // Basic prettification - normalize whitespace and indentation
    try {
        let depth = 0;
        let prettified = '';
        let inString = false;

        for (let i = 0; i < query.length; i++) {
            const char = query[i];
            const nextChar = query[i + 1];

            if (char === '"' && query[i - 1] !== '\\') {
                inString = !inString;
                prettified += char;
                continue;
            }

            if (inString) {
                prettified += char;
                continue;
            }

            if (char === '{' || char === '(') {
                depth++;
                prettified += char + '\n' + '  '.repeat(depth);
            } else if (char === '}' || char === ')') {
                depth--;
                prettified = prettified.trimEnd() + '\n' + '  '.repeat(depth) + char;
            } else if (char === '\n') {
                prettified += '\n' + '  '.repeat(depth);
            } else if (char === ' ' && (query[i - 1] === ' ' || query[i - 1] === '\n')) {
                // Skip extra spaces
            } else {
                prettified += char;
            }
        }

        queryEditor.value = prettified.trim();
    } catch (e) {
        // If prettification fails, leave as is
    }
}

// Copy Result
function copyResult() {
    const text = resultDisplay.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // API Selection
    apiSelector.addEventListener('click', (e) => {
        const card = e.target.closest('.api-card');
        if (card) {
            loadAPI(card.dataset.api);
        }
    });

    // Example Selection
    examplesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.example-card');
        if (card) {
            loadExample(parseInt(card.dataset.index));
        }
    });

    // Buttons
    executeBtn.addEventListener('click', executeQuery);
    prettifyBtn.addEventListener('click', prettifyQuery);
    copyBtn.addEventListener('click', copyResult);

    // Variables Toggle
    variablesToggle.addEventListener('click', () => {
        variablesPanel.classList.toggle('show');
    });

    // Keyboard shortcut (Ctrl/Cmd + Enter to execute)
    queryEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            executeQuery();
        }
    });
}

// Initialize the app
init();
