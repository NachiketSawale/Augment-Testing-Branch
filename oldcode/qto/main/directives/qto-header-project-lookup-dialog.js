(function (angular, globals) {
	/* global  globals */
	'use strict';

	globals.lookups.QtoPrcProject = function QtoPrcProject($injector){
		var qtoHeaderProjectLookupDialogService = $injector.get('qtoHeaderProjectLookupDialogService');
		return {
			lookupOptions : globals.lookups.PrcProject($injector).lookupOptions,
			dataProvider: {
				myUniqueIdentifier: 'qtoHeaderProjectLookupDialogLookupDataHandler',

				getList: function () {
					return qtoHeaderProjectLookupDialogService.getListAsync();
				},

				getItemByKey: function (value) {
					return qtoHeaderProjectLookupDialogService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return qtoHeaderProjectLookupDialogService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return qtoHeaderProjectLookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('qto.main').directive('qtoHeaderProjectLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.QtoPrcProject($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);

