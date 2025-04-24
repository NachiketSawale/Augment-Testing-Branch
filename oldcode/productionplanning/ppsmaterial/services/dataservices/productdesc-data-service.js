(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningPpsMaterialProductDescDataService
	 * @function
	 *
	 * @description
	 * productionplanningPpsMaterialProductDescDataService is the data service for MDCProductDescription.
	 */

	masterModule.factory('productionplanningPpsMaterialProductDescDataService', productionplanningPpsMaterialProductDescDataService);
	productionplanningPpsMaterialProductDescDataService.$inject = ['$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'$http'
	];

	function productionplanningPpsMaterialProductDescDataService($injector, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		$http) {

		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || 'productionplanningPpsMaterialRecordMainService');
			var rootPrefix = globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescription/';
			var serviceInfo = {
				flatNodeItem: {
					module: serviceOptions.moduleName || moduleName,
					serviceName: parentService.getServiceName() + 'ppsMaterialProductDescDataService',
					entityNameTranslationID: 'productionplanning.ppsmaterial.productDescription.entityMdcProductDescription',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'MdcProductDescriptionDto',
						moduleSubModule: 'ProductionPlanning.PpsMaterial'
					})],
					httpCreate: {route: rootPrefix},
					httpRead: {route: rootPrefix},
					entityRole: {
						node: {
							itemName: 'MdcProductDescription',
							parentService: parentService,
							parentFilter: 'mainItemId',
							filterParent: function (data) {
								//keep the same function as platformDataServiceEntityRoleExtension
								data.currentParentItem = data.parentService.getSelected();
								data.selectedItem = null;
								if (data.currentParentItem) {
									return data.currentParentItem[serviceOptions.materialIdColumn || 'Id'];
								}
							}
						}
					},

					actions: {
						delete: {},
						create: 'flat'
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
								creationData.Id = parentService.getSelected()[serviceOptions.materialIdColumn || 'Id'];
							},
							handleCreateSucceeded: function (item) {
							  var parentItem = parentService.getSelected();
							  if(parentItem && parentItem.UomFk){
							  	item.UomFk = parentItem.UomFk;
							  } //defect 131120: PPS Material Module, Pre-select all uoms fields when creating new mdc product descriptions in the UI.
								return item;
							}
						}
					},
					translation: {
						uid: 'productionplanningPpsMaterialProductDescDataService',
						title: 'productionplanning.ppsmaterial.productDescription.entityMdcProductDescription',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'MdcProductDescriptionDto',
							moduleSubModule: 'ProductionPlanning.PpsMaterial'
						},
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'MdcProductDescriptionDto',
				moduleSubModule: 'ProductionPlanning.PpsMaterial',
				validationService: $injector.get('productionplanningPpsMaterialProductDescValidationService').getService(container.service)
			});

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
