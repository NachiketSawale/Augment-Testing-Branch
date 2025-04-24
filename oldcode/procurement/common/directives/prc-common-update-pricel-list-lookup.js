/**
 * Created by alm on 27.08.2018.
 */
(function (angular, globals) {

	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.materialPriceList = function materialPriceList($injector) {
		var http = $injector.get('$http');
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var procurementCommonUpdateItemPriceService = $injector.get('procurementCommonUpdateItemPriceService');

		return {
			lookupOptions: {
				lookupType: 'MaterialPriceList',
				valueMember: 'Id',
				displayMember: 'Cost',
				uuid: 'DE1786262D5944569019510C3ECF47B7',
				formatter: formatter,
				disableCache: true,
				showCustomInputContent: true,
				columns: [
					{
						id: 'PriceVersion',
						field: 'PriceVersionDescription',
						name: 'Price Version',
						name$tr$: 'basics.material.priceList.materialPriceVersion',
						formatter: 'description'
					},
					{
						id: 'PriceListFk',
						field: 'PriceListFk',
						name: 'PriceList',
						formatter: 'lookup',
						name$tr$: 'basics.material.priceList.priceList',
						formatterOptions: {
							lookupModuleQualifier: 'basics.customize.pricelist',
							lookupSimpleLookup: true,
							valueMember: 'Id',
							displayMember: 'Description'
						},
						width: 150
					},
					{
						id: 'Cost',
						field: 'Cost',
						name: 'Cost Price',
						name$tr$: 'basics.material.record.costPrice',
						formatter: 'decimal'
					}, {
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'Valid From',
						name$tr$: 'basics.materialcatalog.validFrom',
						formatter: 'date'
					},
					{
						id: 'ValidTo',
						field: 'ValidTo',
						name: 'Valid To',
						name$tr$: 'basics.materialcatalog.validTo',
						formatter: 'date'
					}
				],
				filterOptions: {
					serverKey: 'update-material-price-list-filter',
					serverSide: true,
					fn: function (entity) {
						if (entity) {
							return {
								MaterialId: entity.MaterialId,
								ParentItemId: entity.PId,
								BusinessPartnerId: procurementCommonUpdateItemPriceService.BusinessPartnerId
							};
						}
					}
				},
				width: 500,
				height: 200
			},
			dataProvider: {
				getSearchList: function (searchRequest) {
					var rootUrl = globals.webApiBaseUrl;
					searchRequest = searchRequest.substring(1, searchRequest.length - 1);
					var params = JSON.parse(searchRequest);

					return http.post(rootUrl + 'procurement/common/UpdateItemPrice/getPriceVersionList', params).then(function (response) {
						// add a default object to list to show in this combobox. It is the price to a material
						return response.data || [];
					});
				},
				getItemByKey: function (key, options) {
					var cache = options.dataView.dataCache.data;
					var defer = q.defer();
					var item = _.find(cache, {Id: key});
					defer.resolve(item || null);
					return defer.promise;
				}
			}
		};

		// ///////////////////////////
		function formatter(model, dataItem, displayText, settings, entity) {
			if (dataItem) {
				entity.UnitRate = dataItem.Cost;
				entity.ConvertedUnitRate = dataItem.ConvertedCost;
			}
			return procurementCommonUpdateItemPriceService.formatterMoneyType(entity, 'UnitRate');
		}
	};

	angular.module(moduleName).directive('prcCommonUpdatePriceListLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var ret;
			var defaults = globals.lookups.materialPriceList($injector);
			ret = new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});

			return ret;
		}
	]);
})(angular, globals);