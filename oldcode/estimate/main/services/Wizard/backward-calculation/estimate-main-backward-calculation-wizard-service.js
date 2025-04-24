
(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBackwardCalculationWizardService
	 * @function
	 * @requires $q
	 * @description
	 */
	angular.module(moduleName).factory('estimateMainBackwardCalculationWizardService', ['$q', '$http', '$injector', 'platformModalService','estimateMainBackwardCalculationController',
		function ($q, $http, $injector, platformModalService,estimateMainBackwardCalculationController) {
			let service = {};

			service.showBackwardWizardDialog = function () {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/backward-calculation/estimate-main-backward-calculation-dialog.html',
					controller: ['$scope', '$injector', '$translate', 'estimateMainBackwardCalculationUIService',estimateMainBackwardCalculationController],
					backdrop: false,
					windowClass: 'form-modal-dialog',
					width: '700px',
					height: '650px',
					resizeable: true
				});
			};
			return service;
		}]);
})();
