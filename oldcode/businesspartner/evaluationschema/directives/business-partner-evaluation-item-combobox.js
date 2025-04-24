// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.evaluationItem = function () {
		return {
			lookupOptions: {
				lookupType: 'EvaluationItem',
				valueMember: 'Id',
				displayMember: 'Description',
				version:3
			}
		};
	};

	angular.module('businesspartner.evaluationschema').directive('businessPartnerEvaluationItemCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.evaluationItem().lookupOptions);
		}]);

})(angular, globals);