define(['IUI-core','Widget'],function(IUI){


	var _isWidgets=function(elem){
		return typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined";
	};
	
	var _elemToWidget=function(elem){
		var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.$element[0]);
		if(widget.options.id){
			this.widgets[widget.options.id]=widget;
		}
		return widget;
	};
	
	/**
	* Base class for All the Custom Tags which will be enclosing other HTML Elements
	*/
	var ContainerUI=IUI.Class.extend({
		classType:'ContainerUI',
		classList:['i-ui-container'],
		events:IUI.Widget.prototype.events.concat(['create']),
		options:{
			async: false
		},
		load: function(options){
			(options.async) && (options.async=JSON.parse(options.async));
		},
		initialize: function(options){
			this.widgets=[];
			this.containers=[];			
			IUI.Class.prototype.initialize.apply(this,arguments);
			if(this.options.async){
				this._create=this._createAsync;
			}			
			var _elem=$(this.options.element || document.createElement('div'));
			if(_elem.length===1 && !Array.isArray(this.options.element)){
				this.element=_elem[0];
				this.$element=_elem;
			}else{
				this.element=document.createElement('div');
				this.$element=$(this.element);
				this.$element.append(_elem);
			}
		},
		_onCreateWidget: function(widget){
			//Override this API to process the newly created Widgets/Containers;
		},
		detach:function(){
			(this._detachedSpan) || (this._detachedSpan=$('<span>'));
			(this.$element.parent().length) && (this.$element.replaceWith(this._detachedSpan));
			return this;
		},
		attach: function(){
			(this._detachedSpan && this._detachedSpan.parent().length) && (this._detachedSpan.replaceWith(this.$element));
		},
		_create: function(elements){
			var length=elements.length;
			for(var i=0;i<length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
					if(typeof IUI.WidgetBuilder.containerList[elem.tagName] !== "undefined"){		
					
						var container=IUI.WidgetBuilder.containerList[elem.tagName](elem,this.element,this.options.model);
						if(container.options.id){
							this.containers[container.options.id]=container;
						}
						this.containers.push(container);
						this._onCreateWidget(container);
					}else if(typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined"){
						
						var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.element,this.options.model);
						if(widget.options.id){
							this.widgets[widget.options.id]=widget;
						}
						this.widgets.push(widget);
						this.trigger('create',{widget: widget});
						this._onCreateWidget(widget);
					}else{
						(elem.children) && (this._create(elem.children));
					}
			}			
		},
		_createAsync: function(elements){
			var length=elements.length;
			for(var i=0;i<length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
				setTimeout((function(elem){return function(){
					if(typeof IUI.WidgetBuilder.containerList[elem.tagName] !== "undefined"){		
					
						var container=IUI.WidgetBuilder.containerList[elem.tagName](elem,this.element,this.options.model);
						if(container.options.id){
							this.containers[container.options.id]=container;
						}
						this.containers.push(container);
						this._onCreateWidget(container);
					}else if(typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined"){
						
						var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.element,this.options.model);
						if(widget.options.id){
							this.widgets[widget.options.id]=widget;
						}
						this.widgets.push(widget);
						this.trigger('create',{widget: widget});
						this._onCreateWidget(widget);
					}else{
						(elem.children) && (this._create(elem.children));
					}
				}})(elem).bind(this));
			}			
		},
		_itterateCommandToAllComponents: function(command){
			var args=Array.prototype.slice.call(arguments,1);
			for(var c in this.containers){
				var container=this.containers[c];
				container[command].apply(container,args);
			}
			for(var w in this.widgets){
				var widget=this.widgets[w];
				widget[command].apply(widget,args);
			}
		},
		enable: function(val){
			this._itterateCommandToAllComponents('enable',val);
		},
		makeUI: function(){
			var tagName=this.element.tagName;
				this._create(this.element.children);
				this.$element.addClass(this.classList);
				this.element.uiContainer=this;
		},
		_findAndMakeWidgets:function(){
			this.widgets=[];
			var allElements=Array.prototype.slice.call(this.$element.find('*')),
				widgetList=allElements.filter(_isWidgets).map(_elemToWidget,this);
			Array.prototype.push.apply(this.widgets,widgetList);
		}
	});
	
	IUI.ContainerUI=ContainerUI;
	
});