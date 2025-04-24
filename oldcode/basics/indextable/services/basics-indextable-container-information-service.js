/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.indextable';

	/**
     * @ngdoc service
     * @name BasicsIndexTableContainerInformationService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('basicsIndextableContainerInformationService', BasicsIndextableContainerInformationService);

	BasicsIndextableContainerInformationService.$inject = ['$injector'];

	function BasicsIndextableContainerInformationService($injector) {

		let service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case 'B20D865CA3594FA98AD281468419BAEB': // basicsIndexHeaderListController
					layServ = $injector.get('basicsIndexHeaderUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsIndexHeaderUIStandardService';
					config.dataServiceName = 'basicsIndexHeaderService';
					config.validationServiceName = 'basicsIndexHeaderValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						type: 'basics.indextable',
						dragDropService : $injector.get('basicsCommonClipboardService')
					};
					break;
				case '65CADB68E8484235BA460341A509DB7F': // basicsIndexHeaderDetailController
					layServ = $injector.get('basicsIndexHeaderUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsIndexHeaderUIStandardService';
					config.dataServiceName = 'basicsIndexHeaderService';
					config.validationServiceName = 'basicsIndexHeaderValidationService';
					break;
				case 'E6A6F3D969CE4265955EF17465F662FE': // basicsIndexDetailListController
					layServ = $injector.get('basicsIndexDetailUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsIndexDetailUIStandardService';
					config.dataServiceName = 'basicsIndexDetailService';
					config.validationServiceName = 'basicsIndexDetailValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '85204B8ECC5E4921A5C004B18FD01507': // basicsIndexDetailDetailController
					layServ = $injector.get('basicsIndexDetailUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsIndexDetailUIStandardService';
					config.dataServiceName = 'basicsIndexDetailService';
					config.validationServiceName = 'basicsIndexDetailValidationService';
					break;
			}
			return config;
		};
		return service;
	}
})(angular);
