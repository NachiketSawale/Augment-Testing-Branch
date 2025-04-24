(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.basAccassignAccount = function basAccassignAccount() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'basaccassignaccount',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'e903a1092dba43b7983ac812399ad478',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};
	angular.module(moduleName).directive('prcCommonAccassignAccountLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basAccassignAccount().lookupOptions);
		}]);

})(angular, globals);