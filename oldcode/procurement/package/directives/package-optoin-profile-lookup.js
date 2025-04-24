/**
 * Created by alm on 8/18/2022.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).directive('packageOptionProfileLookup', packageOptionProfileLookup);

	packageOptionProfileLookup.$inject = ['$q', '$translate', 'globals', 'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', '$'];

	function packageOptionProfileLookup($q, $translate, globals, platformModalService, LookupDirectiveDefinition, $) {
		var defaults = {
			lookupType: 'optionProfile',
			valueMember: 'Description',
			displayMember: 'Description',
			uuid: '11e8c1f718cd4257947dea0519e9a96a',
			columns: [
				{id: 'ProfileName', field: 'ProfileName', name: 'Profile Name', name$tr$: 'basics.common.dialog.saveProfile.labelProfileName'},
				{id: 'ProfileAccessLevel', field: 'ProfileAccessLevel', name: 'Access Level', name$tr$: 'basics.common.dialog.saveProfile.labelAccessLevel'}
			],
			selectableCallback: function (dataItem, entity, settings) {
				if (!dataItem) {
					return false;
				}
				var service = settings.service;
				var profile = service.getLookupItemByDescription(dataItem.Description);
				return !!profile;
			}
		};

		return new LookupDirectiveDefinition('lookup-edit', defaults, {
			dataProvider: {
				getList: function (options) {
					var deferred = $q.defer();
					var service = options.service;
					deferred.resolve(service.getListForLookup());
					return deferred.promise;
				},
				getItemByKey: function (value, options) {
					var deferred = $q.defer();
					var service = options.service;
					deferred.resolve(service.getLookupItemByDescription(value));
					return deferred.promise;
				}
			},
			controller: ['$scope', function ($scope) {
				var service = $scope.lookupOptions.service;
				$.extend($scope.lookupOptions, {
					buttons: [
						{
							img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
							execute: onEditProfileClicked,
							canExecute: canEditProfile
						}
					],
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							service.setSelectedItem(args.selectedItem);
						}
					}]
				});

				function onEditProfileClicked() {
					let updateOptions = $scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.updateOptions ?
						$scope.$parent.$parent.updateOptions :
						angular.isFunction($scope.lookupOptions.getUpdateOptions) ? $scope.lookupOptions.getUpdateOptions() : {};
					var profile = angular.copy(updateOptions);
					let profileParentDataView = $scope.lookupOptions.dataView;
					showDialog();

					function showDialog() {
						var dlgOptions = {};
						dlgOptions.templateUrl = globals.appBaseUrl + 'procurement.package/templates/option-profile-config-dialog.html';
						dlgOptions.backdrop = false;
						dlgOptions.height = '500px';
						dlgOptions.width = '400px';
						dlgOptions.resizeable = true;
						dlgOptions.gridId = '6D1B7935263D45A088BF1722B9226AB0';
						dlgOptions.controller = 'procurementPackageItemOptionSaveProfileController';
						dlgOptions.resolve = {
							controllerOptions: function () {
								return {
									profile: profile,
									profileParentDataView: profileParentDataView,
									onDelete: function (selected, profileParentDataView) {
										service.delete(selected, profileParentDataView);
									},
									setDefault: function (setDefault) {
										service.default(setDefault);
									},
									type: $scope.lookupOptions.type
								};
							}
						};
						dlgOptions.headerTextKey = $translate.instant('basics.common.uniqueFields.uniqueFielsDialogTitle');
						platformModalService.showDialog(dlgOptions);
					}
				}

				function onDeleteProfileClicked() {
					var profile = service.getSelectedItem();
					var modalOptions = {
						headerTextKey: 'basics.common.deleteDialogTitle',
						bodyTextKey: $translate.instant('basics.common.questionDeleteProfile', {p1: profile.ProfileName}),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.yes) {
							service.delete();
						}
					});
				}

				function canDeleteProfile() {
					return false;
				}

				function canEditProfile() {
					return true;
				}
			}]
		});
	}
})(angular);