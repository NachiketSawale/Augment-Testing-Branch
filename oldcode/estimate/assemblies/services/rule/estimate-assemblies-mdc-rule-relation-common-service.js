/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, globals */
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesMdcRuleRelatedToEntityAbstractService
	 * @function
	 *
	 * @description
	 */
	angular.module(moduleName).factory('estimateAssembliesMdcRuleRelationCommonService',
		['$http', '$injector',
			'$q',
			'PlatformMessenger',
			'basicsLookupdataPopupService',
			function ($http, $injector,
				$q,
				PlatformMessenger,
				basicsLookupdataPopupService
			) {
			/**
			 * the lookup valueMember is set to 'Id', after clicking the lookup item,
			 * the mainEntity.Rule is going to set to the Id integer of the rule, but we need it in array format: [Id]
			 * so re-assign the mainEntity.Rule to the ngModel of the editor scope

			 * entity.Rule = [1,2,3]
			 * value = 5 (new selected id)
			 * entity.Rule = 5 | normally the lookup editor will set it
			 * entity.Rule = [1,2,3, 5] | the wanted result
			 *
			 * */
				function manipulateRuleLookupEditorValueApply(entity, newValue, field) {
					if(entity === undefined) {return;}
					let ruleIdValues = entity[field] || [];
					if(!_.isUndefined(newValue) && !_.includes(ruleIdValues, newValue)) {
						if(ruleIdValues){
							ruleIdValues.push(newValue);
						}
					}
					entity.Rule = ruleIdValues;
				}

				// unique service
				function createService(childExtendData) {

					// along with the service once
					let popupToggle = basicsLookupdataPopupService.getToggleHelper();

					// private
					let localData = {
						ruleRelations: [], // data list cache
						currentMainEntity: {}, // data cache
						mainEntityServiceName: {}, // data cache
						popupClickIcon: null, // data cache
						popupService: null // the simplified pop up grid service
					};

					// PROTECTED,  TO BE OVERRIDDEN
					let extendData = {
						mainEntityIdField: 'Id',
						mainEntityEstHeaderFkName: 'EstHeaderFk',

						relationTbRuleFkName: 'EstRuleFk',
						relationTbRuleComment : 'Comment',
						relationTbRuleOperand : 'Operand',
						relationTbMainEntityFkName: 'EstLineItemFk',
						relationTbSequenceFkName: 'EstEvaluationSequenceFk',

						relationEntityServiceName: {}, // to which entity the rule is related

						serviceOption: {},

						getListAsync: null // child load data function
					};

					// customized data
					extendData = _.merge(extendData, childExtendData);

					// popup service operation
					let popGridService = {
						load: popupLoadData,
						popupFirstSelectedItem: popupFirstSelectedItem,
						deleteRelations: deletePopRelationItems,
						updateRelations: updateRelations,
						setSelectItem: setPopupSelectItem
					};

					function setPopupService(popService) {
						localData.popupService = popService;
					}

					function extendValue(attribute) {
						return extendData[attribute] || null;
					}

					function currentMainEntity(setEntity) {
						if (!_.isEmpty(setEntity)) {
							localData.currentMainEntity = angular.copy(setEntity);
						}
						return localData.currentMainEntity;
					}


					function addRelationsToMainEntities(mainEntities, mainEntityServiceName, relationEntityServiceName) {
						localData.mainEntityServiceName = mainEntityServiceName;
						if (_.isArray(mainEntities)) {
							mainEntities.map(function (mainEntity) {
								mainEntity.Rule = _.map(getDataList(mainEntity), extendValue('relationTbRuleFkName'));
								mainEntity.RuleRelationServiceNames = {
									m: mainEntityServiceName,
									r: relationEntityServiceName,
									mainEntityIsNew: false // the item is already existed in db
								};
							});
						}
					}

					function setAllDataList(dataList) {
						localData.ruleRelations = dataList;
					}

					function getDataList(mainEntity) {
						let dataList = localData.ruleRelations;
						if (!mainEntity) {
							mainEntity = currentMainEntity();
						}
						if (mainEntity) {
							let relationCondition = {};
							relationCondition[extendValue('relationTbMainEntityFkName')] = mainEntity[extendValue('mainEntityIdField')];
							dataList = _.filter(localData.ruleRelations, relationCondition) || [];
						}
						return dataList;
					}

					function loadListAsync(estHeaderFk) {
						estHeaderFk = estHeaderFk || -1;
						let opts = extendData.serviceOption.flatRootItem.httpRead;
						let url = opts.route + opts.endRead + '?estHeaderId=' + estHeaderFk;
						return $http.get(url).then(function (response) {
							let ruleRelations = mergeRuleDataIntoRelation(response.data || [], true);
							return ruleRelations;
						});
					}

					// add the icon info: mdcRelation.EstRuleEntity = EstRule
					function mergeRuleDataIntoRelation(relations, addToList) {
						if (_.isArray(relations)) {
							relations = relations.map(function (item) {
								let ruleEntity = $injector.get('estimateAssembliesRuleComplexLookupService')
									.getItemById(item[extendValue('relationTbRuleFkName')]);

								if (ruleEntity) {
									let sequenceEntity = $injector.get('estimateRuleSequenceLookupService')
										.getItemById(item[extendValue('relationTbSequenceFkName')]);

									let sorting = (sequenceEntity && sequenceEntity.Sorting) ? sequenceEntity.Sorting : 0;

									let newEntity = angular.copy(ruleEntity);
									// add data to item
									return angular.extend(newEntity, item, {Sorting: sorting}); // keep the relation item id, sequence, isExecution
								}
							});
						}

						if(addToList){
							setAllDataList(relations);
						}

						return relations;
					}

					// return only one relation
					function getRelationsBy(estHeaderFk, mainEntityFk, estRuleFk) {
						let condition = {};
						if (!_.isUndefined(estHeaderFk)) {
							condition[extendValue('mainEntityEstHeaderFkName')] = estHeaderFk;
						}
						if (!_.isUndefined(mainEntityFk)) {
							condition[extendValue('relationTbMainEntityFkName')] = mainEntityFk;
						}
						if (!_.isUndefined(estRuleFk)) {
							condition[extendValue('relationTbRuleFkName')] = estRuleFk;
						}

						return _.filter(getDataList(), condition);
					}

					function getHeaderFk(items) {
						if (!_.isArray(items)) {
							items = [items];
						}
						let estHeaderFk = (items[0] || {}).EstHeaderFk || -1;

						return estHeaderFk;
					}

					function reloadDataFromServer(dataList, selectedItem) {
						let promise = $q.when([]);
						if (_.isArray(dataList) && dataList.length > 0) {
							if(!selectedItem  && selectedItem !== 0) { // if it  0, it will not set selected
								selectedItem = _.first(dataList);
							}
							promise = extendData.getListAsync(getHeaderFk(dataList)).then(function(){
								refreshPopGrid(selectedItem);
							});
						}
						return promise;
					}

					function updateRelations(dataList, selectedItem) {

						let promise = $q.when([]);
						let opts = extendData.serviceOption.flatRootItem.httpUpdate;
						if (_.isArray(dataList) && dataList.length > 0) {
							let postUrl = opts.route + opts.endUpdate;
							promise = $http.post(postUrl, dataList).then(function () {
								reloadDataFromServer(dataList, selectedItem);
							});
						}
						return promise;

					}

					function addRelations(dataList, selectedItem) {

						let promise = $q.when([]);
						let opts = extendData.serviceOption.flatRootItem.httpCreate;
						if(_.isArray(dataList) && dataList.length > 0) {
							let postUrl = opts.route + opts.endCreate;
							promise = $http.post(postUrl, dataList).then(function() {
								return reloadDataFromServer(dataList, selectedItem);
							});
						}

						return promise;

					}

					function madeRelationEntity(mainEntity, ruleEntity) {
						let relationEntity = {};

						if (!_.isEmpty(mainEntity) && !_.isEmpty(ruleEntity)) {
							relationEntity = {
								Id: -1
							};
							relationEntity[extendValue('mainEntityEstHeaderFkName')] = mainEntity[extendValue('mainEntityEstHeaderFkName')];
							relationEntity[extendValue('relationTbRuleFkName')] = ruleEntity.OriginalMainId || ruleEntity.MainId || ruleEntity.Id;
							relationEntity[extendValue('relationTbRuleComment')] = ruleEntity.Comment;
							relationEntity[extendValue('relationTbRuleOperand')] = ruleEntity.Operand;
							relationEntity[extendValue('relationTbMainEntityFkName')] = mainEntity[extendValue('mainEntityIdField')];
							relationEntity[extendValue('relationTbSequenceFkName')] = ruleEntity[extendValue('relationTbSequenceFkName')];
						}

						return relationEntity;
					}

					function relationExists(mainEntity, ruleEntity) {
						let rs = getRelationsBy(
							mainEntity[extendValue('mainEntityEstHeaderFkName')],
							mainEntity[extendValue('mainEntityIdField')],
							ruleEntity.Id
						);
						return (_.isArray(rs) && rs.length > 0);
					}

					// create relation from mainEntity & ruleEntity
					function createRelations(mainEntity, ruleEntity) {
						let promise = $q.when([]);
						let rEntity = madeRelationEntity(mainEntity, ruleEntity);
						if(!_.isEmpty(rEntity) && ! relationExists(mainEntity, ruleEntity)) {
							promise = addRelations([rEntity]);
						}
						return promise;
					}

					// create relations from mainEntity & ruleEntity list
					function createMultiRelations(mainEntity, ruleEntities) {
						let promise = $q.when([]);
						let rEntities = [];
						ruleEntities.map(function(ruleEntity){
							if(!relationExists(mainEntity, ruleEntity)) {
								rEntities.push(madeRelationEntity(mainEntity, ruleEntity));
							}
						});

						if(rEntities.length > 0) {
							promise = addRelations(rEntities);
						}
						return promise;
					}

					function deleteRelations(dataList, selectedItem) {
						let promise = $q.when([]);
						let opts = extendData.serviceOption.flatRootItem.httpDelete;
						if (_.isArray(dataList) && dataList.length > 0) {
							let postUrl = opts.route + opts.endDelete;
							promise = $http.post(postUrl, dataList).then(function () {
								return reloadDataFromServer(dataList, selectedItem).then(function () {
									return $q.when(dataList);
								});
							});
						}

						return promise;

					}

					function deleteAllRelationsFrom(mainEntity) {
						let promise = $q.when([]);
						if(!_.isEmpty(mainEntity) ) {
							let items = getRelationsBy(mainEntity.EstHeaderFk, mainEntity.Id);
							if(_.isArray(items) && items.length > 0) {
								mainEntity.Rule = [];
								mainEntity.RuleIcons = [];
								promise = deleteRelations(items);
							}
						}
						return promise;

					}

					function updateMainEntityAfterRuleChanged() {
						let mainEntity = currentMainEntity();
						if(mainEntity && localData.mainEntityServiceName) {
							let mainService = $injector.get(localData.mainEntityServiceName);
							if(mainService) {
							// refresh grid, trigger modify & asyn validation action
								mainService.fireItemModified(mainEntity);
							}
						}
					}

					function removeRuleIdsFromMainEntity(removeIds) {
						let mainEntity = currentMainEntity();
						if(!_.isArray(removeIds)) {
							removeIds = [removeIds];
							removeIds = removeIds.filter(function(id){
								return !_.isUndefined(id);
							});
						}
						mainEntity.Rule = mainEntity.Rule || [];
						mainEntity.Rule = mainEntity.Rule.filter(function(ruleId){
							return !_.includes(removeIds, ruleId);
						});
						mainEntity.RuleIcons = mainEntity.RuleIcons || [];
						mainEntity.RuleIcons = mainEntity.RuleIcons.filter(function(ruleId){
							return !_.includes(removeIds, ruleId);
						});
						if(mainEntity.RuleAssignment){
							mainEntity.RuleAssignment = mainEntity.RuleAssignment.filter(function (item) {
								return !_.includes(removeIds, item.Id);
							});
						}
						updateMainEntityAfterRuleChanged();
					}

					function deletePopRelationItems() {
						let promise = $q.when([]);
						if(! localData.popupService) {
							return promise;
						}
						let items = localData.popupService.getSelectedItems();
						if (_.isArray(items) && items.length > 0) {

							removeRuleIdsFromMainEntity(_.map(items, extendValue('relationTbRuleFkName')));
							promise = deleteRelations(items);
						}

						return promise;
					}

					function refreshPopGrid(selectedItem) {
						let popService = localData.popupService;

						if(popService) {
							try{
								popupLoadData();
								popService.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
								if (!selectedItem && selectedItem !== 0) { // if it  0, it will not set selected
								// get the selected Item
									selectedItem = popService.getSelectedItems()[0];
								}
								if (selectedItem) {
									setPopupSelectItem(selectedItem);
								}
								popService.getGrid().invalidate();
							}catch (e) {
							// no popup grid
							}

						}

					}

					function popupLoadData() {
					// sort the items
						let dataList = _.sortBy(getDataList() || [], function (item) {
							return item.Sorting || 0;
						});
						if(localData.popupService) {
						// load data to popup grid
							localData.popupService.updateData(dataList);
						}
						return dataList;
					}

					// set the selected item responding to its clicked icon
					function popupFirstSelectedItem() {
						if(localData.popupService) {
						// load data to popup grid
						// set the selected item responding to its clicked icon
							let item = _.find(getDataList(), {Icon: parseInt(localData.popupClickIcon)});
							if(!_.isEmpty(item)) {
								setPopupSelectItem(item);
							}
						}
					}

					function setPopupSelectItem(selectedItem) {
						let popService = localData.popupService;
						if(! popService) {
							return false;
						}
						if (selectedItem) {
							popService.selectRowById(selectedItem.Id);
						}
					}

					function openPopup(e, scope) {

						function setPopupClickIcon(e) {
							let cl = e.target.classList;
							localData.popupClickIcon = cl && cl.length ? cl[cl.length - 1] : null;
							return localData.popupClickIcon;
						}

						setPopupClickIcon(e);

						let popupOptions = {

							title: 'estimate.rule.ruleContainer',
							showLastSize: true,
							controller: 'estimateAssembliesMdcRuleRelationPopupController',
							controllerDataService: extendData.relationEntityServiceName,
							templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',

							width: 700,
							height: 300,
							focusedElement: angular.element(e.target.parentElement),
							relatedTarget: angular.element(e.target),
							zIndex: 1000,
							scope: scope.$new()
						};

						popupToggle.toggle(popupOptions);
					}

					let openService = {
						createMultiRelations: createMultiRelations,
						updateMainEntityAfterRuleChanged: updateMainEntityAfterRuleChanged,
						deletePopRelationItems: deletePopRelationItems,
						deleteAllRelationsFrom: deleteAllRelationsFrom,
						deleteRelations: deleteRelations,
						updateRelations: updateRelations,
						createRelations: createRelations,
						addRelations: addRelations,
						loadListAsync: loadListAsync,
						popGridService: popGridService,
						setPopupService: setPopupService,
						openPopup: openPopup,
						getRelationsBy: getRelationsBy,
						getDataList: getDataList,
						currentMainEntity: currentMainEntity,
						mergeRuleDataIntoRelation: mergeRuleDataIntoRelation,
						addRelationsToMainEntities: addRelationsToMainEntities
					};
					return openService;
				}

				// CREATE THE SERVICE
				return {
				// unique service, singleton
					createService: createService,

					// common functions
					fns: {
						manipulateRuleLookupEditorValueApply: manipulateRuleLookupEditorValueApply
					}
				};
				//**

			}]);
})();
