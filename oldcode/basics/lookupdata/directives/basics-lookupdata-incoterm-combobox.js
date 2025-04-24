(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataIncotermCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'prcincoterm',
				valueMember: 'Id',
				// displayMember: 'Description'
				displayMember: 'Code',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100 },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 200 }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);