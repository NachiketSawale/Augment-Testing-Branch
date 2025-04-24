
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainGenerateEstFromLeadingStructureOptionProfileLookup', estimateMainGenerateEstFromLeadingStructureOptionProfileLookup);

	estimateMainGenerateEstFromLeadingStructureOptionProfileLookup.$inject = ['$q', '$translate', 'globals', 'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', '$'];

	function estimateMainGenerateEstFromLeadingStructureOptionProfileLookup($q, $translate, globals, platformModalService, LookupDirectiveDefinition, $) {
		let defaults = {
			lookupType: 'estimateMainGenerateEstFromLeadingStructureOptionProfileLookup',
			valueMember: 'Id',
			displayMember: 'Description',
			idProperty: 'Id',
			uuid: '11e4d5a80cbe46ba9e6dfd9316bda181',
			columns: [
				{id: 'ProfileName', field: 'ProfileName', name: 'Profile Name', name$tr$: 'basics.common.dialog.saveProfile.labelProfileName'},
				{id: 'ProfileAccessLevel', field: 'ProfileAccessLevel', name: 'Access Level', name$tr$: 'basics.common.dialog.saveProfile.labelAccessLevel'}
			],
			onDataRefresh:function ($scope){
				$scope.options.service.load(true).then(function (data) {
					$scope.settings.dataView.dataCache.data= data;
					$scope.settings.dataView.dataCache.isLoaded = false;
					$scope.refreshData(data);
				});
			},
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
							service.setSelectedItem(args.selectedItem, true);
						}
					}]
				});

				function canEditProfile() {
					return true;
				}

				function onEditProfileClicked() {
					let profile = angular.copy($scope.$parent.dataItem);
					let profileParentDataView = $scope.lookupOptions.dataView;
					showDialog();
					function showDialog() {
						let dlgOptions = {};
						dlgOptions.templateUrl = globals.appBaseUrl + 'procurement.common/templates/prc-common-option-profile-config-dialog.html';
						dlgOptions.backdrop = false;
						dlgOptions.height = '500px';
						dlgOptions.width = '400px';
						dlgOptions.resizeable = true;
						dlgOptions.gridId = '6a13457fb3134e18b9a713afae532db4';
						dlgOptions.controller= 'estimateMainGenerateEstimateOptionSaveProfileController';
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