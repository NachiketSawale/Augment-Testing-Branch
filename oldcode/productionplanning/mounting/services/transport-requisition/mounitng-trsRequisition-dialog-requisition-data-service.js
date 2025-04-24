/**
 * Created by waz on 11/27/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).service('productionplanningMountingTrsRequisitionDialogRequisitionUiService', ActivityTrsRequisitionDialogUiService);
	ActivityTrsRequisitionDialogUiService.$inject = ['basicsCommonContainerDialogUiServiceFactory', 'transportplanningRequisitionUIStandardService'];
	function ActivityTrsRequisitionDialogUiService(uiServiceFactory, uiService) {
		return uiServiceFactory.createStaticUiService(
			uiService, [
				'code', 'descriptioninfo', 'date'
			]
		);
	}

	angular.module(moduleName).factory('productionplanningMountingTrsRequisitionDialogRequisitionDataService', ActivityTrsRequisitionDialogDataService);
	ActivityTrsRequisitionDialogDataService.$inject = ['platformDataServiceFactory',
		'productionplanningMountingRequisitionDataService',
		'productionplanningMountingContainerInformationService'];
	function ActivityTrsRequisitionDialogDataService(platformDataServiceFactory,
													 requisitionDataService,
													 mountingContainerInformationService) {
		var serviceContainer;
		var activityUid = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityDataService = mountingContainerInformationService.getContainerInfoByGuid(activityUid).dataServiceName;

		var serviceOptions = {
			flatNodeItem: {
				serviceName: 'productionplanningMountingTrsRequisitionDialogRequisitionDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/requisition/',
					endRead: 'listByProjectAndMntActivity',
					initReadData: function (readData) {
						readData.filter = '?projectId=' + requisitionDataService.getSelected().ProjectFk;
					}
				},
				entityRole: {
					node: {
						itemName: 'Requisition',
						parentService: dynamicActivityDataService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};

							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		return serviceContainer.service;
	}
})(angular);