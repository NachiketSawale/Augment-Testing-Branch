(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.quote = function quote($injector) {
		var columnDef = $injector ? $injector.get('procurementPriceComparisonItemColumnDialogDef') : null;
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Quote',
				valueMember: 'Id',
				displayMember: 'BusinessPartnerName1',
				uuid: '6fe2901d335f4b29b31f50e0b8779ec2',
				columns: columnDef && angular.isFunction(columnDef.getStandardConfigForListView) ? angular.copy(columnDef.getStandardConfigForListView().columns) : [],
				width: 500,
				height: 200
			}
		};
	};

	angular.module(moduleName).directive('procurementPricecomparisonQuoteVersionLookup', [
		'BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {

			var defaults = angular.copy(globals.lookups.quote($injector).lookupOptions);

			defaults = angular.extend(defaults, {
				displayMember: 'QuoteVersion',
				pageOptions: {
					enabled: true
				}
			});

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular, globals);