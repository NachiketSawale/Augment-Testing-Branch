/**
 * Created by pel on 3/21/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.clerk';

	angular.module(moduleName).directive('clerkDocumentTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'clerkDocumentType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
