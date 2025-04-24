(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,globals */
	globals.lookups.BasAccassignConType = function BasAccassignConType() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'BasAccassignConType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '95cb09c923a04309858c211bf9ff73eb',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'isCreateInvAccount', field: 'IsCreateInvAccount', name: 'IsCreateInvAccount', width: 80, formatter: Slick.Formatters.CheckmarkFormatter, name$tr$: 'procurement.common.accassign.IsCreateInvAccount' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};
	var moduleName = 'procurement.common';
	angular.module(moduleName).directive('prcCommonAccassignContractTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.BasAccassignConType().lookupOptions);
		}]);

})(angular, globals);