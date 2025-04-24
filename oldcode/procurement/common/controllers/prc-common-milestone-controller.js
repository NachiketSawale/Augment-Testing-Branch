(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonMilestoneListController
	 * @require $scope, $rootScope, $filter, procurementCommonMilestoneDataService, procurementCommonMilestoneColumns, slickGridEditors, lookupDataService, procurementCommonMilestoneValidationService
	 * @description controller for milestone
	 */
	angular.module('procurement.common').controller('procurementCommonMilestoneListController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonMilestoneDataService',
			'procurementCommonMilestoneValidationService', 'procurementCommonMilestoneUIStandardService', 'procurementCommonHelperService',
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
			}]
	);

})(angular);