/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global math, globals, _ */
	/**
     * @ngdoc service
     * @name estimateRuleCommonService
     * @function
     * @description
     * estimateRuleCommonService is the data service for estimate rule related related common functionality.
     */

	let moduleName = 'estimate.project';
	angular.module(moduleName).factory('estimateProjectEstimateRuleCommonService', ['$http','$q','basicsLookupdataTreeHelper',
		function ($http,$q,basicsLookupdataTreeHelper) {
			let service = {};

			service.calculateDetails = function calculateDetails(item, colName, targetColumnName) {
				if(targetColumnName === 'ParameterValue') {
					return;
				}

				let map2Detail = {
						DefaultValue: 'ValueDetail',
						ValueDetail: 'DefaultValue',
						ParameterValue: 'ValueDetail',
						Value:'Value'
					},
					union = angular.extend({}, _.invert(map2Detail), map2Detail);

				// eslint-disable-next-line no-prototype-builtins
				if (union.hasOwnProperty(colName)) {
					if (item[colName]) {
						let detailVal = angular.copy(item[colName].toString());
						// eslint-disable-next-line no-useless-escape
						detailVal = detailVal.replace(/[`~§!@#$%^&|=?;:'"<>\s\{\}\[\]\\]/gi, '');
						detailVal = detailVal.replace(/[,]/gi, '.');
						// eslint-disable-next-line no-useless-escape
						let list = detailVal.match(/\b[a-zA-Z]+[\w|\s*-\+\/]*/g);
						let chars = ['sin', 'tan', 'cos', 'ln'];
						let result = _.filter(list, function (li) {
							if (chars.indexOf(li) === -1) {
								return li;
							}
						});

						let newValue;
						if (result && !result.length) {
							try{
								newValue = math.eval(detailVal);
							}catch (err){
								newValue = 0;
							}
						} else {
							newValue = 0;
						}

						if (targetColumnName) {
							item[targetColumnName] = newValue;
						} else {
							item[union[colName]] = newValue;
						}
					} else {
						item[union[colName]] = 0;
					}
				}
			};

			let attachProp = function attachProp(item, list, parentProps){
				if(item[parentProps]){
					let matchedItem = _.find(list, {MainId : item[parentProps]});
					if(matchedItem){
						if(!matchedItem.CustomEstRules){
							matchedItem.CustomEstRules = [];
						}
						// matchedItem.CustomEstRules.push(item);

						item.CustomEstRuleFk = matchedItem.Id;
						item.ParentCode = matchedItem.Code;
					}
				}
			};

			// used for composite rule which combine the prjEstRule and estRule
			service.generateRuleCompositeList = function generateRuleCompositeList(items){

				let result = items.EstRulesEntities;
				result = items && items.PrjEstRulesEntities && items.PrjEstRulesEntities.length ? result.concat(items.PrjEstRulesEntities) : result;

				let cnt = 0;
				angular.forEach(result, function(item){
					item.MainId = item.Id;
					item.Id = ++cnt;
					item.CustomEstRuleFk = null;
					item.ParentCode = null;
				});

				let prjRules = _.filter(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('PrjEstRuleFk')){
						return item;
					}
				});

				let prjEstRules = _.filter(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(!item.hasOwnProperty('PrjEstRuleFk')){
						return item;
					}
				});

				angular.forEach(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('PrjEstRuleFk')){
						attachProp(item, prjRules, 'PrjEstRuleFk');
					}
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('EstRuleFk')){
						attachProp(item, prjEstRules, 'EstRuleFk');
					}
				});
				result = _.sortBy(result, ['Sorting', 'Code']);
				let context = {
					treeOptions:{
						parentProp : 'CustomEstRuleFk',
						childProp : 'CustomEstRules'
					},
					IdProperty: 'Id'
				};
				return basicsLookupdataTreeHelper.buildTree(result, context);
			};

			service.getCodeIsUnqiue=function getCodeIsUnqiue(prjId,parameterId,code,valueType,isLookup)
			{
				isLookup = !(isLookup === 0 || !isLookup);
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl+'estimate/rule/projectestruleparam/issodecodeinall?prjId=' + prjId + '&parameterId=' +parameterId + '&code=' + code + '&valueType='+valueType + '&isLookup='+isLookup).then(function (response) {
					let isUnquie = response.data;
					defer.resolve(isUnquie);
				});
				return defer.promise;
			};

			service.CheckCodeConflict = function CheckCodeConflict(prjId,parameterId,value,valueType,isLookup) {
				isLookup = !(isLookup === 0 || !isLookup);
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl+'estimate/rule/projectestruleparam/CheckCodeConflict?prjId=' + prjId + '&parameterId=' +parameterId + '&code='+value+'&valueType='+valueType+'&isLookup='+isLookup).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			return service;
		}]);
})(angular);
