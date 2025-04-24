/**
 * Create by jack on 5/10/20223
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('updateEstimeCommonOptionProfileLookup', updateEstimeCommonOptionProfileLookup);

	updateEstimeCommonOptionProfileLookup.$inject = ['$q', '$translate', 'globals', 'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', '$'];

	function updateEstimeCommonOptionProfileLookup($q, $translate, globals, platformModalService, LookupDirectiveDefinition, $) {
		let defaults = {
			lookupType: 'updateEstimeCommonOptionProfileLookup',
			valueMember: 'Description',
			displayMember: 'Description',
			uuid: '0f6291a47378436190aab056adf18b83',
			columns: [
				{id: 'ProfileName', field: 'ProfileName', name: 'Profile Name', name$tr$: 'basics.common.dialog.saveProfile.labelProfileName'},
				{id: 'ProfileAccessLevel', field: 'ProfileAccessLevel', name: 'Access Level', name$tr$: 'basics.common.dialog.saveProfile.labelAccessLevel'}
			]
		};

		return new LookupDirectiveDefinition('lookup-edit', defaults, {
			dataProvider: {
				getList: function (options) {
					let deferred = $q.defer();
					let service = options.service;
					deferred.resolve(service.getListForLookup());
					return deferred.promise;
				},
				getItemByKey: function (value, options) {
					let deferred = $q.defer();
					let service = options.service;
					deferred.resolve(service.getLookupItemByDescription(value));
					return deferred.promise;
				}
			},
			controller: ['$scope', function ($scope) {
				let service = $scope.lookupOptions.service;
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

				function canEditProfile() {
					return true;
				}

				function onEditProfileClicked() {
					let profile = angular.copy($scope.$parent.$parent.$parent.UpdateOptions);
					let profileParentDataView = $scope.lookupOptions.dataView;
					showDialog();
					function showDialog() {
						let dlgOptions = {};
						dlgOptions.templateUrl = globals.appBaseUrl + 'procurement.common/templates/prc-common-option-profile-config-dialog.html';
						dlgOptions.backdrop = false;
						dlgOptions.height = '500px';
						dlgOptions.width = '400px';
						dlgOptions.resizeable = true;
						dlgOptions.gridId = '6487f76ed0a041b18e03f060fda2d207';
						dlgOptions.controller= 'prcCommonOptionSaveProfileController';
						dlgOptions.resolve={
							controllerOptions:function (){
								return {
									profile:profile,
									profileParentDataView: profileParentDataView,
									onDelete: function (selected, profileParentDataView) {
										service.delete(selected, profileParentDataView);
									},
									setDefault: function (setDefault) {
										service.default(setDefault);
									}
								};
							}
						};
						dlgOptions.headerTextKey = $translate.instant('basics.common.uniqueFields.uniqueFielsDialogTitle');
						platformModalService.showDialog(dlgOptions);
					}
				}
			}]
		});
	}
})(angular);