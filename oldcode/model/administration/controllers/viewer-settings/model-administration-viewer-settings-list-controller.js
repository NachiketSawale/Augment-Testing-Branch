/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationViewerSettingsListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of the viewer settings container.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationViewerSettingsListController',
		ModelAdministrationViewerSettingsListController);

	ModelAdministrationViewerSettingsListController.$inject = ['$scope', '$translate',
		'platformContainerControllerService', 'modelAdministrationViewerSettingsDataService', 'platformGridAPI'];

	function ModelAdministrationViewerSettingsListController($scope, $translate, platformContainerControllerService,
		modelAdministrationViewerSettingsDataService, platformGridAPI) {

		platformContainerControllerService.initController($scope, moduleName, 'f7d7913423cc4bf2824e8f13449ec482');

		$scope.addTools([{
			id: 'createCopy',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-new-copy',
			caption: 'model.administration.viewerSettings.copyCreate',
			fn: function () {
				const selProfile = modelAdministrationViewerSettingsDataService.getSelected();
				if (selProfile) {
					platformGridAPI.grids.commitAllEdits();
					return modelAdministrationViewerSettingsDataService.createItem({
						copyCreateFromProfileId: selProfile.Id
					});
				}
			},
			disabled: function () {
				return !modelAdministrationViewerSettingsDataService.getSelected();
			}
		}, {
			id: 'setDefault',
			type: 'item',
			iconClass: 'tlb-icons ico-view-profile-default',
			caption: 'model.administration.viewerSettings.setDefault',
			fn: function () {
				modelAdministrationViewerSettingsDataService.markSelectedAsDefault();
				$scope.getUiAddOns().getAlarm().show($translate.instant('model.administration.viewerSettings.defaultSet'));
			},
			disabled: function () {
				const selProfile = modelAdministrationViewerSettingsDataService.getSelected();
				return !selProfile ||selProfile.IsDefault;
			}
		}, {
			id: 'setActive',
			type: 'item',
			iconClass: 'tlb-icons ico-view-profile-active',
			caption: 'model.administration.viewerSettings.setActive',
			fn: function () {
				modelAdministrationViewerSettingsDataService.markSelectedAsActive();
				$scope.getUiAddOns().getAlarm().show($translate.instant('model.administration.viewerSettings.activeSet'));
			},
			disabled: function () {
				const selProfile = modelAdministrationViewerSettingsDataService.getSelected();
				return !selProfile || selProfile.Active;
			}
		}]);

		function updateTools() {
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		modelAdministrationViewerSettingsDataService.registerSelectionChanged(updateTools);
		$scope.$on('$destroy', function () {
			modelAdministrationViewerSettingsDataService.unregisterSelectionChanged(updateTools);
		});
	}
})(angular);
