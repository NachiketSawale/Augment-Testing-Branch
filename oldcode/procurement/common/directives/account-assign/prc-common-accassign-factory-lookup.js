(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.BasAccassignFactory = function BasAccassignFactory() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'BasAccassignFactory',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'd14e3b2a1e184dbfb655d42725baab8a',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};

	angular.module(moduleName).directive('prcCommonAccassignFactoryLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.BasAccassignFactory().lookupOptions);
		}]);

})(angular, globals);