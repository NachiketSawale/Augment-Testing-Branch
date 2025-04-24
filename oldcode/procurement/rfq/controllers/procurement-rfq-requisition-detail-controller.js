(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqRequisitionDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for rfq requisition form container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqRequisitionDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRfqRequisitionService', 'procurementRfqRequisitionUIStandardService', 'platformTranslateService', 'procurementRfqRequisitionValidationService',
			function ($scope, myInitService, dataService, columnsService, translateService, validationService) {

				myInitService.initDetailController($scope, dataService, validationService, columnsService, translateService);

				$scope.formOptions.configure.dirty = function(entity, model){
					if (model === 'ReqHeaderFk' && entity[model] !== -1){
						dataService.resetReqHeadaerToNull(entity);
						(dataService.gridRefresh || angular.noop())();
						return;
					}
					dataService.markCurrentItemAsModified();
					(dataService.gridRefresh || angular.noop())();
				};
			}
		]);
})(angular);