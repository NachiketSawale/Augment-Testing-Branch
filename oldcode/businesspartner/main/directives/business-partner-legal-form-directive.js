/**
 * Created by chi on 9/17/2021.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	globals.lookups.legalForm = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'legalForm',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '94414606def540f6b18033cf7a64b87b',
				columns: [
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 100
					},
					{
						id: 'countryIso2',
						field: 'BasCountryFk',
						name: 'ISO2',
						name$tr$: 'basics.customize.countryFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'country',
							displayMember: 'Iso2'
						},
						width: 100
					},
					{
						id: 'countryDesc',
						field: 'BasCountryFk',
						name: 'Country',
						name$tr$: 'basics.common.entityCountryDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'country',
							displayMember: 'Description'
						},
						width: 100
					}]
			}
		};
	};

	angular.module(moduleName).directive('businessPartnerMainLegalFormDirective', businessPartnerMainLegalFormDirective);

	businessPartnerMainLegalFormDirective.$inject = [
		'$q',
		'_',
		'globals',
		'BasicsLookupdataLookupDirectiveDefinition'
	];

	function businessPartnerMainLegalFormDirective(
		$q,
		_,
		globals,
		BasicsLookupdataLookupDirectiveDefinition
	) {

		var providerInfo = globals.lookups.legalForm();
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', providerInfo.lookupOptions);
	}
})(angular);