/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationRemarkController',
		modelAnnotationRemarkController);

	modelAnnotationRemarkController.$inject = ['$scope', 'modelAnnotationDataService',];

	function modelAnnotationRemarkController($scope, modelAnnotationDataService) {

		let hasSelectionChanged = false;

		function selectionChanged() {
			hasSelectionChanged = true;
			$scope.selectedAnnotation = modelAnnotationDataService.getSelected();
		}

		$scope.onChange = function () {
			if (hasSelectionChanged) {
				hasSelectionChanged = false;
			} else {
				modelAnnotationDataService.markItemAsModified($scope.selectedAnnotation);
			}
		};

		$scope.textareaEditable = () => Boolean(modelAnnotationDataService.getSelected());

		modelAnnotationDataService.registerSelectionChanged(selectionChanged);

		selectionChanged();

		$scope.$on('$destroy', function () {
			modelAnnotationDataService.unregisterSelectionChanged(selectionChanged);
		});

	}
})(angular);
