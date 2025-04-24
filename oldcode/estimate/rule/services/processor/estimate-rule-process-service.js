/**
 * Created by joshi on 03.12.2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleProcessor
	 * @function
	 *
	 * @description
	 * The estimateRuleProcessor process rules.
	 */
	angular.module(moduleName).factory('estimateRuleProcessor', ['_', function (_) {

		let service = {};

		service.assignRules = function assignRules(sourceItems, destItem, IsExecution){
			if(destItem && destItem.Id)
			{
				let ruleItems = destItem.RuleAssignment;

				if(ruleItems) {
					angular.forEach(sourceItems, function (sourceItem) {
						let sourceItemCopy = angular.copy(sourceItem);
						if (!_.find(ruleItems, {Code: sourceItemCopy.Code})) {
							if (IsExecution) {
								sourceItemCopy.IsExecution = true; // set the IsExecution default value is true
							}
							ruleItems.push(sourceItemCopy);
						}
					});
				}
				if(ruleItems && ruleItems.length > 0){
					destItem.RuleAssignment = ruleItems;
				}
			}
		};

		return service;

	}]);
})(angular);
