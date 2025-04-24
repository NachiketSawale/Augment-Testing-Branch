/**
 * Created by clv on 8/28/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';
	angular.module(moduleName).directive('materialUpdatePriceUnitRateCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$http', 'globals',
		 '_', '$q', 'basicsMaterialUpdateMaterialPricesWizardService',

		function(BasicsLookupdataLookupDirectiveDefinition, $http, globals, _, $q, updateMaterialPricesWizardService){

			var defaults ={
				lookupType: 'MaterialPriceList',
				valueMember: 'Id',
				displayMember: 'Cost',
				showCustomInputContent: true,
				formatter: function(ngModel, displayItem, displayText, settings, entity){

					if(displayItem){
						entity.UnitRate = displayItem.Cost;
					}
					var field = 'UnitRate';
					return updateMaterialPricesWizardService.formatterMoneyType(entity, field);
				},
				columns:[
					{
						id: 'costPrice',
						field: 'Cost',
						name: 'Cost Price',
						name$tr$: 'basics.material.record.costPrice',
						formatter: 'money'
					},
					{
						id: 'version',
						field: 'MaterialPriceVersionFk',
						name: 'Price Version',
						name$tr$: 'basics.material.priceList.materialPriceVersion',
						readonly: true,
						formatter: function(row, cell, value, columnConfig, item){
							return item.PriceVerDescriptionInfo.Translated;
						}
					},
					{
						id: 'priceList',
						field: 'MaterialPriceVersionFk',
						name: 'Price List',
						name$tr$: 'basics.materialCatalog.entityPriceList',
						readonly: true,
						formatter: function(row, cell, value, columnConfig, item){
							return item.PriceListDescriptionInfo.Translated;
						}
					}
				],
				filterOptions:{
					serverKey: 'update-material-price-unit-rate-filter',
					serverSide: true,
					fn: function(entity){
						if(entity){
							return 'MaterialFk='+ entity.Id;
						}
						return '';
					}
				},
				uuid: '0a9ec89855724fa6a8c5026a175ef931'
			};

			 return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {

				 dataProvider: {
					 getSearchList: function(searchRequest, field, scope){
						 var rootUrl = globals.webApiBaseUrl;
						 return $http.get(rootUrl + 'basics/material/wizard/updatematerialprice/getmatpricelist?filter='+searchRequest).then(function(response){
							 //add a default object to list to show in this combobox. It is the price to a material
							 var list = response.data || [];
							 var costPrice = scope.entity.Cost;
							 var id = scope.entity.Id;
							 list.unshift({Id: -id, Cost: costPrice, PriceVerDescriptionInfo:{Translated: null}, PriceListDescriptionInfo:{Translated: null}});
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