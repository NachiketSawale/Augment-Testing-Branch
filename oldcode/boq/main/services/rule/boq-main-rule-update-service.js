/**
 * Created by zos on 1/8/2018.
 */
(function () {
	'use strict';
	/* global _ */

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqRuleUpdateService', ['boqRuleComplexLookupService', 'boqRuleFormatterService', 'estimateRuleAssignmentService',
		function (boqRuleComplexLookupService, boqRuleFormatterService, estimateRuleAssignmentService) {
			var service = {},
				WicBoqRuleToSave = [],
				WicBoqRuleToDelete = [],
				PrjBoqRuleToSave = [],
				PrjBoqRuleToDelete = [],
				prjRuleToSave = [];

			var generateRuleItem = function setRuleItem(rule, destItem, itemName, updateInfo) {
				var item;

				if (itemName === 'PrjBoq') {
					item = {
						Id: rule.Version > 0 ? rule.Id : 0,
						Code: rule.Code,
						BoqItemFk: destItem.Id,
						BoqHeaderFk: destItem.BoqHeaderFk,
						PrjEstRuleFk: rule.MainId ? rule.MainId : (rule.PrjEstRuleFk ? rule.PrjEstRuleFk : rule.Id),
						ItemName: itemName,
						Comment: rule.Comment,
						Icon: rule.Icon,
						Version: rule.Version > 0 ? rule.Version : 0
					};
				} else if (itemName === 'WicBoq') {
					item = {
						Id: rule.Version > 0 ? rule.Id : 0,
						Code: rule.Code,
						EstRuleFk: rule.MainId ? rule.MainId : (rule.EstRuleFk ? rule.EstRuleFk : rule.Id),
						BoqItemFk: destItem.Id,
						BoqHeaderFk: destItem.BoqHeaderFk,
						ItemName: itemName,
						Comment: rule.Comment,
						Icon: rule.Icon,
						Version: rule.Version > 0 ? rule.Version : 0
					};
				}
				if (updateInfo) {
					estimateRuleAssignmentService.updateProperties(item, updateInfo);
				}

				return item;
			};

			service.updateRuleAssignment = function updateRuleAssignment(ruleAssignment, optionsEx, EntityEx, updateInfo) {

				if (!ruleAssignment) {
					return;
				}

				var ruleAssignmentSelected, ruleItem;
				if (boqRuleComplexLookupService.isNavFromBoqProject()) {
					ruleAssignmentSelected = _.find(PrjBoqRuleToSave, {Code: ruleAssignment.Code});
					if (ruleAssignmentSelected) {
						estimateRuleAssignmentService.updateProperties(ruleAssignmentSelected, updateInfo);
					} else {
						prjRuleToSave.push(ruleAssignment);
						// this line code make
						ruleItem = generateRuleItem(ruleAssignment, EntityEx, 'PrjBoq', updateInfo);
						PrjBoqRuleToSave.push(ruleItem);
					}
				} else {
					ruleAssignmentSelected = _.find(WicBoqRuleToSave, {Code: ruleAssignment.Code});
					if (ruleAssignmentSelected) {
						estimateRuleAssignmentService.updateProperties(ruleAssignmentSelected, updateInfo);
					} else {
						// this line code make
						ruleItem = generateRuleItem(ruleAssignment, EntityEx, 'WicBoq', updateInfo);
						WicBoqRuleToSave.push(ruleItem);
					}
				}

				if (EntityEx.RuleAssignment && _.isArray(EntityEx.RuleAssignment)) {
					var assignment = _.find(EntityEx.RuleAssignment, {Code: ruleAssignment.Code});
					if (assignment) {
						estimateRuleAssignmentService.updateProperties(assignment, updateInfo);
					}
				}
			};

			service.setPrjBoqRulesToSave = function setPrjBoqRulesToSave(rules, destItem, selectedPrjEstRule) {
				if (_.isArray(rules)) {
					if (!_.isArray(destItem.RuleAssignment)) {
						destItem.RuleAssignment = [];
					}

					angular.forEach(rules, function (rule) {
						if (rule) {
							if (destItem && _.isArray(destItem.RuleAssignment) && _.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							})) {
								return;
							}

							// existed in PrjBoqRuleToSave
							if (_.find(PrjBoqRuleToSave, {Code: rule.Code})) {
								return;
							}
							// recover it when find it in toDeleteItems
							if (_.find(PrjBoqRuleToDelete, {Code: rule.Code})) {
								PrjBoqRuleToDelete = _.filter(PrjBoqRuleToDelete, function (ruleItemToDelete) {
									return ruleItemToDelete.Code !== rule.Code;
								});
								return;
							}
							if (!_.find(prjRuleToSave, {Code: selectedPrjEstRule.Code})) {
								prjRuleToSave.push(selectedPrjEstRule);
							}

							PrjBoqRuleToSave.push(rule);
							destItem.RuleAssignment.push(rule);
						}
					});

					destItem.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(destItem.RuleAssignment);
					destItem.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(destItem.RuleAssignment);
				}
			};

			service.setPrjBoqRulesToDelete = function setPrjBoqRulesToDelete(rules, destItem) {
				if (_.isArray(rules)) {
					angular.forEach(rules, function (rule) {
						if (rule) {
							// check it exist in destItem.Rule or not
							if (destItem && _.isArray(destItem.RuleAssignment) && !_.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							})) {
								return;
							} else {
								destItem.RuleAssignment = _.filter(destItem.RuleAssignment, function (ruleAssign) {
									return rule.Code !== ruleAssign.Code;
								});
								destItem.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(destItem.RuleAssignment);
								destItem.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(destItem.RuleAssignment);
							}

							if (_.find(PrjBoqRuleToSave, {Code: rule.Code})) {
								// when the user delete the item which is a new one
								prjRuleToSave = _.filter(prjRuleToSave, function (prjRule) {
									return prjRule.Code !== rule.Code;
								});
								PrjBoqRuleToSave = _.filter(PrjBoqRuleToSave, function (ruleItemToSave) {
									return ruleItemToSave.Code !== rule.Code;
								});
								return;
							}

							PrjBoqRuleToDelete.push(rule);
						}
					});
				}
			};

			service.setWicBoqRulesToSave = function setWicBoqRulesToSave(rules, destItem) {
				if (_.isArray(rules)) {
					if (!_.isArray(destItem.RuleAssignment)) {
						destItem.RuleAssignment = [];
					}

					angular.forEach(rules, function (rule) {
						if (rule) {
							// existed in item's rule
							if (destItem && _.isArray(destItem.RuleAssignment) && _.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							})) {
								return;
							}
							// existed in WicBoqRuleToSave
							if (_.find(WicBoqRuleToSave, {Code: rule.Code})) {
								return;
							}
							// recover it when find it in toDeleteItems
							if (_.find(WicBoqRuleToDelete, {Code: rule.Code})) {
								WicBoqRuleToDelete = _.filter(WicBoqRuleToDelete, function (ruleItemToDelete) {
									return ruleItemToDelete.Code !== rule.Code;
								});
								return;
							}

							WicBoqRuleToSave.push(rule);
							destItem.RuleAssignment.push(rule);
						}
					});

					destItem.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(destItem.RuleAssignment);
					destItem.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(destItem.RuleAssignment);
				}
			};

			service.setWicBoqRulesToDelete = function setWicBoqRulesToDelete(rules, destItem) {
				if (_.isArray(rules)) {
					angular.forEach(rules, function (rule) {
						if (rule) {
							// check it exist in destItem.RuleAssignment or not
							if (destItem && _.isArray(destItem.RuleAssignment) && !_.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							})) {
								return;
							} else {
								destItem.RuleAssignment = _.filter(destItem.RuleAssignment, function (ruleAssign) {
									return rule.Code !== ruleAssign.Code;
								});
								destItem.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(destItem.RuleAssignment);
								destItem.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(destItem.RuleAssignment);
							}

							if (_.find(WicBoqRuleToSave, {Code: rule.Code})) {
								WicBoqRuleToSave = _.filter(WicBoqRuleToSave, function (ruleItemToSave) {
									return ruleItemToSave.Code !== rule.Code;
								});
								return;
							}

							WicBoqRuleToDelete.push(rule);
						}
					});
				}
			};

			service.setWicBoqRulesToModified = function setPrjOrWicBoqRulesToModified(rules, destItem) {
				if (_.isArray(rules)) {
					angular.forEach(rules, function (rule) {
						// check it exist in destItem.RuleAssignment or not
						if (rule && destItem &&
							_.isArray(destItem.RuleAssignment) &&
							_.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							}) &&
							!_.find(WicBoqRuleToSave, {Code: rule.Code})) {
							WicBoqRuleToSave.push(rule);
						}
					});
				}
			};

			service.setPrjBoqRulesToModified = function setPrjOrWicBoqRulesToModified(rules, destItem) {
				if (_.isArray(rules)) {
					angular.forEach(rules, function (rule) {
						// check it exist in destItem.RuleAssignment or not
						if (rule && destItem &&
							_.isArray(destItem.RuleAssignment) &&
							_.find(destItem.RuleAssignment, function (item) {
								return item.Code === rule.Code;
							}) &&
							!_.find(PrjBoqRuleToSave, {Code: rule.Code})) {
							PrjBoqRuleToSave.push(rule);
						}
					});
				}
			};

			service.updateRuleToSave = function updateRuleToSave(updateData, projectId) {
				updateData.WicBoqRuleToSave = WicBoqRuleToSave;
				updateData.WicBoqRuleToDelete = WicBoqRuleToDelete;
				updateData.PrjBoqRuleToSave = PrjBoqRuleToSave;
				updateData.PrjBoqRuleToDelete = PrjBoqRuleToDelete;
				updateData.EntitiesCount += WicBoqRuleToSave.length + WicBoqRuleToDelete.length + PrjBoqRuleToSave.length + PrjBoqRuleToDelete.length;

				if (boqRuleComplexLookupService.isNavFromBoqProject()) {
					if (_.isArray(prjRuleToSave) && prjRuleToSave.length > 0) {
						updateData.PrjEstRuleToSave = _.map(prjRuleToSave, function (item) {
							return item ? angular.extend(item, {ProjectFk: projectId}) : item;
						});
					}
				}

				updateData.ProjectId = projectId;

				return updateData;
			};

			// when updated successed, the response data should be merged into the boqItem's RuleAssignment
			service.handleOnRuleAssignUpdateSucceeded = function handleOnRuleAssignUpdateSucceeded(MainItemId, boqItemList, returnRuleToSave) {
				if (returnRuleToSave && _.isArray(returnRuleToSave)) {
					var boqItem = _.find(boqItemList, {Id: MainItemId});
					if (boqItem) {
						_.forEach(returnRuleToSave, function (rule) {
							var sourceAssign = _.find(boqItem.RuleAssignment, {Code: rule.Code});
							if (sourceAssign) {
								boqItem.RuleAssignment = _.filter(boqItem.RuleAssignment, function (ruleAssign) {
									return ruleAssign.Code !== rule.Code;
								});

								// get the right value
								rule.BasRubricCategoryFk = sourceAssign.BasRubricCategoryFk;
								rule.Icon = sourceAssign.Icon;
								rule.DescriptionInfo = sourceAssign.DescriptionInfo;
								rule.IsForBoq = sourceAssign.IsForBoq;
								rule.IsForEstimate = sourceAssign.IsForEstimate;
								rule.EstRuleExecutionTypeFk = sourceAssign.EstRuleExecutionTypeFk;
								rule.MdcLineItemContextFk = sourceAssign.MdcLineItemContextFk;
								rule.FormFk = sourceAssign.FormFk;
								rule.IsPrjRule = sourceAssign.IsPrjRule;
								rule.MainId = sourceAssign.PrjEstRuleFk || sourceAssign.EstRuleFk;
								boqItem.RuleAssignment.push(rule);
							}
						});
					}
				}
			};

			service.clear = function clear() {
				WicBoqRuleToSave = [];
				WicBoqRuleToDelete = [];
				PrjBoqRuleToSave = [];
				PrjBoqRuleToDelete = [];
				prjRuleToSave = [];
			};

			service.getPrjRuleToSave = function getPrjRuleToSave() {
				return prjRuleToSave;
			};

			service.getWicBoqRuleToSave = function getWicBoqRuleToSave() {
				return WicBoqRuleToSave;
			};

			service.getWicBoqRuleToDelete = function getWicBoqRuleToDelete() {
				return WicBoqRuleToDelete;
			};

			service.getPrjBoqRuleToSave = function getPrjBoqRuleToSave() {
				return PrjBoqRuleToSave;
			};

			service.getPrjBoqRuleToDelete = function getPrjBoqRuleToDelete() {
				return PrjBoqRuleToDelete;
			};

			return service;
		}
	]);
})();
