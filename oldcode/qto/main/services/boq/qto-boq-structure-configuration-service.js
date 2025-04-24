/**
 * Created by lnt on 3/22/2019.
 */

(function () {
	'use strict';
	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoBoqStructureConfigurationService
	 * @function
	 *
	 * @description
	 * qtoBoqStructureConfigurationService is the configuration service for creating a form container standard config from dto and high level description.
	 */
	angular.module(moduleName).factory('qtoBoqStructureConfigurationService',
		['_', 'platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'boqMainDetailFormConfigService', 'qtoBoqStructureService','basicsCommonDynamicStandardConfigServiceExtension',
			function (_, platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, boqMainDetailFormConfigService, qtoBoqStructureService,basicsCommonDynamicStandardConfigServiceExtension) {

				let currentBoqMainServiceHolder = {currentBoqMainService: qtoBoqStructureService};
				let BaseService = platformUIStandardConfigService,
					formConfig = angular.copy(boqMainDetailFormConfigService.getFormConfig(currentBoqMainServiceHolder));


				let fields = ['installedquantity', 'billedquantity', 'iqprevquantity', 'bqprevquantity', 'iqremainingquantity',
					'bqremainingquantity', 'iqtotalquantity', 'bqtotalquantity', 'ordquantity', 'cumulativepercentage',
					'percentagequantity', 'bqcumulativepercentage', 'bqpercentagequantity', 'quantityadj',
					'quantityadjdetail', 'quantity', 'quantitydetail', 'quantitymax',
					'isfreequantity', 'calculatequantitysplitting','orderfinalprice','bqfinalprice','iqfinalprice'
				];

				_.forEach(formConfig.groups,function (g) {
					g.attributes = _.filter(g.attributes,function (d) {
						return fields.indexOf(d)<=-1;
					});
				});


				let boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});

				if (boqItemAttributeDomains) {
					boqItemAttributeDomains = boqItemAttributeDomains.properties;
				}

				formConfig.overloads.totalprice = {readonly: true};
				boqItemAttributeDomains.TotalPrice = {domain: 'money'};

				// temporary solution until code will be refactored
				if (boqItemAttributeDomains) {
					boqItemAttributeDomains.Rule = {'domain': 'imageselect'};
					boqItemAttributeDomains.Param = {'domain': 'imageselect'};
					boqItemAttributeDomains.DivisionTypeAssignment = {'domain': 'directive'};
				}

				function BoqMainUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqMainUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqMainUIStandardService.prototype.constructor = BoqMainUIStandardService;

				let service = new BaseService(formConfig, boqItemAttributeDomains, boqMainTranslationService);

				service.setCurrentBoqMainService = function setCurrentBoqMainService(boqMainService) {
					currentBoqMainServiceHolder.currentBoqMainService = boqMainService;
				};

				function  resizeBoqUIDynamicColumns(){
					return {
						'fid': 'qto.main.dynamic',
						'version': '1.0.0',
						'usageServiceContext': 'qtoBoqStructureService', // Mandatory
						'usageValidationContext': 'boqMainValidationServiceProvider', // Mandatory
						'groups': [
							{
								'gid': 'QtyGroup',
								'attributes': [],
								'options': {
									// 'idProperty': 'QuantityGroup',
									// Column Configuration
									'dtoName': 'IQBQQuantityGroup',
									'propertyFn': function(dtoItem){ // foreach to DTO

										let configProperty = {
											id : dtoItem.field,
											domain: 'quantity',
											name: dtoItem.name,
											$field:'Quantity',
											name$tr$: dtoItem.name$tr$,
											formatter:dtoItem.formatter,
											formatterOptions:dtoItem.formatterOptions,
											readonly:true,
											grid: {
												forceVisible: true
											},
											detail: {
											}
										};

										configProperty.grid.formatter = dtoItem.formatter;
										configProperty.grid.formatterOptions = dtoItem.formatterOptions;
										configProperty.grid.$field='Quantity';

										return configProperty;
									}
								}
							},
							{
								'gid': 'AQQtyGroup',
								'attributes': [],
								'options': {
									'dtoName': 'AQWQQuantityGroup',
									'propertyFn': function(dtoItem){ // foreach to DTO
										dtoItem.Id = dtoItem.id;
										let configProperty = {
											id : dtoItem.field,
											domain: 'quantity',
											$field:'Quantity',
											name: dtoItem.name,
											name$tr$: dtoItem.name$tr$,
											readonly:true,
											formatter:dtoItem.formatter,
											formatterOptions:dtoItem.formatterOptions,
											grid: {
												forceVisible: true
											},
											detail: {
											}
										};
										configProperty.grid.$field='Quantity';
										configProperty.grid.formatter = dtoItem.formatter;
										configProperty.grid.formatterOptions = dtoItem.formatterOptions;
										return configProperty;
									}
								}
							},
							{
								'gid': 'UDPGroup',
								'attributes': [],
								'options': {
									'dtoName': 'UDPGroup',
									'propertyFn': function(dtoItem){ // foreach to DTO
										dtoItem.Id = dtoItem.id;
										let configProperty = {
											id: dtoItem.field,
											domain: 'quantity',
											displayName: dtoItem.name$tr$,
											readonly: true,
											grid: {
												forceVisible: true
											},
											detail: {}
										};

										return configProperty;
									}
								}
							}
						]
					};
				}

				basicsCommonDynamicStandardConfigServiceExtension.extend(
					service,
					resizeBoqUIDynamicColumns(),
					boqItemAttributeDomains,
					boqMainTranslationService);

				return service;
			}
		]);
})();
