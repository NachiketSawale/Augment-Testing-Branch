/**
 * Created by chi on 5/31/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonUniqueFieldsProfileLookup', basicsCommonUniqueFieldsProfileCombobox);

	basicsCommonUniqueFieldsProfileCombobox.$inject = ['$q', '$translate', 'globals', 'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', '$'];

	function basicsCommonUniqueFieldsProfileCombobox($q, $translate, globals, platformModalService, LookupDirectiveDefinition, $) {
		var defaults = {
			lookupType: 'uniqueFieldsProfile',
			valueMember: 'description',
			displayMember: 'description',
			uuid: 'ffe8c1f718cd4257947dea0519e9a96a',
			columns: [
				{id: 'profileName', field: 'profileName', name: 'Profile Name', name$tr$: 'basics.common.dialog.saveProfile.labelProfileName'},
				{id: 'accessLevel', field: 'accessLevel', name: 'Access Level', name$tr$: 'basics.common.dialog.saveProfile.labelAccessLevel'}
			],
			selectableCallback: function (dataItem, entity, settings) {
				if (!dataItem) {
					return false;
				}

				var service = settings.service;
				var profile = service.getLookupItemByDescription(dataItem.description);
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
							img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-delete2',
							execute: onDeleteProfileClicked,
							canExecute: canDeleteProfile
						},
						{
							img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
							execute: onEditProfileClicked,
							canExecute: canEditProfile
						}
					],
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							service.setSelectedItemDesc(args.selectedItem.description);
						}
					}]
				});

				// /////////////////////
				function onEditProfileClicked() {
					var profile = service.getSelectedItem();
					showDialog();

					function showDialog() {
						var dlgOptions = {};
						dlgOptions.templateUrl = globals.appBaseUrl + 'basics.common/templates/unique-fields-profile-dialog.html';
						dlgOptions.backdrop = false;
						dlgOptions.height = '500px';
						dlgOptions.width = '400px';
						dlgOptions.resizeable = true;
						dlgOptions.gridId = '6D1B7935263D45A088BF1722B9386AB0';
						dlgOptions.data = angular.copy(profile.UniqueFields);
						dlgOptions.service = service;
						dlgOptions.headerTextKey = service.getModalTitle('modalTitle') ?? $translate.instant('basics.common.uniqueFields.uniqueFielsDialogTitle');

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
					return service.canDeleteProfile();
				}

				function canEditProfile() {
					var profile = service.getSelectedItem();
					return profile ? true : false;
				}
			}]
		});
	}
})(angular);