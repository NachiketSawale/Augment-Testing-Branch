(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainGenerateEstimateOptionSaveProfileController', [
		'_',
		'$scope',
		'$modalInstance',
		'$translate',
		'moment',
		'platformGridAPI',
		'platformObjectHelper',
		'platformModalService',
		'platformUserInfoService',
		'estimateMainGenerateEstimateOptionProfileService',
		'controllerOptions',
		function (_,
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

			let profileSaveType= {
				user: 'User',
				system: 'System'
			};
			let locations = [
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
				actionButtonText: $translate.instant('procurement.common.profileOption.ok'),
				closeButtonText: $translate.instant('basics.common.button.cancel'),
				ok: function () {
					let profile={};
					profile.ProfileName=$scope.profileOptions.profileName;
					profile.ProfileAccessLevel=$scope.locationOptions.selectedItem.value;
					controllerOptions.profile.optionProfile=profileService.getDescription(profile);
					profile.GroupKey = profileService.getSaveGroupKey();
					profile.AppId = profileService.getSaveAppId();
					profile.PropertyConfig = JSON.stringify(controllerOptions.profile);
					profile.IsDefault = !!$scope.profileOptions.selectedItem && $scope.profileOptions.selectedItem.IsDefault;
					profileService.saveProfile(profile).then(function (response) {
						if(response.data) {
							let item=response.data;
							let profile1={};
							profile1.ProfileName =item.ProfileName;
							profile1.ProfileAccessLevel =item.ProfileAccessLevel;
							profile1.PropertyConfig=item.PropertyConfig;
							profile1.Description=profileService.getDescription(profile1);
							let pushData = profileService.updateList(profile1);

							profileService.setSelectedItemDesc(profile1.Description);
							profileService.setSelectedItem(profile1);

							if(pushData){
								controllerOptions.profileParentDataView.dataCache.isLoaded = false;
								controllerOptions.profileParentDataView.loadData();
							}
						}
						$scope.modalOptions.cancel({ok: true});
					});
				},
				delete: function () {
					let selectedItem = $scope.profileOptions.selectedItem;
					profileService.deleteProfile(selectedItem).then(function () {
						loadProfiles();
						if (angular.isFunction(controllerOptions.onDelete)) {
							controllerOptions.onDelete(selectedItem,controllerOptions.profileParentDataView);
						}
						$scope.profileOptions.profileName = '';
					});
				},
				default: function () {
					let selectedItem= $scope.profileOptions.selectedItem;
					_.forEach($scope.profileOptions.items,function (item) {
						item.IsDefault = false;
					});

					profileService.setDefault(selectedItem).then(function () {
						loadProfiles(selectedItem);
						if (angular.isFunction(controllerOptions.setDefault)) {
							controllerOptions.setDefault(selectedItem);
							$scope.profileOptions.profileName = '';
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
					return $scope.profileOptions.profileName === '';
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
					$scope.profileOptions.profileName='';
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
				let requestParam = {
					GroupKey: profileService.getSaveGroupKey(),
					AppId: profileService.getSaveAppId()
				};
				profileService.getProfile(requestParam).then(function (response) {
					let items=response.data;
					let profiles = _.filter(items, function (item) {
						return item.ProfileName !== null && item.ProfileAccessLevel===$scope.locationOptions.selectedItem.value;
					});
					_.forEach(profiles, function(profile){
						profile.dialogName = profile.ProfileName + (profile.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
					});
					$scope.profileOptions.items = profiles;
					if (selectedItem) {
						$scope.profileOptions.selectedItem = _.find(profiles, {Id: selectedItem.Id});
					} else {
						$scope.profileOptions.selectedItem = null;
					}
				});

			}
			loadProfiles();
		}
	]);
})(angular);