/* global globals _ */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningPpsMaterialMappingDataService
	 * @function
	 *
	 * @description
	 * productionplanningPpsMaterialMappingDataService is the data service for PpsMaterial.
	 */

	masterModule.factory('productionplanningPpsMaterialMappingDataService', productionplanningPpsMaterialMappingDataService);
	productionplanningPpsMaterialMappingDataService.$inject = ['$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'ppsConfigExternalSourceLookupService',
		'basicsLookupdataLookupFilterService',
		'$http'
	];

	function productionplanningPpsMaterialMappingDataService($injector, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		ppsConfigExternalSourceLookupService,
		basicsLookupdataLookupFilterService,
		$http) {

		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || 'productionplanningPpsMaterialRecordMainService');
			var rootPrefix = globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppsmaterialmapping/';
			var serviceInfo = {
				flatNodeItem: {
					module: serviceOptions.moduleName || moduleName,
					serviceName: parentService.getServiceName() + 'ppsMaterialMappingDataService',
					entityNameTranslationID: 'productionplanning.ppsmaterial.mapping.entityPpsMaterialMapping',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PpsMaterialMappingDto',
						moduleSubModule: 'ProductionPlanning.PpsMaterial'
					})],
					httpCRUD:{
						route: rootPrefix,
						endRead:'list'
					},
					entityRole: {
						leaf: {
							itemName: 'PpsMaterialMapping',
							parentService: parentService,
							parentFilter: 'mainItemId',
							filterParent: function (data) {
								// keep the same function as platformDataServiceEntityRoleExtension
								data.currentParentItem = data.parentService.getSelected();
								data.selectedItem = null;
								if (_.has(data.currentParentItem, 'PpsMaterial.Id')) {
									return data.currentParentItem.PpsMaterial.Id;
								}
							}
						}
					},

					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc:  () => {
							var selected = parentService.getSelected();
							return selected !== null && selected.PpsMaterial !== null;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: (readData || {}).FilterResult,
									dtos: readData || []
								};
								var dataRead = container.data.handleReadSucceeded(result, data);
								if (dataRead.length === 1) {
									service.setSelected(dataRead[0], dataRead);
								} else {
									service.deselect();
								}

								return dataRead;
							},
							initCreationData: function (creationData) {
								if(_.isNil(parentService.getSelected().PpsMaterial))
								{
									return;
								}
								creationData.Id = parentService.getSelected().PpsMaterial.Id;
							}
						}
					},
					translation: {
						uid: 'productionplanningPpsMaterialMappingDataService',
						title: 'productionplanning.ppsmaterial.mapping.entityPpsMaterialMapping'
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);



			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsMaterialMappingDto',
				moduleSubModule: 'ProductionPlanning.PpsMaterial',
				validationService: 'productionplanningPpsMaterialMappingValidationService'
			});


			var filters = [{
				key: 'ppsmaterial-bas-external-resource-filter',
				fn: function (item) {
					const ppsMaterialMapping = container.service.getSelected();
					if(ppsMaterialMapping && ppsMaterialMapping.BasExternalsourcetypeFk !== null){
						const itemEntity = _.find(ppsConfigExternalSourceLookupService.getItemList(), {Id:item.Id });
						if(itemEntity && itemEntity.ExternalsourcetypeFk){
							return itemEntity.ExternalsourcetypeFk === ppsMaterialMapping.BasExternalsourcetypeFk;
						}
						return false;
					}
					return  false;
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			var service = container.service;

			service.getDefaultByMaterial = function (materialFk) {
				var url = rootPrefix + 'getDefaultByMaterial?materialFk=' + materialFk;
				return $http.get(url);
			};

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
