require(['./IUI/IUI.js'],function(IUI){
	
	
	
	
	window.IUI=IUI;
	
	console.time('UI creation');
	var containerUI=IUI.makeUI();
	console.timeEnd('UI creation');
	console.log(containerUI);
	var form=containerUI.containers['ui-form'];
	
	new IUI.EventGroup({
		name :"form-events",
		click: function(e){
			alert(JSON.stringify(form.value()));
		}
	});

});