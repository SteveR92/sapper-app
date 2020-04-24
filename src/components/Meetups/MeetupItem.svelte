<script>
  import { createEventDispatcher } from 'svelte'

  import meetups from '../../meetups-store.js'
  import Button from '../UI/Button.svelte'
  import Badge from '../UI/Badge.svelte'

  export let id
  export let title
  export let subtitle
  export let imageUrl
  export let description
  export let address
  export let email
  export let isFav

  let isLoading = false

  const dispatch = createEventDispatcher()

  function toggleFavourite() {
    isLoading = true
    fetch(`https://svelte-course-e7c7d.firebaseio.com/meetups/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({isFavourite: !isFav}),
      headers: { 'Content-Type': 'application/json'}
    }).then(res => {
      if (!res.ok) {
        throw new Error('An error occured')
      }
      isLoading = false
      meetups.updateMeetup(id, meetupData)
    })
    .catch(err => {
      isLoading = false
      console.log(err)

    })
    meetups.toggleFavourite(id)
  }

</script>


<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  /* h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  } */

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }

  #address {
      font-size: 1em;
      text-align: right;
      color: #cf0056;
  }

  .content {
      height: 2em;
  }

  
</style>

<article> 
    <header>
        <h1>{title} 
        {#if isFav}
        <Badge>Favourite</Badge> 
        {/if}
        </h1>
        <h2>{subtitle}</h2>
        <p id="address">{address}</p>
    </header>
    <div class="image">
        <img src={imageUrl} alt={title} />
    </div>
    <div class="content">
        <p>{description}</p>
    </div>
    <footer>
        <Button mode="outline" type="button" on:click={() => dispatch('edit', id)}>Edit</Button>
        <Button href="/{id}" >Show Details</Button>
        <Button 
          mode="outline" 
          color={isFav ? null : 'success'}
          rightFloat="rightFloat" 
          type="button" 
          on:click={toggleFavourite} 
        >{isFav ? 'Unfavourite': 'Favourite'}
        </Button>
   
    </footer>
</article>