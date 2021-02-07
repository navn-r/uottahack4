# Uottahack4

## Inspiration
Me and my friends often find ourselves running out of essential items, but we are also fearful of contracting the virus. We wanted a way to find the closest and safest places to shop for these items. Thus the idea to visualize the COVID-19 density per neighborhood as well as finding the closest and safest place to go to was born.  

## What it does
This amazing web app first gives you a visual of the latest COVID-19 density in the city of Toronto straight from their open datasets for COVID-19. Then it allows you to keyword search the store or place you want to visit (For example if you wanted to go to a grocery store you can search "grocery store", if for some reason you wanted to go to a karate dojo you can search "karate" as well). This then places a marker on the map so you can see in which density that store falls into. It also sorts it by distance and by number of cases. Thus your finally left with the closest and most safe place to shop or visit.  

## How we built it
We first made the visualization of the city borders by using an open Toronto data set with the polygons setup. We then used the Google Maps data-layer function to put down the borders. After this we used the COVID-19 data set provided by the city of Toronto and with some data normalization set an opacity to each neighborhood (the most dense being opaque and those with no cases being transparent). After this we used the the Google maps near by search function to find the nearest shops/places within a 10 km radius. We then matched the neighborhood that they were in with the number of cases that we obtained before as well. This is what enables us to sort by number of cases giving you the closest, safest space.

## Challenges we ran into
Our first challenge was getting, normalizing and visualizing the data. Our next challenge was linking the relevant data to our search results to be sorted to find the closest, safest place. We solved the first challenge by researching and combing through the open data set that the city of Toronto provided. To normalize the data we needed a positive only value between 0 and 1 thus we used the (x - min)/(max - min) normalization function. Once we had the data between 0 and 1 to visualize all we had to do was set the color to red and adjust the opacity with the 0 to 1 values that we found. To solve the challenge of linking we first used a quite convoluted method, which went as such: First get the search results using nearby search (this lists all key word matches within a 10km radius), Once this is done we take the longitude and latitude and reverse geocode it to see which neighborhood it falls into. Once we have the neighborhood we get the number of cases from our data set. As mentioned this method was very convoluted and often did not produce the wanted results. Thus we researched available methods from the google maps API and stumbled upon the containsLocation() function. This function allows us to check if a given longitude and latitude are in a polygon. Since our data set has the polygons, as well as the number of cases in it, all we had to do was loop through the dataset until we have a containsLocation() match, and then return the number of cases. This produced exactly what we needed. 

## Accomplishments that we're proud of
Visualizing COVID-19 Data in Toronto (and seeing how bad certain areas  with compared to others). The searching and matching with polygons to get the number of cases. Not to mention the fact that we even came up with an idea. The entire project to be honest with you.

## What we learned
Setting up and using the maps API as well as its many useful functions. Data visualization and normalization. 

## What's next for Where Is The Safest Space?
The next step would be to add path finding that gives you the fastest route to a given area that also avoids dense COVID-19 areas. 
