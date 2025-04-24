(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonRuleAnalyzerService';
	basics.factory(serviceName, ['$q', '_', 'platformObjectHelper', 'basicsCommonRuleEditorService', 'basicsCommonOperatorFunctionsService',

		function ($q, _, objectHelper, ruleEditorService, operatorService) {

			let userConfig = {};

			function processAtomicRules(rule, entity) {
				if (objectHelper.isSet(rule.Operands[0]) && objectHelper.isSet(rule, rule.OperatorFk, rule.Operands[0].NamedProperty.FieldName, entity)) {
					// get the Operator Function
					const operatorFunction = operatorService.getOperatorFunctionById(rule.OperatorFk);
					// get the requiered Dto Prop Values to perform this operation
					const requiredParameterValues = operatorService.getRequiredFunctionParameterValues(rule, entity);
					// apply the propValues to the Operator Function
					rule.valid = operatorFunction.apply(null, requiredParameterValues);
					return rule.valid;
				}
				return false;
			}

			function any(list) {
				let result = false;
				_.each(list, function (item) {
					if (item.valid === true) {
						result = true;

					}
				});
				return result;
			}

			function all(list) {
				let result = true;
				_.each(list, function (item) {
					if (!item.valid) {
						result = false;

					}
				});
				return result;
			}

			/**
			 * OperatorFk: 1 = All must Match , 2 = Any Must Match
			 * @param flatGroupList
			 * @param entity
			 */
			function analyze(flatGroupList, entity) {
				_.each(flatGroupList, function (group) {
					_.each(group.Children, function (child) {
						// process only the rules
						if (child.ConditiontypeFk === 2) {
							group.valid = processAtomicRules(child, entity);
							// All must Match
							if (group.OperatorFk === 1 && !group.valid) {
								// ignore
							}
							// Any Must Match
							else if (group.OperatorFk === 2 && group.valid) {
								// ignore
							}
						}
					});
				});

				// flat array is sorted from deepest to root
				function isValid(items) {
					let result = false;

					for (let i = 0; i < items.length; i++) {
						if (items[i].OperatorFk === 1) {
							result = all(items[i].Children);
						} else if (items[i].OperatorFk === 2) {
							result = any(items[i].Children);
						}
						items[i].valid = result;
					}
					return result;
				}

				return isValid(flatGroupList);
			}

			function getGroupsWithLevel(rulesList) {
				const flatGroupList = [];

				function determine(rulesList, lvl) {
					let level = lvl || 0;
					_.each(rulesList, function (item) {
						if (item.ConditiontypeFk === 1 && !_.isEmpty(item.Children)) {
							// if its not the root
							if (item.ConditionFktop) {
								level++;
							}
							flatGroupList.push(item);
							item.level = _.clone(level);
							determine(item.Children, level);
						}
					});
				}

				determine(rulesList);
				return flatGroupList;
			}

			function needToApply(rulesList, entity) {
				let groupsWithLevel = getGroupsWithLevel(rulesList);
				groupsWithLevel = _.orderBy(groupsWithLevel, ['level'], ['desc']);
				return analyze(groupsWithLevel, entity);
			}

			function rgbToHex(rgb) {
				return rgb ? _.padStart(rgb.toString(16), 7, '#000000') : '#000000';
			}

			function getColor(rgb) {
				return 'background-color:' + rgbToHex(rgb) + ';';
			}

			function processBackgroundConfigs(bgConfigs, entity) {
				let styles = '';
				if (!_.isEmpty(bgConfigs)) {
					_.each(bgConfigs, function (bgConfig) {
						if (objectHelper.isSet(bgConfig.ConditionFk) && bgConfig.IsDisabled !== true) {
							const bgRules = ruleEditorService.getRuleTreeByTopFk(bgConfig.ConditionFk, userConfig.RuleDefinitions);
							if (needToApply(bgRules, entity)) {
								styles = getColor(bgConfig.Colour);
								// the first matching rule will be applied, early out
								return false;
							}
						}
					});
					return styles;
				}
			}

			/***
			 * @param fontConfig
			 */
			function getFontStyles(fontConfig) {
				let styles = '';
				if (fontConfig.Isbold) {
					styles += 'font-weight:bold;';
				}
				if (fontConfig.Isitalic) {
					styles += 'font-style:italic;';
				}
				if (fontConfig.Isstriked) {
					styles += 'text-decoration: line-through;';
				}
				if (fontConfig.Isunderlined) {
					styles += 'text-decoration: underline;';
				}
				styles += 'color:' + rgbToHex(fontConfig.Colour) + ';';
				return styles;
			}

			function processFontConfigs(fontConfigs, entity) {
				let styles = '';
				if (!_.isEmpty(fontConfigs)) {
					_.each(fontConfigs, function (fontConfig) {
						if (objectHelper.isSet(fontConfig.ConditionFk) && fontConfig.IsDisabled !== true) {
							const fontRules = ruleEditorService.getRuleTreeByTopFk(fontConfig.ConditionFk, userConfig.RuleDefinitions);
							if (needToApply(fontRules, entity)) {
								styles = getFontStyles(fontConfig);
								// the first matching rule will be applied, early out
								return false;
							}
						}
					});
				}
				return styles;
			}

			return {
				// returns the Classes which will be applied to a gridCell depending on the analyzed result
				getAnalyzedClasses: function getAnalyzedClasses(entity) {
					let bgClasses;
					let fontClasses;
					if (!_.isEmpty(userConfig)) {
						bgClasses = processBackgroundConfigs(userConfig.MatrixbackgroundDtos, entity);
						fontClasses = processFontConfigs(userConfig.MatrixfontDtos, entity);
					}
					return bgClasses + ' ' + fontClasses;
				},
				setConfig: function (config) {
					ruleEditorService.setConfig(config);
					_.each(config.RuleDefinitions, function (ruleDefinition) {
						ruleEditorService.processIncomingRules(ruleDefinition);
					});
					userConfig = config;
				}
			};
		}]);
})(angular);
