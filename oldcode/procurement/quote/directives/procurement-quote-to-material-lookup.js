/**
 * Created by ltn on 1/12/2017.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.quote2material = function quote2material() {
		return {
			lookupOptions: {
				lookupType: 'Quote2material',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '67D6ED3FA0FA491D9EBE469DE26E4460',
				version:3,
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' },
					{ id: 'DateQuoted', field: 'DateQuoted', name: 'Date Quoted', name$tr$: 'procurement.quote.headerDateQuoted' ,searchable:'false'},
					{ id: 'DateReceived', field: 'DateReceived', name: 'Date Received', name$tr$: 'cloud.common.entityReceived' ,searchable:'false'},
					{ id: 'BusinessPartnerName1', field: 'BusinessPartnerName1', name: 'BusinessPartner name1', name$tr$: 'businesspartner.main.name1' },
					{ id: 'BusinessPartnerName2', field: 'BusinessPartnerName2', name: 'BusinessPartner name2', name$tr$: 'businesspartner.main.name2' },
					{ id: 'MatchCode', field: 'BusinessPartnerMatchCode', name: 'Match code', name$tr$: 'businesspartner.main.matchCode' },
					{ id: 'Subsidiary', field: 'SubsidiaryDescription', name: 'Subsidiary', name$tr$: 'cloud.common.entitySubsidiary' ,searchable:'false'},
					{ id: 'SubsidiaryAddressStreet', field: 'SubsidiaryAddressStreet', name: 'Street', name$tr$: 'cloud.common.entityStreet' ,searchable:'false'},
					{ id: 'SubsidiaryAddressZipCode', field: 'SubsidiaryAddressZipCode', name: 'Zip Code', name$tr$: 'cloud.common.entityZipCode' ,searchable:'false'},
					{ id: 'SubsidiaryAddressCity', field: 'SubsidiaryAddressCity', name: 'City', name$tr$: 'cloud.common.entityCity' ,searchable:'false'},
					{ id: 'SubsidiaryAddressCountryISO2', field: 'SubsidiaryAddressCountryISO2', name: 'ISO2', name$tr$: 'cloud.common.entityCounty' ,searchable:'false'},
					{ id: 'quoteVersion', field: 'QuoteVersion', name: 'Version', name$tr$: 'cloud.common.entityVersion' ,searchable:'false' }
				],
				width:500,
				height:200,
				title: { name: 'Quote Search Dialog', name$tr$: 'procurement.quote.QuoteTitle' }
			}
		};
	};

	/**
     * @ngdoc directive
     * @name procurement.quote.directive:procurementQuoteToMaterialLookup
     * @element div
     * @restrict A
     * @description Quote To Material lookup
     *
     */
	angular.module(moduleName).directive('procurementQuoteToMaterialLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.quote2material().lookupOptions);
		}]);
})(angular, globals);