define(['../IUI-core.js','../core/ContainerUI.js'],function(IUI){

	var Container=IUI.ContainerUI.extend({
		name:'Container',
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this._beforeRender();
			this.makeUI();		
			this._afterRender();
		},
		_beforeRender:function(){
		},
		_afterRender:function(){
		}
	});
	
	IUI.WidgetBuilder.plugin(Container);


});