(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc controller
	 * @name procurementPesHeaderController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of header.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.pes').controller('procurementPesBoqController',
		['$scope', '$translate', 'prcBoqMainService', 'procurementPesBoqService', 'platformGridControllerService', 'procurementPesBoqUIStandardService',
			'procurementPesBoqValidationService',
			function ($scope, $translate, prcBoqMainService, procurementPesBoqService, platformGridControllerService, procurementPesBoqUIStandardService,
				procurementPesBoqValidationService) {

				platformGridControllerService.initListController($scope, procurementPesBoqUIStandardService, procurementPesBoqService, procurementPesBoqValidationService(procurementPesBoqService.name, procurementPesBoqService), {});
				$scope.isLoading = procurementPesBoqService.getEntityCreatingStatus();
				$scope.loadingText = $translate.instant('procurement.common.createStatusTest');
				procurementPesBoqService.entityCreating.register(onEntityCreating);

				$scope.$on('$destroy', function () {
					procurementPesBoqService.entityCreating.unregister(onEntityCreating);
				});

				// ////////////////////

				function onEntityCreating(e, isCreating) {
					$scope.isLoading = isCreating;
				}
			}
		]);
})(angular);