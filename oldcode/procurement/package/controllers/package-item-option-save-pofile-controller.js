/**
 * Created by alm on 8/25/2022.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemOptionSaveProfileController', [
		'_', '$q',
		'$scope',
		'$modalInstance',
		'$translate',
		'moment',
		'platformGridAPI',
		'platformObjectHelper',
		'platformModalService',
		'platformUserInfoService',
		'packageOptionsProfileService',
		'controllerOptions',
		function (_, $q,
			$scope,
			$modalInstance,
			$translate,
			moment,
			platformGridAPI,
			platformObjectHelper,
			platformModalService,
			platformUserInfoService,
			profileService,
			controllerOptions
		) {

			var profileSaveType = {
				user: 'User',
				system: 'System'
			};
			var locations = [
				{
					name: $translate.instant('basics.common.configLocation.user'),
					value: profileSaveType.user
				},
				{
					name: $translate.instant('basics.common.configLocation.system'),
					value: profileSaveType.system
				}
			];
			$scope.isLoading = false;
			$scope.modalOptions = {
				headerText: $translate.instant('procurement.package.saveProfile'),
				locationText: $translate.instant('procurement.package.saveLocation'),
				availableProfilesText: $translate.instant('procurement.package.availableProfiles'),
				saveProfileNameText: $translate.instant('procurement.package.saveProfileName'),
				deleteButtonText: $translate.instant('cloud.common.delete'),
				defaultButtonText: $translate.instant('basics.common.button.default'),
				actionButtonText: $translate.instant('basics.common.button.ok'),
				closeButtonText: $translate.instant('basics.common.button.cancel'),
				ok: function () {
					if ($scope.profileOptions.selectedItem) {//not add
						validateProfile($scope.profileOptions.selectedItem);
						$scope.modalOptions.cancel({ok: true});
					} else {//new data
						let profile = {};
						profile.ProfileName = $scope.profileOptions.profileName;
						profile.ProfileAccessLevel = $scope.locationOptions.selectedItem.value;
						controllerOptions.profile.optionProfile = profileService.getDescription(profile);
						profile.PropertyConfig = JSON.stringify(controllerOptions.profile);
						profile.Type = controllerOptions.type;
						profileService.saveProfile(profile).then(function (response) {
							if (response.data) {
								validateProfile(response.data);
							}
							$scope.modalOptions.cancel({ok: true});
						});
					}
				},
				delete: function () {
					var selectedItem = $scope.profileOptions.selectedItem;
					profileService.deleteProfile(selectedItem).then(function () {
						loadProfiles();
						if (angular.isFunction(controllerOptions.onDelete)) {
							controllerOptions.onDelete(selectedItem, controllerOptions.profileParentDataView);
						}
						$scope.profileOptions.profileName = '';
					});
				},
				default: function () {
					var selectedItem = $scope.profileOptions.selectedItem;
					profileService.setDefault(selectedItem).then(function () {
						loadProfiles(selectedItem);
						if (angular.isFunction(controllerOptions.setDefault)) {
							controllerOptions.setDefault(selectedItem);
							$scope.profileOptions.profileName = selectedItem.ProfileName;
						}
					});
				},
				cancel: function (result) {
					if (result && result.ok) {
						$modalInstance.close(result);
					} else {
						$modalInstance.dismiss('cancel');
					}
				}
			};

			$scope.buttonOptions = {
				disableOkay: function () {
					let profileName = $scope.profileOptions.profileName;
					return (_.some($scope.profileOptions.items, ['ProfileName', profileName]) && $scope.profileOptions.selectedItem === null) || profileName === '';
				},
				disableDefault: function () {
					return !$scope.profileOptions.selectedItem || $scope.profileOptions.selectedItem.IsDefault || $scope.locationOptions.selectedItem.value === profileSaveType.user;
				},
				disableDelete: function () {
					return !$scope.profileOptions.selectedItem;
				}
			};

			$scope.locationOptions = {
				selectedItem: locations[0],
				items: locations,
				onSelectChanged: function () {
					$scope.profileOptions.selectedItem = null;
					$scope.profileOptions.profileName = '';
					loadProfiles();
				}
			};

			$scope.profileOptions = {
				profileName: '',
				selectedItem: null,
				isShowTitle: false,
				items: null,
				onSelectChanged: function () {
					if (this.selectedItem) {
						this.profileName = this.selectedItem.ProfileName;
					}
				}
			};

			function loadProfiles(selectedItem) {
				var defer = $q.defer();
				profileService.getProfile(controllerOptions.type).then(function (response) {
					var items = response.data;
					var profiles = _.filter(items, function (item) {
						return item.ProfileName !== null && item.ProfileAccessLevel === $scope.locationOptions.selectedItem.value;
					});
					_.forEach(profiles, function (profile) {
						profile.dialogName = profile.ProfileName + (profile.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
					});
					$scope.profileOptions.items = profiles;
					if (selectedItem) {
						$scope.profileOptions.selectedItem = _.find(profiles, {ProfileName: selectedItem.ProfileName});
					} else {
						$scope.profileOptions.selectedItem = null;
					}
					defer.resolve(true);
				});
				return defer.promise;
			}

			function validateProfile(item) {
				var profile1 = {};
				profile1.ProfileName = item.ProfileName;
				profile1.ProfileAccessLevel = item.ProfileAccessLevel;
				profile1.PropertyConfig = item.PropertyConfig;
				profile1.Description = profileService.getDescription(profile1);
				let pushData = profileService.updateList(profile1);

				profileService.setSelectedItemDesc(profile1.Description);
				profileService.setSelectedItem(profile1);

				if (pushData) {
					controllerOptions.profileParentDataView.dataCache.isLoaded = false;
					controllerOptions.profileParentDataView.loadData();
				}
			}

			loadProfiles();
		}
	]);
})(angular);