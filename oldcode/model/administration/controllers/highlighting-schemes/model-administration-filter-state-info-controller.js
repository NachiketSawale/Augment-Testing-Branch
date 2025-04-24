/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationFilterStateInfoController
	 * @function
	 *
	 * @description
	 * Controller for the filter state info container.
	 **/
	angular.module(moduleName).controller('modelAdministrationFilterStateInfoController',
		modelAdministrationFilterStateInfoController);

	modelAdministrationFilterStateInfoController.$inject = ['$scope', '$translate', '_',
		'modelAdministrationStaticHlItemDataService', 'modelAdministrationFilterStateDataService'];

	function modelAdministrationFilterStateInfoController($scope, $translate, _,
		modelAdministrationStaticHlItemDataService, modelAdministrationFilterStateDataService) {

		function showOverlay(message) {
			if (message) {
				$scope.showInfoOverlay = true;
				$scope.overlayInfo = message;
			} else {
				$scope.showInfoOverlay = false;
				$scope.overlayInfo = null;
			}
		}

		function showLoadingMessage(message) {
			if (message) {
				$scope.isLoading = true;
				$scope.info2 = message;
			} else {
				$scope.isLoading = false;
				$scope.info2 = null;
			}
		}

		let filterStates = null;

		function updateFilterStates() {
			filterStates = modelAdministrationFilterStateDataService.getList();
			updateOutput();
		}

		function updateOutput() {
			const selStaticHlItem = modelAdministrationStaticHlItemDataService.getSelected();
			if (selStaticHlItem) {
				showOverlay(false);
				if (filterStates) {
					const fs = _.find(filterStates, function (state) {
						return state.Id === selStaticHlItem.FilterStateFk;
					});
					if (fs) {
						$scope.outputTitle = fs.DescriptionInfo ? fs.DescriptionInfo.Translated : '';
						$scope.outputText = fs.RemarkInfo ? fs.RemarkInfo.Translated : '';
						showLoadingMessage(false);
						return;
					}
				}

				showLoadingMessage('model.administration.loadingFilterStates');
			}

			showLoadingMessage(false);
			showOverlay($translate.instant('model.administration.noStaticHlItemSelected'));
		}

		updateOutput();

		modelAdministrationFilterStateDataService.load();
		modelAdministrationStaticHlItemDataService.registerSelectionChanged(updateOutput);
		modelAdministrationFilterStateDataService.registerListLoaded(updateFilterStates);

		$scope.$on('$destroy', function () {
			modelAdministrationFilterStateDataService.unregisterListLoaded(updateFilterStates);
			modelAdministrationStaticHlItemDataService.unregisterSelectionChanged(updateOutput);
		});
	}
})(angular);
