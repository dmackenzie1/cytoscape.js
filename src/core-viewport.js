;(function($$){
	
	$$.fn.core({
		
		panningEnabled: function( bool ){
			if( bool !== undefined ){
				this._private.panEnabled = bool ? true : false;
			} else {
				return this._private.panEnabled;
			}
			
			return this; // chaining
		},
		
		zoomingEnabled: function( bool ){
			if( bool !== undefined ){
				this._private.zoomEnabled = bool ? true : false;
			} else {
				return this._private.zoomEnabled;
			}
			
			return this; // chaining
		},
		
		pan: function(){
			var args = arguments;
			var pan = this._private.pan;
			var dim, val, dims, x, y;

			switch( args.length ){
			case 0: // .pan()
				return pan;

			case 1: 

				if( !this._private.panEnabled ){
					return this;

				} else if( $$.is.string( args[0] ) ){ // .pan("x")
					dim = args[0];
					return pan[ dim ];

				} else if( $$.is.plainObject( args[0] ) ) { // .pan({ x: 0, y: 100 })
					dims = args[0];
					x = dims.x;
					y = dims.y;

					if( $$.is.number(x) ){
						pan.x = x;
					}

					if( $$.is.number(y) ){
						pan.y = y;
					}

					this.trigger("pan");
				}
				break;

			case 2: // .pan("x", 100)
				if( !this._private.panEnabled ){
					return this;
				}

				dim = args[0];
				val = args[1];

				if( (dim === "x" || dim === "y") && $$.is.number(val) ){
					pan[dim] = val;
				}

				this.trigger("pan");
				break;

			default:
				break; // invalid
			}

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});

			return this; // chaining
		},
		
		panBy: function(params){
			var args = arguments;
			var pan = this._private.pan;
			var dim, val, dims, x, y;

			if( !this._private.panEnabled ){
				return this;
			}

			switch( args.length ){
			case 1: 

				if( $$.is.plainObject( args[0] ) ) { // .panBy({ x: 0, y: 100 })
					dims = args[0];
					x = dims.x;
					y = dims.y;

					if( $$.is.number(x) ){
						pan.x += x;
					}

					if( $$.is.number(y) ){
						pan.y += y;
					}

					this.trigger("pan");
				}
				break;

			case 2: // .panBy("x", 100)
				dim = args[0];
				val = args[1];

				if( (dim === "x" || dim === "y") && $$.is.number(val) ){
					pan[dim] += val;
				}

				this.trigger("pan");
				break;

			default:
				break; // invalid
			}

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});

			return this; // chaining
		},	

		fit: function( elements, padding ){
			if( $$.is.number(elements) && padding === undefined ){ // elements is optional
				padding = elements;
				elements = undefined;
			}

			if( !this._private.panEnabled || !this._private.zoomEnabled ){
				return this;
			}

			var bb = this.boundingBox( elements );
			var style = this.style();

			var w = parseFloat( style.containerCss("width") );
			var h = parseFloat( style.containerCss("height") );
			var zoom;
			padding = $$.is.number(padding) ? padding : 0;

			if( !isNaN(w) && !isNaN(h) ){
				zoom = this._private.zoom = Math.min( (w - 2*padding)/bb.w, (h - 2*padding)/bb.h );

				// crop zoom
				zoom = zoom > this._private.maxZoom ? this._private.maxZoom : zoom;
				zoom = zoom < this._private.minZoom ? this._private.minZoom : zoom;

				this._private.pan = { // now pan to middle
					x: (w - zoom*( bb.x1 + bb.x2 ))/2,
					y: (h - zoom*( bb.y1 + bb.y2 ))/2
				};
			}

			this.trigger("pan zoom");

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});

			return this; // chaining
		},
        fitAnimated: function( elements, padding ){

            var me = this;
            var zoomSensitivity = 0.05;
            var panSensitivity = 10;

            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            window.requestAnimationFrame = requestAnimationFrame;

            var updateZoom = function () {

                if ($$.is.number(elements) && padding === undefined) { // elements is optional
                    padding = elements;
                    elements = undefined;
                }

                if (!me._private.panEnabled || !me._private.zoomEnabled) {
                    return me;
                }

                var bb = me.boundingBox(elements);
                var style = me.style();

                var w = parseFloat(style.containerCss("width"));
                var h = parseFloat(style.containerCss("height"));

                var currentZoom = me._private.zoom;
                var requestedZoom;

                var currentPanX = me._private.pan.x;
                var currentPanY = me._private.pan.y;
                var requestedPanX;
                var requestedPanY;

                padding = $$.is.number(padding) ? padding : 0;

                if (!isNaN(w) && !isNaN(h)) {
                    requestedZoom = Math.min((w - 2 * padding) / bb.w, (h - 2 * padding) / bb.h);

                    // crop zoom
                    requestedZoom = requestedZoom > me._private.maxZoom ? me._private.maxZoom : requestedZoom;
                    requestedZoom = requestedZoom < me._private.minZoom ? me._private.minZoom : requestedZoom;

                    if (currentZoom < requestedZoom) {
                        currentZoom = currentZoom + ((requestedZoom - currentZoom) / 4);
                    } else {
                        if (currentZoom > requestedZoom) {
                            currentZoom = currentZoom - ((currentZoom - requestedZoom) / 4);
                        }
                    }
                    me._private.zoom = currentZoom;

                    requestedPanX = (w - currentZoom * (bb.x1 + bb.x2)) / 2;
                    requestedPanY = (h - currentZoom * (bb.y1 + bb.y2)) / 2;

                    if (currentPanX < requestedPanX) {
                        currentPanX = currentPanX + ((requestedPanX - currentPanX) / 2);
                    } else if (currentPanX > requestedPanX) {
                        currentPanX = currentPanX - ((currentPanX - requestedPanX) / 2);
                    }

                    if (currentPanY < requestedPanY) {
                        currentPanY = currentPanY + ((requestedPanY - currentPanY) / 2);
                    } else if (currentPanY > requestedPanY) {
                        currentPanY = currentPanY - ((currentPanY - requestedPanY) / 2);
                    }


                    me._private.pan = { // now pan to middle
                        x: currentPanX,
                        y: currentPanY
                    };
                }

                me.trigger("pan zoom");

                me.notify({ // notify the renderer that the viewport changed
                    type: "viewport"
                });

                if (
                (Math.abs(requestedZoom - currentZoom) >= zoomSensitivity) || (Math.abs(requestedPanX - currentPanX) >= panSensitivity) || (Math.abs(requestedPanY - currentPanY) >= panSensitivity)) {
                    window.requestAnimationFrame(updateZoom);
                } else {
                    me.fit();
                }
            }

            window.requestAnimationFrame(updateZoom);

            return this; // chaining
		},
		minZoom: function( zoom ){
			if( zoom === undefined ){
				return this._private.minZoom;
			} else if( $$.is.number(zoom) ){
				this._private.minZoom = zoom;
			}

			return this;
		},

		maxZoom: function( zoom ){
			if( zoom === undefined ){
				return this._private.maxZoom;
			} else if( $$.is.number(zoom) ){
				this._private.maxZoom = zoom;
			}

			return this;
		},

		zoom: function( params ){
			var pos;
			var zoom;

			if( params === undefined ){ // then get the zoom
				return this._private.zoom;

			} else if( $$.is.number(params) ){ // then set the zoom
				zoom = params;
				pos = {
					x: 0,
					y: 0
				};

			} else if( $$.is.plainObject(params) ){ // then zoom about a point
				zoom = params.level;

				if( params.renderedPosition ){
					var rpos = params.renderedPosition;
					var p = this._private.pan;
					var z = this._private.zoom;

					pos = {
						x: (rpos.x - p.x)/z,
						y: (rpos.y - p.y)/z
					};
				} else if( params.position ){
					pos = params.position;
				}

				if( pos && !this._private.panEnabled ){
					return this; // panning disabled
				}
			}

			if( !this._private.zoomEnabled ){
				return this; // zooming disabled
			}

			if( !$$.is.number(zoom) || !$$.is.number(pos.x) || !$$.is.number(pos.y) ){
				return this; // can't zoom with invalid params
			}

			// crop zoom
			zoom = zoom > this._private.maxZoom ? this._private.maxZoom : zoom;
			zoom = zoom < this._private.minZoom ? this._private.minZoom : zoom;

			var pan1 = this._private.pan;
			var zoom1 = this._private.zoom;
			var zoom2 = zoom;
			
			var pan2 = {
				x: -zoom2/zoom1 * (pos.x - pan1.x) + pos.x,
				y: -zoom2/zoom1 * (pos.y - pan1.y) + pos.y
			};

			this._private.zoom = zoom;
			this._private.pan = pan2;

			var posChanged = pan1.x !== pan2.x || pan1.y !== pan2.y;
			this.trigger("zoom" + (posChanged ? " pan" : "") );

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});

			return this; // chaining
		},
		
		// get the bounding box of the elements (in raw model position)
		boundingBox: function( selector ){
			var eles = this.$( selector );

			return eles.boundingBox();
		},

		center: function(elements){
			if( !this._private.panEnabled || !this._private.zoomEnabled ){
				return this;
			}

			var bb = this.boundingBox( elements );
			var style = this.style();
			var w = parseFloat( style.containerCss("width") );
			var h = parseFloat( style.containerCss("height") );
			var zoom = this._private.zoom;

			this.pan({ // now pan to middle
				x: (w - zoom*( bb.x1 + bb.x2 ))/2,
				y: (h - zoom*( bb.y1 + bb.y2 ))/2
			});
			
			this.trigger("pan");

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});

			return this; // chaining
		},
		
		reset: function(){
			if( !this._private.panEnabled || !this._private.zoomEnabled ){
				return this;
			}

			this.pan({ x: 0, y: 0 });

			if( this._private.maxZoom > 1 && this._private.minZoom < 1 ){
				this.zoom(1);
			}

			this.notify({ // notify the renderer that the viewport changed
				type: "viewport"
			});
			
			return this; // chaining
		}
	});	
	
})( cytoscape );
