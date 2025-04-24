/**
 * Created by xia on 4/21/2017.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleSequenceLookupService', ['$http', '$q', '$injector', 'estimateRuleAssignmentService',
		function ( $http, $q, $injector, estimateRuleAssignmentService) {

			let prefixEditableGroup = 'estSequenceGroup';
			let unEditableGroup = 'unEditableSequenceGroup';

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estRuleSequenceItems:[],
				estRuleSequenceGroups:[]
			};

			let groupDetail = [];

			let getEstRuleSequenceItems = function(){
				return $http.post(globals.webApiBaseUrl + 'basics/customize/EstEvaluationSequence/list');
			};

			let genarateEstRuleSequenceGroups = function(ruleSequenceItems){
				let lastSorting;
				let index = 1;
				let subIndex = 0;
				let sequenceGroup = [];
				let groupName;

				_.forEach(ruleSequenceItems, function(item){

					if(item.Ischangeable){// TODO-Walt
						groupName = prefixEditableGroup + index;
						sequenceGroup.push({Id : item.Id, GroupName : groupName});
						subIndex++;
					}else{
						groupName = unEditableGroup;
						sequenceGroup.push({Id : item.Id, GroupName : groupName});
						if(item.Sorting !== lastSorting){
							index++;
							subIndex = 0;
						}
					}
					groupDetail[groupName] = groupDetail[groupName] || [];
					groupDetail[groupName].push({Index : subIndex, Id : item.Id, Sorting : item.Sorting});
					lastSorting = item.Sorting;
				});

				return sequenceGroup;
			};

			let initializeSequenceItems = function(data){
				lookupData.estRuleSequenceItems = _.sortBy(data, ['Sorting']);
				lookupData.estRuleSequenceGroups = genarateEstRuleSequenceGroups(lookupData.estRuleSequenceItems);
				return lookupData.estRuleSequenceItems;
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList() {
				if(lookupData.estRuleSequenceItems.length >0){
					return lookupData.estRuleSequenceItems;
				}
				else{
					getEstRuleSequenceItems().then(function(response){
						return initializeSequenceItems(response.data);
					});
				}
			};

			// get data list of the estimate RuleCode items
			service.getList4SequenceDetailFormIcons = function getList() {
				if(lookupData.estRuleSequenceItems.length >0){
					return lookupData.estRuleSequenceItems;
				}
				else{
					return [];
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				if(lookupData.estRuleSequenceItems && lookupData.estRuleSequenceItems.length >0){
					return $q.when(lookupData.estRuleSequenceItems);
				}
				else{
					return getEstRuleSequenceItems().then(function(response){
						return initializeSequenceItems(response.data);
					});
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				let item = null;
				let list = lookupData.estRuleSequenceItems;
				if(list && list.length>0){
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			};

			let getItemById = function(id){
				return _.find(lookupData.estRuleSequenceItems, {Id : id});
			};

			// get list of the estimate RuleCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if(lookupData.estRuleSequenceItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if(!lookupData.estRuleSequenceItemsPromise) {
						lookupData.estRuleSequenceItemsPromise = service.getListAsync();
					}
					return lookupData.estRuleSequenceItemsPromise.then(function(data){
						lookupData.estRuleSequenceItemsPromise = null;
						lookupData.estRuleSequenceItems = data;
						return service.getItemById(value);
					});
				}
			};

			let initializeSorting = function(itemList, ruleAssignments){
				angular.forEach(itemList, function(item){
					let ruleAssignment = _.find(ruleAssignments, {'Code': item.Code});
					if(ruleAssignment){
						item.EstEvaluationSequenceFk = ruleAssignment.EstEvaluationSequenceFk;
						item.IsExecution = ruleAssignment.IsExecution;
						if ($injector.get('estimateMainService').getHeaderStatus() || !$injector.get('estimateMainService').hasCreateUpdatePermission()) {
							$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'IsExecution', readonly: true }]);
						}
						let sequenceEntity = getItemById(item.EstEvaluationSequenceFk);
						if(sequenceEntity){
							item.Sorting = sequenceEntity.Sorting;
						}else{
							item.Sorting = 1;
						}

					}
				});

				return _.sortBy(itemList, 'Sorting');
			};

			service.setSorting = function (itemList, ruleAssignments) {
				if(!angular.isDefined(ruleAssignments) || !_.isArray(ruleAssignments)){
					return [];
				}

				if(lookupData.estRuleSequenceItems.length) {
					return initializeSorting(itemList, ruleAssignments);// $q.when(
				} else {
					if(!lookupData.estRuleSequenceItemsPromise) {
						lookupData.estRuleSequenceItemsPromise = service.getListAsync();
					}
					/* return */lookupData.estRuleSequenceItemsPromise.then(function(data){
						lookupData.estRuleSequenceItemsPromise = null;
						lookupData.estRuleSequenceItems = data;
						return initializeSorting(itemList, ruleAssignments);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				return getEstRuleSequenceItems().then(function(response){
					return initializeSequenceItems(response.data);
				});
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			let getGroupNameBySequenceId = function(sequenceId){
				return _.find(lookupData.estRuleSequenceGroups, {Id : sequenceId});
			};

			service.isInSameGroup = function(source, target){
				if(!source || !target){
					return false;
				}

				let groupName1 = getGroupNameBySequenceId(source.Id);

				let groupName2 = getGroupNameBySequenceId(target.Id);

				return groupName1.GroupName === groupName2.GroupName;
			};

			let validationSequence = function(sequence1, sequence2){
				if(!sequence1.Ischangeable || !sequence2.Ischangeable){
					return false;
				}

				if(!service.isInSameGroup(sequence1, sequence2)){
					return false;
				}
				return true;
			};

			let getRuleById = function (ruleCode, isFromAssembly) {
				let rules;
				if(isFromAssembly){
					rules = $injector.get('estimateAssembliesRuleComplexLookupService').getItem4ChangeSequence([ruleCode]);
				}
				else {
					rules = $injector.get('estimateRuleComplexLookupService').getItemById([ruleCode]);
				}

				if(!rules || rules.length < 1){
					return null;
				}
				return rules[0];
			};

			let madeAssignmentModification = function(source, option, entity, isFromAssembly){
				let rule = getRuleById(source, isFromAssembly);
				if(rule){
					if(isFromAssembly)
					{
						if(source.EstLineItemFk > 0)
						{
							$injector.get('estimateAssembliesRuleUpdateService').setAssemblyRuleToSave(source);
						}
						else if(source.EstAssemblyCatFk > 0)
						{
							$injector.get('estimateAssembliesRuleUpdateService').setAssemblyCategoryRuleToSave(source);
						}
						else{
							return;
						}
					}
					else{
						let updateInfo = estimateRuleAssignmentService.createNewEntity(source, rule.IsExecution);
						$injector.get('estimateMainRuleUpdateService').updateRuleAssignment(rule, option, entity, updateInfo);
					}
				}
			};

			function getToolsStatues(grid, ruleSeleted, isSequenceReadonly){
				let isSequenceMoveDownReadonly = true,
					isSequenceMoveUpReadonly = true,
					deleteButtonReadonly = true;

				if(grid) {
					let assignmentItems = grid.getData().getItems();

					let length = assignmentItems.length;

					let selectedIndexs = grid.getSelectedRows();

					let firstSelectedIndex;

					let lastSelectedItemIndex;

					if (length > 1 && selectedIndexs.length > 0) {

						let selectedIndexsSorted = selectedIndexs.sort(function (a, b) {
							return a - b;
						});

						firstSelectedIndex = selectedIndexsSorted[0];

						lastSelectedItemIndex = selectedIndexsSorted[selectedIndexsSorted.length - 1];
					}

					if (isSequenceReadonly === false) {

						// if the selected item is the last item, will can't MoveDown
						if (lastSelectedItemIndex < length - 1) {
							isSequenceMoveDownReadonly = false;
						}

						// if the selected item is the first item, will can't MoveUp
						if (firstSelectedIndex >= 1) {
							isSequenceMoveUpReadonly = false;
						}
					}

					if (selectedIndexs.length >= 1) {
						deleteButtonReadonly = false;
					}

					if(isSequenceReadonly || (ruleSeleted && _.some(ruleSeleted, function(item){ return item.Ischangeable === false; }))){
						isSequenceMoveUpReadonly = true;
						isSequenceMoveDownReadonly = true;
					}

					/* if(ruleSeleted){
						let hasQnaRule = _.some(ruleSeleted, function (item) {
							return item.EstRuleExecutionTypeFk === 3;
						});

						if (hasQnaRule) {
							isSequenceMoveUpReadonly = true;
							isSequenceMoveDownReadonly = true;
						}
					} */
				}

				return {
					isSequenceMoveDownReadonly : isSequenceMoveDownReadonly,
					isSequenceMoveUpReadonly : isSequenceMoveUpReadonly,
					deleteButtonReadonly : deleteButtonReadonly
				};
			}

			service.getToolsStatues = getToolsStatues;

			let interchangeSequence = function(source, target, option, entity, isFromAssembly){
				let tempSequenceFk = source.EstEvaluationSequenceFk;
				let tempSorting = source.Sorting;
				source.EstEvaluationSequenceFk = target.EstEvaluationSequenceFk;
				source.Sorting = target.Sorting;
				target.EstEvaluationSequenceFk = tempSequenceFk;
				target.Sorting = tempSorting;
				madeAssignmentModification(source, option, entity, isFromAssembly);
				madeAssignmentModification(target, option, entity, isFromAssembly);
			};

			service.changeSequence = function changeSequence(source, target, option, entity, isFromAssembly){
				let sourceSequence = service.getItemById(source.EstEvaluationSequenceFk);
				let targetSequence = service.getItemById(target.EstEvaluationSequenceFk);

				if(!validationSequence(sourceSequence, targetSequence)) {
					return false;
				}

				if(sourceSequence.Sorting === targetSequence.Sorting){
					return false;
				}else{
					// interchange the prevItem and the selectedItem
					interchangeSequence(source, target, option, entity, isFromAssembly);

					return true;
				}
			};

			service.moveUp = function moveUp(selectedItemsIndexs, assignRuleItems, option, entity, isFromAssembly){

				let selectedItemsIndexsSort = selectedItemsIndexs.sort(function(a, b){ return a - b;}, {ascending : true});

				if(selectedItemsIndexsSort.includes(0)) { return; }

				_.forEach(selectedItemsIndexsSort, function(index){
					let selectedItem = assignRuleItems[index];

					let prevItem = assignRuleItems[index-1];

					if(selectedItem && prevItem){
						service.changeSequence(selectedItem, prevItem, option, entity, isFromAssembly);
					}
				});
			};

			service.moveDown = function (selectedItemsIndexs, assignRuleItems, option, entity, isFromAssembly) {

				let selectedItemsIndexsSort = selectedItemsIndexs.sort(function(a, b){ return b - a;}, {ascending : true});

				if(selectedItemsIndexsSort.includes(assignRuleItems.length - 1)) { return; }

				_.forEach(selectedItemsIndexsSort, function(index){
					let selectedItem = assignRuleItems[index];

					let nextItem = assignRuleItems[index+1];

					if(selectedItem && nextItem){
						service.changeSequence(selectedItem, nextItem, option, entity, isFromAssembly);
					}
				});
			};

			return service;
		}]);
})(angular);
