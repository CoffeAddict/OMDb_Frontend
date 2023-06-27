<template>
    <div>Movies</div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Index',
  mounted () {
    this.checkToken()
    this.getMovies({t: 'a', y: '2023'})
  },
  data () {
    return {
        token: ''
    }
  },
  methods: {
    checkToken () {
        this.token = Cookies.get('token')
        if (!this.token) this.$router.push('/login')
    },
    getMoviesbyTitle () {
    },
    searchMovies () {
        
    }
  }
}
</script>