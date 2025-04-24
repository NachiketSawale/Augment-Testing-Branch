/**
 * Created by reimer on 13.08.2015.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsImportProfileCombobox
	 * @requires
	 * @description ComboBox to select a rubric
	 */

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportProfileCombobox', ['$q', 'basicsImportProfileService', 'BasicsLookupdataLookupDirectiveDefinition', '$translate', 'platformModalService',
		function ($q, dataService, LookupDirectiveDefinition, $translate, platformModalService) {

			const defaults = {
				lookupType: 'basicsImportProfileCombobox',
				valueMember: 'description',
				displayMember: 'description'
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					getList: function () {

						let deferred = $q.defer();
						deferred.resolve(dataService.getListForLookup());
						return deferred.promise;

					},

					getItemByKey: function (value) {

						let deferred = $q.defer();
						deferred.resolve(dataService.getLookupItemByDescription(value));
						return deferred.promise;
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

					let onDeleteProfileClicked = function () {

						let profile = dataService.getSelectedItem();

						let modalOptions = {
							headerTextKey: 'basics.common.deleteDialogTitle',
							bodyTextKey: $translate.instant('basics.common.questionDeleteProfile', {p1: profile.ProfileName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};

						platformModalService.showDialog(modalOptions).then(function (result) {
							if (result.yes) {
								dataService.deleteSelectedItem();
								// todo: refresh
							}
						}
						);
					};

					let canDeleteProfile = function() {
						let result = dataService.canDeleteSelectedItem();
						return result;
					};

					$.extend($scope.lookupOptions, {
						buttons: [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-delete2',
								execute: onDeleteProfileClicked,
								canExecute: canDeleteProfile
							}
						]
					});
				}]

			});
		}
	]);

})(angular);



