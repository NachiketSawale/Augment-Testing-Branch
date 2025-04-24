(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name procurementCommonDeliveryScheduleFormController
	 * @require $scope, procurementCommonPrcItemDataService, lookupDataService, procurementRequisitionHeaderDataService
	 * @description controller for delivery schedule detail
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonDeliveryScheduleFormController',
		['$scope', 'procurementContextService', 'procurementCommonDeliveryScheduleDataService', 'platformDetailControllerService',
			'procurementCommonDeliveryScheduleValidationService', 'procurementCommonItemdeliveryUIStandardService',
			'platformTranslateService', 'procurementCommonPrcItemDataService', 'procurementCommonHelperService',
			function ($scope, moduleContext, dataServiceFactory, platformDetailControllerService, validationService,
				itemDetailFormConfig, platformTranslateService, procurementCommonPrcItemDataService,
				procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getItemDataService());
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