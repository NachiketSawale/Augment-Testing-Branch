(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementChangeOrderDeliveryScheduleListController
	 * @require $rootScope, $scope, procurementCommonDeliveryScheduleDataService, procurementCommonDeliveryscheduleColumns, procurementCommonPrcItemDataService, $q
	 * @description controller for delivery schedule
	 */
	angular.module('procurement.contract').controller('procurementChangeOrderDeliveryScheduleListController',
		['platformGridControllerService', 'platformDetailControllerService', '$translate', '$scope', 'procurementChangeOrderContextService',
			'procurementChangeOrderItemDeliveryScheduleDataService', 'procurementChangeOrderItemDeliveryUIStandardService',
			'procurementCommonDeliveryScheduleValidationService', 'procurementChangeOrderItemDataService',
			'platformTranslateService', 'procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (gridControllerService, platformDetailControllerService, $translate, $scope, moduleContext, dataServiceFactory, uiService, validationService,
				procurementChangeOrderItemDataService, platformTranslateService, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getItemDataService());
				validationService = validationService(dataService);
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);

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