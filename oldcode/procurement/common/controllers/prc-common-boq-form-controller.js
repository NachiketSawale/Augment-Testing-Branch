(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonPrcBoqDetailController
	 * @require $scope, procurementCommonPrcItemDataService, lookupDataService, procurementRequisitionHeaderDataService
	 * @description controller for item detail
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonPrcBoqDetailController',
		['$scope', 'procurementContextService', 'procurementCommonPrcBoqService', 'platformDetailControllerService',
			'procurementCommonPrcBoqValidationService', 'procurementCommonPrcBoqUIStandardService',
			'platformTranslateService', 'procurementCommonHelperService',
			function ($scope, moduleContext, prcBoqMainService, platformDetailControllerService, validationService,
				itemDetailFormConfig, platformTranslateService, procurementCommonHelperService) {

				prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());
				validationService = validationService(prcBoqMainService);
				platformDetailControllerService.initDetailController($scope, prcBoqMainService, validationService, itemDetailFormConfig, platformTranslateService);

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