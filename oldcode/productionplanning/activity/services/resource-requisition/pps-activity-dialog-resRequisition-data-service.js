/**
 * Created by lid on 9/15/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('productionplanningActivityDialogResRequisitionListService', ActivityDialogResRequisitionListService);
	ActivityDialogResRequisitionListService.$inject = ['platformDataServiceFactory'];
	function ActivityDialogResRequisitionListService(platformDataServiceFactory) {

		var service = [];
		service.createService = function (parentService) {
			var serviceOptions = {
				flatLeafItem: {
					serviceName: 'productionplanningActivityDialogResRequisitionListService',
					httpRead: {
						route: globals.webApiBaseUrl + 'resource/requisition/',
						endRead: 'lookuplistbyfilter',
						usePostForRead: true,
						initReadData: function (readData) {
							var parentItem = parentService.getSelected();
							readData.projectFk = (parentItem.ProjectFk) ? parentItem.ProjectFk : parentItem.ProjectId;
						}
					},
					useItemFilter: true,
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

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions); // jshint ignore:line
			serviceContainer.data.doNotLoadOnSelectionChange = true;
			return serviceContainer.service;
		};
		return service;
	}
})(angular);