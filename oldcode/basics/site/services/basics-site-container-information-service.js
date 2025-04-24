(function (angular) {

	'use strict';
	var moduleName = 'basics.site';

	/**
     * @ngdoc service
     * @name basicsSiteContainerInformationService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('basicsSiteContainerInformationService', BasicsSiteContainerInformationService);

	BasicsSiteContainerInformationService.$inject = ['$injector'];

	function BasicsSiteContainerInformationService($injector) {

		var service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case 'd7d2e8cf9d9b47999e7a391ead0d3e00': //basicsSiteListController
					layServ = $injector.get('basicsSiteUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsSiteUIStandardService';
					config.dataServiceName = 'basicsSiteMainService';
					config.validationServiceName = 'basicsSiteValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'a34485a41a6d4de6810f5198ac3e2459': //basicsSiteDetailController
					layServ = $injector.get('basicsSiteUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsSiteUIStandardService';
					config.dataServiceName = 'basicsSiteMainService';
					config.validationServiceName = 'basicsSiteValidationService';
					break;
				case 'e3ddd810665a48598ba6fc70f6f10c6c': //basicsSite2ExternalListController
					layServ = $injector.get('basicsSite2ExternalUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsSite2ExternalUIStandardService';
					config.dataServiceName = 'basicsSite2ExternalDataService';
					config.validationServiceName = 'basicsSite2ExternalValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'dee5249511c14645a2C91cb84ecab0ad':
					layServ = $injector.get('basicsSite2TksShiftUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsSite2TksShiftUIStandardService';
					config.dataServiceName = 'basicsSite2TksShiftDataService';
					config.validationServiceName = 'basicsSite2TksShiftValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '5b555d06656c450dae151d73b83d6261': //ppsCommonCalendarSiteListController
					var service = $injector.get('ppsCommonCalendarSiteServiceFactory').getService({
						serviceKey: 'basics.site.calendar4site',
						parentService: 'basicsSiteMainService',
						parentFk: 'Id'
					});
					layServ = $injector.get('ppsCommonCalendarSiteUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCommonCalendarSiteUIStandardService';
					config.dataServiceName = service;
					config.validationServiceName = $injector.get('ppsCommonCalendarSiteValidationServiceFactory').getService(service);
					config.listConfig = {initCalled: false, columns: []};
					break;
			}
			return config;
		};
		return service;
	}
})(angular);