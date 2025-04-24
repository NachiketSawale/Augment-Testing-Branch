/**
 * Created by hzh on 2017/06/05.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(){
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesRuleUpdateService',['_',
		function(_){
			let ruleToSave = [],
				assemblyCategoryRule = [],
				service = [];

			service.setRuleToSave = function(entity, value){
				if (entity && value && ruleToSave.indexOf(value) === -1){
					ruleToSave.push(value);
				}
			};

			service.setAssemblyRuleToSave = function(entity){
				if (entity  && ruleToSave.indexOf(entity) === -1){
					ruleToSave.push(entity);
				}
			};

			service.setAssemblyCategoryRuleToSave = function(entity){
				if (entity && assemblyCategoryRule.indexOf(entity) === -1){
					assemblyCategoryRule.push(entity);
				}
			};

			service.removeRule = function(items){
				_.forEach(items,function(item){
					if(ruleToSave.indexOf(item) !== -1){
						ruleToSave.pop(item);
					}
				});
			};

			service.getRuleToSave = function(){
				return ruleToSave;
			};

			service.getAssemblyCategoryRuleToSave = function(){
				return assemblyCategoryRule;
			};

			service.clear = function(){
				ruleToSave = [];
				assemblyCategoryRule = [];
			};

			service.clearAll = function (args, scope) {
				service.clear();

				scope.ngModel = [];
				let entity = args.entity || args.$parent.entity;
				entity.RuleAssignment = [];

			};

			return service;
		}
	]);
})();
