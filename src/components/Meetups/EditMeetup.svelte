 <script>
    import meetups from '../../meetups-store.js'
    import { createEventDispatcher } from 'svelte'
    import TextInput from '../UI/TextInput.svelte'
    import Button from '../UI/Button.svelte'
    import Modal from '../UI/Modal.svelte'
    import { isEmpty, isEmail } from '../../Helpers/validation.js'

    export let id = null

    let title = ""
    let subtitle = ""
    let address = ""
    let email = ""
    let description = ""
    let imageUrl = ""

        if (id) {
        const unsubscribe = meetups.subscribe(items => {
            const selectedMeetup = items.find(i => i.id === id)
            title = selectedMeetup.title
            subtitle = selectedMeetup.subtitle
            address = selectedMeetup.address
            email = selectedMeetup.email
            description = selectedMeetup.description
            imageUrl = selectedMeetup.imageUrl
        })

        unsubscribe()
    }
  

    const dispatch = createEventDispatcher()

    $: titleValid = !isEmpty(title)
    $: subtitleValid = !isEmpty(subtitle)
    $: addressValid = !isEmpty(address)
    $: imageValid = !isEmpty(imageUrl)
    $: descriptionValid = !isEmpty(description)

    $: emailValid = isEmail(email)

    $: formIsValid = 
        titleValid &&
        subtitleValid &&
        addressValid &&
        imageValid &&
        descriptionValid &&
        emailValid

    function submitForm() {
        const meetupData = {
            title: title,
            subtitle: subtitle,
            description: description,
            imageUrl: imageUrl,
            address: address,
            email: email,
        };

        if (id) {
            fetch(`https://svelte-course-e7c7d.firebaseio.com/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(meetupData),
                headers: { 'Content-Type': 'application/json'}

            }).then(res => {
                if (!res.ok) {
                    throw new Error('An error occured')
                }
                meetups.updateMeetup(id, meetupData)
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            fetch("https://svelte-course-e7c7d.firebaseio.com/meetups.json", {
                method: 'POST',
                body: JSON.stringify({...meetupData, isFavourite: false}),
                headers: { 'Content-Type': 'application/json'}
            }).then(res => {
                if (!res.ok) {
                    throw new Error('An error occured')
                }
                return res.json
            })
            .then(data => {
            meetups.addMeetup({...meetupData, isFavourite: false, id: data.name})
            })
            .catch(err => {
                console.log(err)
            })
        }

        dispatch('save')
    }

    function cancel() {
        dispatch('cancel')
    }

    function removeItem() {
        fetch(`https://svelte-course-e7c7d.firebaseio.com/meetups/${id}.json`, {
            method: 'DELETE',
            }).then(res => {
                if (!res.ok) {
                    throw new Error('An error occured')
                }
                meetups.removeItem(id)
            })
            .catch(err => {
                console.log(err)
        })
        dispatch('save')
    }
  
 </script>

 <style>
    form {
        width: 100%;
    }
 </style>
 <Modal title="Edit Meetup" on:cancel>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
        id="title"
        label="Title"
        valid={titleValid}
        validityMessage="Please Enter a Valid Title"
        type="text"
        value={title}
        on:input={event => (title = event.target.value)} />
        <TextInput
        id="subtitle"
        label="Subtitle"
        valid={subtitleValid}
        validityMessage="Please Enter a Valid Subtitle"
        type="text"
        value={subtitle}
        on:input={event => (subtitle = event.target.value)} />
        <TextInput
        id="address"
        label="Address"
        valid={addressValid}
        validityMessage="Please Enter a Valid Address"
        type="text"
        value={address}
        on:input={event => (address = event.target.value)} />
        <TextInput
        id="imageUrl"
        label="Image URL"
        valid={imageValid}
        validityMessage="Enter a Valid Image URL"
        type="text"
        value={imageUrl}
        on:input={event => (imageUrl = event.target.value)} />
        <TextInput
        id="email"
        label="E-Mail"
        valid={emailValid}
        validityMessage="Please Enter a Valid Email"
        type="email"
        value={email}
        on:input={event => (email = event.target.value)} />
        <TextInput
        id="description"
        label="Description"
        valid={descriptionValid}
        validityMessage="Enter a Valid Description"
        controlType="textarea"
        bind:value={description} />
    </form>
        <div slot="footer">
                <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
                <Button type="button" on:click={submitForm} disabled={!formIsValid}>Save</Button>
                <Button type="button" on:click={removeItem} >Delete Event</Button>
        </div>
  </Modal>