/* global globals,angular*/
(function (angular, globals) {
	'use strict';

	globals.lookups.contactRoleType = function invGroup() {
		return {
			lookupOptions: {
				lookupType: 'ContactRoleType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name contactRoleTypeLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module('project.main').directive('contactRoleTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.contactRoleType().lookupOptions);
		}]);

})(angular, globals);