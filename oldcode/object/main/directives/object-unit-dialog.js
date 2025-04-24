(function (angular) {
	'use strict';

	angular.module('object.main').directive('basicsObjectUnitDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'ObjectUnit',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '37e199319f4345548ab809766dad609b',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' },
					{ id: 'situation', field: 'Situation', name: 'Situation', name$tr$: 'object.main.entitySituation' }
				],
				width: 500,
				height: 200,
				title: { name: 'object.main.dialogTitleObjectUnit' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);
