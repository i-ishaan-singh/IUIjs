(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ListView'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	var PageListView=IUI.uiWidgets.ListView.extend({
		name:'PageListView',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-page-listview']),
		template: '<div class="i-ui-page-container"></div>',
		containerSelector: '.i-ui-page-container',
		initialize: function(options){
			var container=$();
			$(options.element).append(container);
			options.container=container;
			IUI.uiWidgets.ListView.prototype.initialize.apply(this, arguments);
			this.$element.append('<i class="fa fa-caret-right i-ui-icon scroll-right"></i>');
			this.$element.prepend('<i class="fa fa-caret-left i-ui-icon scroll-left"></i>');	
			this._attachEvents();
		},
		options:{
			text: '',
			listclass: 'i-ui-page-list-item'
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
		_scrollRight: function(){
			var _scrollLeft = this.container.scrollLeft(),
				width=0,
				first = this.container.children().eq(0);
				
				while(width <  _scrollLeft){
					width = width + first.outerWidth(true);
					first = first.next();
				}

				this.container.scrollLeft(width + first.outerWidth(true));

		},
		_scrollLeft: function(){
			var _scrollLeft = this.container.scrollLeft(),
				_scrollWidth = this.container.width(),
				width=0,
				last = this.container.children().eq(0);
				
				while(width <  _scrollLeft + _scrollWidth){
					width = width + last.outerWidth(true);
					last = last.next();
				}
				
				if(!last.length){
					this.container.scrollLeft(_scrollLeft - this.container.children().eq(this.container.children().length - 1).outerWidth(true));	
				}else{					
					var offset = (_scrollLeft + _scrollWidth) - width + last.prev().outerWidth();
					this.container.scrollLeft(_scrollLeft - offset);
				}
		},
		_attachEvents: function(){
			var that=this;
			
			this.$element.find('.scroll-right').on('click', function(){
				that._scrollRight();
			});
			this.$element.find('.scroll-left').on('click', function(){
				that._scrollLeft();
			});
		}
	});
	
	IUI.WidgetBuilder.plugin(PageListView);



});