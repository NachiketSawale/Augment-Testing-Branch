(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentBusinessPartnerDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentBusinessPartnerDataService', ['resourceEquipmentPlantDataService', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService',
		function (resourceEquipmentPlantDataService, platformDataServiceFactory, basicsLookupdataLookupFilterService) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentBusinessPartnerDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentBusinessPartner',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/businesspartner/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName:'BusinessPartner', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			function setObjectEntityRelatedFilters(lookupItem, value){
				return ( lookupItem.BusinessPartnerFk === value);
			}

			var objectEntityRelatedFilters = [
				{
					key: 'resource-equipment-bizpartner-filter',
					fn: function (item, object) {
						return (setObjectEntityRelatedFilters(item, object.BusinessPartnerFk));
					}
				},
				{
					key: 'resource-equipment-bizpartner-server-filter',
					serverSide: true,
					serverKey: 'resource-equipment-bizpartner-server-filter',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinessPartnerFk
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(objectEntityRelatedFilters);

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.takeOver = function takeOver(entity) {
				var data = serviceContainer.data;
				var dataEntity = data.getItemById(entity.Id, data);

				data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
				data.markItemAsModified(dataEntity, data);
			};


			return serviceContainer.service;
		}]);
})(angular);
