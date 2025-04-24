/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.changeset.controller:modelChangeSetSummaryVisController
	 * @description The controller for the visual model change set summary container.
	 */
	angular.module('model.changeset').controller('modelChangeSetSummaryVisController',
		ModelChangeSetSummaryVisController);

	ModelChangeSetSummaryVisController.$inject = ['$scope', '$translate', '_', 'platformDatavisService',
		'modelChangeSetSummaryVisService', 'modelChangeSetSummaryDataService'];

	function ModelChangeSetSummaryVisController($scope, $translate, _, platformDatavisService,
		modelChangeSetSummaryVisService, modelChangeSetSummaryDataService) {

		const visLink = platformDatavisService.initDatavisContainerController($scope, modelChangeSetSummaryVisService, null);

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

		modelChangeSetSummaryDataService.registerInfoChanged(updateData);

		$scope.$on('$destroy', function () {
			modelChangeSetSummaryDataService.unregisterInfoChanged(updateData);
		});
	}
})(angular);
