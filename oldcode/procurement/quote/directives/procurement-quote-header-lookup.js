(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc directive
	 * @name procurement.quote.directive:procurementQuoteHeaderLookup
	 * @element div
	 * @restrict A
	 * @description Quote Header lookup
	 *
	 */
	angular.module(moduleName).directive('procurementQuoteHeaderLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'platformGridDomainService',
		function (BasicsLookupdataLookupDirectiveDefinition, platformGridDomainService) {

			var defaults = angular.copy(globals.lookups.quote().lookupOptions);
			defaults.displayMember = 'Code';
			defaults.title = { name: 'Quote Search Dialog', name$tr$: 'procurement.quote.QuoteTitle' };
			defaults.columns = [
				{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' },
				{ id: 'DateQuoted', field: 'DateQuoted', name: 'Date Quoted', name$tr$: 'procurement.quote.headerDateQuoted' ,searchable:'false', formatter: platformGridDomainService.formatter('dateutc')},
				{ id: 'DateReceived', field: 'DateReceived', name: 'Date Received', name$tr$: 'cloud.common.entityReceived' ,searchable:'false', formatter: platformGridDomainService.formatter('dateutc')},
				{ id: 'BusinessPartnerName1', field: 'BusinessPartnerName1', name: 'BusinessPartner name1', name$tr$: 'businesspartner.main.name1' },
				{ id: 'BusinessPartnerName2', field: 'BusinessPartnerName2', name: 'BusinessPartner name2', name$tr$: 'businesspartner.main.name2' },
				{ id: 'MatchCode', field: 'BusinessPartnerMatchCode', name: 'Match code', name$tr$: 'businesspartner.main.matchCode' },
				{ id: 'Subsidiary', field: 'SubsidiaryDescription', name: 'Subsidiary', name$tr$: 'cloud.common.entitySubsidiary' ,searchable:'false'},
				{ id: 'SubsidiaryAddressStreet', field: 'SubsidiaryAddressStreet', name: 'Street', name$tr$: 'cloud.common.entityStreet' ,searchable:'false'},
				{ id: 'SubsidiaryAddressZipCode', field: 'SubsidiaryAddressZipCode', name: 'Zip Code', name$tr$: 'cloud.common.entityZipCode' ,searchable:'false'},
				{ id: 'SubsidiaryAddressCity', field: 'SubsidiaryAddressCity', name: 'City', name$tr$: 'cloud.common.entityCity' ,searchable:'false'},
				{ id: 'SubsidiaryAddressCountryISO2', field: 'SubsidiaryAddressCountryISO2', name: 'ISO2', name$tr$: 'cloud.common.entityCounty' ,searchable:'false'},
				{ id: 'quoteVersion', field: 'QuoteVersion', name: 'Version', name$tr$: 'cloud.common.entityVersion' ,searchable:'false' }
			];
			defaults.pageOptions = {
				enabled: true
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);
})(angular, globals);