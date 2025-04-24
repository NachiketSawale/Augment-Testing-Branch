/**
 * Created by aljami on 16.11.2020.
 */

((angular) => {
	'use strict';

	const moduleName = 'basics.biplusdesigner';

	/**
	 * @ngdoc controller
	 * @name basicsBiPlusDesignerImportDialogController
	 * @function
	 *
	 * @description
	 * Controller for the import dashboard dialog
	 **/
	angular.module(moduleName).controller('basicsBiPlusDesignerImportDialogController', basicsBiPlusDesignerImportDialogController);

	basicsBiPlusDesignerImportDialogController.$inject = ['$scope', '$translate', '_', '$http', 'basicsBiPlusDesignerService', 'globals'];

	function basicsBiPlusDesignerImportDialogController($scope, $translate, _, $http, basicsBiPlusDesignerService, globals) {

		function onExecuteBtnClick() {
			const data = {
				url: globals.dashboard.url
			};

			$scope.loading = true;

			return $http.post(globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard/import', data)
				.then((result) => {
					$scope.loading = false;
					$scope.displayInfo = false;
					prepareOutput(result.data);
					basicsBiPlusDesignerService.read();
				})
				.catch((result) => {
					$scope.loading = false;
					$scope.displayInfo = false;
					showError();
				});
		}

		const executeBtn = {
			id: 'execute',
			caption: $translate.instant('basics.biplusdesigner.import.btnExecuteImport'),
			fn: onExecuteBtnClick,
			disabled: () => $scope.loading || !$scope.displayInfo
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('basics.biplusdesigner.import.btnCancel'),
			fn: () => $scope.$close(),
			disabled: () => $scope.loading
		};

		function prepareOutput(importResult) {
			$scope.data = importResult; // prepare
			$scope.notificationText = $translate.instant('basics.biplusdesigner.import.successText');
		}

		function showError() {
			$scope.notificationText = $translate.instant('basics.biplusdesigner.import.errorText');
		}

		$scope.displayInfo = true;
		$scope.instructionText = $translate.instant('basics.biplusdesigner.import.instructionsText');
		$scope.warningText = $translate.instant('basics.biplusdesigner.import.warningText');
		$scope.message = $translate.instant('basics.biplusdesigner.import.loadingMessage');
		$scope.loading = false;
		$scope.data = [];
		$scope.statTitle = $translate.instant('basics.biplusdesigner.import.dialogTitle');
		$scope.notificationText = '';
		$scope.dialog.buttons = [executeBtn, cancelBtn];
	}
})(angular);
