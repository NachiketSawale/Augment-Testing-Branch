(function (angular, globals) {
	/* global  globals */
	'use strict';

	globals.lookups.QtoConHeaderView = function QtoConHeaderView($injector){
		var qtoHeaderProcurementContractLookupDialogService = $injector.get('qtoHeaderProcurementContractLookupDialogService');
		return {
			lookupOptions : globals.lookups.ConHeaderView($injector).lookupOptions,
			dataProvider:{
				myUniqueIdentifier: 'qtoHeaderProjectLookupDialogLookupDataHandler',

				getList: function () {
					return qtoHeaderProcurementContractLookupDialogService.getListAsync();
				},

				getItemByKey: function (value) {
					return qtoHeaderProcurementContractLookupDialogService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return qtoHeaderProcurementContractLookupDialogService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return qtoHeaderProcurementContractLookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('qto.main').directive('qtoHeaderProcurementContractLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.QtoConHeaderView($injector);
			$injector.get('qtoMainHeaderDataService').configConHeaderViewLookup(defaults.lookupOptions.columns);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider:defaults.dataProvider});
		}]);

})(angular, globals);

