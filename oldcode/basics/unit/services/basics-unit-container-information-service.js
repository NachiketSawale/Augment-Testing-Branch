(function (angular) {

	'use strict';
	var basicsUnitModule = angular.module('basics.unit');

	/**
	 * @ngdoc service
	 * @name basicsUnitContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsUnitModule.factory('basicsUnitContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '438973C14EAD47D3A651742BBC9B5696': // basicsUnitListController
						layServ = $injector.get('basicsUnitUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsUnitUIStandardService';
						config.dataServiceName = 'basicsUnitMainService';
						config.validationServiceName = 'basicsUnitValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'A68D72F3D8B74A4A9DD677738A79EBAA': // basicsUnitDetailController
						layServ = $injector.get('basicsUnitUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsUnitUIStandardService';
						config.dataServiceName = 'basicsUnitMainService';
						config.validationServiceName = 'basicsUnitValidationService';
						break;
					case '92CD68EFDE7247AAB4F955C125EF8ECB': // basicsUnitSynonymListController
						layServ = $injector.get('basicsUnitSynonymUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsUnitSynonymUIStandardService';
						config.dataServiceName = 'basicsUnitSynonymService';
						config.validationServiceName = 'basicsUnitSynonymValidationService';
						config.listConfig = { initCalled: false, columns: [], sortOptions: {initialSortColumn: {field: 'Synonym', id: 'synonym' }, isAsc: true} };
						break;
					case '7B3E7ACEB29D4EDC9B0F7B4F02F73581': // basicsUnitSynonymDetailController
						layServ = $injector.get('basicsUnitSynonymUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsUnitSynonymUIStandardService';
						config.dataServiceName = 'basicsUnitSynonymService';
						config.validationServiceName = 'basicsUnitSynonymValidationService';
						break;


				}

				return config;
			};

			return service;
		}
	]);
})(angular);