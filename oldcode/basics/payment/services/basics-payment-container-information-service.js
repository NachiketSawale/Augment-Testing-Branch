(function (angular) {

	'use strict';
	var basicsPaymentModule = angular.module('basics.payment');

	/**
	 * @ngdoc service
	 * @name basicsPaymentContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsPaymentModule.factory('basicsPaymentContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '24790afafd35416595ef14527d0ba021': //basicsPaymentListController
						layServ = $injector.get('basicsPaymentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsPaymentUIStandardService';
						config.dataServiceName = 'basicsPaymentMainService';
						config.validationServiceName = 'basicsPaymentValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '997d0546dca4406dae95ab214aae9d0d': //basicsPaymentDetailController
						layServ = $injector.get('basicsPaymentUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsPaymentUIStandardService';
						config.dataServiceName = 'basicsPaymentMainService';
						config.validationServiceName = 'basicsPaymentValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);