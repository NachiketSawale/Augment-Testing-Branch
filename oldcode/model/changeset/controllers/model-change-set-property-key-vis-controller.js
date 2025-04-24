/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.changeset.controller:modelChangeSetPropertyKeyVisController
	 * @description The controller for the cost curve container.
	 */
	angular.module('model.changeset').controller('modelChangeSetPropertyKeyVisController',
		ModelChangeSetPropertyKeyVisController);

	ModelChangeSetPropertyKeyVisController.$inject = ['$scope', '$translate', '_', 'platformDatavisService',
		'modelChangeSetPropertyKeyVisService', 'modelChangeSetPropertyKeyDataService'];

	function ModelChangeSetPropertyKeyVisController($scope, $translate, _, platformDatavisService,
		modelChangeSetPropertyKeyVisService, modelChangeSetPropertyKeyDataService) {

		const visLink = platformDatavisService.initDatavisContainerController($scope, modelChangeSetPropertyKeyVisService, null);

		function updateData(data) {
			if (data.selected) {
				if (data.loaded) {
					$scope.showLoadingOverlay = false;
					$scope.overlayInfo = null;
					visLink.setData(data.summary);
				} else {
					$scope.showLoadingOverlay = true;
					$scope.overlayInfo = null;
				}
			} else {
				$scope.showLoadingOverlay = false;
				$scope.overlayInfo = $translate.instant('model.changeset.changeSetSummary.noSelection');
			}
		}

		modelChangeSetPropertyKeyDataService.registerInfoChanged(updateData);

		$scope.$on('$destroy', function () {
			modelChangeSetPropertyKeyDataService.unregisterInfoChanged(updateData);
		});
	}
})(angular);
