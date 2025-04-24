( function (angular, globals) {
	/* global  globals */
	'use strict';

	globals.lookups.QtoLineType = function QtoLineType(){
		return {
			lookupOptions:{
				lookupType: 'QtoLineType',
				valueMember: 'Id',
				searchInterval:0,
				displayMember: 'Code',
				uuid: 'cbed25157ad14953ae173ba5dcab0001',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
				]
			}
		};
	};

	angular.module('qto.main').directive('qtoLineTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoLineType();

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions);
		}
	]);
})(angular, globals);