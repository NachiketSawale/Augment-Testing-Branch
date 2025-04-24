(function (angular) {

	'use strict';
	var basicsCountryModule = angular.module('basics.country');

	/**
	 * @ngdoc service
	 * @name basicsCountryContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsCountryModule.factory('basicsCountryContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '84ac7a2a178e4ea6b6dba23ab5f04aa9': // basicsCountryListController
						layServ = $injector.get('basicsCountryUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsCountryUIStandardService';
						config.dataServiceName = 'basicsCountryMainService';
						config.validationServiceName = 'basicsCountryValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'cd1fc59aa30149c487bedcfc38704ab5': // basicsCountryDetailController
						layServ = $injector.get('basicsCountryUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsCountryUIStandardService';
						config.dataServiceName = 'basicsCountryMainService';
						config.validationServiceName = 'basicsCountryValidationService';
						break;
					case '8a1744845b1c4107b6a16559df69bdab': // basicsCountryStateListController
						layServ = $injector.get('basicsCountryStateUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsCountryStateUIStandardService';
						config.dataServiceName = 'basicsCountryStateService';
						config.validationServiceName = 'basicsCountryStateValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '5860289e7cd04a8ebddfadf892e11870': // basicsCountryStateDetailController
						layServ = $injector.get('basicsCountryStateUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsCountryStateUIStandardService';
						config.dataServiceName = 'basicsCountryStateService';
						config.validationServiceName = 'basicsCountryStateValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);