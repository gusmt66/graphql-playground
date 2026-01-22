// API Configurations
const APIs = {
    rickmorty: {
        name: 'Rick & Morty API',
        endpoint: 'https://rickandmortyapi.com/graphql',
        simple: [
            {
                title: 'List Characters',
                description: 'Basic character data',
                query: `query GetCharacters {
  characters(page: 1) {
    info {
      count
      pages
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
                description: 'Search by name or status',
                query: `query FilterCharacters {
  characters(filter: { name: "Rick" }) {
    results {
      name
      status
      species
    }
  }
}`
            },
            {
                title: 'Character Origin',
                description: 'Where a character comes from',
                query: `query CharacterOrigin {
  characters(page: 1) {
    results {
      name
      origin {
        name
        type
        dimension
      }
    }
  }
}`
            },
            {
                title: 'Character Location',
                description: 'Where a character currently is',
                query: `query CharacterLocation {
  characters(page: 1) {
    results {
      name
      location {
        name
        type
        dimension
      }
    }
  }
}`
            },
            {
                title: 'List Episodes',
                description: 'Basic episode data',
                query: `query GetEpisodes {
  episodes(page: 1) {
    results {
      id
      name
      air_date
      episode
    }
  }
}`
            },
            {
                title: 'List Locations',
                description: 'Basic location data',
                query: `query GetLocations {
  locations(page: 1) {
    results {
      id
      name
      type
      dimension
    }
  }
}`
            },
            {
                title: 'Location Residents',
                description: 'Who lives in a location',
                query: `query LocationResidents {
  locations(page: 1) {
    results {
      name
      residents {
        name
        status
      }
    }
  }
}`
            }
        ],
        advanced: [
            {
                title: 'Characters + Episodes',
                description: 'Each character with all their episode appearances',
                query: `query CharactersWithEpisodes {
  characters(page: 1) {
    results {
      name
      status
      species
      origin {
        name
        dimension
      }
      location {
        name
        type
      }
      episode {
        name
        episode
        air_date
      }
    }
  }
}`
            },
            {
                title: 'Episodes + Full Cast',
                description: 'Each episode with complete character details',
                query: `query EpisodesWithCharacters {
  episodes(page: 1) {
    results {
      name
      episode
      air_date
      characters {
        name
        status
        species
        origin {
          name
        }
        location {
          name
          dimension
        }
      }
    }
  }
}`
            },
            {
                title: 'Character Journey',
                description: 'Track a character across locations & episodes',
                query: `query CharacterJourney {
  characters(filter: { name: "Rick Sanchez" }) {
    results {
      name
      status
      origin {
        name
        type
        dimension
        residents {
          name
        }
      }
      location {
        name
        type
        dimension
      }
      episode {
        name
        episode
        characters {
          name
          species
        }
      }
    }
  }
}`
            }
        ]
    },
    countries: {
        name: 'Countries API',
        endpoint: 'https://countries.trevorblades.com/graphql',
        simple: [
            {
                title: 'List Countries',
                description: 'Basic country information',
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
                title: 'Single Country',
                description: 'Query one country by code',
                query: `query GetCountry {
  country(code: "US") {
    name
    capital
    currency
    emoji
  }
}`
            },
            {
                title: 'Country Languages',
                description: 'Languages spoken in a country',
                query: `query CountryLanguages {
  country(code: "CH") {
    name
    languages {
      code
      name
      native
    }
  }
}`
            },
            {
                title: 'Country States',
                description: 'States/provinces of a country',
                query: `query CountryStates {
  country(code: "US") {
    name
    states {
      code
      name
    }
  }
}`
            },
            {
                title: 'Country Continent',
                description: 'Which continent a country belongs to',
                query: `query CountryContinent {
  country(code: "JP") {
    name
    continent {
      code
      name
    }
  }
}`
            },
            {
                title: 'List Continents',
                description: 'All continents with codes',
                query: `query GetContinents {
  continents {
    code
    name
  }
}`
            },
            {
                title: 'Filter Countries',
                description: 'Countries by continent',
                query: `query FilterByContinent {
  countries(filter: { continent: { eq: "EU" } }) {
    name
    capital
    emoji
  }
}`
            }
        ],
        advanced: [
            {
                title: 'Continents + Countries + Languages',
                description: 'Full hierarchy with all languages spoken',
                query: `query ContinentsDeep {
  continents {
    name
    countries {
      name
      capital
      currency
      emoji
      languages {
        name
        native
      }
      states {
        name
      }
    }
  }
}`
            },
            {
                title: 'Country Full Profile',
                description: 'Everything about a country including neighbors',
                query: `query CountryFullProfile {
  country(code: "JP") {
    name
    native
    capital
    currency
    phone
    emoji
    continent {
      name
      countries {
        name
        emoji
      }
    }
    languages {
      name
      native
      rtl
    }
    states {
      name
      code
    }
  }
}`
            },
            {
                title: 'Multi-Country Comparison',
                description: 'Compare multiple countries using aliases',
                query: `query CompareCountries {
  usa: country(code: "US") {
    name
    capital
    currency
    languages { name }
    states { name }
  }
  japan: country(code: "JP") {
    name
    capital
    currency
    languages { name }
    states { name }
  }
  brazil: country(code: "BR") {
    name
    capital
    currency
    languages { name }
    states { name }
  }
}`
            }
        ]
    },
    anime: {
        name: 'AniList API',
        endpoint: 'https://graphql.anilist.co',
        simple: [
            {
                title: 'Search Anime',
                description: 'Find anime by name',
                query: `query SearchAnime {
  Media(search: "Death Note", type: ANIME) {
    title {
      english
      native
    }
    episodes
    averageScore
    genres
    description
  }
}`
            },
            {
                title: 'Anime Characters',
                description: 'Characters from a show',
                query: `query AnimeCharacters {
  Media(search: "Death Note", type: ANIME) {
    title { english }
    characters(perPage: 10) {
      nodes {
        name { full }
        gender
        age
      }
    }
  }
}`
            },
            {
                title: 'Anime Staff',
                description: 'Creators and crew',
                query: `query AnimeStaff {
  Media(search: "Death Note", type: ANIME) {
    title { english }
    staff(perPage: 10) {
      nodes {
        name { full }
        primaryOccupations
      }
    }
  }
}`
            },
            {
                title: 'Anime Studios',
                description: 'Production studios',
                query: `query AnimeStudios {
  Media(search: "Death Note", type: ANIME) {
    title { english }
    studios {
      nodes {
        name
        isAnimationStudio
      }
    }
  }
}`
            },
            {
                title: 'Anime Relations',
                description: 'Sequels, prequels, spin-offs',
                query: `query AnimeRelations {
  Media(search: "Attack on Titan", type: ANIME) {
    title { english }
    relations {
      edges {
        relationType
        node {
          title { english }
          format
        }
      }
    }
  }
}`
            },
            {
                title: 'Anime Recommendations',
                description: 'Similar shows',
                query: `query AnimeRecommendations {
  Media(search: "Death Note", type: ANIME) {
    title { english }
    recommendations(perPage: 5) {
      nodes {
        mediaRecommendation {
          title { english }
          genres
        }
      }
    }
  }
}`
            },
            {
                title: 'Popular Anime',
                description: 'Top anime by popularity',
                query: `query PopularAnime {
  Page(page: 1, perPage: 10) {
    media(sort: POPULARITY_DESC, type: ANIME) {
      title { english }
      episodes
      averageScore
      genres
    }
  }
}`
            },
            {
                title: 'Search Studio',
                description: 'Find a studio by name',
                query: `query SearchStudio {
  Studio(search: "MAPPA") {
    name
    isAnimationStudio
  }
}`
            }
        ],
        advanced: [
            {
                title: 'Anime + Characters + Staff',
                description: 'Full production details in one query',
                query: `query AnimeFullDetails {
  Media(search: "Death Note", type: ANIME) {
    title {
      english
      native
      romaji
    }
    description
    episodes
    averageScore
    genres
    studios {
      nodes {
        name
        isAnimationStudio
      }
    }
    characters(perPage: 10) {
      nodes {
        name { full }
        gender
        age
      }
    }
    staff(perPage: 5) {
      nodes {
        name { full }
        primaryOccupations
      }
    }
  }
}`
            },
            {
                title: 'Anime + Relations + Recommendations',
                description: 'Sequels, prequels, and similar shows',
                query: `query AnimeRelations {
  Media(search: "Attack on Titan", type: ANIME) {
    title { english }
    relations {
      edges {
        relationType
        node {
          title { english }
          type
          format
          episodes
          averageScore
        }
      }
    }
    recommendations(perPage: 5) {
      nodes {
        mediaRecommendation {
          title { english }
          averageScore
          genres
        }
      }
    }
  }
}`
            },
            {
                title: 'Studio Portfolio',
                description: 'All anime by a studio with nested data',
                query: `query StudioPortfolio {
  Studio(search: "MAPPA") {
    name
    isAnimationStudio
    media(sort: POPULARITY_DESC, perPage: 10) {
      nodes {
        title { english }
        format
        episodes
        averageScore
        popularity
        genres
        seasonYear
        characters(perPage: 3) {
          nodes {
            name { full }
          }
        }
      }
    }
  }
}`
            }
        ]
    }
};

let currentAPI = 'rickmorty';
let allExamples = [];

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

function init() {
    loadAPI(currentAPI);
    setupEventListeners();
}

function loadAPI(apiKey) {
    currentAPI = apiKey;
    const api = APIs[apiKey];

    document.querySelectorAll('.api-card').forEach(card => {
        card.classList.toggle('active', card.dataset.api === apiKey);
    });

    endpointDisplay.textContent = api.endpoint;

    // Combine examples with type info for index tracking
    allExamples = [
        ...api.simple.map(ex => ({ ...ex, type: 'simple' })),
        ...api.advanced.map(ex => ({ ...ex, type: 'advanced' }))
    ];

    // Render both sections
    const simpleCards = api.simple.map((example, index) => `
        <div class="example-card" data-index="${index}">
            <h4>${example.title}</h4>
            <p>${example.description}</p>
        </div>
    `).join('');

    const advancedCards = api.advanced.map((example, index) => `
        <div class="example-card advanced" data-index="${api.simple.length + index}">
            <span class="complexity-badge">Advanced</span>
            <h4>${example.title}</h4>
            <p>${example.description}</p>
        </div>
    `).join('');

    examplesGrid.innerHTML = `
        <div class="examples-category">
            <div class="category-header">
                <span class="category-icon">📘</span>
                <span class="category-title">Basic Queries</span>
                <span class="category-desc">Single-level data fetching</span>
            </div>
            <div class="category-cards">${simpleCards}</div>
        </div>
        <div class="examples-category advanced-category">
            <div class="category-header">
                <span class="category-icon">🚀</span>
                <span class="category-title">Advanced Queries</span>
                <span class="category-desc">Nested & relational data</span>
            </div>
            <div class="category-cards">${advancedCards}</div>
        </div>
    `;

    loadExample(0);
}

function loadExample(index) {
    const example = allExamples[index];
    queryEditor.value = example.query;
    resultDisplay.innerHTML = '<span style="color: var(--text-secondary)">// Click "Execute Query" to see results</span>';
    responseMeta.textContent = '';

    // Highlight selected card
    document.querySelectorAll('.example-card').forEach(card => {
        card.classList.toggle('selected', parseInt(card.dataset.index) === index);
    });
}

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

function showError(message) {
    resultDisplay.innerHTML = `<span style="color: var(--error)">Error: ${message}</span>`;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
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
        }
    );
}

function prettifyQuery() {
    const query = queryEditor.value;

    try {
        let depth = 0;
        let prettified = '';
        let inString = false;

        for (let i = 0; i < query.length; i++) {
            const char = query[i];

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

function setupEventListeners() {
    apiSelector.addEventListener('click', (e) => {
        const card = e.target.closest('.api-card');
        if (card) {
            loadAPI(card.dataset.api);
        }
    });

    examplesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.example-card');
        if (card) {
            loadExample(parseInt(card.dataset.index));
        }
    });

    executeBtn.addEventListener('click', executeQuery);
    prettifyBtn.addEventListener('click', prettifyQuery);
    copyBtn.addEventListener('click', copyResult);

    variablesToggle.addEventListener('click', () => {
        variablesPanel.classList.toggle('show');
    });

    queryEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            executeQuery();
        }
    });
}

init();
