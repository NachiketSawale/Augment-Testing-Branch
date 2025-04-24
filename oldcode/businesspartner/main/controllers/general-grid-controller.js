/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainGeneralsGridController',
		['$scope', 'platformGridControllerService', 'businessPartnerMainGeneralsDataService', 'businessPartnerMainGeneralsValidationService', 'businessPartnerMainGeneralsUIStandardService',
			function ($scope, platformGridControllerService, dataService, validationService, gridColumns) {

				var gridConfig = {
					initCalled: false, columns: []
				};

				platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
			}]);
})(angular);