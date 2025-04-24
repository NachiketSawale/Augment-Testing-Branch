(function () {

	/* global angular, _ */

	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name createInstanceWizardController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('createInstanceWizardController', [
		'globals',
		'_',
		'$q',
		'$scope',
		'$injector',
		'$translate',
		'platformModalService',
		'constructionSystemMainCreateInstanceWizardService',
		function (globals,
			_,
			$q,
			$scope,
			$injector,
			$translate,
			platformModalService,
			constructionSystemMainCreateInstanceWizardService) {

			// region loading status

			$scope.isLoading = false;
			$scope.ok = ok;
			$scope.modifyGlobalParameter = modifyGlobalParameter;

			function ok(model) {
				constructionSystemMainCreateInstanceWizardService.ok(model);
			}

			function modifyGlobalParameter() {
				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/modify-global-parameters-dialog.html',
					backdrop: false,
					headerTextKey: 'constructionsystem.main.createInstanceWizard.modifyGlobalParameter',
					resizeable: true,
					width: '800px',
					height: '600px',
				};
				platformModalService.showDialog(modalOptions);
			}

			function close() {
				$scope.$close();
			}

			function loadingStatusChanged(newStatus) {
				$scope.isLoading = newStatus;
			}

			constructionSystemMainCreateInstanceWizardService.loadingStatusChanged.register(loadingStatusChanged);

			constructionSystemMainCreateInstanceWizardService.close.register(close);

			// endregion

		}
	]);
})();
