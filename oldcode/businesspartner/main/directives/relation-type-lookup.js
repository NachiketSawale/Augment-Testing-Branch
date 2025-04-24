/**
 * Created by wwa on 11/9/2015.
 */
(function (angular, globals) { // jshint ignore:line
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.businessPartnerRelationType = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'BusinessPartnerRelationType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '005c5278188143259e0c133546f2d57e',
				columns: [
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'businesspartner.main.descriptionRelationLookup', toolTip: 'Description', formatter: 'description'},
					{id: 'oppositeDesc', field: 'OppositeDescriptionInfo.Translated', name: 'OppositeDescription', name$tr$: 'businesspartner.main.oppositeDescriptionRelationLookup', formatter: 'description'}
				]
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerRelationTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.businessPartnerRelationType().lookupOptions);
		}]);
})(angular, globals);