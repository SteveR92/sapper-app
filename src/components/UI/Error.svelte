<script>
    import Modal from './Modal.svelte'

    export let message
</script>


<Modal title="An Error Occured" on:cancel>
    <p>{message}</p>
</Modal>