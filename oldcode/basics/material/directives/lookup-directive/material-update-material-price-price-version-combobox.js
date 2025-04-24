/**
 * Created by clv on 8/29/2018.
 */
(function(angular){

	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialPriceVersionCombobox', [ 'BasicsLookupdataLookupDirectiveDefinition', '$translate', '_', '$http', '$q', 'globals',
		function(BasicsLookupdataLookupDirectiveDefinition, $translate, _, $http, $q, globals){

			var basePriceStr = $translate.instant('basics.material.updatePriceWizard.updateMaterialPriceBasePrice');
			var defaults = {
				version: 2,
				lookupType: 'UpdateMaterialPriceVersion',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showCustomInputContent: true,
				columns: [
					{
						id: 'priceVersion',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$:'cloud.common.entityDescription'
					},
					{
						id: 'priceList',
						field: 'PriceListFk',
						name: 'Price List',
						name$tr$:'basics.materialcatalog.entityPriceList',
						formatter: 'lookup',
						formatterOptions:{
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.pricelist',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},
					{
						id: 'validFrom',
						field: 'ValidFrom',
						name: 'Valid From',
						formatter: 'dateutc',
						name$tr$: 'basics.materialcatalog.validFrom',
						width: 100
					},
					{
						id: 'validTo',
						field: 'ValidTo',
						name: 'Valid To',
						formatter: 'dateutc',
						name$tr$: 'basics.materialcatalog.validTo',
						width: 100
					}
				],
				formatter: function(ngModel, displayItem, displayText){
					if(ngModel === 0){
						// display the default value from the front-end side, default id set zero
						return basePriceStr;
					}
					return displayText;
				},
				filterOptions:{
					serverKey: 'update-material-price-price-version-filter',
					serverSide: true,
					fn: function(entity){
						if(entity){
							//return {MaterialCatalogFk: entity.materialCataLog.catalogId};
							return {MaterialCatalogFk: entity.catalogId};
						}
						return {};
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					/* jshint -W098*/
					getSearchList: function(searchRequest, field, options){
						var rootUrl = globals.webApiBaseUrl;
						return $http.get(rootUrl + 'basics/material/wizard/updatematerialprice/getmatpricever?filterValue='+searchRequest).then(function(response){
							//add a default object to list to show in this combobox
							var list = response.data || [];
							list.unshift({Id: 0, DescriptionInfo:{Translated: basePriceStr}});
							return list;
						});
					},
					getItemByKey: function(key, options){
						var cache = options.dataView.dataCache.data;
						var defer = $q.defer();
						var item = _.find(cache, {Id: key});
						defer.resolve(item || null);
						return defer.promise;
					}
				}
			});
		}]);
})(angular);