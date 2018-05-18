(function(){
	'use strict;'

	class HomeViewControl extends H.ui.Control {

		constructor (options) {
			super();
			this.setAlignment(options.position)
			this.center = options.center;
			this.zoom = options.zoom;
		}
		renderInternal (el, doc) {
			el.innerHTML = `
				<div id="ctrl-homeview" class="btn-location">
					<span data-here-map-control-location-svg>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" color="blue" viewBox="0 0 32 32">
							<title>home3</title>
							<path d="M32 19l-6-6v-9h-4v5l-6-6-16 16v1h4v10h10v-6h4v6h10v-10h4z"></path>
						</svg>
					</span>
				</div>
			`;

			el.addEventListener ('click', this.setHomeView.bind(this), false);
			
			super.renderInternal(el, doc);
		}
		
		setHomeView () {
			map.setCenter(this.center);
			map.setZoom(this.zoom);
		}
	};

	Object.assign(window, {HomeViewControl});

}());