(function(){

	'use strict;'

	// Step 1 - Initialize Map

	// GLOBALS
    // H (from HERE API)
    // M manage common objects and settings
      
	let M = {
	    'Init' : { // developer.here.com for app_id and app_code
	      'app_id':   'SRDnjFXg1EUdjJNVu9xN',
	      'app_code': 'BDyd-r-8dYkniAe-fQKrOw',
	      useHTTPS: true
	    },
	    'Behavior' :    {},         // Manage map behaviors
	    'Container' :   {},         // Reference to DOM object containing map
	    'PlacesService' :      {},  // Geocoder service
	    'PlacesGroup': 	{},			// Group for markers
	    'Lat' :         55.751,     // Latitude
	    'Lng' :         37.620,     // Longitude
	    'Layers' :      {},         // Map layers
	    'Map' :         {},         // Map object
	    'Platform' :    {},         // Core to HERE API
	    'UI' :          {},         // User interface and interaction
	    'Zoom' :        12          // 1 == global, 15 == street level
	};
	
	// Obtain reference to #map in DOM 
	M.Container = document.querySelector('#map');
	  
	// Store initialized platform object
	M.Platform = new H.service.Platform(M.Init)
	  
	// Store reference to places service
	M.PlacesService = M.Platform.getPlacesService()

	// Store places markers in group
	M.PlacesGroup = new H.map.Group()
	  
	// Store reference to layers object
	M.Layers = M.Platform.createDefaultLayers({lg:'rus'})

	// Create map object initialized with container and style
	// Set map style - example M.Layers.satellite.map
	M.Map = new H.Map(M.Container, M.Layers.normal.map);
	  
	// Create behavior object initialized with map object
	M.Behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(M.Map))
	  
	// Store UI object associated with map object and layers object
	M.UI = H.ui.UI.createDefault(M.Map, M.Layers)

	window.addEventListener('resize', () => {
		M.Map.getViewPort().resize()
	})

	function displayMap () {
		M.Map.setCenter({lat: M.Lat, lng: M.Lng})
        M.Map.setZoom(M.Zoom)
        M.Map.addObject(M.PlacesGroup)
	}

	displayMap()



	// Step 2 - Calculations

	let C = {
		CvtStepsToMeters: steps => steps * 0.762,
		CvtMetersToSteps: meters => meters / 0.762,
		CreateMarker: (coords, options=null) => new H.map.Marker({ lat: coords.lat, lng: coords.lng }, options),
	}

	// Step 3 - Places
	let P = {
		'Latitude': 55.751,
		'Longitude': 37.620,
		'Category': 'sights-museums',
		'Radius': C.CvtStepsToMeters(2500),
		'ShowPlaces': {}
	}

	P.ShowPlaces = () => {

		let explore = {
			'in': `${P.Latitude},${P.Longitude};r=${P.Radius}`,
		    'cat': P.Category
		}

		M.PlacesService.explore(
	  		explore, 
	  		result => onResult(result), 
	  		error => onError(error)
	  	)

	  	let onResult = result => {
	  		console.log(result)

	  		let startPoint = C.CreateMarker({ lat: P.Latitude, lng: P.Longitude }, {})
	  		
	  		M.PlacesGroup.removeObjects(M.PlacesGroup.getObjects())

	  		result.results.items.forEach( point => {

	  			let endPoint = C.CreateMarker({ lat: point.position[0], lng: point.position[1]}, {icon: new H.map.Icon(point.icon)})
	  			
	  			let distance = startPoint.getPosition().distance(endPoint.getPosition())
	  			
	  			endPoint.setData({ 'distance': C.CvtMetersToSteps(distance), 'name': point.title}).addEventListener('tap', e => {
	  				alert("Название: " + e.target.getData().name + "\n" +"Количество шагов: " + e.target.getData().distance.toFixed(0))
	  			})

	  			M.PlacesGroup.addObject(endPoint)
	  			M.Map.setViewBounds(M.PlacesGroup.getBounds())
	  		})
	  		
	  	}

	  	let onError = error => console.log(error)
	}

	// Step 4 - Geolocation
	let G = {
		'StartTrackPosition': {},
		'ShowPosition': {},
		'ShowError': {},
		'CurrentPosition': {},
		'LocationMarker':{},
	}

	G.StartTrackPosition = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(G.ShowPosition, G.ShowError)
		} else {
			console.log("Geolocation is not supported by this browser.")
		}
	}

	G.ShowPosition = position => {
		// debugger;
		G.CurrentPosition = { 
			lat: position.coords.latitude, 
			lng: position.coords.longitude 
		}

		M.Map.setCenter(G.CurrentPosition)

		if (G.LocationMarker instanceof H.map.Marker) {
			G.LocationMarker.setPosition(G.CurrentPosition)
		} else {
			G.LocationMarker = C.CreateMarker(G.CurrentPosition, {})
			M.Map.addObject(G.LocationMarker)
		}		
	}

	G.ShowError = error =>{
		switch(error.code) {
		    case error.PERMISSION_DENIED:
		      alert("User denied the request for Geolocation.")
		      break
		    case error.POSITION_UNAVAILABLE:
		      alert("Location information is unavailable.")
		      break
		    case error.TIMEOUT:
		      alert("The request to get user location timed out.")
		      break
		    case error.UNKNOWN_ERROR:
		      alert("An unknown error occurred.")
		      break
		}
	}

	

	document.querySelector('#search').addEventListener('click', e => {
		G.StartTrackPosition()
		if(document.querySelector("#steps").value != ''){
            try{
    			P.Radius = C.CvtStepsToMeters(Number(document.querySelector("#steps").value))
    			P.Latitude  = G.CurrentPosition.lat
    			P.Longitude = G.CurrentPosition.lng

    			P.ShowPlaces()
            }catch(err){
                console.log(err)
            }
		} 
		
	})

}())
