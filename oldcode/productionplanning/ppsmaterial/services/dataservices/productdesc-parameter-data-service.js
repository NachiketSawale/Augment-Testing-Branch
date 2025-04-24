(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningPpsMaterialProductDescParameterDataService
	 * @function
	 *
	 * @description
	 * productionplanningPpsMaterialProductDescParameterDataService is the data service for ProductDesc Parameter.
	 */

	masterModule.factory('productionplanningPpsMaterialProductDescParameterDataService', productionplanningPpsMaterialProductDescParameterDataService);
	productionplanningPpsMaterialProductDescParameterDataService.$inject = [
		'$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'productionplanningPpsMaterialProductDescParameterSortingProcessor'

	];

	function productionplanningPpsMaterialProductDescParameterDataService($injector, platformDataServiceFactory,
																		  platformDataServiceProcessDatesBySchemeExtension,
																		  basicsLookupdataLookupDescriptorService,
																		  basicsCommonMandatoryProcessor,
																		  productionplanningPpsMaterialProductDescParameterSortingProcessor) {
		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || 'productionplanningPpsMaterialProductDescDataService');
			var serviceInfo = {
				flatLeafItem: {
					module: serviceOptions.moduleName || moduleName,
					serviceName: parentService.getServiceName() + 'ppsMaterialProductDescParameterDataService',
					entityNameTranslationID: 'productionplanning.ppsmaterial.productDescParameter.entityProductDescParameter',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'MdcProductDescParamDto',
						moduleSubModule: 'ProductionPlanning.PpsMaterial'
					}), productionplanningPpsMaterialProductDescParameterSortingProcessor],
					httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescparam/'},
					httpRead: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescparam/'},
					entityRole: {
						leaf: {
							itemName: 'MdcProductDescParam',
							parentService: parentService,
							parentFilter: 'productDescriptionFk'
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
							}
						}
					},
					translation: {
						uid: 'productionplanningPpsMaterialProductDescParameterDataService',
						title: 'productionplanning.ppsmaterial.productDescParameter.entityProductDescParameter',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'MdcProductDescParamDto',
							moduleSubModule: 'ProductionPlanning.PpsMaterial',
						},
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'MdcProductDescParamDto',
				moduleSubModule: 'ProductionPlanning.PpsMaterial',
				validationService: $injector.get('productionplanningPpsMaterialProductDescParameterValidationService').getService(container.service),
				mustValidateFields: ['Quantity', 'Sorting']
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
