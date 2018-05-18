
// инициализируем платформу с ID и Кодом приложения 
var platform = new H.service.Platform({
  app_id: 'YOUR_APP_ID',
  app_code: 'YOUR_APP_CODE',
  useCIT: true,
  useHTTPS: true
});

// Получаем спислк картографических основ (спутник, вектор)
var defaultLayers = platform.createDefaultLayers({lg:"RUS"});

/* Инициализируем объект карты с аргументами: 
		контейнер где необходимо отобразить карту, 
		тип базовой карты,
		опции
*/
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  	center:{
  		"lat":47.21623,
  		"lng":39.63069
  	},
  	zoom:10
});

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Создаем стаедартный пользовательский интерфейс
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Изменение размера карты в зависимости от изменения размеров окна
window.addEventListener('resize',function(){
	map.getViewPort().resize()
});


class Routing {
  constructor(map, platform, params){
    this.router = platform.getRoutingService();
    this.params = params;
    this.map = map;
  }
  drawRoute () {
    this.router.calculateRoute(
      this.params, 
      this.onSuccess, 
      this.onError
    );
  }
  onSuccess (result) {
    
    let lineString = new H.geo.LineString(),
        way = result.response.route[0].shape;

    way.forEach((point) => {
      let parts = point.split(",")
      lineString.pushLatLngAlt(parts[0], parts[1])
    });

    map.addObject(new H.map.Polyline(lineString, {
      style: { lineWidth: 10 },
      arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
    }));
  }
  onError (error) {
    console.log(error)
  }
};

var params = {
    mode: 'fastest;pedestrian',
    waypoint0: 47.435 + "," + 39.1234,
    waypoint1: 47.34534 + "," + 39.7845,
    representation: 'display',
};

new Routing(map, platform, params).drawRoute()
        



