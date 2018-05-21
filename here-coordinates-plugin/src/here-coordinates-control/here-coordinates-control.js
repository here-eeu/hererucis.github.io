(function(){
	'use strict;'

	class CoordinatesControl extends H.ui.Control {

		constructor (position) {
			super();
			this.setAlignment(position)
		}
		renderInternal (el, doc) {
			el.innerHTML = `
				<div id="ctrl-coordinates"></div>
			`;
			super.renderInternal(el, doc);
			this.updateCoords();
		}
		
		updateCoords () {
			let container = document.getElementById("ctrl-coordinates");
			container.innerHTML = `
					<div>
						Широта: <br>
						Долгота:
					</div>
					<div class="coords-style">
						${map.getCenter().lat} <br>
						${map.getCenter().lng}
					</div>`;
			
			map.addEventListener('pointermove', e => {
				let coords = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
				container.innerHTML = `
					<div>
						Широта: <br>
						Долгота:
					</div>
					<div class="coords-style">
						${coords.lat} <br>
						${coords.lng}
					</div>`;
			})
		}
	};

	Object.assign(window, {CoordinatesControl});

}());