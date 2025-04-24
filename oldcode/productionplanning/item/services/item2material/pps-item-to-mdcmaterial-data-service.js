/**
 * Created by lav on 12/10/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItem2MdcMaterialDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'ppsItem2MdcMaterialValidationService',
		'ppsItem2MdcMaterialReadonlyProcessor',
		'PlatformMessenger'];

	function DataService(platformDataServiceFactory,
						 basicsCommonMandatoryProcessor,
						 $injector,
						 validationService,
						 readonlyProcessor,
						 PlatformMessenger) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk')) {
						if (newItem[prop] <= 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || $injector.get('ppsUpstreamItemDataService').getService());
			var route = globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/material/';
			var defaultServiceOptions = {
				flatNodeItem: {
					module: serviceOptions.module || moduleName,
					serviceName: parentService.getServiceName() + 'ppsItem2MdcMaterialDataService',
					entityNameTranslationID: 'productionplanning.item.ppsItem2MdcMaterial.entity',
					httpRead: {
						route: route,
						endRead: serviceOptions.endRead || 'list'
					},
					httpCreate: {
						route: route,
						endCreate: serviceOptions.endCreate || 'create'
					},
					entityRole: {
						node: {
							itemName: 'PpsItem2MdcMaterial',
							parentService: parentService,
							parentFilter: 'itemFk',
							filterParent: function (data) {
								//keep the same function as platformDataServiceEntityRoleExtension
								data.currentParentItem = data.parentService.getSelected();
								data.selectedItem = null;
								if (data.currentParentItem) {
									return data.currentParentItem[serviceOptions.PpsItemColumn || 'PpsItemUpstreamFk'];
								}
							}
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [readonlyProcessor],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var parentSelected = parentService.getSelected();
								creationData.Id = parentSelected[serviceOptions.PpsItemColumn || 'PpsItemUpstreamFk'];
							},
							handleCreateSucceeded: function (newItem) {
								enSureInvalidValue(newItem);
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							var selectedParentItem = parentService.getSelected();
							return selectedParentItem && selectedParentItem.PpsUpstreamTypeFk === 1 && !_.isNil(selectedParentItem.PpsItemUpstreamFk);
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'PpsItem2MdcMaterialDto',
				moduleSubModule: 'ProductionPlanning.Item',
				validationService: validationService.getService(serviceContainer.service)
			});

			serviceContainer.service.onUpdateToolsEvent = new PlatformMessenger();
			serviceContainer.data.usesCache = false;
			serviceContainer.service.resetFilter = function (entity){
				let parentId = entity.PpsItemUpstreamFk;
				let filter = serviceContainer.data.parentFilter + '=' + parentId;
				serviceContainer.data.setFilter(filter);
			};
			return serviceContainer.service;
		}

		var serviceCache = {};

		function getService(serviceOptions) {
			serviceOptions = serviceOptions || {};
			var serviceKey = serviceOptions.serviceKey || 'productionplanning.item.upstreamitem.material';
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		}

		return {
			getService: getService
		};
	}

})(angular);