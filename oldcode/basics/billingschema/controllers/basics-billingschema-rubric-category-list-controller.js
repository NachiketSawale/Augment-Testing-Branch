/**
 * Created by chm on 6/8/2015.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').controller('basicsBillingSchemaRubriclCataegoryListController',
		['$scope', 'platformTranslateService', 'platformGridControllerService', 'basicsBillingSchemaRubricCategoryStandardConfigurationService', 'basicsBillingSchemaRubricCategoryService',
			function ($scope, platformTranslateService, platformGridControllerService, basicsBillingSchemaRubricCategoryStandardConfigurationService, basicsBillingSchemaRubricCategoryService) {
				var myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'ParentFk',
					childProp: 'RubricCategories'
				};

				platformTranslateService.translateGridConfig(basicsBillingSchemaRubricCategoryStandardConfigurationService.getStandardConfigForListView().columns);

				$scope.getContainerUUID = function getContainerUUID() {
					return 'AEF895205A3B40DA98736C73594ABC56';
				};

				platformGridControllerService.initListController($scope, basicsBillingSchemaRubricCategoryStandardConfigurationService, basicsBillingSchemaRubricCategoryService, null, myGridConfig);
			}
		]);
})(angular);