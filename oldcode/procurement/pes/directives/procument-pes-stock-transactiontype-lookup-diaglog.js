/**
 * Created by lcn on 9/14/2017.
 */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pes';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcStockTransactionType = function prcStockTransactionType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcStocktransactiontype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true,
				imageSelector: 'basicsCustomizeProcurementStockTransactionTypeIconService'
			}
		};
	};

	angular.module(moduleName).directive('procumentPesStockTransactiontypeLookupDiaglog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcStockTransactionType().lookupOptions);
		}]);

})(angular, globals);

