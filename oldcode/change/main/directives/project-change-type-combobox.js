/**
 * Created by jie on 2023.10.08.
 */
(function (angular) {
	'use strict';
	angular.module('change.main').directive('projectChangeTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'ProjectChangeType',
				valueMember: 'Id',
				version:3,
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);