/**
 * Created by joshi on 04.01.2016.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRuleUpdateService
	 * @description provides rules to create, save or delete for the line items
	 */
	angular.module(moduleName).factory('estimateMainRuleUpdateService', ['estimateRuleAssignmentService', '$injector', '$rootScope', 'platformModuleStateService',
		function (estimateRuleAssignmentService, $injector, $rootScope, platformModuleStateService) {
			let service = {},
				ruleToSave = [],
				prjRuleToSave = [],
				// used for the situation that user choose one prjRule then delete the one immediately
				tempAddedRule = [];

			let getEstRule = function getEstRule(rule, destItem, itemName, action) {
				return{
					Id:0,
					Code:rule.Code,
					DescriptionInfo : rule.DescriptionInfo,
					PrjEstRuleFk : rule.MainId ? rule.MainId : rule.Id,
					ItemName:itemName,
					Action:action,
					Comment:rule.Comment,
					Icon:rule.Icon,
					OriginaPrjEstRuleFk:rule.OriginalMainId ? rule.OriginalMainId:rule.Id,
					FormFk: rule.FormFk
				};
			};

			service.updateRuleAssignment = function updateRuleAssignment(ruleAssignment, optionsEx, EntityEx, updateInfo){

				if(!ruleAssignment)
				{
					return;
				}

				let ruleAssignmentSelected = _.find(ruleToSave, {ItemName : optionsEx.itemName, Code : ruleAssignment.Code});

				if(ruleAssignmentSelected){
					estimateRuleAssignmentService.updateProperties(ruleAssignmentSelected, updateInfo);
				}else{
					prjRuleToSave.push(ruleAssignment);
					// this line code make
					setRuleItem(ruleAssignment, EntityEx, optionsEx.itemServiceName, optionsEx.itemName, 'ToSave', updateInfo);
					increaseModifiedEntityCount();
				}

				if(EntityEx.RuleAssignment && _.isArray(EntityEx.RuleAssignment))
				{
					let assignment = _.find(EntityEx.RuleAssignment, {Code : ruleAssignment.Code});

					if(assignment){
						estimateRuleAssignmentService.updateProperties(assignment, updateInfo);
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name increaseModifiedEntityCount
			 * @description increase the modified entity count, Activate the UI Save button state
			 */
			function increaseModifiedEntityCount() {
				let estimateMainService = $injector.get('estimateMainService');
				let state = platformModuleStateService.state(estimateMainService.getModule());
				state.modifications = state.modifications || {};
				state.modifications.EntitiesCount = state.modifications.EntitiesCount || 0;
				state.modifications.EntitiesCount += 1;
				forceRootScopeApply();
			}

			/**
			 * @ngdoc function
			 * @name forceRootScopeApply
			 * @description force the root scope to apply
			 */
			function forceRootScopeApply() {
				if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
					$rootScope.$apply();
				}
			}

			/* jshint -W074 */ //
			/* jshint -W003 */ //
			let setRuleItem = function setRuleItem(rule, destItem, serviceName, itemName, action, updateInfo)
			{
				let validItemName = destItem.IsRoot ? 'EstHeader' : itemName;

				let item = getEstRule(rule, destItem, validItemName, action);

				if(updateInfo)
				{
					estimateRuleAssignmentService.updateProperties(item, updateInfo);
				}

				setLeadingStructureFk(item, destItem, serviceName, itemName);

				ruleToSave.push(item);
			};

			/* jshint -W003 */ //
			let setLeadingStructureFk = function(item, destItem, serviceName){
				let itemId = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;
				if(destItem.IsRoot){
					item.EstHeaderFk = itemId;
				}else{
					switch (serviceName){
						case'estimateMainRootService':
							item.EstHeaderFk= itemId;
							break;
						case'estimateMainService':
							item.EstLineItemFk = itemId;
							break;
						case 'projectAssemblyMainService':
							item.EstLineItemFk = itemId;
							break;
						case'estimateMainBoqService':
							item.BoqItemFk = itemId;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case'boqMainService':
							item.BoqItemFk = destItem.Id;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case'estimateMainActivityService':
							item.PsdActivityFk = itemId;
							break;
						case'estimateMainAssembliesCategoryService':
							item.EstAssemblyCatFk = itemId;
							break;
						case'projectAssemblyStructureService':
							item.EstAssemblyCatFk = itemId;
							item.IsPrjAssembly = true;
							break;
						case'estimateMainLocationService':
							item.PrjLocationFk = itemId;
							break;
						case'estimateMainControllingService':
							item.MdcControllingUnitFk = itemId;
							break;
						case'estimateMainProcurementStructureService':
							item.PrcStructureFk = itemId;
							break;
						case 'costGroupStructureDataServiceFactory':
							item.CostGroupFk =  itemId;  // cost group structure (right container)
							item.CostGroupCatFk = destItem.CostGroupCatalogFk; // cost group Catalog (left container)
							break;
					}
				}
			};

			service.setRuleToSave = function setRuleToSave(rules, destItem, serviceName, itemName, isRuleExecution, overwrite) {
				if(_.isArray(rules)){
					angular.forEach(rules, function(rule){
						if(rule){
							let isSavePrjRule = true;
							if(overwrite && !overwrite.canRuleOverwrite) {
								if (destItem && _.isArray(destItem.Rule) && destItem.Rule.indexOf(rule.Code) !== -1) {
									return;
								}
								for (let i = 0; i < prjRuleToSave.length; ++i) {
									if (prjRuleToSave[i].Code === rule.Code) {
										isSavePrjRule = false;
									}
								}
							}

							if(isSavePrjRule){
								prjRuleToSave.push(rule);
							}

							let isExecution = (isRuleExecution === false || rule.IsExecution === false) ? false : true;

							setRuleItem(rule, destItem, serviceName, itemName, 'ToSave', estimateRuleAssignmentService.createNewEntity(rule, isExecution));
						}
					});
				}
			};

			service.updateRuleToSave = function updateRuleToSave(updateData, estHeaderId, projectId, isPrjAssembly) {
				angular.forEach(ruleToSave, function(item){
					if(item){
						if(!_.isArray(updateData[item.ItemName + 'Rule'+ item.Action])){
							updateData[item.ItemName + 'Rule'+ item.Action] = [];
						}
						item.EstHeaderFk = estHeaderId;
						updateData[item.ItemName + 'Rule'+ item.Action].push(item);
					}
				});

				if(_.isArray(prjRuleToSave) && prjRuleToSave.length > 0) {
					var tempPrjRuleToSave = _.map(prjRuleToSave, function (item) {
						return item ? angular.extend(item, {ProjectFk: projectId}) : item;
					});
					if (isPrjAssembly){
						updateData.PrjAssemblyRuleToSave = tempPrjRuleToSave;
					}
					else {
						updateData.PrjEstRuleToSave = tempPrjRuleToSave;
					}
				}

				updateData.ProjectId = projectId;

				return updateData;
			};

			service.setRuleToDelete = function setRuleToDelete(rules, destItem, serviceName, itemName) {
				if(_.isArray(rules)){
					angular.forEach(rules, function(rule){
						if(rule){
							if(_.find(tempAddedRule, {Code: rule.Code})){
								// when the user delete the item which is a new one
								prjRuleToSave = _.filter(prjRuleToSave, function(prjRule){return prjRule.Code !== rule.Code;});
								// ruleToSave has two actions
								ruleToSave = _.filter(ruleToSave, function(ruleItem){return ruleItem.Code !== rule.Code;});
							}
							else{
								setRuleItem(rule, destItem, serviceName, itemName, 'ToDelete');
							}

						}
					});
				}
			};

			service.clear = function clear() {
				ruleToSave = [];
				prjRuleToSave = [];
				tempAddedRule = [];
			};

			service.getRuleToDelete = function getRuleToDelete(){
				return _.filter(ruleToSave, {Action:'ToDelete'});
			};

			service.getRuleToSave = function getRuleToSave(){
				return _.filter(ruleToSave, {Action:'ToSave'});
			};

			service.getPrjRuleToSave = function getPrjRuleToSave(){
				return prjRuleToSave;
			};

			service.getTempAddedRule = function getTempAddedRule(){
				return tempAddedRule;
			};

			return service;
		}
	]);

})(angular);

