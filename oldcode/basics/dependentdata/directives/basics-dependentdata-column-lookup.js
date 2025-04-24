/**
 * Created by alm on 6/30/2015.
 */

(function (angular) {
	'use strict';
	angular.module('basics.dependentdata').directive('basicsDependentDataColumnLookup',
		['$q', 'basicsDependentDataColumnLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, basicsDependentDataColumnLookupService, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'basicsDependentDataColumn',
					valueMember: 'Id',
					displayMember: 'DatabaseColumn'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							//console.log("====getList======");
							//console.log(basicsDependentDataColumnLookupService.getList());
							return basicsDependentDataColumnLookupService.getList();
						},
						getItemByKey: function (key) {
							return basicsDependentDataColumnLookupService.getItemByIdAsync(key);
						},
						getSearchList: function () {
							return basicsDependentDataColumnLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return basicsDependentDataColumnLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);
})(angular);