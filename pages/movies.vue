<template>
    <div class="container">
        <header>
            <h1>IMDb Search</h1>
            <div class="search-container">
                <input
                    type="text"
                    v-model="search"
                    @keydown.enter="searchTriggerEvent()">
                <button @click="searchTriggerEvent()">Search</button>
                <button
                    class="alt"
                    @click="showFilters = !showFilters">
                    {{ showFilters ? 'Filters ▲': 'Filters ▼' }}
                </button>
            </div>
        </header>
        <div
            class="filters"
            :class="{'open': showFilters}">
            <select
                name="year"
                id="year"
                v-model="searchYear">
                <option value="null" disabled selected>Year</option>
                <option value="">All</option>
                <option
                    v-for="i in yearRangeArray"
                    :key="i"
                    :value="i">
                    {{ i }}
                </option>
            </select>
            <select
                name="type"
                id="type"
                v-model="searchType">
                <option value="null" disabled selected>Type</option>
                <option value="">All</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
                <option value="epidose">Episode</option>
            </select>
        </div>
        <section class="movie-list-container">
            <div v-if="loading">Loading...</div>
            <div v-else-if="movieList.length == 0" class="error-message">
                {{ error ? error : 'Type something on the search bar and press enter' }}
            </div>
            <div v-else class="movie-list">
                <div
                    class="movie-card"
                    v-for="(movie, i) in movieList"
                    :key="i"
                    @click="loadMovieDetails(movie.imdbID)">
                    <div
                        class="img-container"
                        :style="{
                            'background-image': `url(${getMoviePoster(movie)})`
                        }"/>
                    <div class="movie-details">
                        <h2>
                            {{ movie.Title }} <br>
                            <span>{{ movie.Type }}</span>
                            <span>{{ movie.Year }}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div
                class="pagination-controls"
                v-if="totalItems > 10 && !error && !loading">
                <button
                    @click="searchMovies(page--)"
                    :disabled="page == 1 || loading">
                    &lt;
                </button>
                <span>
                    {{ page }} / {{ pagesAmount }}
                </span>
                <button
                    @click="searchMovies(page++)"
                    :disabled="page == pagesAmount || loading">
                    >
                </button>
            </div>
        </section>
        <section
            class="modal"
            v-if="showModal && modalMovie">
            <div class="modal-content">
                <div
                    class="img-container"
                    :style="{
                        'background-image': `url(${getMoviePoster(modalMovie)})`
                    }"/>
                <h3>
                    {{  modalMovie.Title }} <br>
                    <span>{{ modalMovie.Type }}</span>
                    <span>{{ modalMovie.Year }}</span>
                </h3>
                <p>
                    <span v-if="modalMovie.Plot != 'N/A'">{{ modalMovie.Plot }}</span> <br> <br>
                    <span v-if="modalMovie.Ratings.length > 0">Rating: {{ modalMovie.Ratings[0].value || 'N/A' }}</span> <br>
                    <span>Rated: {{ modalMovie.Rated }} </span> <br>
                    <span>Genre: {{ modalMovie.Genre }} </span> <br>
                    <span>Director: {{ modalMovie.Director }} </span> <br>
                </p>
            </div>
            <div v-if="!modalMovie">
                Loading...
            </div>
            <div
                tabindex="0"
                class="close-modal"
                @keydown.enter="showModal = false"
                @click="showModal = false">
                ❌
            </div>
        </section>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import notFoundImage from '/not_found.png'
export default {
    name: 'Index',
    mounted () {
        this.checkToken()
    },
    data () {
        return {
            runtimeConfig: useRuntimeConfig(),
            token: null,
            search: '',
            movieList: [],
            totalItems: 0,
            loading: false,
            error: null,
            page: 1,
            showFilters: false,
            searchYear: null,
            searchType: null,
            showModal: true,
            modalMovie: null
        }
    },
    methods: {
        checkToken () {
            // Verify the existence of a token
            this.token = Cookies.get('token')
            if (!this.token) this.$router.push('/login')
        },
        searchTriggerEvent () {
            this.page = 1
            this.showFilters = false
            this.searchMovies()
        },
        searchMovies (newPage) {
            // Reset variables
            this.loading = true
            this.error = null
            this.movieList = []
            this.totalItems = 0
            let page = newPage || 1

            // Create string with parameters
            const params = new URLSearchParams({
                s: this.search.trim(),
                token: this.token,
                page,
                type: this.searchType ? this.searchType : '',
                y: this.searchYear ? this.searchYear : ''
            })

            fetch(`${this.runtimeConfig.public.API_BASE_URL}/movie?${params}`, { method: 'GET' })
            .then(resp => {
                this.loading = false
                // Handle response on error
                if (resp.ok) return resp.json()
                throw new Error(resp.status)
            })
            .then(data => this.handleSearchResults(data))
            .catch(error => {
                // Redirect to login if token's expired or not valid
                if (error.message == 401 || error.message == 403) this.$router.push('/login')
            })
        },
        searchMovieById (id) {
            const params = new URLSearchParams({
                i: id,
            })

            fetch(`${this.runtimeConfig.public.API_BASE_URL}/movie?${params}`, { method: 'GET' })
            .then(resp => {
                // Handle response on error
                if (resp.ok) return resp.json()
                throw new Error(resp.status)
            })
            .then(data => this.modalMovie = data)
            .catch(error => {
                // Redirect to login if token's expired or not valid
                if (error.message == 401 || error.message == 403) this.$router.push('/login')
            })
        },
        loadMovieDetails (id) {
            this.modalMovie = null
            this.showModal = true
            this.searchMovieById(id)
        },
        handleSearchResults (data) {
            // Handle missing data and response error report
            if (!data) {console.error('Missing request data'); return}
            if (data.Response == 'False') {this.error = data.Error; return}

            this.totalItems = data.totalResults
            this.movieList = data.Search
        },
        getMoviePoster (movie) {
            return movie && movie.Poster != 'N/A' ? movie.Poster : notFoundImage
        }
    },
    computed: {
        pagesAmount () {
            return Math.round(this.totalItems / 10)
        },
        yearRangeArray () {
            const yearLimit = new Date().getFullYear() + 1
            return [...Array(yearLimit).keys()].filter(i => i > 1893).reverse()
        }
    }
}
</script>

<style scoped>
header {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    background-color: var(--bg-color);
    position: relative;
    z-index: 3;
}

h1 {
    margin-right: 1em;
}

input {
    margin-right: .5em;
}

header button:not(:last-child) {
    margin-right: .5em;
}

.container {
    position: relative;
}

.error-message {
    text-align: center;
    max-width: 90%;
}

.movie-list-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 80px);
    flex-direction: column;
    position: relative;
    z-index: 1;
}

.filters {
    background: #262626;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    position: absolute;
    top: 0;
    padding: .5em;
    transition: top .2s ease;
    width: 100%;
    z-index: 2;
}

.filters.open {
    top: 5em;
}

.movie-list {
    z-index: -2;
}

.pagination-controls {
    padding: 1em 0;
}

.pagination-controls span {
    padding: 0 1em;
}

@media screen and (max-width: 600px) {
    header {
        flex-direction: column;
        margin-bottom: 0;
        padding-bottom: .5em;
    }

    h1 {
        margin-right: 0;
        margin-bottom: 1em;
    }

    header div {
        display: flex;
        width: 100%;
    }

    input {
        width: 100%;
    }

    .movie-list-container {
        height: calc(100% - 183px);
    }

    .search-container {
        display: flex;
        flex-wrap: wrap;
    }

    .search-container input {
        width: calc(75% - 0.5em);
    }

    .search-container button:first-of-type {
        width: 25%;
        margin-right: 0;
    }

    .search-container button:not(:first-of-type) {
        width: 100%;
        margin-top: .5em;
    }

    .filters.open {
        top: 11.4em;
    }
}
</style>