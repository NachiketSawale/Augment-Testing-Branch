(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.basAccassignMatGroup = function basAccassignMatGroup() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'basaccassignmatgroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '74a27b31c55c46b28646840793d40a26',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};
	angular.module(moduleName).directive('prcCommonAccassignMatGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basAccassignMatGroup().lookupOptions);
		}]);

})(angular, globals);