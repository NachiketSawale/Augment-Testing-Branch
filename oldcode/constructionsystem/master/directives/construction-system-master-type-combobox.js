(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'ConstructionSystemMasterType',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'basicsCustomizeConstructionIconService'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
