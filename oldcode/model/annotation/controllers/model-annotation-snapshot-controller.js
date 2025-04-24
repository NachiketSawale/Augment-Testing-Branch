/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationSnapshotController', modelAnnotationSnapshotController);

	modelAnnotationSnapshotController.$inject = ['$scope', 'modelAnnotationCameraDataService', '$http'];

	function modelAnnotationSnapshotController($scope, modelAnnotationCameraDataService, $http) {

		let hasSelectionChanged = false;

		function selectionChanged() {
			$scope.image = null;
			hasSelectionChanged = true;
			$scope.selectedAnnotation = modelAnnotationCameraDataService.getSelected();

			if ($scope.selectedAnnotation !== null && $scope.selectedAnnotation.FileArchiveDocImageFk !== null) {
				$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + $scope.selectedAnnotation.FileArchiveDocImageFk)
					.then(function (response) {
						if (response.data === null) {
							$scope.image = null;
						} else {
							$scope.image = response.data;
						}
					});
			} else {
				$scope.image = null;
			}
		}

		modelAnnotationCameraDataService.registerSelectionChanged(selectionChanged);

		$scope.$on('$destroy', function () {
			modelAnnotationCameraDataService.unregisterSelectionChanged(selectionChanged);
		});
	}
})(angular);
