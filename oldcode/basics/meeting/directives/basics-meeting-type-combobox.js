/**
 * Created by chd on 04/02/2022.
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';

	angular.module(moduleName).directive('basicsMeetingTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'MeetingType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
