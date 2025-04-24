/**
 * Created by xia on 5/3/2017.
 */
(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('estimateRuleSequenceLookup',['$http', 'basicsCustomizeRuleIconService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleSequenceLookupService',
		function ($http, basicsCustomizeRuleIconService, BasicsLookupdataLookupDirectiveDefinition, estimateRuleSequenceLookupService) {
			let defaults = {
				lookupType: 'estsequences',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: 'c57ed35ye54f487695e4772cf9c9c328',
				columns:[
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description',  width: 120, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
					{ id: 'ischangeable', field: 'Ischangeable', name: 'Ischangeable',  width: 70, toolTip: 'Ischangeable', formatter: 'bool', name$tr$: 'cloud.common.ischangeable' }
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							// eslint-disable-next-line no-console
							console.log(args);
						}
					}
				],
				onDataRefresh : function($scope){
					estimateRuleSequenceLookupService.loadLookupData().then(function(data){
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return estimateRuleSequenceLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return estimateRuleSequenceLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateRuleSequenceLookupService.getItemByIdAsync(value);
					}
				}
			});
		}]);
})(angular);
