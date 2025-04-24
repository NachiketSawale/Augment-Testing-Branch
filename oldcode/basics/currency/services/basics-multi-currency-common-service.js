/**
 * Created by waldrop on 20.03.2019.
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name basicsMultiCurrencyCommonService
	 * @function
	 *
	 * @description
	 * basicsMultiCurrencyCommonService is the master control for setting and getting n-ary currencies.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.currency').factory('basicsMultiCurrencyCommonService',
		['$injector','estimateMainService','$http','$q',
			function ($injector, estimateMainService, $http, $q) {
				var service = {};

				service.setCurrencies = function(lineitem){
					var estHeader = estimateMainService.getSelectedEstHeaderItem();

					if(estHeader !== null){
						lineitem.Currency1Fk = estHeader.Currency1Fk;
						lineitem.Currency2Fk = estHeader.Currency2Fk;
						lineitem.ExchangeRate1 = estHeader.ExchangeRate1;
						lineitem.ExchangeRate2 = estHeader.ExchangeRate2;
					}
				};

				service.setResourceCurrency = function (res){
					var selectedItem = estimateMainService.getSelected();

					if(selectedItem !== null){
						res.Currency1Fk = selectedItem.Currency1Fk;
						res.Currency2Fk = selectedItem.Currency2Fk;
					}
				};

				service.calculateMultiCurrencies = function calculateMultiCurrencies(lineitem){
					var estHeader = estimateMainService.getSelectedEstHeaderItem();

					if(estHeader !== null){
						lineitem.CostExchangeRate1 = estHeader.ExchangeRate1 * lineitem.CostTotal;
						lineitem.CostExchangeRate2 = estHeader.ExchangeRate2 * lineitem.CostTotal;
						lineitem.ForeignBudget1 = estHeader.ExchangeRate1 * lineitem.Budget;
						lineitem.ForeignBudget2 = estHeader.ExchangeRate2 * lineitem.Budget;
					}
				};

				service.getPrjCurrenciesAndRates = function getPrjCurrenciesAndRates(currentProject) {
					return $http.get(globals.webApiBaseUrl + 'project/main/currencyrate/listbyproject?projectId=' + currentProject);
				};

				service.getRate = function getRate(){
					return $http.get(globals.webApiBaseUrl + 'basics/currency/rate/getList');
				};

				service.getLatestRate = function getLatestRate(currencyHomeFk,currrencyForeignFk,currencyRateTypeFk){
					return $http.get(globals.webApiBaseUrl + 'basics/currency/rate/latest?currencyHomeFk='+currencyHomeFk +'&currrencyForeignFk=' +currrencyForeignFk+'&currencyRateTypeFk='+currencyRateTypeFk);
				};
				service.getAllCurrencies = function getAllCurrencies(){
					return $http.get(globals.webApiBaseUrl + 'basics/currency/list');
				};

				service.getCurrencyById = function getCurrencyById(id){
					// '$http.get(globals.webApiBaseUrl + 'basics/currency/list')
					return $http.post(globals.webApiBaseUrl + 'basics/currency/listforeign', {Id:id});
				};

				service.getCurrencyRatesFromMaster = function getCurrencyRatesFromMaster(currencyFk){
					// Exchange Rates not defined in Project Level then get from Master Data
					var estimateMainExchangeRateService = $injector.get('estimateMainExchangeRateService');

					return estimateMainExchangeRateService.getExchRate(currencyFk);
				};

				service.getRateFromCurrencyId = function getRateFromCurrencyId(currencyId){
					var deferred = $q.defer();

					var currentProject =  estimateMainService.getSelectedProjectInfo();

					var loDash = $injector.get('_');

					if(currentProject){
						// Get List of Project Exchange Rates
						service.getPrjCurrenciesAndRates(currentProject.ProjectId).then(function (response) {

							// Some are set in Project Exchange Rate
							if(response.data.length > 0 ){
								// Check Currency selected against list
								var foundCurrency = loDash.find(response.data,function(item){
									return item.CurrencyForeignFk === currencyId;
								});

								if(foundCurrency){
									deferred.resolve(foundCurrency.Rate);// Currency selected is found in list
								}else{
									// currently selected currency not defined in Project Exchange Rate get from Master
									service.getRate().then(function(response) {
										var foundMasterCurrency = loDash.find(response.data,function (item) {
											return item.CurrencyForeignFk === currencyId;
										});

										if(foundMasterCurrency){
											deferred.resolve(foundMasterCurrency.Rate);
										}else{
											deferred.resolve(0);
										}
									},function () {
										deferred.resolve('fail');
									});
								}
							}else{
								// No Currencies defined at all in Project
								// Get Rate from Master
								service.getRate().then(function(response) {

									var foundMasterCurrency = loDash.find(response.data,function (item) {
										return item.CurrencyForeignFk === currencyId;
									});

									if(foundMasterCurrency){
										deferred.resolve(foundMasterCurrency.Rate);
									}else{
										deferred.resolve(0);
									}
								});
							}
						},function () {
							deferred.resolve('fail');
						});
					}
					return deferred.promise;
				};

				service.filterBudgetRate = function filterBudgetRate(rates,args){
					var BudgetRateFk = 2;
					var budget = null;
					var newDate;
					var oldDate;
					var parsedDate = null;
					angular.forEach(rates,function (item) {

						if(item.CurrencyRateTypeFk === BudgetRateFk && item.CurrencyForeignFk === args.selectedItem.Id){
							if(item.Version > 1){
								parsedDate = Date.parse(item.UpdatedAt);
							}
							else{
								parsedDate = Date.parse(item.InsertedAt);
							}
							newDate = parsedDate;

							if(oldDate === undefined){// base case
								oldDate = newDate;
								budget = item;
							}
							if(newDate > oldDate) {// swap
								oldDate = newDate;
								budget = item;
							}
						}
					});

					return budget;
				};

				service.filterProjectRate = function filterProjectRate(rates,args){
					var projectRateFk = 3;
					var budget = null;
					var newDate;
					var oldDate;
					var parsedDate = null;
					angular.forEach(rates,function (item) {
						if(item.CurrencyRateTypeFk === projectRateFk && item.CurrencyForeignFk === args.selectedItem.Id){
							if(item.Version > 1){
								parsedDate = Date.parse(item.UpdatedAt);
							}
							else{
								parsedDate = Date.parse(item.InsertedAt);
							}
							newDate = parsedDate;

							if(oldDate === undefined){// base case
								oldDate = newDate;
								budget = item;
							}
							if(newDate > oldDate) {// swap
								oldDate = newDate;
								budget = item;
							}
						}
					});

					return budget;
				};
				service.filterExchangeRate = function filterExchangeRate(rates,args){
					var exchangeRateFk = 1;
					var budget = null;
					var newDate;
					var oldDate;
					var parsedDate = null;
					angular.forEach(rates,function (item) {
						if(item.CurrencyRateTypeFk === exchangeRateFk && item.CurrencyForeignFk === args.selectedItem.Id){
							if(item.Version > 1){
								parsedDate = Date.parse(item.UpdatedAt);
							}
							else{
								parsedDate = Date.parse(item.InsertedAt);
							}
							newDate = parsedDate;

							if(oldDate === undefined){// base case
								oldDate = newDate;
								budget = item;
							}
							if(newDate > oldDate) {// swap
								oldDate = newDate;
								budget = item;
							}
						}
					});

					return budget;
				};
				return service;
			}]);
})(angular);
