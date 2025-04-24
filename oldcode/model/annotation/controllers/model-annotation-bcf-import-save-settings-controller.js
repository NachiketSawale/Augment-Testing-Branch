/*
 * $Id:
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	/**
	 @ngdoc controller
	 * @name modelAnnotationBcfImportSaveSettingsController
	 * @function
	 *
	 * @description
	 * Controller for the Bcf Import Save Settings view.
	 */

	const moduleName = 'model.annotation';
	angular.module(moduleName).controller('modelAnnotationBcfImportSaveSettingsController', modelAnnotationBcfImportSaveSettingsController);

	modelAnnotationBcfImportSaveSettingsController.$inject = ['$scope', '_', 'platformTranslateService', 'basicsCommonConfigLocationListService',
		'cloudDesktopSidebarService', '$translate', 'cloudDesktopBulkSearchDataService', '$http', 'globals'];

	function modelAnnotationBcfImportSaveSettingsController($scope, _, platformTranslateService, basicsCommonConfigLocationListService,
		cloudDesktopSidebarService, $translate, cloudDesktopBulkSearchDataService, $http, globals) {

		$scope.selections = {
			selectedProfile: null,
			selectedType: null,
		};

		$scope.viewTypes = basicsCommonConfigLocationListService.createItems({user: true, role: true, system: true});
		$scope.selections.selectedType = $scope.viewTypes[0];

		platformTranslateService.registerModule(['cloud.common', 'basics.common']);

		function selectProfile() {
			const profilesInBox = $scope.displayedProfiles;
			let inputText = null;
			if ($scope.selections.inputView) {
				$scope.dialog.modalOptions.value.resultData = $scope.selections.inputView.DescriptionInfo.Description;
				inputText = $scope.selections.inputView;
				profilesInBox.forEach(function (profile) {
					if (inputText.DescriptionInfo.Description !== '' && profile.DescriptionInfo.Description.toLowerCase()
						=== (inputText.DescriptionInfo.Description.toLowerCase())) {
						$scope.selections.selectedProfile = profile;
						$scope.selections.inputView = angular.copy($scope.selections.selectedProfile);
					} else {
						$scope.selections.selectedProfile = null;
					}
				});
			}
		}

		function updateList() {
			const selectedType = $scope.selections.selectedType.id;
			$http.post(globals.webApiBaseUrl + 'model/annotation/importprf/byaccesslevel', {accessLevel: selectedType}).then(function (response) {
				const profiles = response.data;
				_.each(profiles, function (profile) {
					profile.dialogName = profile.DescriptionInfo.Description;
				});
				$scope.displayedProfiles = profiles;

			});
		}

		$scope.selectedProfileChanged = function () {
			$scope.dialog.modalOptions.value.resultData = $scope.selections.selectedProfile;
			$scope.selections.inputView = angular.copy($scope.selections.selectedProfile);
		};

		$scope.selectedTypeChanged = function () {
			$scope.selections.inputView = null;
			updateList();
		};

		$scope.inputChanged = function () {
			selectProfile();
		};

		$scope.deleteProfile = function () {
			const profile = $scope.selections.selectedProfile.Id;
			$http.post(globals.webApiBaseUrl + 'model/annotation/importprf/deleteProfile', {Id: profile}).then(function () {
				updateList();
				$scope.selections.inputView = null;
			});
		};

		$scope.selectedTypeChanged();
	}
})(angular);
