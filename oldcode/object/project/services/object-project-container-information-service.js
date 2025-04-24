(function (angular) {

	'use strict';
	var objectProjectModule = angular.module('object.project');

	/**
	 * @ngdoc service
	 * @name objectProjectContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	objectProjectModule.factory('objectProjectContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '34ce2fbe7aa74734b5389b19df8646b6': // ObjectProjectHeaderListController
						layServ = $injector.get('objectProjectHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'objectProjectHeaderUIStandardService';
						config.dataServiceName = 'objectProjectHeaderService';
						config.validationServiceName = 'objectProjectHeaderValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'e542d3f1f9374fd8815de4aef382b6a1': // objectProjectHeaderDetailController
						layServ = $injector.get('objectProjectHeaderUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'objectProjectHeaderUIStandardService';
						config.dataServiceName = 'objectProjectHeaderService';
						config.validationServiceName = 'objectProjectHeaderValidationService';
						break;
					case '230a2d63c31e429486325c62660afcca': // objectProjectLevelListController
						layServ = $injector.get('objectProjectLevelUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'objectProjectLevelUIStandardService';
						config.dataServiceName = 'objectProjectLevelService';
						config.validationServiceName = 'objectProjectLevelValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'cb60bceef3e243929c9e2b3d1a1292cb': // objectProjectLevelDetailController
						layServ = $injector.get('objectProjectLevelUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'objectProjectLevelUIStandardService';
						config.dataServiceName = 'objectProjectLevelService';
						config.validationServiceName = 'objectProjectLevelValidationService';
						break;
					case 'a93d6d0701a04a15b88685b3c0800125': // objectProjectHeaderDocumentListController
						layServ = $injector.get('objectProjectHeaderDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'objectProjectHeaderDocumentUIStandardService';
						config.dataServiceName = 'objectProjectHeaderDocumentService';
						config.validationServiceName = '';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '909b0d66111643bf92a6e8d6e810c7f0': // objectProjectHeaderDocumentDetailController
						layServ = $injector.get('objectProjectHeaderDocumentUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'objectProjectHeaderDocumentUIStandardService';
						config.dataServiceName = 'objectProjectHeaderDocumentService';
						config.validationServiceName = '';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);