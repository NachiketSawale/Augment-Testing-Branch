/**
 * Created by chi on 2/21/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonTextReplacementDialogController', procurementCommonTextReplacementDialogController);

	procurementCommonTextReplacementDialogController.$inject = ['$scope', '$translate', '$http', 'globals'];

	function procurementCommonTextReplacementDialogController($scope, $translate, $http, globals) {

		let hasReplaced = false;
		$scope.modalOptions = $scope.modalOptions || {};
		$scope.modalOptions.width = '1200px';
		$scope.modalOptions.height = '800px';
		$scope.modalOptions.headerText = $translate.instant('procurement.common.replaceDialog.title');
		$scope.modalOptions.beforeReplacement = $translate.instant('procurement.common.replaceDialog.beforeReplacement');
		$scope.modalOptions.afterReplacement = $translate.instant('procurement.common.replaceDialog.afterReplacement');
		$scope.modalOptions.note = $translate.instant('procurement.common.replaceDialog.note');
		$scope.modalOptions.replaceBtn = $translate.instant('procurement.common.replaceDialog.replaceBtn');

		$scope.data = $scope.modalOptions.data;
		$scope.data.replaced = '';
		$scope.modalOptions.ok = ok;
		$scope.modalOptions.cancel = cancel;
		$scope.modalOptions.progress = {
			isReplacing: false,
			info: $translate.instant('procurement.common.replaceDialog.progressInfo')
		};

		function ok() {
			if (hasReplaced) {
				$scope.$close({hasReplaced: true, replaced: $scope.data.replaced});
				return;
			}

			$scope.modalOptions.progress.isReplacing = true;
			let request = {
				ModuleName: $scope.modalOptions.moduleName,
				Source: $scope.data.source,
				QueryItemId: $scope.data.queryItemId,
				TextFormat: $scope.data.textFormat
			};
			$http.post(globals.webApiBaseUrl + 'basics/textmodules/text/operation/replace', request)
				.then(function (response) {
					if (!response) {
						return;
					}

					$scope.data.replaced = response.data;
					hasReplaced = true;
				})
				.finally(function () {
					$scope.modalOptions.progress.isReplacing = false;
					$scope.modalOptions.replaceBtn = $translate.instant('cloud.common.ok');
				});
		}

		function cancel() {
			$scope.$close({hasReplaced: false});
		}
	}

})(angular);