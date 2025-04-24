(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterParameterAggregateTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition','cosParameterAggregateTypeLookupService',
		function (BasicsLookupdataLookupDirectiveDefinition,cosParameterAggregateTypeLookupService) {
			var defaults = {
				lookupType: 'constructionSystemMasterAggregateType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,{
				dataProvider: {
					getList: function () {
						return cosParameterAggregateTypeLookupService.getList();
					},
					getItemByKey: function (key) {
						return cosParameterAggregateTypeLookupService.getItemByIdAsync(key);
					},
					getSearchList: function () {
						return cosParameterAggregateTypeLookupService.getSearchList();
					},
					getDisplayItem: function (value) {
						return cosParameterAggregateTypeLookupService.getItemByIdAsync(value);
					}
				}
			});
		}]);
})(angular);
