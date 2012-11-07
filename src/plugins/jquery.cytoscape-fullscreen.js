
/*

Cytoscape JS Full Screen UI plugin

Depends on
    - jQuery UI core
	- Theme Roller UI icons (if you want)
*/

;(function($){
	
	var defaults = {
		staticPosition: false,
        autodisableForMobile: true
	};
	
	$.fn.cytoscapeFullscreen = function(params){
		var options = $.extend(true, {}, defaults, params);
		var fn = params;
		
		var functions = {
			destroy: function(){
				var $this = $(this);
				
				$this.find(".ui-cytoscape-fullscreen").remove();
			},
				
			init: function(){
				var browserIsMobile = 'ontouchstart' in window;
				
				if( browserIsMobile && options.autodisableForMobile ){
					return $(this);
				}
				
				return $(this).each(function(){
					var $container = $(this);
					
					var $fullscreen = $('<div class="ui-cytoscape-fullscreen"></div>');
					$container.append( $fullscreen );
					
					if( options.staticPosition ){
						$fullscreen.addClass("ui-cytoscape-fullscreen-static");
					}

					function setFullScreen(){
						var cy = $container.cytoscape("get");
                          var r = cy.renderer();
                          
                               var el = r.container;

                             if(el.webkitRequestFullScreen) {
							    el.webkitRequestFullScreen();
						     }
						     else {
							    el.mozRequestFullScreen();
						    }    
						
                        console.log("set full screen");        
                        r.redraw();
					}

					
					//var handler = function(e){
					//	e.stopPropagation(); // don't trigger dragging of panzoom
					//	e.preventDefault(); // don't cause text selection
					//};
					
					$fullscreen.bind("mousedown", function(e){
						// handle click of icon
						//handler(e);
						setFullScreen();

					});
					
					
				});
			}
		};
		
		if( functions[fn] ){
			return functions[fn].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof fn == 'object' || !fn ) {
			return functions.init.apply( this, arguments );
		} else {
			$.error("No such function `"+ fn +"` for jquery.cytoscapeFullScreen");
		}
		

        console.log("hi");
		return $(this);
	};
	
})(jQuery);