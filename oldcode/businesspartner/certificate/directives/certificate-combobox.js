/**
 * Created by sfi on 2/2/2016.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.certificate = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Certificate',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '3f107fb9a28944ba9eaf4b212194caae',
				columns: [
					{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'ReferenceName', field: 'Reference', name: 'Reference Name', name$tr$: 'cloud.common.entityReferenceName'}
				],
				title: {name: 'BusinessPartner Certificate', name$tr$: 'businesspartner.certificate.certificate'}
			}
		};
	};

	angular.module('businesspartner.certificate').directive('businesspartnerCertificateCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.certificate().lookupOptions);
		}
	]);

})(angular, globals);