/**
 * Created by sandu on 01.04.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsConfigTabService
     * @function
     *
     * @description
     * data service for all ModuleTab related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	configModule.factory('basicsConfigTabService', basicsConfigTabService);

	basicsConfigTabService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService', '$http'];

	function basicsConfigTabService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigMainService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/tab/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {itemName: 'ModuleTab', parentService: basicsConfigMainService}},
				translation: {
					uid: 'basicsConfigTabService',
					title: 'basics.config.tabListTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'ModuleTabDto', moduleSubModule: 'Basics.Config' }
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
		    var selectedId = serviceContainer.service.getSelected().Id;
		    var descriptorName = getUserInput();

		    var data = {
			    TabId: selectedId,
			    DescriptorName: descriptorName
		    };

		    $http.post(globals.webApiBaseUrl + 'basics/config/tab/createAsscessRightDesc', data).then(function (data) {
			    var selectedObject = serviceContainer.service.getSelected();
			    selectedObject.AccessRightDescriptorFk = data.data.AccessRightDescriptorFk;
			    selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
			    serviceContainer.service.markItemAsModified(selectedObject);
		    });
	    }

	    function deleteAccessRightDescriptor() {
		    var selectedId = serviceContainer.service.getSelected().Id;

		    var data = {
			    TabId: selectedId
		    };
		    $http.post(globals.webApiBaseUrl + 'basics/config/tab/deleteAsscessRightDesc', data).then(function (data) {
			    var selectedObject = serviceContainer.service.getSelected();
			    selectedObject.AccessRightDescriptor = data.data.AccessRightDescriptor;
			    selectedObject.Version = data.data.Version;
			    serviceContainer.service.gridRefresh();
		    });
	    }



		return serviceContainer.service;
	}
})(angular);
