/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateRuleItems2RuleLookupService
	 * @function
	 *
	 * @description
	 * estimateRuleItems2RuleLookupService provides list of lookup data for estimate main filter structures and line item
	 */
	angular.module(moduleName).factory('estimateAssembliesRuleFormatterService', ['$http', '$q',
		'estimateAssembliesRuleComplexLookupService', '$injector',
		function ($http, $q, estimateAssembliesRuleComplexLookupService, $injector)
		{
			let assemblyCategoryEstHeaderFk = null;

			let service = {
				getAssemblyCategoryEstHeaderFk: getAssemblyCategoryEstHeaderFk, // after the extra data is loaded, the headerfk is loaded too
				getIconIds: getIconIds, // used in formatter options definition in columns
				loadRuleRelationsAsync: loadRuleRelationsAsync,
				loadRuleRelationsTreeAsync: loadRuleRelationsTreeAsync,
				lookupFormatter: lookupFormatter // used in lookup default options definition
			};

			function getHeaderFk(items) {
				if(! _.isArray(items)) {
					items = [items];
				}
				return (items[0] || {}).EstHeaderFk || -1;
			}

			function loadRuleRelationsAsync(mainEntities, mainEntityServiceName, relationEntityServiceName) {
				let deferred = $q.defer();
				let headerFk = getHeaderFk(mainEntities);
				// first load all the est rules
				estimateAssembliesRuleComplexLookupService.getListAsync().then(function(){
					// load all the relation-ship data under the current estHeaderFk
					$injector.get(relationEntityServiceName).getListAsync(headerFk).then(function () {
						$injector.get(relationEntityServiceName).addRelationsToMainEntities(
							mainEntities, mainEntityServiceName, relationEntityServiceName
						);
						deferred.resolve();
					});
				});
				return deferred.promise;
			}

			function loadRuleRelationsTreeAsync(mainEntitiesTree, mainEntityServiceName, relationEntityServiceName, treeOptions) {
				let deferred = $q.defer();
				let flatList = $injector.get('cloudCommonGridService').flatten(mainEntitiesTree, [], treeOptions.childProp);
				let headerFk = getHeaderFk(flatList);

				let setData = function(headerFk, flatList) {
					flatList.map(function(item){
						if(!item.EstHeaderFk) {
							item.EstHeaderFk = headerFk;
						}
					});
					estimateAssembliesRuleComplexLookupService.getListAsync().then(function(){
						// load all the relation-ship data under the current estHeaderFk
						$injector.get(relationEntityServiceName).getListAsync(headerFk).then(function () {
							$injector.get(relationEntityServiceName).addRelationsToMainEntities(
								flatList, mainEntityServiceName, relationEntityServiceName
							);

							deferred.resolve();
						});
					});
				};

				if(headerFk === -1) { // if the header is not set
					$injector.get('estimateAssembliesService').getHeaderFkAsync().then(function(rsHeaderFk){
						assemblyCategoryEstHeaderFk = rsHeaderFk;
						setData(rsHeaderFk, flatList);
					});
				}else{
					assemblyCategoryEstHeaderFk = headerFk;
					setData(headerFk, flatList);
				}
				return deferred.promise;
			}

			function getAssemblyCategoryEstHeaderFk() {
				return assemblyCategoryEstHeaderFk;
			}

			// format the lookup editor
			function lookupFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				if(!entity){
					return '';
				}

				let column = {formatterOptions: {serviceName: 'basicsCustomizeRuleIconService'}};

				let icons = getIconIds(entity);
				return  $injector.get('platformGridDomainService').formatter('imageselect')(null,null, icons, column, entity, null, null);
			}

			function getIconIds(mainEntity) {
				if(!mainEntity){
					return [];
				}

				initEstRule(mainEntity);

				let RuleIcons = mainEntity.RuleIcons ? mainEntity.RuleIcons : mainEntity.Rule;
				return estimateAssembliesRuleComplexLookupService.getIconValuesByIds(RuleIcons || []);
			}

			// get rules of line item or filter structures async
			service.getItemByRuleAsync = function getItemByRuleAsync(mainEntity) {
				if(!mainEntity){
					return $q.when([]);
				}

				initEstRule(mainEntity);

				let RuleIcons = mainEntity.RuleIcons ? mainEntity.RuleIcons : mainEntity.Rule;
				let returnValues = estimateAssembliesRuleComplexLookupService.getIconValuesByIds(RuleIcons || []);
				return $q.when(returnValues);
			};

			function initEstRule(entity) {
				let ruleIds = entity.RuleIcons ? entity.RuleIcons : entity.Rule;
				if (ruleIds && ruleIds.length > 0){
					entity.RuleAssignment = estimateAssembliesRuleComplexLookupService.getFlatList().filter(function(e) {
						return _.includes(ruleIds, e.Id);
					});
				}
			}

			return service;
		}]);
})();
