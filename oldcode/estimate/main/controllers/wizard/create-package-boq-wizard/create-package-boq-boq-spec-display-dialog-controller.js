/**
 * Created by chi on 8/14/2024.
 */
(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainCreatePackageBoqBoqSpecDisplayDialogController', estimateMainCreatePackageBoqBoqSpecDisplayDialogController);

	estimateMainCreatePackageBoqBoqSpecDisplayDialogController.$inject = ['$scope', '$translate', '$http', 'globals'];

	function estimateMainCreatePackageBoqBoqSpecDisplayDialogController($scope, $translate, $http, globals) {
		$scope.isLoading = false;
		$scope.isLoadingInfo = $translate.instant('platform.processing');
		$scope.modalOptions = $scope.modalOptions || {
			data: {}
		};
		$scope.modalOptions.headerText = $translate.instant('estimate.main.boqSpecification');

		if ($scope.modalOptions.data.specContent === undefined && angular.isNumber($scope.modalOptions.data.BasBlobsSpecificationFk)) {
			$scope.isLoading = true;
			$http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + $scope.modalOptions.data.BasBlobsSpecificationFk)
				.then(function (response) {
					if (response && response.data) {
						$scope.modalOptions.data.specContent = response.data.Content;
					}
				})
				.finally(function () {
					$scope.isLoading = false;
				});
		}
	}

})();