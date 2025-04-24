(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name businessPartnerMainFilteredContactComboboxWithoutTeams
	 * @function
	 *
	 * @description
	 * businessPartnerMainFilteredContactComboboxWithoutTeams is a directive for a combo box showing contact. It is important to set a filter key to reduce the number of elements being shown
	 */
	angular.module('businesspartner.main').directive('businessPartnerMainFilteredContactComboboxWithoutTeams', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 3,
				lookupType: 'contact',
				valueMember: 'Id',
				displayMember: 'FullName',
				uuid: 'e008134d1ba941f1ac9af03db4548fd5',
				columns: [
					{id: 'FirstName', field: 'FirstName', name: 'FirstName', name$tr$: 'businesspartner.main.firstName', width: 100},
					{id: 'FamilyName', field: 'FamilyName', name: 'FamilyName', name$tr$: 'businesspartner.main.familyName', width: 100},
					{id: 'Title', field: 'Title', name: 'Title', name$tr$: 'businesspartner.main.title', width: 100},
					{id: 'Description', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 120},
					{id: 'AddressLine', field: 'AddressLine', name: 'Address', name$tr$: 'cloud.common.entityAddress', width: 120}
				],
				width: 500,
				height: 200,
				pageOptions: {
					enabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);
})(angular);