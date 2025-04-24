(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name procurementCommonMilestoneFormController
	 * @require $scope, procurementCommonPrcItemDataService, lookupDataService, procurementRequisitionHeaderDataService
	 * @description controller for item detail
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonMilestoneFormController',
		['$scope', 'procurementContextService', 'procurementCommonMilestoneDataService', 'platformDetailControllerService',
			'procurementCommonMilestoneValidationService', 'procurementCommonMilestoneUIStandardService',
			'platformTranslateService', 'procurementCommonHelperService',
			function ($scope, moduleContext, dataServiceFactory, platformDetailControllerService, validationService,
				itemDetailFormConfig, platformTranslateService, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService());
				validationService = validationService(dataService);
				platformDetailControllerService.initDetailController($scope, dataService, validationService, itemDetailFormConfig, platformTranslateService);

				// remove add and delete when module readonly
				if (moduleContext.getModuleReadOnly()) {
					$scope.formContainerOptions.onAddItem = false;
					$scope.formContainerOptions.onDeleteItem = false;
				}

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindFormReadOnlyListener($scope.formOptions.configure);
			}]);
})(angular);