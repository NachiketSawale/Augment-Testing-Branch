/**
 * Created by waz on 11/15/2017.
 */
(function (angular) {
	'use strict';

	var module = 'productionplanning.mounting';

	angular.module(module).factory('productionplanningMountingResRequisitionDialogDataService', ProductionplanningMountingResRequisitionDialogDataService);
	ProductionplanningMountingResRequisitionDialogDataService.$inject = ['platformDataServiceFactory', 'productionplanningMountingTrsRequisitionDataService'];
	function ProductionplanningMountingResRequisitionDialogDataService(platformDataServiceFactory, parentService) {

		var serviceContainer;
		var serviceOption = {
			flatNodeItem: {
				module: angular.module(module),
				serviceName: 'productionplanningMountingResRequisitionDialogDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'lookuplist'
				},
				entityRole: {
					leaf: {
						itemName: 'ResRequisition',
						parentService: parentService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							//filter by project
							var parentItem = parentService.getSelected();
							var projectId = (parentItem.ProjectFk) ? parentItem.ProjectFk : parentItem.ProjectId;
							var dtos = [];
							_.each(readData, function (item) {
								if (item.ProjectFk === projectId || item.ProjectFk === null) {
									dtos.push(item);
								}
							});
							dtos = _.orderBy(dtos, ['ProjectFk'], ['asc']);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: dtos || []
							};

							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		return serviceContainer.service;
	}
})(angular);