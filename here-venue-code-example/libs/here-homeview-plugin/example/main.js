
var platform = new H.service.Platform({
  app_id: 'TBDjSb7P7zIirbfww4jT',
  app_code: 'TysyptsFjJv-ceJwXGoYmw',
  useCIT: true,
  useHTTPS: true
});

var defaultLayers = platform.createDefaultLayers({lg:"RUS"});

var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  	center:{
  		"lat":47.21623,
  		"lng":39.63069
  	},
  	zoom:17
  });

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

window.addEventListener('resize',function(){
	map.getViewPort().resize()
});

var control = new HomeViewControl({
  position:'right-middle',
  center: {
    "lat": 47.234,
    "lng": 39.123,
  },
  zoom:3
});

ui.addControl('control', control);



