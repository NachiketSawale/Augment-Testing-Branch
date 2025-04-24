(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).directive('projectDocumentTypeLookupService', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'ProjectDocumentTypeLookup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);