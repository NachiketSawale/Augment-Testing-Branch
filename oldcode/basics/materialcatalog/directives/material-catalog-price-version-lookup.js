/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).directive('basicsMaterialCatalogPriceVersionLookup', ['_', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'MaterialPriceVersion',
				valueMember: 'Id',
				displayMember: 'MaterialPriceVersionDescriptionInfo.Translated',
				dialogUuid: '4c2e7a70eb174e5d8620adeef4e5e7ac',
				uuid: '74bcdf9eb9ed43b0bce124d68260ea9f',
				columns: [
					{ id: 'priceverdesc', field: 'MaterialPriceVersionDescriptionInfo.Translated', name: 'Price Version Description', name$tr$: 'basics.materialcatalog.priceVersionDescription', width: 100 },
					{ id: 'pricelistdesc', field: 'PriceListDescriptionInfo.Translated', name: 'Price List Description', name$tr$: 'basics.materialcatalog.priceListDescription', width: 100 }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				processData: function (itemList, options) {
				    if (angular.isArray(options.additionalData) && options.additionalData.length > 0 && itemList && itemList.length > 0) {
						_.forEach(options.additionalData, function (item) {
							var found = _.find(itemList, {Id: item.Id});
							if (!found) {
								itemList.unshift(item);
							}
						});
					}
					return itemList;
				}
			});
		}]);
	angular.module(moduleName).directive('basicsMaterialCatalogPriceVersionCustomerLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 3,
				lookupType: 'customer',
				valueMember: 'Id',
				displayMember: 'Userdefined1',
				dialogUuid: '3f0d5b5c1fd94e4a836f78f2abd9316e',
				uuid: 'acdb63f1556c493481a7c302161e4d38',
				columns: [
					{ id: 'bpName1', field: 'BusinessPartnerName1', name: 'Business Partner Name', name$tr$: 'businesspartner.main.name1', width: 150},
					{ id: 'userdefined1', field: 'Userdefined1', name: 'ITWO Company Code', name$tr$: 'basics.materialcatalog.itwocompanycode', width: 150},
					{ id: 'status', field: 'Id', name: 'Customer Status', name$tr$: 'businesspartner.main.customerStatus', width: 100, formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Customer',
							displayMember: 'CustomerStatusDescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						}
					},
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'businesspartner.main.customerCode', width: 100 },
					{ id: 'supplier', field: 'SupplierNo', name: 'Supplier No', name$tr$: 'businesspartner.main.supplierCode', width: 100 }
				],
				width: 600,
				height: 200,
				title: {name: 'Customer Search Dialog', name$tr$: 'businesspartner.main.customerTitle'}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);