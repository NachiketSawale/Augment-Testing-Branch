// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.businessPartnerEvaluationSchemaIcon = function () {
		return {
			lookupOptions: {
				lookupType: 'businessPartnerEvaluationSchemaIcon',
				valueMember: 'Id',
				displayMember: 'Description',
				disableInput: true,
				imageSelector: 'businessPartnerEvaluationSchemaIconProcessor'
			}
		};
	};

	angular.module('businesspartner.evaluationschema').directive('businessPartnerEvaluationSchemaIconCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.businessPartnerEvaluationSchemaIcon().lookupOptions, {
				dataProvider: 'businesspartnerEvaluationSchemaIconDataService'
			});
		}
	]);

})(angular, globals);
