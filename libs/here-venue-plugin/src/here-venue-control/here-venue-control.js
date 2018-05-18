(function () {
	'use strict;'

	class IndoorControl extends H.ui.Control {
		constructor (position="top-left", venues, first_level_id=1) {
			super();

			this.setAlignment(position);
			this.layerGroup = new H.map.Group();

			map.addObject(this.layerGroup);
			
			this.venues = venues;

			let first_level = this.venues.filter(function (elem) {
				return elem.id == first_level_id
			});

			first_level = first_level[0].data;
			
			let bubble;
			
			map.addEventListener('pointerenter', ev => {
				first_level.getObjects().forEach(function(el){
					el.setStyle({
						fillColor: "rgba(0,85,170,.4)",
						lineWidth: 2,
						strokeColor: "rgba(0,85,170,.6)"
					})
				});
				try{
					bubble.close()
				} catch {

				}
			});
			
			let holdEvent;

			first_level.addEventListener('pointermove', function (feature) {
				// debugger;
				if (holdEvent != feature) {
					try {
						holdEvent.target.setStyle({
					      fillColor: "rgba(0,85,170,.4)",
					      lineWidth: 2,
					      strokeColor: "rgba(0,85,170,.6)"
					    });

					    bubble.close()
					} catch (err) {
						
					}
				};
				
				holdEvent = feature;

				var coords = map.screenToGeo(feature.currentPointer.viewportX,feature.currentPointer.viewportY);

				bubble = new H.ui.InfoBubble({
					"lat": coords.lat,
					"lng": coords.lng,
				},{
					content: `
						Этаж: ${feature.target.getData().properties.LEVEL}
						<br>
						Аудитория: ${feature.target.getData().properties.LOT_id}
						`
				});

				feature.target.setStyle({
					fillColor:"#fff"
				});

				ui.addBubble(bubble);
				
			});
			
			this.layerGroup.addObject(first_level);
		}
		renderInternal (el, doc) {
			var that = this;
			
			let control = document.createElement("div");
			control.id = "ctrl-venues";
			control.className = "btn-venue";


			this.venues.forEach(elem => {

				let button = document.createElement("div");
				button.id = elem.id;
				button.className = "venue-level";
				button.innerHTML = elem.id;
				

				control.appendChild(button);
				
			});
			
			el.innerHTML = control.innerHTML;

			el.addEventListener('click', this._levelHandler.bind(this), false);

			super.renderInternal(el, doc);
			
		}
		_levelHandler (evt) {
			this.layerGroup.removeObjects(this.layerGroup.getObjects());
			
			let holdEvent;

			let level_id = evt.target.id,
				current_level = this.venues.filter(function (elem) {
					return elem.id == level_id
				});

			current_level = current_level[0].data;

			current_level.getObjects().forEach(function(el){
				el.setStyle({
					fillColor: "rgba(0,85,170,.4)",
					lineWidth: 2,
					strokeColor: "rgba(0,85,170,.6)"
				})
			});

			let bubble;

			map.addEventListener('pointerenter', ev => {
				current_level.getObjects().forEach(function(el){
					el.setStyle({
						fillColor: "rgba(0,85,170,.4)",
						lineWidth: 2,
						strokeColor: "rgba(0,85,170,.6)"
					})
				});
				try{
					bubble.close()
				} catch {

				}
			});

			current_level.addEventListener('pointermove', function (feature) {
				
				if (holdEvent != feature) {
					try {
						holdEvent.target.setStyle({
					      fillColor: "rgba(0,85,170,.4)",
					      lineWidth: 2,
					      strokeColor: "rgba(0,85,170,.6)"
					    });

					    bubble.close()
					} catch (err) {
						
					}
				};
				
				holdEvent = feature;

				var coords = map.screenToGeo(feature.currentPointer.viewportX,feature.currentPointer.viewportY);

				bubble = new H.ui.InfoBubble({
					"lat": coords.lat,
					"lng": coords.lng,
				},{
					content: `
						Этаж: ${feature.target.getData().properties.LEVEL}
						<br>
						Аудитория: ${feature.target.getData().properties.LOT_id}
						`
				});

				feature.target.setStyle({
					fillColor:"#fff"
				});

				ui.addBubble(bubble);
				
			});

			this.layerGroup.addObject(current_level);
		}
	};
	
	Object.assign(window, {IndoorControl});
}())