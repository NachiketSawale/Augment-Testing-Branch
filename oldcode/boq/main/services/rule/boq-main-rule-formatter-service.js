/**
 * Created by zos on 1/8/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainRuleFormatterService
	 * @function
	 *
	 * @description
	 * boqMainRuleFormatterService provides list of lookup data for boq item
	 */
	angular.module(moduleName).factory('boqRuleFormatterService', ['$http', '$q', 'boqRuleComplexLookupService',
		function ($http, $q, boqRuleComplexLookupService) {
			var service = {},
				lookupData = {
					estPrjOrMdcRules: [],
					PrjOrWic2BoqRules: []
				};

			function getRuleCode(rule) {
				return rule.Code;
			}

			function getRuleDescription(rule) {
				if (!rule.DescriptionInfo) {
					return rule.Code;
				}

				if (rule.DescriptionInfo.Translated) {
					return rule.DescriptionInfo.Translated;
				}

				if (rule.DescriptionInfo.Description) {
					return rule.DescriptionInfo.Description;
				}

				return rule.Code;
			}

			function GeneratedRuleFormulaByField(rules, getFieldValue) {
				var result = '';

				if (rules && angular.isArray(rules)) {
					_.forEach(rules, function (item, index) {
						if (!item.IsExecution) {
							return;
						}
						var code = '[' + getFieldValue(item) + ']';
						if (item.Operand && item.Operand !== 1) {
							if ((item.Operand + 1) === 0) {
								code = '-' + code;
							} else {
								code = item.Operand + '*' + code;
							}
						}
						if (index === 0 || result === '') {
							result += code;
						} else {
							if (item.Operand && item.Operand < 0) {
								result += code;
							} else {
								result += '+' + code;
							}
						}
					});
				}

				return result;
			}

			service.GeneratedRuleFormula = function (rules) {
				return GeneratedRuleFormulaByField(rules, getRuleCode);
			};

			service.GeneratedRuleFormulaDesc = function (rules) {
				return GeneratedRuleFormulaByField(rules, getRuleDescription);
			};

			// this function is used to construct the right boqRule for display
			service.generateCompositeBoqRuleItem = function generateCompositeBoqRuleItem(boq2Rule, prjOrMdcRule) {
				if (prjOrMdcRule && boq2Rule) {
					boq2Rule.MainId = prjOrMdcRule.Id;
					boq2Rule.Code = prjOrMdcRule.Code;
					boq2Rule.EstRuleExecutionTypeFk = prjOrMdcRule.EstRuleExecutionTypeFk;
					boq2Rule.MdcLineItemContextFk = prjOrMdcRule.MdcLineItemContextFk;
					boq2Rule.ProjectFk = prjOrMdcRule.ProjectFk;
					boq2Rule.Icon = prjOrMdcRule.Icon;
					boq2Rule.DescriptionInfo = prjOrMdcRule.DescriptionInfo;
					boq2Rule.HasChildren = prjOrMdcRule.HasChildren;
					boq2Rule.IsForBoq = prjOrMdcRule.IsForBoq;
					boq2Rule.IsForEstimate = prjOrMdcRule.IsForEstimate;
					boq2Rule.IsLive = prjOrMdcRule.IsLive;
					boq2Rule.BasRubricCategoryFk = prjOrMdcRule.BasRubricCategoryFk;
					// boq2Rule.Operand = prjOrMdcRule.Operand;
					boq2Rule.Remark = prjOrMdcRule.Remark;
					boq2Rule.FormFk = prjOrMdcRule.FormFk;
					boq2Rule.IsPrjRule = prjOrMdcRule.IsPrjRule;
				}
				return boq2Rule;
			};

			var setRuleAndRuleAssignment4BoqItems = function (boqItems, boq2MdcOrPrjRules, prjOrMdcRules) {
				angular.forEach(boqItems, function (boqItem) {
					var boq2Rules = _.filter(boq2MdcOrPrjRules, function (boq2MdcOrPrjRule) {
						return boq2MdcOrPrjRule.BoqHeaderFk === boqItem.BoqHeaderFk && boq2MdcOrPrjRule.BoqItemFk === boqItem.Id;
					});
					var rule4BoqItem, ruleAssignment = [];
					if (boq2Rules && boq2Rules.length) {
						if (!boqItem.IsWicItem) {
							angular.forEach(boq2Rules, function (boq2PrjRule) {
								rule4BoqItem = _.find(prjOrMdcRules, {Id: boq2PrjRule.PrjEstRuleFk});

								service.generateCompositeBoqRuleItem(boq2PrjRule, rule4BoqItem);

								if (boq2PrjRule && boq2PrjRule.Code) {
									ruleAssignment.push(boq2PrjRule);
								}
							});
						} else {
							angular.forEach(boq2Rules, function (boq2MdcRule) {
								rule4BoqItem = _.find(prjOrMdcRules, {Id: boq2MdcRule.EstRuleFk});

								service.generateCompositeBoqRuleItem(boq2MdcRule, rule4BoqItem);

								if (boq2MdcRule && boq2MdcRule.Code) {
									ruleAssignment.push(boq2MdcRule);
								}
							});
						}
					}
					boqItem.RuleAssignment = ruleAssignment;
					boqItem.RuleFormula = GeneratedRuleFormulaByField(ruleAssignment, getRuleCode);
					boqItem.RuleFormulaDesc = GeneratedRuleFormulaByField(ruleAssignment, getRuleDescription);

					var childBoqItems = boqItem.BoqItems;
					if (childBoqItems && childBoqItems.length) {
						setRuleAndRuleAssignment4BoqItems(childBoqItems, boq2MdcOrPrjRules, prjOrMdcRules);
					}
				});
			};

			service.buildRuleAndRuleAssignment = function buildRuleAndRuleAssignment(boqTreeItems, boq2MdcOrPrjRules, prjOrMdcRules) {

				service.initialize(boqTreeItems);

				if (boq2MdcOrPrjRules && boq2MdcOrPrjRules.length && prjOrMdcRules && prjOrMdcRules.length && boqTreeItems && boqTreeItems.length) {
					lookupData.estPrjOrMdcRules = prjOrMdcRules;
					lookupData.PrjOrWic2BoqRules = boq2MdcOrPrjRules;
					// as the boqTreeItems has a hirachical structure, so a recursion function here to handler it
					setRuleAndRuleAssignment4BoqItems(boqTreeItems, boq2MdcOrPrjRules, prjOrMdcRules);
				}
			};

			service.initialize = function initialize(boqTreeItems) {

				if (!boqTreeItems || !angular.isArray(boqTreeItems)) {
					return;
				}

				angular.forEach(boqTreeItems, function (boqItem) {
					// to show the rule and parameter icon
					boqItem.Rule = [];
					boqItem.Param = [];

					var childBoqItems = boqItem.BoqItems;

					if (childBoqItems && childBoqItems.length) {
						initialize(childBoqItems);
					}
				});
			};

			service.getItemByIdNew = function (item) {
				return _.map(boqRuleComplexLookupService.getItemById(item.RuleAssignment), 'Icon');
			};

			service.getEstPrjOrMdcRules = function getEstPrjOrMdcRules() {
				return lookupData.estPrjOrMdcRules;
			};

			return service;
		}]);
})(angular);
