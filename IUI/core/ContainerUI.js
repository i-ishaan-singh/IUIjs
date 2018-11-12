define(['../IUI-core.js','../core/Widget.js'],function(IUI){


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
		initialize: function(options){
			this.widgets=[];
			this.containers=[];			
			IUI.Class.prototype.initialize.apply(this,arguments);			
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
		_onCreate: function(widget){
			//Override this API to process the newly created Widgets/Containers;
		},
		_create: function(elements){
			var length=elements.length;
			for(var i=0;i<length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
				
				if(typeof IUI.WidgetBuilder.containerList[elem.tagName] !== "undefined"){		
				
					var container=IUI.WidgetBuilder.containerList[elem.tagName](elem,this.element);
					if(container.options.id){
						this.containers[container.options.id]=container;
					}
					this.containers.push(container);
					this._onCreate(container);
				}else if(typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined"){
					
					var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.element);
					if(widget.options.id){
						this.widgets[widget.options.id]=widget;
					}
					this.widgets.push(widget);
					this.trigger('create',{widget: widget});
					this._onCreate(widget);
				}else{
					(elem.children) && (this._create(elem.children));
				}
			}			
		},
		makeUI: function(){
			var tagName=this.element.tagName;
				this._create(this.element.children);
				this.element.classList.add.apply(this.$element[0].classList,this.classList);
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