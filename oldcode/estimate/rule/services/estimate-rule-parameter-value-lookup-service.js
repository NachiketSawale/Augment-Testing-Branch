(function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleParameterValueLookupService',
		['$http', '$q', 'estimateRuleParameterValueService', 'basicsLookupdataLookupDescriptorService',
			function ($http, $q, estimateRuleParameterValueService, basicsLookupdataLookupDescriptorService) {
				let service = {};
				service.getList = function getList(entity) {

					let list = [];

					let matchList = _.orderBy(estimateRuleParameterValueService.getList(),['Sorting'],['asc']);
					if(!matchList.length) {
						list = basicsLookupdataLookupDescriptorService.getData('RuleParameterValueLookup');

					}else{
						list = _.filter(matchList,function(pitem){
							return pitem.Code === entity.Code;
						});

						if(!list.length){
							list = basicsLookupdataLookupDescriptorService.getData('RuleParameterValueLookup');
						}
					}

					if(_.size(list)>0){
						list = _.filter(list,function(pitem){
							return pitem.Code === entity.Code;
						});
					}

					return $q.when(list);

				};

				service.getItemById = function getItemById(id) {
					let item;
					let list = estimateRuleParameterValueService.getList();
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === id) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						let targetData = basicsLookupdataLookupDescriptorService.getData('RuleParameterValueLookup');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[id];
						}
					}
					return item;
				};

				service.getItemByKey = function getItemByKey(key) {
					let item;
					let deferred = $q.defer();
					let list = estimateRuleParameterValueService.getList();
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						let targetData = basicsLookupdataLookupDescriptorService.getData('RuleParameterValueLookup');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[key];
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				};
				service.getItemByIdAsync = function getItemByIdAsync(value) {
					return service.getItemByKey(value);
				};

				service.getSearchList = function () {
					return service.getList();
				};

				return service;
			}]);
})(angular);
