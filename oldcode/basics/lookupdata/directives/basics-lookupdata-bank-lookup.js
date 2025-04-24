/**
 * Created by zos on 9/11/2014.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataBankLookup',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'Bank',
				valueMember: 'Id',
				displayMember: 'BankName',
				uuid: '0bd600c128db49b3b19379e3a35c45f6',
				dialogUuid: '40e929354d7d4d4d91bc973a80b806e2',
				columns: [
					{ id: 'BankName', field: 'BankName', name: 'BankName', width: 100, name$tr$: 'cloud.common.entityBankName',sortable: true },
					{ id: 'Bic', field: 'Bic', name: 'Bic', width: 100, name$tr$: 'cloud.common.entityBankBic',sortable: true },
					{ id: 'SortCode', field: 'SortCode', name: 'SortCode', width: 100, name$tr$: 'cloud.common.entityBankSortCode',sortable: true},
					{ id: 'Country', field: 'Iso2', name: 'ISO2', width: 100, name$tr$: 'cloud.common.entityISO2',sortable: true },
					{ id: 'City', field: 'City', name: 'City', width: 100, name$tr$: 'cloud.common.entityCity',sortable: true }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);