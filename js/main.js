// инициализируем платформу с ID и Кодом приложения 
var platform = new H.service.Platform({
  app_id: 'YOUR APP ID',
  app_code: 'YOUR APP CODE',
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
      "lat":47.21667,
	  "lng":39.62861
    },
    zoom:18,
    autoColor:false
  });

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Создаем стандартный пользовательский интерфейс
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Изменение размера карты в зависимости от изменения размеров окна
window.addEventListener('resize',function(){
	map.getViewPort().resize()
});


function InitializePlugins () {
	
	// Инициализация переменных для плагинов
	let distanceMeasurementTool,
		zoomRectangle,
		homeView,
		zoomControl,
		geolocation;
	//_____________________________________
	
	// Настраиваем плагин измерения расстояния
	distanceMeasurementTool = new H.ui.DistanceMeasurement({
	  'lineStyle': {
	  'strokeColor': 'rgba(18, 65, 145, .8)',
	  'lineWidth': 6
	  }
	});
	distanceMeasurementTool.setAlignment("top-right");
	//______________________________________

	// Настраиваем плагин зумирования
	zoomRectangle = new H.ui.ZoomRectangle();
	zoomRectangle.setAlignment("right-middle");
	//______________________________________
	
	// Настройка плагина домашнего вида
	homeView = new HomeViewControl({
	  position:'right-middle',
	  center: {
	    "lat":47.21667,
	    "lng":39.62861
	  },
	  zoom:18
	});
	//______________________________________

	geolocation = new GeolocationControl('right-middle');

	// Настраиваем плагин масштабирования
	zoom = ui.getControl("zoom");
	zoom.setAlignment("right-middle");
	//______________________________________

	// Добавляем инструменты в проект
	ui.addControl('distancemeasurement', distanceMeasurementTool);
	ui.addControl('zoomrectangle', zoomRectangle);
	ui.addControl('homeView', homeView);
	ui.addControl('geolocation', geolocation);
};

InitializePlugins();

// Функция для парсинга данных в формате geojson
function geojsonParser (layer) {
	let reader = new H.data.geojson.Reader();
    reader.parseData(layer);
    return reader.getParsedObjects()[0];
}


var venues = [
	{id:1, data: geojsonParser(first_level)},
	{id:2, data: geojsonParser(second_level)},
	{id:3, data: geojsonParser(third_level)},
];

var indoor_control = new IndoorControl("top-left", venues, first_level_id=1);
ui.addControl("indoor", indoor_control);

// map.addObject(venues.first_venue);





