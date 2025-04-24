/**
 * Created by zos on 1/9/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('boqRuleSequenceLookup', ['$http', 'basicsCustomizeRuleIconService',
		'BasicsLookupdataLookupDirectiveDefinition', 'boqRuleSequenceLookupService',
		function ($http, basicsCustomizeRuleIconService, BasicsLookupdataLookupDirectiveDefinition, boqRuleSequenceLookupService) {
			var defaults = {
				lookupType: 'estsequences',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: 'c57ed35ye54f487695e4772cf9c9c328',
				columns: [
					{id: 'desc', field: 'DescriptionInfo', name: 'Description', width: 120, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
					{id: 'ischangeable', field: 'Ischangeable', name: 'Ischangeable', width: 70, toolTip: 'Ischangeable', formatter: 'bool', name$tr$: 'cloud.common.ischangeable'}
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							console.log(args);
						}
					}
				],
				onDataRefresh: function ($scope) {
					boqRuleSequenceLookupService.loadLookupData().then(function (data) {
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return boqRuleSequenceLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return boqRuleSequenceLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return boqRuleSequenceLookupService.getItemByIdAsync(value);
					}
				}
			});
		}]);
})(angular);
