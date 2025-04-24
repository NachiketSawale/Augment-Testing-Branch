(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainProspectService
	 * @function
	 *
	 * @description
	 * objectMainProspectService is the data service for all Prospect related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainModule = angular.module(moduleName);
	objectMainModule.factory('objectMainProspectService', ['platformDataServiceFactory','platformRuntimeDataService','objectMainUnitService','platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, platformRuntimeDataService,objectMainUnitService, platformDataServiceProcessDatesBySchemeExtension) {
			var factoryOptions = {
				flatNodeItem: {
					module: objectMainModule,
					serviceName: 'objectMainService',
					entityNameTranslationID: 'object.main.entityObjectMain',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/prospect/', endRead: 'listByParent', usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = objectMainUnitService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'ProspectDto', moduleSubModule: 'Object.Main'})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = objectMainUnitService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						node: {itemName: 'Prospect', parentService: objectMainUnitService}
					}

				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.takeOver = function takeOver(entity) {
				var data = serviceContainer.data;
				var dataEntity = data.getItemById(entity.Id, data);

				data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
				data.markItemAsModified(dataEntity, data);

				var fields = [
					{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk},
					{field: 'ContactFk', readonly: !dataEntity.BusinessPartnerFk}
				];
				platformRuntimeDataService.readonly(dataEntity, fields);
			};


			return serviceContainer.service;

		}]);
})(angular);
