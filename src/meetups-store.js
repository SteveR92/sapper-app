import { writable } from 'svelte/store'

const meetups = writable([
    
  ]
)

const customMeetupsStore = {
    subscribe: meetups.subscribe,
    setMeetups: (meetupArray) => {
      meetups.set(meetupArray)
    },
    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData,
        }
        meetups.update(items => {
            return [newMeetup, ...items]
        })
    },
    updateMeetup: (id, meetupData) => {
        meetups.update(items => {
          const meetupIndex = items.findIndex(i => i.id === id);
          const updatedMeetup = { ...items[meetupIndex], ...meetupData };
          const updatedMeetups = [...items];
          updatedMeetups[meetupIndex] = updatedMeetup;
          return updatedMeetups;
        });
      },
    removeItem: (id) => {
        meetups.update(items => {
            return items.filter(i => i.id !== id)
        })
    },
    toggleFavourite: id => {
        meetups.update(items => {
            const updatedMeetup = { ...items.find(m => m.id === id) };
            updatedMeetup.isFavourite = !updatedMeetup.isFavourite;
            const meetupIndex = items.findIndex(m => m.id === id);
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups
        })
    }

}

export default customMeetupsStore