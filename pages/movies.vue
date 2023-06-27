<template>
    <div>
        <header>
            <h1>IMDb Search</h1>
            <input
                type="text"
                v-model="search"
                @keydown.enter="searchMovies(); page = 1">
            <button @click="searchMovies(); page = 1">Search</button>
        </header>
        <section class="movie-list">
            <div v-if="loading">Loading...</div>
            <div v-else-if="movieList.length == 0">
                {{ error ? error : 'type something on the search and press enter' }}
            </div>
            <div v-else>
                <div v-for="(movie, i) in movieList" :key="i">
                    {{  movie.Title }}
                </div>
            </div>
            <div v-if="totalItems > 10">
                <button
                    @click="searchMovies(page--)"
                    :disabled="page == 1 || loading">
                    &lt;
                </button>
                {{ page }} / {{ pagesAmount }}
                <button
                    @click="searchMovies(page++)"
                    :disabled="page == pagesAmount || loading">
                    >
                </button>
            </div>
        </section>
        <footer>
            Made with ❤️ using Nuxt
        </footer>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
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
            page: 1
        }
    },
    methods: {
        checkToken () {
            // Verify the existence of a token
            this.token = Cookies.get('token')
            if (!this.token) this.$router.push('/login')
        },
        searchMovies (newPage) {
            // Reset variables
            this.loading = true
            this.error = null
            this.movieList = []
            let page = newPage || 1

            // Create string with parameters
            const params = new URLSearchParams({ s: this.search, token: this.token, page })

            fetch(`${this.runtimeConfig.public.API_BASE_URL}/movie?${params}`, { method: 'GET' })
            .then(resp => {
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
        handleSearchResults (data) {
            // Handle missing data and response error report
            if (!data) {console.error('Missing request data'); return}
            if (data.Response == 'False') {this.error = data.Error; return}

            this.totalItems = data.totalResults
            this.movieList = data.Search
            this.loading = false
        }
    },
    computed: {
        pagesAmount () {
            return Math.round(this.totalItems / 10)
        }
    }
}
</script>