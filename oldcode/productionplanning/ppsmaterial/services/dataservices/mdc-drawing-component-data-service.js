(function (angular) {
	'use strict';
	/* global globals, _, angular */
	var moduleName = 'productionplanning.ppsmaterial';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name mdcDrawingComponentDataService
	 * @function
	 *
	 * @description
	 * mdcDrawingComponentDataService is the data service for Drawing Components.
	 */

	masterModule.factory('mdcDrawingComponentDataService', mdcDrawingComponentDataService);
	mdcDrawingComponentDataService.$inject = [
		'$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor'
	];

	function mdcDrawingComponentDataService($injector, platformDataServiceFactory,
																		  platformDataServiceProcessDatesBySchemeExtension,
																		  basicsLookupdataLookupDescriptorService,
																		  basicsCommonMandatoryProcessor) {
		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || 'productionplanningPpsMaterialProductDescDataService');
			var serviceInfo = {
				flatLeafItem: {
					module: serviceOptions.moduleName || moduleName,
					serviceName: parentService.getServiceName() + 'mdcDrawingComponentDataService',
					entityNameTranslationID: 'productionplanning.ppsmaterial.drawingComponent.entityDrawingComponent',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'MdcDrawingComponentDto',
						moduleSubModule: 'ProductionPlanning.PpsMaterial'
					})],
					httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcdrawingcomponent/'},
					httpRead: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcdrawingcomponent/'},
					entityRole: {
						leaf: {
							itemName: 'MdcDrawingComponent',
							parentService: parentService,
							parentFilter: 'MdcProductDescriptionFk'
						}
					},

					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								return container.data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								creationData.Id = parentService.getSelected().Id;
								creationData.PKey1 = parentService.getSelected().EngDrawingFk;
							}
						}
					},
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'MdcDrawingComponentDto',
				moduleSubModule: 'ProductionPlanning.PpsMaterial',
				validationService: $injector.get('mdcDrawingComponentValidationService').getService(container.service),
				mustValidateFields: ['EngDrwCompTypeFk', 'MdcMaterialCostCodeFk']
			});

			return container.service;
		}

		var serviceCache = {};

		function getService(serviceOptions) {
			serviceOptions = serviceOptions || {};
			var serviceKey = serviceOptions.serviceKey;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		}

		var service = getService();
		service.getService = getService;
		return service;
	}
})(angular);
