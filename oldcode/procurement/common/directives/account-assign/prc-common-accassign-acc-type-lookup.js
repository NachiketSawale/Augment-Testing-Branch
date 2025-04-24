(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,globals */
	var moduleName = 'procurement.common';
	globals.lookups.BasAccassignAccType = function BasAccassignAccType() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'BasAccassignAccType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '4db758c7e2b0491681f9ef832da848d8',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'is2Fields', field: 'Is2Fields', name: 'Is2Fields', width: 80, formatter: Slick.Formatters.CheckmarkFormatter, name$tr$: 'procurement.common.accassign.Is2Fields' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};
	angular.module(moduleName).directive('prcCommonAccassignAccTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.BasAccassignAccType().lookupOptions);
		}]);

})(angular, globals);