(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonSyscontextItemsLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsBiPlusDesignerSysContextItemsLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition, dataService) {
			const defaults = {
				lookupType: 'SysContextItemsLookup',
				valueMember: 'Id',
				displayMember: 'description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return dataService.getList();
					},
					getItemByKey: function (key) {
						return dataService.getItemByIdAsync(key);
					},
					getSearchList: function () {
						return dataService.getSearchList();
					},
					getDisplayItem: function (value) {
						return dataService.getItemByIdAsync(value);
					}
				}
			});
		}]);
})(angular);
