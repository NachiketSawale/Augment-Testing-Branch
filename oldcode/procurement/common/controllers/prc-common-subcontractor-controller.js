/**
 * Created by lja on 07/21/2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonSubcontractorListController
	 * @require $scope
	 * @description controller for SubContractor
	 */
	angular.module('procurement.common').controller('procurementCommonSubcontractorListController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonSubcontractorDataService',
			'procurementCommonSubcontractorValidationDataService', 'procurementCommonSubcontractorUIStandardService','procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns, procurementCommonHelperService) {

				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(moduleContext.getMainService());

				validationService = validationService(dataService);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
				});
			}]);


})(angular);