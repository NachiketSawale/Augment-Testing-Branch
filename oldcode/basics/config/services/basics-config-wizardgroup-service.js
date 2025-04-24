/**
 * Created by sandu on 27.01.2016.
 */
(function(){
	'use strict';
	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardGroupService
	 * @function
	 *
	 * @description
	 * data service for all WizardGroup related functionality.
	 */
	configModule.factory('basicsConfigWizardGroupService', basicsConfigWizardGroupService);

	basicsConfigWizardGroupService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService','$http'];

	function basicsConfigWizardGroupService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http){
		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsConfigWizardGroupService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/wizardgroup/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {
					node: {
						itemName: 'WizardGroup',
						parentService: basicsConfigMainService
					}
				},
				translation: {
					uid: 'basicsConfigWizardGroupService',
					title: 'basics.config.wizardGroupListTitle',
					columns:[
						{header: 'basics.config.entityName', field: 'Name'},
						{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}
					],
					dtoScheme: { typeName: 'WizardGroupDto', moduleSubModule: 'Basics.Config' }
				},
				entitySelection: {},
				modification: {multi: true},
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

		serviceContainer.service.getSelectedWizardGroupId = function () {
			var selectedWizardGroup = serviceContainer.service.getSelected();
			if (selectedWizardGroup && selectedWizardGroup.Id) {
				return selectedWizardGroup.Id;
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

		function setUserInput(userInput) {
			accessrightDescriptorName = userInput;
		}

		function getUserInput() {
			return accessrightDescriptorName;
		}

		function createAccessRightDescriptor() {
			var selectedId = serviceContainer.service.getSelectedWizardGroupId();
			var descriptorName = getUserInput();

			var data = {
				WizardGroupId: selectedId,
				DescriptorName: descriptorName
			};

			$http.post(globals.webApiBaseUrl + 'basics/config/wizardgroup/createaccessrightdesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptorFk = data.data.AccessRightDescriptorFk;
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				serviceContainer.service.markItemAsModified(selectedObject);
			});
		}

		function deleteAccessRightDescriptor () {
			var selectedId = serviceContainer.service.getSelectedWizardGroupId();

			var data = {
				WizardGroupId: selectedId
			};
			$http.post(globals.webApiBaseUrl + 'basics/config/wizardgroup/deleteaccessrightdesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				selectedObject.Version = data.data.Version;
				serviceContainer.service.gridRefresh();
			});
		}

		return serviceContainer.service;
	}
})(angular);