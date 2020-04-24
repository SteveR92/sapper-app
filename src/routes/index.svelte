<script context="module">
    export function preload(page){
    return this.fetch("https://svelte-course-e7c7d.firebaseio.com/meetups.json")
            .then(res => {
                if (!res.ok) {
                throw new Error ('error')
                }
                return res.json()
            })
            .then(data => {
                const loadedMeetup = []
                for (const key in data) {
                loadedMeetup.push({
                    ...data[key],
                    id: key
                })
                }
                return {fetchedMeetups: loadedMeetup.reverse()}
            })
            .catch(err => {
                error = err
                isLoading = false
                console.log(err)
                this.error(500, 'Could Not Fetch Meetups')
            })
    }
</script>


<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'
    import { scale } from 'svelte/transition'
    import { flip } from 'svelte/animate'
    import meetups from '../meetups-store.js'
    import Meetup from '../components/Meetups/MeetupItem.svelte'
    import MeetupFilter from '../components/Meetups/MeetupFilter.svelte'
    import Button from '../components/UI/Button.svelte'
    import EditMeetup from '../components/Meetups/EditMeetup.svelte'
    import LoadingSpinner from '../components/UI/LoadingSpinner.svelte'
    
    export let fetchedMeetups

    let editMode
    let editedId
    let isLoading
    let unsubscribe

    const dispatch = createEventDispatcher()

    let favsOnly = false

    $: filteredMeetups = favsOnly ? fetchedMeetups.filter(m => m.isFavourite) : fetchedMeetups

    onMount(() => {
        meetups.setMeetups(fetchedMeetups)
        unsubscribe = meetups.subscribe(items => {
            fetchedMeetups = items;    
        })
    })

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe()
        }
    })

    function setFilter(e) {
        favsOnly = e.detail === 1
    }
    function savedMeetup(event) {
    editMode = null;
    editedId = null
  }


  function cancelEdit() {
    editMode = null;
    editedId = null
  }


  function startEdit(e) {
    editMode = 'edit'
    editedId = e.detail
  }

  function startAdd() {
      editMode = 'edit'
  }
</script>

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    .no-meetups {
        margin: 1rem;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>


<svelte:head>
	<title>Meetups</title>
</svelte:head>


 
{#if editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found, you can start adding some.</p>
  {/if}
  <section id="meetups">
    {#each filteredMeetups as meetup (meetup.id)}
      <div transition:scale animate:flip={{ duration: 300 }}>
        <Meetup id={meetup.id} title={meetup.title} subtitle={meetup.subtitle} description={meetup.description} imageUrl={meetup.imageUrl} email={meetup.contactEmail} address={meetup.address} isFav={meetup.isFavourite} on:edit={startEdit} />
      </div>
    {/each}
  </section>
{/if}


