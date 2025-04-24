/**
 * Created on 11/9/2014.
 */
(function (angular) {
	'use strict';
	/* jshint -W072*/ //many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialCharacteristicController
	 * @require $scope, $translate, platformGridControllerBase, basicsMaterialCharacteristicGridColumns, basicsMaterialCharacteristicService, $filter, platformTranslateService,basicsMaterialCharacteristicValidationService
	 * @description controller for basics material characteristic
	 */
	angular.module('basics.material').controller('basicsMaterialCharacteristicController',
		['$scope', 'platformGridControllerService', 'basicsMaterialCharacteristicStandardConfigurationService',
			'basicsMaterialCharacteristicService', 'basicsMaterialCharacteristicValidationService',

			function ($scope, gridControllerService, gridColumns, dataService, validationService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]);
})(angular);