/**
 * Created by wed on 9/11/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonItemBoqPrintSaveProfileController', [
		'_',
		'$scope',
		'$modalInstance',
		'$translate',
		'moment',
		'platformGridAPI',
		'platformObjectHelper',
		'platformModalService',
		'platformUserInfoService',
		'procurementPriceComparisonItemConfigService',
		'procurementPriceComparisonBoqConfigService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintProfileService',
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
			itemConfigService,
			boqConfigService,
			commonService,
			printSettingService,
			constants,
			profileService,
			controllerOptions) {

			var locations = [
				{
					name: $translate.instant('basics.common.configLocation.user'),
					value: constants.profileSaveType.user
				},
				{
					name: $translate.instant('basics.common.configLocation.role'),
					value: constants.profileSaveType.role
				},
				{
					name: $translate.instant('basics.common.configLocation.system'),
					value: constants.profileSaveType.system
				}
			];
			var locationFilters = {
				'1': function (item) {
					return !!item.FrmUserFk;
				},
				'2': function (item) {
					return !!item.FrmAccessRoleFk;
				},
				'3': function (item) {
					return item.IsSystem;
				}
			};

			$scope.isLoading = false;

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.printing.saveProfile'),
				locationText: $translate.instant('procurement.pricecomparison.printing.saveLocation'),
				availableProfilesText: $translate.instant('procurement.pricecomparison.printing.availableProfiles'),
				saveProfileNameText: $translate.instant('procurement.pricecomparison.printing.saveProfileName'),
				deleteButtonText: $translate.instant('cloud.common.delete'),
				defaultButtonText: $translate.instant('basics.common.button.default'),
				actionButtonText: $translate.instant('basics.common.button.ok'),
				closeButtonText: $translate.instant('basics.common.button.cancel'),
				ok: function () {
					var profile = $scope.profileOptions.selectedItem && $scope.profileOptions.selectedItem.Description === $scope.profileOptions.profileName ? $scope.profileOptions.selectedItem
						: {
							RfqHeaderFk: controllerOptions.profileType === constants.profileType.generic ? null : controllerOptions.rfqHeaderId,
							Description: $scope.profileOptions.profileName,
							ProfileType: controllerOptions.profileType
						};
					profile.PropertyConfig = JSON.stringify(processSorting(controllerOptions.profile));
					$scope.isLoading = true;
					profileService.saveProfile($scope.locationOptions.selectedItem.value, [profile]).then(function () {
						$scope.modalOptions.cancel({ok: true});
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				delete: function () {
					$scope.isLoading = true;
					var selectedId = $scope.profileOptions.selectedItem.Id;
					profileService.deleteProfile(selectedId).then(function () {
						loadProfiles();
						if (angular.isFunction(controllerOptions.onDelete)) {
							controllerOptions.onDelete(selectedId, controllerOptions.profileType);
						}
						$scope.profileOptions.profileName = '';
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				default: function () {
					$scope.isLoading = true;
					profileService.setDefault($scope.profileOptions.selectedItem.Id, $scope.locationOptions.selectedItem.value).then(function () {
						loadProfiles($scope.profileOptions.selectedItem);
						if (angular.isFunction(controllerOptions.setDefault)) {
							controllerOptions.setDefault($scope.profileOptions.selectedItem.Id, controllerOptions.profileType);
						}
					}).finally(function () {
						$scope.isLoading = false;
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
					return !$scope.profileOptions.selectedItem || $scope.profileOptions.selectedItem.IsDefault || $scope.locationOptions.selectedItem.value === constants.profileSaveType.user;
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
						this.profileName = this.selectedItem.Description;
					}
				}
			};

			function loadProfiles(selectedItem) {
				var getPromise = null;
				switch (controllerOptions.profileType) {
					case  constants.profileType.generic:
						getPromise = profileService.getGenericProfiles(true);
						break;
					case  constants.profileType.item:
						getPromise = profileService.getRfqItemProfiles(controllerOptions.rfqHeaderId, true);
						break;
					case  constants.profileType.boq:
						getPromise = profileService.getRfqBoqProfiles(controllerOptions.rfqHeaderId, true);
						break;
				}
				$scope.isLoading = true;
				if (getPromise !== null) {
					getPromise.then(function (items) {
						var profiles = _.filter(items, function (item) {
							return item.Description !== null && locationFilters[$scope.locationOptions.selectedItem.value].call(null, item);
						});
						_.forEach(profiles, function (profile) {
							var userName = platformUserInfoService.logonName(profile.UpdatedBy || profile.InsertedBy);
							var extStr;

							if (userName) {
								extStr = userName + ' | ' + moment(profile.UpdatedAt || profile.InsertedAt).format('L | LTS');
								profile.dialogName = profile.Description + ' (' + extStr + ')' + (profile.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
							} else {
								profile.dialogName = profile.Description + ' ( loading ...)';

								platformUserInfoService.loadUsers([profile.UpdatedBy || profile.InsertedBy])
									.then(function () {
										userName = platformUserInfoService.logonName(profile.UpdatedBy || profile.InsertedBy);
										extStr = userName + ' | ' + moment(profile.UpdatedAt || profile.InsertedAt).format('L | LTS');
										profile.dialogName = profile.Description + ' (' + extStr + ')' + (profile.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
									});
							}
						});
						$scope.profileOptions.items = profiles;
						if (selectedItem) {
							$scope.profileOptions.selectedItem = _.find(profiles, {Id: selectedItem.Id});
						} else {
							$scope.profileOptions.selectedItem = null;
						}
						$scope.isLoading = false;
					});
				}
			}

			function processSorting(profile){
				if (profile.row){
					if (profile.row.boq){
						sortingItemBoqFields(profile.row.boq);
					}
					if (profile.row.item){
						sortingItemBoqFields(profile.row.item);
					}
				}
				return profile;
			}

			function sortingItemBoqFields(profileRowItemBoq){
				profileRowItemBoq.billingSchemaFields = rankBySorting(profileRowItemBoq.billingSchemaFields);
				profileRowItemBoq.itemFields = rankBySorting(profileRowItemBoq.itemFields);
				profileRowItemBoq.quoteFields = rankBySorting(profileRowItemBoq.quoteFields);
			}

			function rankBySorting(fields){
				return _.map(fields, function (field, index){
					field.Sorting = index + 1;
					return field;
				});
			}

			loadProfiles();
		}
	]);
})(angular);