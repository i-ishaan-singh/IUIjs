define(['../IUI-core.js'],function(IUI){

	var overlayContainer;
		overlayContainer=document.createElement('DIV');
		overlayContainer.classList.add('i-ui-overlay-container');
		document.body.append(overlayContainer);
		
	var Overlay=IUI.Class.extend({
		classType: 'Overlay',
		classList: ['i-ui-overlay'],
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);			
			if(!this.options.lazy){
				this.createOverlay();
			}
			
		},
		options:{
			lazy: false,
			anchor:'body',
			direction: 'down',
			placement: 'top',
			height: '20em',
			classList:[],
			width: '13em'
		},
		_position:function(){
			var $anchor=$(this.options.anchor), _anchor=$anchor[0], _rect=_anchor.getClientRects(),top,left,right,bottom,width,height;
				if(_rect.length){
					var rect=_rect[0];
					top=rect.top;
					left=rect.left;
					right=rect.right;
					bottom=rect.bottom;
				}
			var placements=this.options.placement.split(' ');
			for(var placement in placements){
				var place=placements[placement];
				if(place==="top"){
					this.options.top=top;
					delete this.options.bottom;
				}else if(place==="bottom"){
					this.options.bottom=bottom;
					delete this.options.top;
				}
				if(place==="right"){
					this.options.right=right;
					delete this.options.left;
				}else if(place==="left"){
					this.options.left=left;
					delete this.options.right;
				}
			}
				
		},
		createOverlay: function(){
			var overlay=document.createElement('DIV');
			overlay.classList.add.apply(overlay.classList,this.classList);
			if(this.options.anchor){
				this._position();
			}
			IUI.behaviors.extractStyleFromObject(overlay,this.options);
			if(this.options.element){
				$(overlay).append()
			}
			$(overlayContainer).append(overlay);
			this.overlay=overlay;
		}		
	}
	
	
	IUI.createOverlay=function(options){
		return new this(options);
	}


});