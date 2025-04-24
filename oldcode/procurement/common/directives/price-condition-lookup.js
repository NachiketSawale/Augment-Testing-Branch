(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.priceConditionList = function priceConditionList($injector) {
		var http = $injector.get('$http');
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var translate = $injector.get('$translate');
		var procurementCommonUpdateItemPriceService = $injector.get('procurementCommonUpdateItemPriceService');

		return {
			lookupOptions: {
				lookupType: 'priceConditionList',
				valueMember: 'Id',
				displayMember: 'PriceVersionDescription',
				uuid: '12FB50B1287548038C82DBF469AABBA8',
				columns: [
					{
						id: 'Description',
						field: 'PriceVersionDescription',
						name$tr$: 'basics.material.priceList.materialPriceVersion',
						name: 'Description',
						width: 200
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
						id: 'CatalogFk',
						field: 'CatalogFk',
						name: 'CatalogFk',
						formatter: 'lookup',
						name$tr$: 'basics.material.materialCatalog',
						formatterOptions: {
							lookupType: 'MaterialCatalog',
							displayMember: 'Code'
						},
						width: 150
					},
					{
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'Valid From',
						name$tr$: 'basics.materialcatalog.validFrom',
						formatter:'date'
					},
					{
						id: 'ValidTo',
						field: 'ValidTo',
						name: 'Valid To',
						name$tr$: 'basics.materialcatalog.validTo',
						formatter:'date'
					}
				]
			},
			dataProvider: {
				getList: function (/* options, scope */) {
					var deferred = q.defer();
					var arrList = [
						{
							Id: 0,
							PriceVersionDescription: translate.instant('basics.material.updatePriceWizard.updateMaterialPriceBasePrice'),
							PriceListFk: null
						},
						{
							Id: -1,
							PriceVersionDescription: translate.instant('procurement.common.wizard.updateItemPrice.latestPriceVersion'),
							PriceListFk: null
						},
						{
							Id: -3,
							PriceVersionDescription: translate.instant('basics.material.updatePriceWizard.baseAndPriceVersions'),
							PriceListFk: null
						}];
					var materialIds = procurementCommonUpdateItemPriceService.materialIds;

					if (!!materialIds && materialIds.length > 0) {
						var params = {
							materialIds: materialIds,
							queryNeutralMaterial: procurementCommonUpdateItemPriceService.queryNeutralMaterial,
							BusinessPartnerId:procurementCommonUpdateItemPriceService.BusinessPartnerId
						};
						http.post(globals.webApiBaseUrl + 'procurement/common/UpdateItemPrice/getPriceVersionListByCatalog', params).then(function (res) {
							var arr = res.data;
							var arrShow = _.concat(arrList, arr);
							deferred.resolve(arrShow);
						});
					}
					else {
						deferred.resolve(arrList);
					}

					return deferred.promise;
				},
				getItemByKey: function (identification, options, scope) {
					return this.getList(options, scope).then(function (list) {
						return _.find(list, {Id: identification});
					});

				}
			}
		};
	};

	angular.module(moduleName).directive('priceConditionLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.priceConditionList($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);