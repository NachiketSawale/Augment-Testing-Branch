/**
 * Created by lja on 07/15/2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonContactDetailController
	 * @require $scope
	 * @description controller for contact
	 */
	angular.module('procurement.common').controller('procurementCommonContactDetailController',
		['$scope', 'procurementContextService', 'platformDetailControllerService', 'procurementCommonContactDataService',
			'procurementCommonContactValidationService', 'procurementCommonContactUIStandardService', 'platformTranslateService',
			'procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, moduleContext, platformDetailControllerService, dataServiceFactory, validationService, formConfig,
				platformTranslateService, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				validationService = validationService(dataService);

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

				// remove add and delete when module readonly
				if (moduleContext.getModuleReadOnly()) {
					$scope.formContainerOptions.onAddItem = false;
					$scope.formContainerOptions.onDeleteItem = false;
				}

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindFormReadOnlyListener($scope.formOptions.configure);
			}
		]);
})(angular);