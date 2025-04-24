(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name procurementCommonTotalDetailController
	 * @requires  $scope, $translate, $filter, procurementContractTotalDataService, procurementContractTotalValidationService, procurementcontractTotalColumns, procurementContractHeaderDataService, messengerService, platformTranslateService
	 * @description Controller for total container
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonTotalDetailController',
		['$scope', 'procurementContextService', 'platformDetailControllerService', 'procurementCommonTotalDataService', 'procurementCommonTotalValidationService',
			'procurementCommonTotalUIStandardService', 'platformTranslateService', 'procurementCommonHelperService',
			function ($scope, moduleContext, detailControllerService, dataServiceFactory, validationService, formConfig,
				platformTranslateService, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				validationService = validationService(dataService);
				detailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

				// remove add and delete when module readonly
				if (moduleContext.getModuleReadOnly()) {
					$scope.formContainerOptions.onAddItem = false;
					$scope.formContainerOptions.onDeleteItem = false;
				}

				// register filters
				dataService.registerFilters();

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindFormReadOnlyListener($scope.formOptions.configure);

				/* $scope.$on('$destroy', function () {
					dataService.unregisterFilters();
				}); */
			}
		]);
})(angular);