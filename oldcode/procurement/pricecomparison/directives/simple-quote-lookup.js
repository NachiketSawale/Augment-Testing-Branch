/**
 * Created by chi on 10/25/2018.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.simpleQuote = function simpleQuote() {
		return {
			lookupOptions: {
				lookupType: 'SimpleQuote',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '4a9b8dbb9cc1485aa4dda1466db553de',
				columns: [
					{
						id: 'qtnCode',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code'
					},
					{
						id: 'qtnDescription',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						width: 120
					},
					{
						id: 'businessPartnerFk',
						field: 'BusinessPartnerName1',
						name: 'Business Partner',
						name$tr$: 'cloud.common.entityBusinessPartner',
						formatter: 'description',
						width: 120
					},
					{
						id: 'qtnVersion',
						field: 'QuoteVersion',
						name: 'Version',
						name$tr$: 'cloud.common.entityVersion',
						formatter: 'integer'
					}
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module(moduleName).directive('procurementPricecomparisonSimpleQuoteLookup', [
		'_', '$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDescriptorService',
		function (_, $q, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupDescriptorService) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.simpleQuote().lookupOptions, {
				dataProvider: {
					getList: function(){
						var deferred = $q.defer();
						var data = basicsLookupdataLookupDescriptorService.getData('SimpleQuote');
						var list = [];
						_.map(data, function(value/* , keys */){
							list.push(value);
						});
						list = _.orderBy(list, 'Id');
						deferred.resolve(list);
						return deferred.promise;
					},
					getItemByKey: function(id){
						var deferred = $q.defer();
						var data = basicsLookupdataLookupDescriptorService.getData('SimpleQuote');
						deferred.resolve(data[id]);
						return deferred.promise;
					}
				}
			});
		}
	]);
})(angular, globals);