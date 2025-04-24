/**
 * Created by lvy on 9/29/2018.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcItemType85 = function prcItemType85() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcItemType85',
				valueMember: 'Id',
				displayMember: 'CodeInfo.Translated',
				uuid: '004486aee8274306975c84d1f2ec0ffd',
				columns: [
					{ id: 'code', field: 'CodeInfo.Translated', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100 },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 200 }
				]
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonItemType85Combobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.prcItemType85().lookupOptions);
		}
	]);

})(angular, globals);