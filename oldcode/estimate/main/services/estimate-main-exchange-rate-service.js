/**
 * Created by joshi on 28.09.2015.
 */



(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainExchangeRateService
	 * @function
	 *
	 * @description
	 * estimateMainService is the data service for all estimate related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainExchangeRateService', [ '$q', '$http','$injector',
		function ($q, $http, $injector) {

			let service = {},
				exchangeRates = [];

			service.getCurrencyExchangeRate = function getCurrencyExchangeRate(projectInfo, resList, resItem){
				let ids = [];

				ids = _.map(_.filter(resList, function(res) {
					return res.EstResourceTypeFk !== 5 && res.BasCurrencyFk;
				}), 'BasCurrencyFk');// todo:test

				if(resItem && resItem.Id && resItem.EstResourceTypeFk !== 5){
					let item = _.find(resList, {Id: resItem.Id});
					if(!item){
						ids.push(resItem.BasCurrencyFk);
					}
				}
				ids =_.uniq(ids);
				let postData = {
						'ProjectFk': projectInfo && projectInfo.ProjectId ? projectInfo.ProjectId : null,
						'ProjectCurrencyFk': projectInfo && projectInfo.ProjectCurrency ? projectInfo.ProjectCurrency : null,
						'CurrencyForeignFk':ids,
						'ProjectCurrencyRateType':2},
					exchangeRate = null,
					exchangeRates = [];

				return $http.post(globals.webApiBaseUrl + 'estimate/main/currencyconversion/exchangerate', postData).then(function(response) {

					_.forEach(response.data, function(value) {
						exchangeRates.push(angular.copy(value));
					});
					if(resItem && resItem.Id && resItem.EstResourceTypeFk !== 5){
						let key = _.findKey(response.data, {'Key' : resItem.BasCurrencyFk});
						if(key){
							exchangeRate  = response.data[key].Value;
						}
					}
					return exchangeRate;
				});
			};

			service.getExchangeRate = function getExchangeRate(item){
				let rate = null;
				if(item.EstResourceTypeFk !== 5){
					let rateItem =  _.find(exchangeRates, {'Key': item.BasCurrencyFk});
					rate =  rateItem ? rateItem.Value: null;
				}
				rate = rate ? rate : 1;
				return rate;
			};

			service.loadData = function loadData(projectId, reload){
				if(exchangeRates && exchangeRates.length && !reload){
					return $q.when(exchangeRates);
				}else{
					return $http.get(globals.webApiBaseUrl + 'estimate/main/currencyconversion/getexchangerates?projectId='+ projectId).then(function(response) {

						exchangeRates = [];
						_.each(response.data, function(val, key){
							exchangeRates.push(angular.copy({'ForeignCurrencyFk':parseInt(key), 'Rate':val}));
						});
						return exchangeRates;
					});
				}
			};
			service.getAllExchRates = function getAllExchRates(projectInfo,estHeader,currencyFk){
				let postData = {
					'ProjectFk': projectInfo && projectInfo.ProjectId ? projectInfo.ProjectId : null,
					'ProjectCurrencyFk': projectInfo && projectInfo.ProjectCurrency ? projectInfo.ProjectCurrency : null,
					'CurrencyForeignFk':[currencyFk],
					'EstHeaderFk':estHeader,
					'ProjectCurrencyRateType':2};

				return $http.post(globals.webApiBaseUrl + 'estimate/main/currencyconversion/exchangerate', postData).then(function(response) {

					return response;
				});
			};
			service.getExchRate = function getExchRate(foreignCurrencyId){
				let rate = null;
				if(foreignCurrencyId){
					let item =  _.find(exchangeRates, {'ForeignCurrencyFk': foreignCurrencyId});
					rate =  item ? item.Rate: null;
				}
				return rate ? rate : 1;
			};

			service.setExchRate = function setExchRate(foreignCurrencyId){
				if(foreignCurrencyId){
					let item =  _.find(exchangeRates, {'ForeignCurrencyFk': foreignCurrencyId});
					if(item){
						return $q.when(item.Rate);
					}
					else{
						var projectId = $injector.get('estimateMainService').getProjectId();
						if(projectId && foreignCurrencyId){
							let postData = {
								'ProjectFk': projectId,
								'CurrencyForeignFk':[foreignCurrencyId],
								'EstHeaderFk':0};
							return $http.post(globals.webApiBaseUrl + 'estimate/main/currencyconversion/saveexchangerate', postData).then(function(response) {
								let result = response.data[foreignCurrencyId];
								const existingCurrency = exchangeRates.find(item => item.ForeignCurrencyFk === foreignCurrencyId);
								if (!existingCurrency) {
									exchangeRates.push(angular.copy({'ForeignCurrencyFk':foreignCurrencyId, 'Rate':result}));
								}
								return result;
							});
						}
					}
				}
				return $q.when(1);
			};

			service.clear = function clear(){
				exchangeRates = [];
			};

			return service;
		}]);
})();
