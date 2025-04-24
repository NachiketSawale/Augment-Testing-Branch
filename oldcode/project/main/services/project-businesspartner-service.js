(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectPrj2BPService
	 * @function
	 *
	 * @description
	 * projectPrj2BPService is the data service for all generals related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectPrj2BPService', ['projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService',

		function (projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService) {

			function processProjectBusinessPartner(bizPartner) {
				if(bizPartner.Id === 0) {
					platformRuntimeDataService.readonly(bizPartner, true);
				}
				else {
					var fields = [];

					if (!bizPartner.BusinessPartnerFk) {
						fields.push({field: 'SubsidiaryFk', readonly: true});
					}

					if (fields.length > 0) {
						platformRuntimeDataService.readonly(bizPartner, fields);
					}
				}
			}

			var bpServiceInfo = {
				flatNodeItem: {
					module: projectMainModule,
					serviceName: 'projectPrj2BPService',
					entityNameTranslationID: 'project.main.entityPrj2BP',
					dataProcessor: [{processItem: processProjectBusinessPartner}],
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/project2bp/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'project/main/project2bp/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = projectMainService.getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = selected.SubsidiaryFk;
							readData.PKey3 = selected.BusinessPartnerFk;
						}
					},
					entityRole: {
						node: {
							itemName: 'BusinessPartners',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					presenter: { list: {
						initCreationData: function initCreationData(creationData) {
							var selectedItem = projectMainService.getSelected();
							creationData.Id = selectedItem.Id;
							delete creationData.MainItemId;
						}}
					},
					longText: {
						relatedContainerTitle:'project.main.listPrj2BpTitle',
						relatedGridId:'B15A05E067094D3988F4626281C88E24',
						longTextProperties: [{
							displayProperty: 'Remark',
							propertyTitle: 'project.main.remarkContainerTitle'
						}]
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);

			container.service.takeOver = function takeOver(entity) {
				var data = container.data;
				var dataEntity = data.getItemById(entity.Id, data);

				data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
				data.markItemAsModified(dataEntity, data);

				var fields = [
					{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk}
				];
				platformRuntimeDataService.readonly(dataEntity, fields);
			};

			return container.service;

		}]);
})(angular);
