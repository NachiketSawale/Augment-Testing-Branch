/**
 * Created by sandu on 28.01.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupService
	 * @function
	 *
	 * @description
	 * data service for all WizardXGroup related functionality.
	 */
	configModule.factory('basicsConfigWizardXGroupService', basicsConfigWizardXGroupService);

	basicsConfigWizardXGroupService.$inject = ['basicsConfigWizardGroupService', 'platformDataServiceFactory', 'basicsConfigWizardXGroupValidationProcessor', '$http', 'platformModalService','ServiceDataProcessArraysExtension','basicsConfigWizardXGroupUpdateProcessor','$log'];

	function basicsConfigWizardXGroupService(basicsConfigWizardGroupService, platformDataServiceFactory, basicsConfigWizardXGroupValidationProcessor, $http, platformModalService, ServiceDataProcessArraysExtension, basicsConfigWizardXGroupUpdateProcessor, $log) {
		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsConfigWizardXGroupService',
				entityNameTranslationID: 'basics.config.wizardXGroupListTitle',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/wizard2group/'},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Wizard2Group']), basicsConfigWizardXGroupUpdateProcessor],
				entityRole: {
					node: {
						itemName: 'Wizard2Group',
						parentService: basicsConfigWizardGroupService
					}
				},
				translation: {
					uid: 'basicsConfigWizardXGroupService',
					title: 'basics.config.wizardXGroupListTitle',
					columns: [
						{header: 'basics.config.entityName', field: 'Name'},
						{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}
					],
					dtoScheme: { typeName: 'Wizard2GroupDto', moduleSubModule: 'Basics.Config' }
				},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsConfigWizardGroupService.getSelected().Id;
						}
					}
				}

			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		serviceContainer.data.usesCache = false;
		serviceContainer.data.newEntityValidator = basicsConfigWizardXGroupValidationProcessor;

		serviceContainer.service.getSelectedWizardXGroupId = function () {
			var selectedWizardXGroup = serviceContainer.service.getSelected();
			if (selectedWizardXGroup && selectedWizardXGroup.Id) {
				return selectedWizardXGroup.Id;
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

		serviceContainer.service.getWizardById = function (id){
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/wizard/listById',
				params: {id :id}
			}).then(function (response) {
				return response.data;
			}, function (error) {
				$log.error(error);
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
			var selectedId = serviceContainer.service.getSelectedWizardXGroupId();
			var descriptorName = getUserInput();

			var data = {
				WizardXGroupId: selectedId,
				DescriptorName: descriptorName
			};

			$http.post(globals.webApiBaseUrl + 'basics/config/wizard2group/createAsscessRightDesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptorFk = data.data.AccessRightDescriptorFk;
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				serviceContainer.service.markItemAsModified(selectedObject);
			});
		}

		function deleteAccessRightDescriptor () {
			var selectedId = serviceContainer.service.getSelectedWizardXGroupId();

			var data = {
				WizardXGroupId: selectedId
			};
			$http.post(globals.webApiBaseUrl + 'basics/config/wizard2group/deleteAsscessRightDesc', data).then(function (data) {
				var selectedObject = serviceContainer.service.getSelected();
				selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
				selectedObject.Version = data.data.Version;
				serviceContainer.service.gridRefresh();
			});
		}

		return serviceContainer.service;
	}
})(angular);