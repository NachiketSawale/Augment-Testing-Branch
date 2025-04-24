/**
 * Created by jhe on 11/20/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).factory('basicsAccountingJournalsContainerInformationService', ['$injector',
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '008F7B6E76F14AD5B5B16365E2D11823': // basicsAccountingJournalsListController
						layServ = $injector.get('basicsAccountingJournalsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsAccountingJournalsUIStandardService';
						config.dataServiceName = 'basicsAccountingJournalsMainService';
						config.validationServiceName = 'basicsAccountingJournalsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '26EF760CD529457DA85FEADC241F16BB': // basicsAccountingJournalsDetailController
						layServ = $injector.get('basicsAccountingJournalsUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsAccountingJournalsUIStandardService';
						config.validationServiceName = 'basicsAccountingJournalsValidationService';
						config.dataServiceName = 'basicsAccountingJournalsMainService';
						break;
					case 'C11B5B707FF744CF9A8EDDD26633DB43': // basicsAccountingJournalsTransactionListController
						layServ = $injector.get('basicsAccountingJournalsTransactionUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsAccountingJournalsTransactionUIStandardService';
						config.validationServiceName = 'basicsAccountingJournalsTransactionValidationService';
						config.dataServiceName = 'basicsAccountingJournalsTransactionService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '1772FE6173C7471EB256E9FA08A054F6': // basicsAccountingJournalsTransactionDetailController
						layServ = $injector.get('basicsAccountingJournalsTransactionUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsAccountingJournalsTransactionUIStandardService';
						config.validationServiceName = 'basicsAccountingJournalsTransactionValidationService';
						config.dataServiceName = 'basicsAccountingJournalsTransactionService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);