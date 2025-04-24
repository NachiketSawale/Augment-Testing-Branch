(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	/* global globals */
	globals.lookups.basAccassignControl = function basAccassignControl() {
		return {
			lookupOptions:{
				version:3,
				lookupType: 'basaccassigncontrol',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'd43450a057cb488b8837ab72b001d0cd',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]}
		};
	};

	angular.module(moduleName).directive('prcCommonAccassignControlLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basAccassignControl().lookupOptions);
		}]);

})(angular);