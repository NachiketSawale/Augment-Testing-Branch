(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataTableDocumentTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'documentType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);