/**
 * Created by clv on 8/24/2017.
 */
(function (angular, globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	globals.lookups.businessPostingGroup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'BusinessPostingGroup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('businessPartnerBusinessPostingGroupCombobox', businessPartnerBusinessPostingGroupCombobox);

	businessPartnerBusinessPostingGroupCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function businessPartnerBusinessPostingGroupCombobox(BasicsLookupdataLookupDirectiveDefinition) {

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.businessPostingGroup().lookupOptions);
	}
})(angular, globals);