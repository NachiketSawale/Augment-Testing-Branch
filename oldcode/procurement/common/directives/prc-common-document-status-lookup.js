(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('procurementCommonStatusLookupService', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcDocumentStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);