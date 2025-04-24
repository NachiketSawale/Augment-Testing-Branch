/**
 * Created by sandu on 28.05.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigReportXGroupService
	 * @function
	 *
	 * @description
	 * data service for all ReportXGroup related functionality.
	 */
	configModule.factory('basicsConfigReportXGroupService', basicsConfigReportXGroupService);

	basicsConfigReportXGroupService.$inject = ['basicsConfigReportGroupService', 'platformDataServiceFactory', 'basicsConfigReportXGroupValidationProcessor','platformModalService','$http'];

	function basicsConfigReportXGroupService(reportGroupService, platformDataServiceFactory, basicsConfigReportXGroupValidationProcessor,platformModalService, $http) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigReportXGroupService',
				entityNameTranslationID: 'basics.config.reportXGroupListTitle',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/reportXgroup/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {itemName: 'Report2Group', parentService: reportGroupService}},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = reportGroupService.getIfSelectedIdElse();
						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		serviceContainer.data.newEntityValidator = basicsConfigReportXGroupValidationProcessor;

		serviceContainer.service.getSelectedReportXGroupId = function () {
			var selectedReportXGroup = serviceContainer.service.getSelected();
			if (selectedReportXGroup && selectedReportXGroup.Id) {
				return selectedReportXGroup.Id;
			}
		};

		serviceContainer.service.processInputDialog = function () {
			var modalOptions = {
				headerTextKey: 'basics.config.enterAccessRightDescriptorName',
				bodyTextKey: 'basics.config.plsEnterName',
				maxLength: 64
			};

			return platformModalService.showInputDialog(modalOptions).then(function (result) {
				if (result.ok) {
					var userInput = result.value.text;
					setUserInput(userInput);
					createAccessRightDescriptor();
				}
			});
		};

		serviceContainer.service.processYesNoDialog = function () {
			return platformModalService.showYesNoDialog('basics.config.yesNoDialogQuestion', 'basics.config.yesNoDialogTitle', 'yes').then(function (result) {
				if (result.yes) {
					deleteAccessRightDescriptor();
				}
			});
		};

		var accessrightDescriptorName;

		function setUserInput (userInput) {
			accessrightDescriptorName = userInput;
		}

		function getUserInput() {
			return accessrightDescriptorName;
		}

		function createAccessRightDescriptor() {
			var selectedId = serviceContainer.service.getSelectedReportXGroupId();
			var descriptorName = getUserInput();

			var data = {
				ReportXGroupId: selectedId,
				DescriptorName: descriptorName
			};

			$http.post(globals.webApiBaseUrl + 'basics/config/reportXgroup/createAsscessRightDesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptorFk = data.data.AccessRightDescriptorFk;
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				serviceContainer.service.markItemAsModified(selectedObject);
			});
		}

		function deleteAccessRightDescriptor() {
			var selectedId = serviceContainer.service.getSelectedReportXGroupId();

			var data = {
				ReportXGroupId: selectedId
			};
			$http.post(globals.webApiBaseUrl + 'basics/config/reportXgroup/deleteAsscessRightDesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				selectedObject.Version = data.data.Version;
				serviceContainer.service.gridRefresh();
			});
		}
		return serviceContainer.service;
	}
})(angular);