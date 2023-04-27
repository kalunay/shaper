<template>
    <div class="toast align-items-center text-bg-primary border-0" :class="(($store.state.messages.show == true) ? 'show' : 'hide')" data-bs-config='{"delay":0, "autohide": true}'  role="alert" aria-live="assertive" aria-atomic="false">
      <div class="d-flex">
        <div class="toast-body">
          Изменение сохранено
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click.prevent="hideMsg()" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
</template>

<script>
export default {
    name: 'MessagePopup',
    watch: {
        '$store.state.messages.show': {
            handler(newValue) {
                console.log(newValue)
                setTimeout(() => {
                  this.hideMsg()
                }, 3000)
            },
            immediate: false,
        },
    },
    methods: {
      hideMsg(){
        this.$store.state.messages.show = false
      }
    }
}
</script>

<style scoped>

</style>