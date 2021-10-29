## DOM analysis


It seems that everything visible are in the `<div>` with attribute `data-uia="player"`, which makes sense as it represents the video player. Considering the names of the new divisions' classes that pop up when the buttons appear, the behavior may change depending on the screen resolution. Therefore, I should probably use the data attribute to find the elements. 

> Does the code really differ depending on the screen resolution?

The class of the player contains "passive" when watching, then it's replaced by in.active when the mouse moves in/out. 


### Loading process


I noticed that the player takes some times to load, about 2 seconds on my end. So I just set a 1 second interval loop to check if the player exists before continuing. 

The buttons are dynamically added to or removed from the player. Therefore I thought to observe when nodes are added/removed with a MutationObserver on the player. As there are other kind of child nodes that trigger the mutations, I just check whether a button exists, and if so I call the click function. 


## Buttons references

What are the custom data (they chose to name it data-uia) name for each button?
- Summary : "player-skip-recap"
- Intro : "player-skip-intro"
- Next episode : "next-episode-seamless-button"
- Still watching : ""