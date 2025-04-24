
(function (angular) {

	'use strict';
	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureContrFormulaPropDefLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'contrFormulaPropDef',
				valueMember: 'Id',
				displayMember: 'Code',
				version:3,
				dataProcessor : {}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

		}]);
})(angular);
