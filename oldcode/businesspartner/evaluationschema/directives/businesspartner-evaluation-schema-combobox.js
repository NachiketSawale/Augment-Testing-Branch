// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.evaluationSchema = function () {
		return {
			lookupOptions: {
				lookupType: 'EvaluationSchema',
				valueMember: 'Id',
				displayMember: 'Description',
				version:3
			}
		};
	};

	angular.module('businesspartner.evaluationschema').directive('businessPartnerEvaluationSchemaCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.evaluationSchema().lookupOptions);
		}]);

})(angular, globals);