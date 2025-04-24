(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonSubcontractorFormController
	 * @require $scope, lookupDataService, procurementRequisitionHeaderDataService
	 * @description controller for Subcontractor
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonSubcontractorFormController',
		['$scope', 'procurementContextService', 'procurementCommonSubcontractorDataService', 'platformDetailControllerService',
			'procurementCommonSubcontractorValidationDataService', 'procurementCommonSubcontractorUIStandardService',
			'procurementCommonHelperService', 'platformTranslateService',
			function ($scope, moduleContext, dataServiceFactory, platformDetailControllerService, validationService,
				detailFormConfig, procurementCommonHelperService, platformTranslateService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService());
				validationService = validationService(dataService);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, detailFormConfig, platformTranslateService);

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