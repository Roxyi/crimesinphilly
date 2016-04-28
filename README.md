# Crimes in Philly

This is a web mapping interface displaying the crimes in Philly during the time period from 2015-01-01 to 2016-04-12.
The data source is https://www.opendataphilly.org/dataset/crime-incidents/resource/3e00a40d-8444-418c-b3a6-bef5524b90a2. 

The data is stored on [CartoDB](https://yixu0215.cartodb.com/viz/fa797b26-021e-11e6-b8d9-0ea31932ec1d/public_map). I mainly used leaflet.js and CartoDB.js to build the web map. Actually, to solve the conflict between CartoDB.js and jQuery, I used cartodb_nojquery.js. It enabled me to display the torque layer.

An alternative URL of the project is: [crimesinphilly.com](http://crimesinphilly.com/). ~~I use AWS to host the website. However, for some reason, I cannot use geolocation function on Chrome with an http domain. I am still trying to figure out how to get an https domain. Therefore, if you use the alternative URL to browse the website, you may need to use Firefox to enable the geolocation function.~~

I used leaflet draw to create a marker instead of geolocation because I found that if you are out of Philly, the geolocation function will be meaningless. Now you can create a marker on the map to see the nearest 10 crimes to this marker.

Thank [Nathan Zimmerman](https://github.com/moradology) and [Jeff Frankl](https://github.com/jfrankl) for helping me on the code. They are the instructors of my JavaScript class. Follow them if you are interested in their projects.
