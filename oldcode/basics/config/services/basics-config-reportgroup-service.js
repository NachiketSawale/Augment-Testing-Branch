/**
 * Created by sandu on 23.04.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsConfigReportGroupService
     * @function
     *
     * @description
     * data service for all ReportGroup related functionality.
     */

	configModule.factory('basicsConfigReportGroupService', basicsConfigReportGroupService);

	basicsConfigReportGroupService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService','$http'];

	function basicsConfigReportGroupService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http) {

		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsConfigReportGroupService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/reportgroup/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {
					node: {
						itemName: 'ReportGroup',
						parentService: basicsConfigMainService
					}
				},
				entitySelection: {},
				modification: {multi: true},
				translation: {
					uid: 'basicsConfigReportGroupService',
					title: 'basics.config.reportGroupListTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'Report2GroupDto', moduleSubModule: 'Basics.Config' }
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsConfigMainService.getSelected().Id;
						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		serviceContainer.service.getSelectedReportGroupId = function () {
			var selectedReportGroup = serviceContainer.service.getSelected();
			if (selectedReportGroup && selectedReportGroup.Id) {
				return selectedReportGroup.Id;
			}
		};

		serviceContainer.service.getSelectedReportGroupId = function () {

			var selectedReportGroup = serviceContainer.service.getSelected();
			if (selectedReportGroup && selectedReportGroup.Id) {
				return selectedReportGroup.Id;
			}
			// return 0;
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
			var selectedId = serviceContainer.service.getSelectedReportGroupId();
			var descriptorName = getUserInput();

			var data = {
				ReportGroupId: selectedId,
				DescriptorName: descriptorName
			};

			$http.post(globals.webApiBaseUrl + 'basics/config/reportgroup/createaccessrightdesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptorFk = data.data.AccessRightDescriptorFk;
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				serviceContainer.service.markItemAsModified(selectedObject);
			});
		}

		function deleteAccessRightDescriptor() {
			var selectedId = serviceContainer.service.getSelectedReportGroupId();

			var data = {
				ReportGroupId: selectedId
			};
			$http.post(globals.webApiBaseUrl + 'basics/config/reportgroup/deleteaccessrightdesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				selectedObject.Version = data.data.Version;
				serviceContainer.service.gridRefresh();
			});
		}



		return serviceContainer.service;
	}
})(angular);