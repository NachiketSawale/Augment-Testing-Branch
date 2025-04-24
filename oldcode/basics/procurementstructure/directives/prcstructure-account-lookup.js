/**
 * Created by lvy on 5/13/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).directive('basicsProcurementstructureAccountLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'BasAccount',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'ae7ce2f0f1d24bfc91d6300b18e636ad',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'isBalanceSheet', field: 'IsBalanceSheet', name: 'Is Balance Sheet', width: 80, name$tr$: 'basics.procurementstructure.isBalanceSheet', formatter: 'boolean' },
					{ id: 'isProfitAndLoss', field: 'IsProfitAndLoss', name: 'Is Profit And Loss', width: 80, name$tr$: 'basics.procurementstructure.isProfitAndLoss', formatter: 'boolean' },
					{ id: 'isCostCode', field: 'IsCostCode', name: 'Is Cost Code', width: 80, name$tr$: 'basics.procurementstructure.isCostCode', formatter: 'boolean' },
					{ id: 'isRevenueCode', field: 'IsRevenueCode', name: 'Is Revenue Code', width: 80, name$tr$: 'basics.procurementstructure.isRevenueCode', formatter: 'boolean' }
				],
				width: 600,
				height: 200
			};
			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults);
		}
	]);

})(angular);