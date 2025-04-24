(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).directive('hsqeCheckListTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'HsqeCheckListType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
