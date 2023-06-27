<template>
    <div>Homepage</div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'Index',
    mounted () {
        this.checkToken()
    },
    methods: {
        checkToken () { // Verify the existence of a token
            const token = Cookies.get('token')
            if (!token) this.$router.push('/login')
            this.$router.push('/movies')
        }
    }
}
</script>