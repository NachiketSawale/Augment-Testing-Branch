(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.basAccassignBusiness = function basAccassignBusiness() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'basaccassignbusiness',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'f20097c7e668437fb6b5b4a7dc1946b9',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'sapMandant', field: 'SapMandant', name: 'SapMandant', width: 100, name$tr$: 'procurement.common.accassign.SapMandant' }
				]}
		};
	};
	angular.module(moduleName).directive('prcCommonAccassignBusinessLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basAccassignBusiness().lookupOptions);
		}]);

})(angular, globals);