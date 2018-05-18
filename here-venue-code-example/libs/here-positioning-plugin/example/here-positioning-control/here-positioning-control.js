(function(){
	'use strict;'

	// Создание класса контрола 
	class GeolocationControl extends H.ui.Control {

		// Указываем стандартное место отображения на экране 
		constructor (position='top-left') {
			// Наследование конструктора из класса H.ui.Control
			super();
			// Указываем место отображения кнопки
			this.setAlignment(position)

		}
		renderInternal (el, doc) {
			// Формируем структура инструмента
			el.innerHTML = `
				<div id="ctrl-geolocation" class="btn-location">
					<span data-here-map-control-location-svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
							
							<path class="middle_location_stroke" d="M8 12c-2.206 0-4-1.795-4-4 0-2.206 1.794-4 4-4s4 1.794 4 4c0 2.205-1.794 4-4 4M8 1.25a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5">
							</path>
							
							<path class="inner_location_stroke" d="M8 5a3 3 0 1 1 .001 6A3 3 0 0 1 8 5m0-1C5.794 4 4 5.794 4 8c0 2.205 1.794 4 4 4s4-1.795 4-4c0-2.206-1.794-4-4-4">
							</path>
							
							<path class="outer_location_stroke" d="M8 1.25a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5M8 0C3.59 0 0 3.59 0 8c0 4.411 3.59 8 8 8s8-3.589 8-8c0-4.41-3.59-8-8-8">
							</path>

							</svg>
					</span>
				</div>
			`;

			// Обработчик события при нажатии на кнопку
			el.addEventListener ('click', this.getLocation);

			// Рендеринг контрола
			super.renderInternal(el, doc);
		}
		getLocation (evt) {
			var that = this;

			// Получаем кнопку по ID
			var button = document.getElementById("ctrl-geolocation");

			// Обрабатываем два состояния: есть класс active, нет класса active
			if (!button.classList.contains("active")) {
				
				// Добавляем класс в списко классов элемента
				button.classList.add("active");

				// Втроенный объект navigator для работы с геолокацией
				navigator.geolocation.getCurrentPosition (function (position) {
					
					// Записываем полученные координаты в переменную center
					var center = {"lat":position.coords.latitude,"lng":position.coords.longitude};

					// Получаем точность определения местоположения (радиус)
					var accuracy = position.coords.accuracy;

					// Формируем окружность в зависимости от радиуса accuracy
					that.area = new H.map.Circle(center, accuracy, {
				      style: {
				        strokeColor: '#0099bb4f',
				        lineWidth: 1,
				        fillColor: '#0099bb4f'
				      }
				    });

				    that.geoGroup = new H.map.Group(); 
					
					// Создаем маркер с координатами нашего местоположения
					that.marker = new H.map.Circle(center, 1.5, {
				      style: {
				        strokeColor: '#245f2f',
				        lineWidth: 1,
				        fillColor: 'rgba(116, 237, 38, 0.78)'
				      }
				    });

					that.marker2 = new H.map.Circle(center, 0.8, {
				      style: {
				        strokeColor: '#245f2f',
				        lineWidth: 1,
				        fillColor: 'rgba(255, 255, 255, 0.74)'
				      }
				    });

					that.geoGroup.addObject(that.marker);
					that.geoGroup.addObject(that.marker2);
					// Масштабируемся на местоположения
					map.setCenter(center);
					
					// добавляем созданные объекты на карту
					map.addObject(that.area);
					map.addObject(that.geoGroup);
				});

			} else {
				// Если класс active есть - удаляем класс и объекты с карты
				button.classList.remove("active");
				map.removeObject(that.geoGroup);
				map.removeObject(that.area);
			} 
		}
	};

	// Добавление в объект window нашего класса, чтобы он был доступен в основном
	Object.assign(window, {GeolocationControl});

}());