/**
 * Created by xia on 4/21/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).factory('estimateAssemblyRuleComplexLookupProcessService',
		['estimateAssembliesRuleComplexLookupService','platformRuntimeDataService', function (estimateAssembliesRuleComplexLookupService, platformRuntimeDataService) {

			let service = {};

			service.processItems = function (gridData, isSequenceReadonly){

				_.forEach(gridData, function(item){
					if(isSequenceReadonly){// item.EstRuleExecutionTypeFk === 3 ||
						platformRuntimeDataService.readonly(item, [{field : 'EstEvaluationSequenceFk', readonly : true }]);
					}else{
						platformRuntimeDataService.readonly(item, [{field : 'EstEvaluationSequenceFk', readonly : false }]);
					}
				});
			};

			service.select = function (lookupItem, entity) {
				if (!lookupItem || !entity) {
					return '';
				}

				let iconName = '';

				if(angular.isDefined(entity.Ischangeable)){
					if(entity.Ischangeable){
						iconName = 'editable';
					}else{
						iconName = 'not-editable';
					}
				}else{
					let sequence = estimateAssembliesRuleComplexLookupService.getItemById(entity.EstEvaluationSequenceFk);
					if(sequence && sequence.Ischangeable){
						iconName = 'editable';
					}else{
						iconName = 'not-editable';
					}
				}

				return 'cloud.style/content/images/control-icons.svg#ico-'+ iconName;
			};

			return service;
		}]);
})(angular);
