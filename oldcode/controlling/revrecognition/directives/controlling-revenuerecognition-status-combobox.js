(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).directive('controllingRevenueRecognitionStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'RevenueRecognitionStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
