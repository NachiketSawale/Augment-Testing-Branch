/**
 * Created by wui on 8/23/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialPriceListLookupColumns', [
		{
			id: 'PriceVersion',
			field: 'MaterialPriceVersionFk',
			name: 'Price Version',
			name$tr$: 'basics.material.priceList.materialPriceVersion',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'MaterialPriceVersion',
				displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
			}
		},
		{
			id: 'PriceList',
			field: 'MaterialPriceVersionFk',
			name: 'Price List',
			name$tr$: 'basics.material.priceList.priceList',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'MaterialPriceVersion',
				displayMember: 'PriceListDescriptionInfo.Translated'
			}
		},
		{
			id: 'Cost',
			field: 'Cost',
			name: 'Cost Price',
			name$tr$: 'basics.material.record.costPrice',
			formatter: 'decimal'
		},
		{
			id: 'EstimatePrice',
			field: 'EstimatePrice',
			name: 'Estimate Price',
			width: 120,
			name$tr$: 'basics.material.record.estimatePrice',
			formatter: 'decimal'
		},
		{
			id: 'CurrencyFk',
			field: 'CurrencyFk',
			name: 'Currency',
			name$tr$: 'cloud.common.entityCurrency',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'Currency',
				displayMember: 'Currency'
			}
		}
	]);

	angular.module(moduleName).factory('basicsMaterialPriceListLookupDataService', ['$q', '$http', 'basicsLookupdataLookupDescriptorService',
		function ($q, $http, basicsLookupdataLookupDescriptorService) {
			var service = {
				cache: {},
				state: {}
			};

			service.getCache = function (materialId) {
				return service.cache[materialId];
			};

			service.clearCache = function () {
				service.cache = {};
			};

			service.getState = function (materialId) {
				var state = service.state[materialId];
				service.state[materialId] = null;
				return state;
			};

			service.setState = function (material, priceList) {
				service.state[material.Id] = {
					m: material,
					p: priceList
				};
			};

			service.clearState = function () {
				service.state = {};
			};

			service.getPriceList = function (material) {
				var state = service.getState(material.Id);
				var priceList;

				if (state) {
					priceList = {
						Id: state.p.Id,
						Cost: state.p.Cost,
						EstimatePrice: state.p.EstimatePrice,
						BasCurrencyFk: state.p.CurrencyFk,
						PrcPriceConditionFk: state.p.PrcPriceConditionFk,
						LeadTime: state.p.LeadTime,
						MinQuantity: state.p.MinQuantity,
						SellUnit: state.p.SellUnit,
						PriceExtra: state.p.PriceExtras,
						MdcTaxCodeFk: state.p.TaxCodeFk,
						RetailPrice: state.p.RetailPrice,
						ListPrice: state.p.ListPrice,
						Discount: state.p.Discount,
						Charges: state.p.Charges,
						Co2Project : state.p.Co2Project,
						Co2Source : state.p.Co2Source
					};
				}
				else {
					priceList = {
						Id: null,
						Cost: material.Cost,
						EstimatePrice: material.EstimatePrice,
						BasCurrencyFk: material.BasCurrencyFk,
						PrcPriceConditionFk: material.PrcPriceconditionFk,
						LeadTime: material.LeadTime,
						MinQuantity: material.MinQuantity,
						SellUnit: material.SellUnit,
						PriceExtra: material.PriceExtra,
						MdcTaxCodeFk: material.MdcTaxCodeFk,
						RetailPrice: material.RetailPrice,
						ListPrice: material.ListPrice,
						Discount: material.Discount,
						Charges: material.Charges,
						Co2Project : material.Co2Project,
						Co2Source : material.Co2Source
					};
				}

				return priceList;
			};

			service.getList = function (options, scope) {
				var material = scope.entity;

				return $http.get(globals.webApiBaseUrl + 'basics/material/pricelist/lookuplist?mainItemId=' + material.Id).then(function (res) {
					service.processBaseItem(res.data.Main);
					service.cache[material.Id] = res.data;
					return res.data.Main;
				});
			};

			service.processBaseItem = function (list) {
				var target = _.find(list, {Id: -1});
				if(target){
					target.Id = null;
					target.MaterialPriceVersionFk = null;
				}
				return list;
			};

			service.getItemByKey = function (identification, options, scope) {
				return service.getList(options, scope).then(function (list) {
					return _.find(list, {Id: identification.Id});
				});
			};

			service.overridePrice = function (material, priceList) {
				material.Cost = priceList.Cost;
				material.PriceForShow = priceList.Cost;
				material.EstimatePrice = priceList.EstimatePrice;
				material.PriceReferenceForShow = priceList.EstimatePrice;
				material.PrcPriceconditionFk = priceList.PrcPriceConditionFk;
				material.LeadTime = priceList.LeadTime;
				material.MinQuantity = priceList.MinQuantity;
				material.SellUnit = priceList.SellUnit;
				material.PriceExtra = priceList.PriceExtras;
				material.MdcTaxCodeFk = priceList.TaxCodeFk;
				material.RetailPrice = priceList.RetailPrice;
				material.ListPrice = priceList.ListPrice;
				material.Discount = priceList.Discount;
				material.Charges = priceList.Charges;
				material.Co2Project = priceList.Co2Project;
				material.Co2Source = priceList.Co2Source;
				material.DayworkRate = priceList.DayworkRate;
				setRequireQuantityAfterChangePriceList(material);

				if (material.BasCurrencyFk !== priceList.CurrencyFk) {
					material.BasCurrencyFk = priceList.CurrencyFk;

					if (_.isNil(material.BasCurrencyFk)) {
						material.Currency = '';
					}
					else {
						basicsLookupdataLookupDescriptorService.getItemByKey('Currency', material.BasCurrencyFk).then(function (currency) {
							material.Currency = currency.Currency;
						});
					}
				}
				if(material.BasCo2SourceFk !== priceList.BasCo2SourceFk){
					material.BasCo2SourceFk = priceList.BasCo2SourceFk;
					if (_.isNil(material.BasCo2SourceFk)) {
						material.BasCo2SourceFk = '';
					}else{
						basicsLookupdataLookupDescriptorService.getItemByKey('co2sourcename', material.BasCo2SourceFk,{version:3}).then(function (Co2Source) {
							material.BasCo2SourceFk = Co2Source.Id;
							material.BasCo2SourceName = Co2Source.DescriptionInfo.Translated;
						});
					}
				}
			};

			function setRequireQuantityAfterChangePriceList(material)
			{
				if (material.MinQuantity === 0 || material.SellUnit === 0)
				{
					material.Requirequantity = material.MinQuantity === 0 ? material.SellUnit : material.MinQuantity;
				}
				else
				{
					const remainder = material.MinQuantity % material.SellUnit;
					material.Requirequantity = remainder === 0 ? material.MinQuantity : (material.MinQuantity + material.SellUnit - remainder);
				}
			}

			return service;
		}
	]);

	angular.module(moduleName).directive('basicsMaterialPriceListLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsMaterialPriceListLookupColumns',
		'basicsMaterialPriceListLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,
			basicsMaterialPriceListLookupColumns,
			basicsMaterialPriceListLookupDataService) {
			var events = [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						var material = args.entity;
						var priceList = args.selectedItem;
						basicsMaterialPriceListLookupDataService.setState(material, priceList);
						basicsMaterialPriceListLookupDataService.overridePrice(material, priceList);
					}
				}
			];

			var defaults = {
				version: 2,
				lookupType: 'Basics.Material.PriceList',
				valueMember: 'Id',
				disableCache: true,
				showCustomInputContent: true,
				uuid: '0CE3F0CAB1164242AED14E5AAE47EA45',
				formatter: formatter,
				columns: basicsMaterialPriceListLookupColumns,
				events: events,
				handleContent: handleContent
			};

			function handleContent(content) {
				content.css({
					border: 'initial',
					boxShadow: 'initial',
					transition: 'initial',
					backgroundColor: 'initial'
				});
				content.find('.input-group-content').removeAttr('tabindex');
			}

			function formatter(model, dataItem, displayText, settings, entity) {
				if (_.isNil(entity)) {
					return '';
				}

				return '<span>' + getEstimatePriceInfo(entity) + '</span>[<span>' + getListPriceInfo(entity) + '</span>]' + entity.Currency;
			}

			function getEstimatePriceInfo(material){
				material.PriceForShow = material.PriceForShow || material.Cost;
				return formatNumber(material.PriceForShow);
			}

			function getListPriceInfo(material){
				material.PriceReferenceForShow = material.PriceReferenceForShow || material.EstimatePrice;
				return formatNumber(material.PriceReferenceForShow);
			}

			function formatNumber(number){
				var floatNumber = parseFloat(number);
				var decimalPlaces = 2;
				var pow = Math.pow(10, decimalPlaces);
				var result = (Math.round(floatNumber * pow) / pow);
				return result.toUserLocaleNumberString();
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: basicsMaterialPriceListLookupDataService
			});
		}
	]);

	angular.module(moduleName).service('basicsMaterialPriceListCostNEstimatePriceLookupService', [
		'$q',
		'platformGridDomainService',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsMaterialPriceListLookupColumns',
		'basicsMaterialPriceListLookupDataService',
		function (
			$q,
			platformGridDomainService,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsMaterialPriceListLookupColumns,
			basicsMaterialPriceListLookupDataService) {

			this.generateLookup = function(lookupType, displayField) {
				const defaults = {
					lookupType: lookupType,
					valueMember: 'Id',
					disableCache: true,
					showCustomInputContent: true,
					formatter: formatter,
					columns: basicsMaterialPriceListLookupColumns,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							var material = args.entity;
							var priceList = args.selectedItem;
							basicsMaterialPriceListLookupDataService.setState(material, priceList);
							basicsMaterialPriceListLookupDataService.overridePrice(material, priceList);
						}
					}]
				};

				function formatter(model, dataItem, displayText, settings, entity) {
					if (_.isNil(entity)) {
						return '';
					}

					return platformGridDomainService.formatter('money')(0, 0, entity[displayField], {field: displayField});
				}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					...basicsMaterialPriceListLookupDataService,
					...{
						getList: function (options, scope) {
							return $q.when(basicsMaterialPriceListLookupDataService.processBaseItem(scope.entity.PriceLists));
						}
					}
				}
			});
		}
		}
	]);

	angular.module(moduleName).directive('basicsMaterialPriceListCostLookup', [
		'basicsMaterialPriceListCostNEstimatePriceLookupService',
		function (
			basicsMaterialPriceListCostNEstimatePriceLookupService
		) {
			return basicsMaterialPriceListCostNEstimatePriceLookupService.generateLookup('Basics.Material.PriceList.Cost', 'Cost');
		}
	]);

	angular.module(moduleName).directive('basicsMaterialPriceListEstimatePriceLookup', [
		'basicsMaterialPriceListCostNEstimatePriceLookupService',
		function (
			basicsMaterialPriceListCostNEstimatePriceLookupService
		) {
			return basicsMaterialPriceListCostNEstimatePriceLookupService.generateLookup('Basics.Material.PriceList.EstimatePrice', 'EstimatePrice');
		}
	]);

})(angular);