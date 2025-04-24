( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('procurement.stock').directive('procurementStockAccrualModeLookup', ['BasicsLookupdataLookupDirectiveDefinition','$translate','$q',
		function (BasicsLookupdataLookupDirectiveDefinition,$translate,$q) {

			let options = [
				{
					Id: 1,// By PRC_STOCKTRANSACTION, MDC_CONTROLLINGUNIT_FK, ACCOUNT, OFFSETACCOUNT, NOMINAL_DIMENSION
					Description: 'One Transaction per Stock Transaction',
					Description$tr$: 'procurement.stock.transactionMode.OneTransactionperStockTransaction'
				},
				{
					Id: 2,// By PRJ_STOCK, MDC_CONTROLLINGUNIT_FK, ACCOUNT, OFFSETACCOUNT, NOMINAL_DIMENSION
					Description: 'One Transaction per Stock Header',
					Description$tr$: 'procurement.stock.transactionMode.OneTransactionperStockHeader'
				},
				{
					Id: 3,//MDC_CONTROLLINGUNIT_FK, ACCOUNT, OFFSETACCOUNT, NOMINAL_DIMENSION
					Description: 'Consolidated by CU, Account',
					Description$tr$: 'procurement.stock.transactionMode.ConsolidatedCUandAccount'
				},
				{
					Id: 4,// ACCOUNT, OFFSETACCOUNT, NOMINAL_DIMENSION
					Description: 'Consolidated by Account',
					Description$tr$: 'procurement.stock.transactionMode.ConsolidatedAccount'
				}
			];

			angular.forEach(options, function (item) {
				let translation = $translate.instant(item.Description$tr$);
				if (translation !== item.Description$tr$) {
					item.Description = translation;
				}
			});
			var defaults = {
				lookupType: 'transactionMode',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return $q.when(options);
					},
					getItemByKey: function (key) {
						var item=_.find(options,{Id:key});
						return $q.when(item);
					}
				}
			});
		}]);

})(angular);