(function (angular) {

	'use strict';
	var basicsBankModule = angular.module('basics.bank');

	/**
	 * @ngdoc service
	 * @name basicsBankContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsBankModule.factory('basicsBankContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case 'C33E512FEE614BDA84485F33093472F7': // basicsBankListController
						layServ = $injector.get('basicsBankUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsBankUIStandardService';
						config.dataServiceName = 'basicsBankMainService';
						config.validationServiceName = 'basicsBankValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '31d65ad2dc274a26ae91281b8d71a009': // basicsBankDetailController
						layServ = $injector.get('basicsBankUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsBankUIStandardService';
						config.dataServiceName = 'basicsBankMainService';
						config.validationServiceName = 'basicsBankValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);