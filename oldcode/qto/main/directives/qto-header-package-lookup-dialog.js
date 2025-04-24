(function (angular, globals) {
	/* global  globals */
	'use strict';

	globals.lookups.QtoPrcPackage = function QtoPrcPackage($injector){
		var qtoHeaderPackageLookupDialogService = $injector.get('qtoHeaderPackageLookupDialogService');
		return {
			lookupOptions : globals.lookups.prcPackage($injector).lookupOptions,
			dataProvider: {
				myUniqueIdentifier: 'qtoHeaderProjectLookupDialogLookupDataHandler',

				getList: function () {
					return qtoHeaderPackageLookupDialogService.getListAsync();
				},

				getItemByKey: function (value) {
					return qtoHeaderPackageLookupDialogService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return qtoHeaderPackageLookupDialogService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return qtoHeaderPackageLookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('qto.main').directive('qtoHeaderPackageLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.QtoPrcPackage($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);

