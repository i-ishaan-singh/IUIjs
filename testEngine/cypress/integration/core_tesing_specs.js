describe('IUI Core Testing', function() {
	
	

	var IUI, NewClass,_win, _body,
		$ = Cypress.$,
		_initPromise = Cypress.$.Deferred();
	
	it('IUI Loading', function() {	
				cy.visit("localhost:3000/",{
					onLoad: function(win){
						expect(win.IUI).to.exist;
						expect(win.IUI.Class).to.exist;							
						_win=win;
						IUI=win.IUI;
						_body=win.$(win.document.body);
						IUI._customCache={};
						_initPromise.resolve();
					}
				});			
	});

	describe('IUI Class Testing', function(){
		
		
		it('Class Extension Testing', function() {	
			NewClass = IUI.Class.extend({
				initialize: function(){
					IUI.Class.prototype.initialize.apply(this,arguments);
					this.trigger('load');
				},
				events: ['load'],
				customArray : [1,2,3,4],
				customFunction: function(){
					return true;
				},
				options:{
					customOption: true
				}
			});
			
			
			var newClassInstance = new NewClass({
				option1: 10,
				option2: 20
			});
			
			expect(newClassInstance.customArray).to.exist;
			expect(newClassInstance.customArray).to.have.members([1,2,3,4]);
			expect(newClassInstance.customFunction).to.exist;
			expect(newClassInstance.options.customOption).to.exist;
			expect(newClassInstance.options.option1).to.exist;
			expect(newClassInstance.options.option2).to.exist;
			
		});	
		
		it('Class Trigger Testing', function() {
			var value=0;
			
			var newClassInstance = new NewClass({
				load: function(){
					value=10;
				},
			});
			
			expect(value).to.equal(10);
			
		});
		
		it('Class Binding Testing', function() {
			var value=0;
			
			var newClassInstance = new NewClass({});
			newClassInstance.on('load', function(){
					value=10;
			});
			newClassInstance.trigger('load');
			
			expect(value).to.equal(10);
			
		});
		
			
		it('Class Binding Testing (External Event)', function() {
			var value=0;
			
			var newClassInstance = new NewClass({});
			newClassInstance.on('externalEvent', function(){
					value=10;
			});
			newClassInstance.trigger('externalEvent');
			
			expect(value).not.to.equal(10);
			
		});
		
		
		it('EventGroup Binding Testing - (before)', function() {
			var value=0;
			
			new IUI.EventGroup({
				name: 'customEvents',
				load: function(){
					value=10;
				}				
			});
			
			var newClassInstance = new NewClass({
				eventgroup: 'customEvents'
			});
			
			expect(value).to.equal(10);
			
		});
		
		
		it('EventGroup Binding Testing - (after)', function() {
			var value=0;
			
			
			
			var newClassInstance = new NewClass({
				eventgroup: 'customEvents'
			});
			
			new IUI.EventGroup({
				name: 'customEvents',
				load: function(){
					value=10;
				}				
			});
			
			newClassInstance.trigger('load');
			
			expect(value).to.equal(10);
			
		});
		
		
	});
	
/******************************************************************************/
/******************************************************************************/
	
	describe('IUI Template Testing', function(){
		
		it('Template String Extraction', function(){
			var _string ='::a::';
			debugger;
			var _templateObject = IUI.Template.extractTemplateObject(_string);
			
		
		});
		
		
	
	});
	
	describe('IUI Behavior Testing', function(){
	
		it('Style Extraction (Object)', function(){
			var styleObject= IUI.behaviors.filterStyleFromObject({
				'height': '150px',
				'width': '150px',
				'background-color': 'blue',
				'padding': '30px',
				'margin': '30px',
				'display': 'inline-block',
				ishaan: 'Singh',
				otherAttribute: 'present'
			});

			expect(styleObject.height).to.exist;
			expect(styleObject.width).to.exist;
			expect(styleObject.padding).to.exist;
			expect(styleObject.margin).to.exist;
			expect(styleObject.display).to.exist;
			expect(styleObject.ishaan).to.not.exist;
			expect(styleObject.otherAttribute).to.not.exist;
			expect(styleObject['background-color']).to.exist;

		});	

/******************************************************************************/
		
		it('Style Extraction (Element)', function(){	

			_initPromise.then(function(){
					
				var _elem = document.createElement('div');
				_body.append(_elem );
				
				
				IUI.behaviors.extractFromObject(_elem, {
					'height': '150px',
					'width': '150px',
					'background-color': 'blue',
					'padding': '30px',
					'margin': '30px',
					'display': 'inline-block'
				},['style']);
				
				expect($(_elem).css('height')).to.equal('150px');
				expect($(_elem).css('width')).to.equal('150px');
				expect($(_elem).css('background-color')).to.equal("rgb(0, 0, 255)");
				expect($(_elem).css('padding')).to.equal("30px");
				expect($(_elem).css('margin')).to.equal("30px");
				expect($(_elem).css('display')).to.equal("inline-block");
				$(_elem).remove();			
			});
		});
			
/******************************************************************************/
		it('ii-attribute Extraction (Element)', function(){	
					
				var _elem = document.createElement('div');
				
				IUI.behaviors.extractFromObject(_elem, {
					'ii-base': 'division',
					'ii-data': 'main-data'
				},['ii-attibute']);
				
				expect($(_elem).attr('ii-base')).to.equal('division');
				expect($(_elem).attr('ii-data')).to.equal('main-data');
				$(_elem).remove();

		});
		
		
/******************************************************************************/

		it('subcontainer-attribute Extraction (Element)', function(){	

			_initPromise.then(function(){
		
				var options ={
					'subcontainer-height': '150px',
					'subcontainer-width': '150px',
					'subcontainer-background-color': 'blue',
					'subcontainer-padding': '30px',
					'subcontainer-margin': '30px',
					'subcontainer-display': 'inline-block',
					'subcontainer-ii-data': 'main-data'					
				};
				
				
				IUI.behaviors.extractFromObject(null, options, ['subconatiner-attribute']);
				
				expect(options.subcontainerOptions['height']).to.equal('150px');
				expect(options.subcontainerOptions['width']).to.equal('150px');
				expect(options.subcontainerOptions['background-color']).to.equal("blue");
				expect(options.subcontainerOptions['padding']).to.equal("30px");
				expect(options.subcontainerOptions['margin']).to.equal("30px");
				expect(options.subcontainerOptions['display']).to.equal("inline-block");
				expect(options.subcontainerOptions['ii-data']).to.equal("main-data");
		
				
			});
		});
		
		
/******************************************************************************/
		
	});
	
/******************************************************************************/
/******************************************************************************/
	
	describe('IUI Observable Model Testing', function(){
		 var _observedSpy, obj;
		it("Initialization Testing", function(){
			
			var _observed = {
				observer: function(key,value,sender){
				cy.log('value changed of '+key+' to '+value);
				}
			}
			 _observedSpy = cy.spy(_observed, 'observer').as('ChangeObserver');
				obj={
					customKeyOne: 10,
					customKeyTwo: 20,
				}
				var _model = new IUI.ObservableModel(obj,_observed.observer);
				obj.customKeyOne=30;


		});
		
		it("Handler Call Testing", function(){
				expect(_observedSpy).to.be.called;
				obj.customKeyOne=100;
				obj.customKeyTwo=90;
		});	
		
		it("Handler Call Testing - continuoued", function(){
				expect(_observedSpy).to.be.calledWith('customKeyOne', 100, undefined);
				expect(_observedSpy).to.be.calledWith('customKeyTwo', 90, undefined);

		});
		
	});
	
/******************************************************************************/
/******************************************************************************/
	
	describe('IUI Widget Testing', function(){
		
		var customWidget, container;
		
		it('Initialization Testing', function(){
			
			_body.append($('<Widget id="customWidget" class="customWidget" click=""></Widget>'));
			cy.log('Appended Widget To DOM');
			var container = IUI.makeUI(_body);	
			var $el = _body.find('div#customWidget');
			expect($el).to.exist;
			expect($el).to.have.class('customWidget');
			var widget = container.getWidgetById('customWidget');
			expect(widget).to.exist;
			widget.destroy();
			widget.$element.remove();
			
		});
		
		
		it('Detached Testing', function(){
			
			_body.append($('<Widget id="customWidget_detached" isAttached="false" ></Widget>'));
			var container = IUI.makeUI(_body);	
			var _widget = container.getWidgetById('customWidget_detached'); 
			expect(_widget).to.exist;
			expect(_widget.$element).to.not.exist;
			_widget.destroy();
			_widget.$element.remove();
			
		});
		
		it('Disable Testing', function(){
			
			_body.append($('<Widget id="customWidget_detached" enable="false" ></Widget>'));
			var container = IUI.makeUI(_body);	
			var _widget = container.getWidgetById('customWidget_detached'); 
			expect(_widget).to.exist;
			expect(_widget.$element).to.have.class('i-ui-disabled');
			_widget.destroy();
			_widget.$element.remove();
			
		});

		describe("Extending Widget", function(){
			
			
			it('Extending and Plugging Custom Widget', function(){
				
				customWidget = IUI.Widget.extend({
					name: 'CustomWidget',
					tagName: 'marquee',
					events: ['dataattach'],
					_observedOptions: IUI.Widget.prototype._observedOptions.concat(['customattribute']),
					cleanUp: function(){
						this.$element.children().remove();
					},
					onDataFetch: function(dataObject){
					
						var _dataObject = dataObject.data.map(function(obj){
							return obj.text;
						});
						this.$element.text(_dataObject.join('  -:- '))
						this.trigger('dataattach');
					},
					onDataChange: function(dataObject){

						this.cleanUp();
						this.onDataFetch(dataObject);
					},
					_handlecustomattributeChange: function(value){

						IUI._customAttributeValue = value;
					},
					customAction: function(){
						return true;
					}
				});
				
				
				IUI.WidgetBuilder.plugin(customWidget);
				expect(IUI.uiWidgets.CustomWidget).to.exist;
			});
			
			
			it('Custom Widget Creation', function(){
				
				_body.append($('<CustomWidget id="customWidget" dataattach="IUI._customCache.dataAttach = true;" dataMart="custom-widget-mart"></CustomWidget>'));
				container = IUI.makeUI();
				var $el = _body.find('marquee#customWidget');
				expect($el).to.exist;
				
			});
			
			});
			
			describe("Binding Testing", function(){

				
				describe("Data Mart", function(){
					
					
					it('Data Mart Binding Testing (after)', function(){
						
						var dataMart = new IUI.DataMart({
							name: "custom-widget-mart",
							data: ['Ishaan Singh','Lyra Singh','Naziyah Singh']
						});
						
						dataMart.fetch();

						expect(IUI._customCache.dataAttach).to.equal(true);
						delete IUI._customCache.dataAttach;
						var _widget = container.getWidgetById('customWidget'); 
						expect(_widget).to.exist;
						expect(_widget.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						_widget.destroy();
						_widget.$element.remove();
						_widget.$element.text();
						expect(IUI._customCache.dataAttach).to.not.exist;
						
					});
					
					it('Data Mart Binding Testing (before)', function(){
						
						var dataMart = new IUI.DataMart({
							name: "custom-widget-mart",
							data: ['Ishaan Singh','Lyra Singh','Naziyah Singh']
						});
						
						dataMart.fetch();
						
						_body.append($('<CustomWidget id="customWidget" dataattach="IUI._customCache.dataAttach1 = true;" dataMart="custom-widget-mart"></CustomWidget>'));
						container = IUI.makeUI();
						
						expect(IUI._customCache.dataAttach1).to.equal(true);
						delete IUI._customCache.dataAttach1;
						var _widget = container.getWidgetById('customWidget'); 
						expect(_widget).to.exist;
						expect(_widget.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						_widget.destroy();
						_widget.$element.remove();
						_widget.$element.text();
					});
					
				});
				
				describe("Data Attribute", function(){
					var _widget;
					it('Data Attribute Binding Testing', function(){
						
						_body.append($('<CustomWidget data="::customWidgetData::" id="customWidget_dataAttribute"></CustomWidget>'));
						
						var obj={
							customWidgetData: ['Ishaan Singh','Lyra Singh','Naziyah Singh']
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_dataAttribute'); 
						expect(_widget).to.exist;
						expect(_widget.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						
						cy.log('Testing for Data Binding');
						
						obj.customWidgetData = ['Ravi More','Riya Varghese','Priyanka Gade'];
						
					});
					
					it('Data Attribute Binding Testing - cont', function(){
							cy.get('#customWidget_dataAttribute').then(function(elem){
								expect(elem	.text().trim()).to.equal(['Ravi More','Riya Varghese','Priyanka Gade'].join('  -:- ').trim());
								_widget.destroy();
								_widget.$element.remove();
							});
							

					});
					
				});
			
				describe("Data Attribute - Multiple Widgets", function(){
					var _widget, _widgetTwo;
					it('Data Attribute Binding Testing (Multiple Widgets)', function(){
						
						_body.append($('<CustomWidget data="::customWidgetData::" id="customWidget_dataAttribute"></CustomWidget>'));
						_body.append($('<CustomWidget data="::customWidgetData::" id="customWidget_dataAttribute2"></CustomWidget>'));
						
						var obj={
							customWidgetData: ['Ishaan Singh','Lyra Singh','Naziyah Singh']
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_dataAttribute'); 
						_widgetTwo = container.getWidgetById('customWidget_dataAttribute2'); 
						expect(_widget).to.exist;
						expect(_widgetTwo).to.exist;
						expect(_widget.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						expect(_widgetTwo.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						
						cy.log('Testing for Data Binding');
						debugger;
						obj.customWidgetData = ['Ravi More','Riya Varghese','Priyanka Gade'];
						
					});
					
					it('Data Attribute Binding Testing (Multiple Widgets) - cont', function(){
							cy.get('#customWidget_dataAttribute').then(function(elem){
								expect(elem	.text().trim()).to.equal(['Ravi More','Riya Varghese','Priyanka Gade'].join('  -:- ').trim());
								expect(_widgetTwo.$element.text().trim()).to.equal(['Ravi More','Riya Varghese','Priyanka Gade'].join('  -:- ').trim());
								_widgetTwo.destroy();
								_widgetTwo.$element.remove();
								_widget.destroy();
								_widget.$element.remove();
							});
							

					});
					
				});
						
				describe("Data Attribute - 100 Widgets", function(){
					var container;
					it('Data Attribute Binding Testing (100 Widgets)', function(){
						
						for(var i=0;i<100;++i){
							_body.append($('<CustomWidget data="::customWidgetData::" id="customWidget_dataAttribute'+i+'"></CustomWidget>'));
						}
						
						var obj={
							customWidgetData: ['Ishaan Singh','Lyra Singh','Naziyah Singh']
						};
						container = IUI.makeUI(obj);
						
						
						for(var i=0;i<100;++i){
							var _widget = container.getWidgetById('customWidget_dataAttribute'+i); 
							expect(_widget).to.exist;
							expect(_widget.$element.text().trim()).to.equal(['Ishaan Singh','Lyra Singh','Naziyah Singh'].join('  -:- ').trim());
						}
						
						obj.customWidgetData = ['Ravi More','Riya Varghese','Priyanka Gade'];
						cy.clock();
						cy.tick(10000);
						cy.wait(2000);
					});
					
					it('Data Attribute Binding Testing (100 Widgets) - cont', function(){
			
						for(var i=0;i<100;++i){
							var _widget = container.getWidgetById('customWidget_dataAttribute'+i); 
							expect(_widget).to.exist;
							expect(_widget.$element.text().trim()).to.equal(['Ravi More','Riya Varghese','Priyanka Gade'].join('  -:- ').trim());
							_widget.destroy();
							_widget.$element.remove();
						}
					});
					
				});
				
				describe("Attribute", function(){
					
					var _widget;
					it('Attribute Binding Testing', function(){
						
						_body.append($('<CustomWidget customattribute="::customAttributeValue::" id="customWidget_customAttribute"></CustomWidget>'));
						
						var obj={
							customAttributeValue: 19
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_customAttribute'); 
						expect(_widget).to.exist;

						 obj.customAttributeValue = 32;

					});
					

					it('Attribute Binding Testing - cont', function(){
						expect(IUI._customAttributeValue).to.equal(32);
						_widget.destroy();
						_widget.$element.remove();
					});
					
				});
				
				describe("Two Way", function(){
					var obj, _widget;
					it('Two Way Binding Testing', function(){
						
						_body.append($('<CustomWidget customattribute="::customAttributeValue::" id="customWidget_twoWay"></CustomWidget>'));
						
						obj={
							customAttributeValue: 19
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_twoWay'); 
						expect(_widget).to.exist;
						 _widget.options.customattribute = 32;
		
					});
					
					it('Two Way Binding Testing - cont', function(){
						
						expect(obj.customAttributeValue).to.equal(_widget.options.customattribute);
						_widget.destroy();
						_widget.$element.remove();

					});
					
				});		
				
				describe("Two Way - 100 Widgets", function(){
					var obj, _widget, container;
					it('Two Way Binding Testing', function(){
						
							
						for(var i=0;i<100;++i){
							_body.append($('<CustomWidget customattribute="::customAttributeValue::" id="customWidget_twoWay'+i+'"></CustomWidget>'));
						}
						obj={
							customAttributeValue: 19
						};
						
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_twoWay'+Math.floor(Math.random()*100)); 
						expect(_widget).to.exist;
						_widget.options.customattribute = 32;
		
					});
					
					it('Two Way Binding Testing - cont', function(){
						expect(obj.customAttributeValue).to.equal(32);
						
						_widget = container.getWidgetById('customWidget_twoWay'+Math.floor(Math.random()*100)); 
						expect(_widget).to.exist;
						setTimeout(function(){
							_widget.options.customattribute = 15;
						});
						_widget = container.getWidgetById('customWidget_twoWay'+Math.floor(Math.random()*100)); 
						expect(_widget).to.exist;
						setTimeout(function(){
							_widget.options.customattribute = 20;
						});
						cy.clock();
						cy.tick(10000);
						cy.wait(3000);
					});
					
					it('Two Way Binding Testing - cont', function(){
			
						expect(obj.customAttributeValue).to.equal(20);

					});
					
					it('Two Way Binding Testing - cont', function(){
			
						for(var i=0;i<100;++i){
							_widget = container.getWidgetById('customWidget_twoWay'+i); 
							_widget.destroy();
							_widget.$element.remove();
						}

					});
					
				});		
				
				describe("ii-Attribute", function(){
					var obj, _widget;
					it('ii-Attribute Binding Testing', function(){
						
						_body.append($('<CustomWidget ii-data="::customAttributeValue::" id="customWidget_ii"></CustomWidget>'));
						
						obj={
							customAttributeValue: 'redVelvet'
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('customWidget_ii'); 
						expect(_widget).to.exist;
						expect(_widget.$element.attr('ii-data')).to.equal('redVelvet');
						
						 obj.customAttributeValue = 'blueVelvet';
		
					});
					
					it('Two Way Binding Testing - cont', function(){
						
						
						expect(_widget.$element.attr('ii-data')).to.equal('blueVelvet');
						_widget.destroy();
						_widget.$element.remove();

					});
					
				});
				
			
				describe("presistant Attributes", function(){
					var obj, _widget;
					it('Presistant Attributes Binding Testing', function(){
						
						_body.append($('<Division tagname="img" src="::customUrl::" id="division_presistant" ></Division>'));
						
						obj={
							customUrl: '/images/test_img.jpg'
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('division_presistant'); 
						expect(_widget).to.exist;
						expect(_widget.$element.attr('src')).to.equal('/images/test_img.jpg');
						debugger;
						obj.customUrl = '/images/test_img2.jpg';
		
					});
					
					it('Presistant Attributes Binding Testing - cont', function(){
						
						expect(_widget.$element.attr('src')).to.equal('/images/test_img2.jpg');
						obj.customUrl = '/images/test_img3.jpg';

					});
					
					it('Presistant Attributes Binding Testing - cont2', function(){
						
						
						expect(_widget.$element.attr('src')).to.equal('/images/test_img3.jpg');
						obj.customUrl = '/images/test_img.jpg';

					});
					
					it('Presistant Attributes Binding Testing - cont3', function(){
						
						
						expect(_widget.$element.attr('src')).to.equal('/images/test_img.jpg');
						_widget.destroy();
						_widget.$element.remove();

					});
					
				});
				
				
			
				describe("Detach", function(){
					var obj, _widget;
					it('Detach Binding Testing', function(){
						
						_body.append($('<CustomWidget tagname="img" isattached="::_attached::" id="division_detach" ></CustomWidget>'));
						
						obj={
							_attached: true
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('division_detach'); 
						expect(_widget).to.exist;
						expect(_widget.$element).to.exist;
						
						obj._attached = false;
		
					});
					
					it('Detach Binding Testing - detach', function(){
						expect(_widget.$element).to.not.exist;
						debugger;
						obj._attached = true;
					});
					
					it('Detach Binding Testing - attach', function(){
						expect(_widget.$element).to.exist;
						_widget.destroy();
						_widget.$element.remove();
					});
					
				});
				
			
			
				describe("Disable", function(){
					var obj, _widget;
					it('Enable Binding Testing', function(){
						
						_body.append($('<CustomWidget tagname="img" enable="::_enabled::" id="division_detach" ></CustomWidget>'));
						
						obj={
							_enabled: true
						};
						container = IUI.makeUI(obj);
						
						_widget = container.getWidgetById('division_detach'); 
						expect(_widget).to.exist;
						expect(_widget.$element).to.not.have.class('i-ui-disabled');
						debugger;
						obj._enabled = false;
		
					});
					
					it('Enable Binding Testing - disable', function(){
						expect(_widget.$element).to.have.class('i-ui-disabled');
						obj._enabled = true;
					});

					it('Enable Binding Testing - enable', function(){
						expect(_widget.$element).to.not.have.class('i-ui-disabled');
						_widget.destroy();
						_widget.$element.remove();
					});
					
				});
				
			
			
			});
		
		
	
	});
/******************************************************************************/
/******************************************************************************/
	
	
	/*describe('InputBox Testing', function(){
		
		it('Widget Creation', function() {
			var _window;
			cy.visit("localhost:3000/test/Widgets/InputBox/base",{
				onLoad: function(win){
					_window=win;
				}
			}).then(function(){
				cy.get('inputbox').should('exist');
			}).then(function(win){
				cy.window()
			}).then(function(win){
				win.IUI.makeUI();
				cy.get('inputbox').should('not.exist');
			}).then(function(){
				cy.get('#test-inputbox').should('exist').should('have.class', 'i-ui-widget').should('have.class', 'i-ui-inputbox');
			}).then(function(el){
				expect(el[0].iuiWidget).to.exist;
			});
	
			
		});
	});*/
	
})