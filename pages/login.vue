<template>
    <section>
        <form @submit.prevent="tryLogin()">
            <input
                type="text"
                name="username"
                placeholder="Username"
                required
                v-model="username">
            <input
                type="password"
                name="password"
                placeholder="********"
                required
                v-model="password">
            <button type="submit">
                Login
            </button>
        </form>
        <br>
        <div v-if="error != ''" class="error">{{ error }}</div>
    </section>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Login',
  data () {
    return {
        runtimeConfig: useRuntimeConfig(),
        username: '',
        password: '',
        error: null
    }
  },
  methods: {
    tryLogin () {
        // Reset variables and create string with parameters
        this.error = null
        const params = new URLSearchParams({ user: this.username, password: this.password })

        fetch(`${this.runtimeConfig.public.API_BASE_URL}/login?${params}`, { method: 'POST' })
        .then(resp => {
            // Handle response on error
            if (resp.ok) return resp.json()
            throw new Error(resp.status)
        })
        .then(data => this.saveToken(data.token))
        .catch(error => {
            // Display error in case credentials are invalid
            if (error.message == 401) this.error = 'Invalid Credentials'
        })
    },
    saveToken (token) {
        Cookies.set('token', token)
        this.$router.push('/movies')
    }
  }
}
</script>

<style>
</style>