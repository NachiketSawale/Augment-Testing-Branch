/**
 * Created by xsi on 2016-07-21.
 */
(function(angular) {
	'use strict';
	var moduleName = 'basics.billingschema';
	angular.module(moduleName).factory('basicsBillingschemaContainerInformationService', [
		'basicsCommonContainerInformationServiceUtil',
		function (containerInformationServiceUtil) {
			var service = {};
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '0DE5C7C7D34D45A7A0EB39172FBD3796'://Billing Schema
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsBillingSchemaStandardConfigurationService',
							dataSvc : 'basicsBillingSchemaService',
							validationSvc : 'basicsBillingSchemaValidationService'
						});
						break;
					case '5D010AE2CB5E4C96BC77DA8044069022'://Billing Schema Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc : 'basicsBillingSchemaStandardConfigurationService',
							dataSvc : 'basicsBillingSchemaService',
							validationSvc : 'basicsBillingSchemaValidationService'
						});
						break;

				}
				return config;
			};
			return service;
		}
	]);

})(angular);
