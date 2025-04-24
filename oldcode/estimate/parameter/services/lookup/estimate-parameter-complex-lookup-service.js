/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookupService
	 * @function
	 *
	 * @description
	 * estimateParamComplexLookupService provides all lookup data for estimate Parameters complex lookup
	 */
	angular.module(moduleName).factory('estimateParamComplexLookupService', ['$http', '$q','$injector','BasicsLookupdataLookupDictionary',
		function ( $http, $q,$injector,BasicsLookupdataLookupDictionary) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = new BasicsLookupdataLookupDictionary(true);
			lookupData.isActive= false;

			let getEstParamItems = function(currentItemName,currentEntity) {

				let estimateMainService = $injector.get('estimateMainService');
				let mainItemId = currentEntity.Id;
				let ruleAssignment = [];

				if(currentEntity.RuleAssignment){
					ruleAssignment = ruleAssignment.concat(currentEntity.RuleAssignment);
				}

				let ruleIds = _.map(ruleAssignment, 'Id');
				if(currentItemName === 'Boq'){
					ruleIds = _.map(ruleAssignment, 'PrjEstRuleFk');
				}
				let params = {
					mainItemId: mainItemId,
					currentItemName:currentItemName,
					ruleIdsOfCurrentEntity: ruleIds,
					projectFk:estimateMainService.getProjectId(),
					estHeaderFk:estimateMainService.getSelectedEstHeaderId()
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/prjparam/GetLookupParamOfRuleByCondition', params).then(function (response) {
					let params = [];
					if(response.data){
						if(response.data.basicCustomizeEstParams) {
							_.forEach(response.data.basicCustomizeEstParams, function (d) {
								d.IsLookup = d.Islookup;
								if(d.ParamvaluetypeFk ===1 ){
									d.ValueDetail = d.ParameterValue = d.DefaultValue;
								}else if(d.ParamvaluetypeFk === 2){
									d.ParameterValue = d.DefaultValue;
								}else if(d.ParamvaluetypeFk === 3){
									d.ValueDetail =  d.ValueText;
									d.ParameterText =  d.ValueText;
								}
								d.SourceId = 3002; // GlobalParam:3002
							});
							params= params.concat(response.data.basicCustomizeEstParams);
						}

						if(response.data.prjEstRuleParamEntities){

							let estRuleParms = [];
							let paramCodes1 = _.countBy(response.data.prjEstRuleParamEntities,'Code');

							_.forEach(response.data.prjEstRuleParamEntities, function (d) {
								if(d.IsLookup){
									d.ParameterValue = d.DefaultValue;
								}
								d.SourceId = 3003; // RuleParameter:3003

								if(paramCodes1[d.Code]>1){
									let params = _.filter(response.data.prjEstRuleParamEntities,{'Code':d.Code});
									let param = _.min(params,'Id');
									let hasAddedParam = _.find(estRuleParms,{'Id':param.Id});
									if(!hasAddedParam ) {
										estRuleParms.push (d);
									}

								}else{
									estRuleParms.push(d);
								}
							});
							params= params.concat(estRuleParms);
						}

						if(response.data.projectParamEntities){
							_.forEach(response.data.projectParamEntities, function (d) {
								d.SourceId = 3001; // ProjectParam:3001
							});
							params = params.concat(response.data.projectParamEntities);
						}
					}

					return params;
				});
			};

			// get data list of the estimate ParamCode items
			service.getList = function getList() {
				if(lookupData.estParamItems.length >0){
					return lookupData.estParamItems;
				}
				else{
					getEstParamItems().then(function(data){
						lookupData.estParamItems = data;
						return lookupData.estParamItems;
					});
				}
			};

			// get data list of the estimate ParamCode items
			service.getListAsync = function getListAsync(mainItemName,currentEntity) {
				let cacheData = lookupData.get(mainItemName);

				if(cacheData && _.size(cacheData) >0){
					return $q.when(cacheData);
				}
				else{
					return getEstParamItems(mainItemName,currentEntity).then(function(data){
						lookupData.estParamItems = data;

						updateLookupData(mainItemName,data);

						return lookupData.estParamItems;
					});
				}
			};


			// get list of the estimate ParamCode item by Id
			service.getItemById = function getItemById(value,mainItemName) {
				let items = [];
				let list = lookupData.get(mainItemName);
				if(list && _.size(list)>0){
					angular.forEach(value, function(val){
						let item = _.find(list, {'Code':val});
						if(item && item.Id){
							items.push(item);
						}
					});
				}
				return _.uniqBy(items, 'Id');
			};

			// get list of the estimate ParamCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value,mainItemName,currentEntity) {
				let cacheData = lookupData.get(mainItemName);
				if(cacheData && _.size(cacheData) >0) {
					return $q.when(service.getItemById(value,mainItemName));
				} else {
					if(!lookupData.estParamItemsPromise) {
						lookupData.estParamItemsPromise = service.getListAsync(mainItemName,currentEntity);
					}
					return lookupData.estParamItemsPromise.then(function(data){
						lookupData.estParamItemsPromise = null;
						updateLookupData(mainItemName,data);
						return service.getItemById(value,mainItemName);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(mainItemName,currentEntity){
				return getEstParamItems(mainItemName,currentEntity).then(function(data){
					updateLookupData(mainItemName,data);
					return data;
				});
			};

			// General stuff
			service.reLoad = function(){
				service.loadLookupData();
			};

			function updateLookupData(mainItemName,data) {
				if(mainItemName) {
					let idIndex = 1;
					_.forEach(data, function (d) {
						d.Id = idIndex;
						idIndex++;
					});
					if (!lookupData.has(mainItemName)) {
						lookupData.add(mainItemName, data);
					} else {
						lookupData.remove(mainItemName);
						lookupData.add(mainItemName, data);
					}
				}
			}

			service.clearCacheData = function clearCacheData(mainItemName) {
				lookupData.remove(mainItemName);
			};

			service.clearCacheData = function clearCacheData(mainItemName) {
				lookupData.remove(mainItemName);
			};

			return service;
		}]);
})();
