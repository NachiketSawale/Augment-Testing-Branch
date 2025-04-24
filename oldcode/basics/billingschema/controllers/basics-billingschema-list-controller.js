/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {

	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').controller('basicsBillingSchemaListController',
		['$scope', 'basicsBillingSchemaService', 'basicsBillingSchemaStandardConfigurationService', 'basicsBillingSchemaValidationService', 'platformGridControllerService','platformTranslateService',
			function ($scope, basicsBillingSchemaService, basicsBillingSchemaStandardConfigurationService, basicsBillingSchemaValidationService, platformGridControllerService, platformTranslateService) {

				var myGridConfig = { initCalled: false, columns: [] };

				platformTranslateService.translateGridConfig(basicsBillingSchemaStandardConfigurationService.getStandardConfigForListView().columns);

				platformGridControllerService.initListController($scope, basicsBillingSchemaStandardConfigurationService, basicsBillingSchemaService, basicsBillingSchemaValidationService, myGridConfig);

				//small module should load data when user enter the module
				basicsBillingSchemaService.refresh();
			}
		]);
})(angular);