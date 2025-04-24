/**
 * Created by lvy on 4/12/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterGlobalParameterValueController
	 * @require $scope
	 * @description controller for construction System Master Global Parameter Value Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGlobalParameterValueController',
		['$scope', 'constructionSystemMasterGlobalParameterValueDataService',
			'platformGridControllerService', 'constructionSystemMasterGlobalParameterValueUIStandardService',
			'constructionSystemMasterGlobalParameterValueValidationService', 'constructionSystemMasterGlobalParameterDataService',
			'constructionSystemMasterValidationHelperService',
			function ($scope, globalParameterValueDataService,
				platformGridControllerService, globalParameterValueUIStandardService,
				globalParameterValueValidationService, globalParameterDataService,
				validationHelperService) {
				globalParameterDataService.parameterValidateComplete.register(globalParameterValidationComplete);
				function globalParameterValidationComplete() {
					validationHelperService.updateContainTools($scope,globalParameterValueDataService,true);
					var selectedItem = globalParameterDataService.getSelected();
					if (selectedItem && selectedItem.IsLookup !== true) {
						globalParameterValueDataService.deleteAll();
					}
				}
				platformGridControllerService.initListController($scope, globalParameterValueUIStandardService, globalParameterValueDataService, globalParameterValueValidationService, {});
			}
		]);
})(angular);
