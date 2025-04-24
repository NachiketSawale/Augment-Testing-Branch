(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonCertificatesFormController
	 * @require $scope, procurementCommonPrcItemDataService, lookupDataService, procurementRequisitionHeaderDataService
	 * @description controller for item detail
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonCertificatesFormController',
		['$scope', 'procurementContextService', 'procurementCommonCertificateNewDataService', 'platformDetailControllerService',
			'procurementCommonCertificatesValidationService', 'procurementCommonHelperService',
			'procurementCommonCertificateUIStandardService', 'platformTranslateService',
			function ($scope, moduleContext, dataServiceFactory,
				platformDetailControllerService, validationService, procurementCommonHelperService,
				itemDetailFormConfig, platformTranslateService) {

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

				// remove add and delete when module readonly
				if (moduleContext.getModuleReadOnly()) {
					$scope.formContainerOptions.onAddItem = false;
					$scope.formContainerOptions.onDeleteItem = false;
				}
			}]);
})(angular);