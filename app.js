// API Configurations
const SWAPI_ENDPOINT = 'https://swapi-graphql.netlify.app/.netlify/functions/index';

const APIs = {
    characters: {
        name: 'Characters',
        endpoint: SWAPI_ENDPOINT,
        examples: [
            {
                title: 'All Characters',
                description: 'List all people in the galaxy',
                query: `query AllPeople {
  allPeople {
    totalCount
    people {
      name
      birthYear
      gender
      homeworld {
        name
      }
    }
  }
}`
            },
            {
                title: 'Character Details',
                description: 'Get Luke Skywalker info',
                query: `query GetPerson {
  person(id: "cGVvcGxlOjE=") {
    name
    birthYear
    eyeColor
    hairColor
    height
    mass
    gender
    homeworld {
      name
      climate
      terrain
    }
    filmConnection {
      films {
        title
      }
    }
  }
}`
            },
            {
                title: 'Characters with Pagination',
                description: 'Paginated people query',
                query: `query PaginatedPeople {
  allPeople(first: 5) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        name
        birthYear
        species {
          name
        }
      }
      cursor
    }
  }
}`
            },
            {
                title: 'Character Starships',
                description: 'Ships piloted by characters',
                query: `query CharacterStarships {
  allPeople(first: 5) {
    people {
      name
      starshipConnection {
        starships {
          name
          model
          starshipClass
        }
      }
    }
  }
}`
            }
        ]
    },
    films: {
        name: 'Films',
        endpoint: SWAPI_ENDPOINT,
        examples: [
            {
                title: 'All Films',
                description: 'List all Star Wars films',
                query: `query AllFilms {
  allFilms {
    totalCount
    films {
      title
      episodeID
      releaseDate
      director
      producers
    }
  }
}`
            },
            {
                title: 'Film Details',
                description: 'A New Hope details',
                query: `query FilmDetails {
  film(id: "ZmlsbXM6MQ==") {
    title
    episodeID
    openingCrawl
    director
    producers
    releaseDate
    characterConnection {
      characters {
        name
      }
    }
  }
}`
            },
            {
                title: 'Film Planets',
                description: 'Planets featured in films',
                query: `query FilmPlanets {
  allFilms {
    films {
      title
      planetConnection {
        planets {
          name
          climate
          terrain
        }
      }
    }
  }
}`
            },
            {
                title: 'Film Species',
                description: 'Species appearing in films',
                query: `query FilmSpecies {
  allFilms {
    films {
      title
      speciesConnection {
        species {
          name
          classification
          language
        }
      }
    }
  }
}`
            }
        ]
    },
    starships: {
        name: 'Starships & Planets',
        endpoint: SWAPI_ENDPOINT,
        examples: [
            {
                title: 'All Starships',
                description: 'List all starships',
                query: `query AllStarships {
  allStarships {
    totalCount
    starships {
      name
      model
      starshipClass
      manufacturers
      costInCredits
      maxAtmospheringSpeed
      hyperdriveRating
    }
  }
}`
            },
            {
                title: 'All Planets',
                description: 'Explore the galaxy',
                query: `query AllPlanets {
  allPlanets {
    totalCount
    planets {
      name
      diameter
      rotationPeriod
      orbitalPeriod
      gravity
      population
      climate
      terrain
    }
  }
}`
            },
            {
                title: 'All Vehicles',
                description: 'Ground and air vehicles',
                query: `query AllVehicles {
  allVehicles {
    totalCount
    vehicles {
      name
      model
      vehicleClass
      manufacturers
      costInCredits
      maxAtmospheringSpeed
      crew
      passengers
    }
  }
}`
            },
            {
                title: 'All Species',
                description: 'Species across the galaxy',
                query: `query AllSpecies {
  allSpecies {
    totalCount
    species {
      name
      classification
      designation
      averageHeight
      averageLifespan
      language
      homeworld {
        name
      }
    }
  }
}`
            }
        ]
    }
};

// State
let currentAPI = 'characters';

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
