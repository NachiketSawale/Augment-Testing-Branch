(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.basAccassignItemType = function basAccassignItemType() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'basaccassignitemtype',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'fae5dd90eccc4da0b5c159d83acf543d',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};
	angular.module(moduleName).directive('prcCommonAccassignItemTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basAccassignItemType().lookupOptions);
		}]);

})(angular, globals);