
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
  		"lat":47.21623,
  		"lng":39.63069
  	},
  	zoom:17,
    noWrap:true,
  });

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Создаем стаедартный пользовательский интерфейс
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Изменение размера карты в зависимости от изменения размеров окна
window.addEventListener('resize',function(){
	map.getViewPort().resize()
});

var control = new GeolocationControl('right-middle');
ui.addControl('control', control);



