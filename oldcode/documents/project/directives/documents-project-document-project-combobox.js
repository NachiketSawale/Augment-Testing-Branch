

(function (angular) {
	'use strict';


	var moduleName = 'documents.project';
	angular.module(moduleName).directive('documentsProjectDocumentProjectCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'DocumentLookup',
				valueMember: 'Id',
				displayMember: 'Id'
			};


			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);
})(angular);