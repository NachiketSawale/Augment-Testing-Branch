/**
 * Created by zos on 1/9/2018.
 */
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqRuleSequenceLookupService', ['$http', '$q', '$injector', 'estimateRuleAssignmentService',
		function ($http, $q, $injector, estimateRuleAssignmentService) {

			var prefixEditableGroup = 'estSequenceGroup';
			var unEditableGroup = 'unEditableSequenceGroup';

			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				estRuleSequenceItems: [],
				estRuleSequenceGroups: []
			};

			var groupDetail = [];

			var getEstRuleSequenceItems = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/EstEvaluationSequence/list');
			};

			var genarateEstRuleSequenceGroups = function (ruleSequenceItems) {
				var lastSorting;
				var index = 1;
				var subIndex = 0;
				var sequenceGroup = [];
				var groupName;

				_.forEach(ruleSequenceItems, function (item) {

					if (item.Ischangeable) {// TODO-Walt
						groupName = prefixEditableGroup + index;
						sequenceGroup.push({Id: item.Id, GroupName: groupName});
						subIndex++;
					} else {
						groupName = unEditableGroup;
						sequenceGroup.push({Id: item.Id, GroupName: groupName});
						if (item.Sorting !== lastSorting) {
							index++;
							subIndex = 0;
						}
					}
					groupDetail[groupName] = groupDetail[groupName] || [];
					groupDetail[groupName].push({Index: subIndex, Id: item.Id, Sorting: item.Sorting});
					lastSorting = item.Sorting;
				});

				return sequenceGroup;
			};

			var initializeSequenceItems = function (data) {
				lookupData.estRuleSequenceItems = _.sortBy(data, ['Sorting']);
				lookupData.estRuleSequenceGroups = genarateEstRuleSequenceGroups(lookupData.estRuleSequenceItems);
				return lookupData.estRuleSequenceItems;
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList() {
				if (lookupData.estRuleSequenceItems.length > 0) {
					return lookupData.estRuleSequenceItems;
				} else {
					getEstRuleSequenceItems().then(function (response) {
						return initializeSequenceItems(response.data);
					});
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				if (lookupData.estRuleSequenceItems && lookupData.estRuleSequenceItems.length > 0) {
					return $q.when(lookupData.estRuleSequenceItems);
				} else {
					return getEstRuleSequenceItems().then(function (response) {
						return initializeSequenceItems(response.data);
					});
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				var item = {};
				var list = lookupData.estRuleSequenceItems;
				if (list && list.length > 0) {
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			};

			var getItemById = function (id) {
				return _.find(lookupData.estRuleSequenceItems, {Id: id});
			};

			// get list of the estimate RuleCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if (lookupData.estRuleSequenceItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if (!lookupData.estRuleSequenceItemsPromise) {
						lookupData.estRuleSequenceItemsPromise = service.getListAsync();
					}
					return lookupData.estRuleSequenceItemsPromise.then(function (data) {
						lookupData.estRuleSequenceItemsPromise = null;
						lookupData.estRuleSequenceItems = data;
						return service.getItemById(value);
					});
				}
			};

			var initializeSorting = function (itemList, ruleAssignments) {
				angular.forEach(itemList, function (item) {
					var ruleAssignment = _.find(ruleAssignments, {'Code': item.Code});
					if (ruleAssignment) {
						estimateRuleAssignmentService.updateProperties(item, ruleAssignment);
						var sequenceEntity = getItemById(item.EstEvaluationSequenceFk);
						if (sequenceEntity) {
							item.Sorting = sequenceEntity.Sorting;
						} else {
							item.Sorting = 1;
						}
					}
				});

				return _.sortBy(itemList, 'Sorting');
			};

			service.fillWithSorting = function (items) {
				angular.forEach(items, function (item) {
					var sequenceEntity = getItemById(item.EstEvaluationSequenceFk);
					if (sequenceEntity) {
						item.Sorting = sequenceEntity.Sorting;
					} else {
						item.Sorting = 1;
					}
				});

				return _.sortBy(items, 'Sorting');
			};

			service.setSorting = function (itemList, ruleAssignments) {
				if (!angular.isDefined(ruleAssignments) || !_.isArray(ruleAssignments)) {
					return [];
				}

				if (lookupData.estRuleSequenceItems.length) {
					return initializeSorting(itemList, ruleAssignments);// $q.when(
				} else {
					if (!lookupData.estRuleSequenceItemsPromise) {
						lookupData.estRuleSequenceItemsPromise = service.getListAsync();
					}
					/* return */
					lookupData.estRuleSequenceItemsPromise.then(function (data) {
						lookupData.estRuleSequenceItemsPromise = null;
						lookupData.estRuleSequenceItems = data;
						return initializeSorting(itemList, ruleAssignments);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function () {
				return getEstRuleSequenceItems().then(function (response) {
					return initializeSequenceItems(response.data);
				});
			};

			// General stuff
			service.reload = function () {
				service.loadLookupData();
			};

			var getGroupNameBySequenceId = function (sequenceId) {
				return _.find(lookupData.estRuleSequenceGroups, {Id: sequenceId});
			};

			service.IsInSameGroup = function (source, target) {
				if (!source || !target) {
					return false;
				}

				var groupName1 = getGroupNameBySequenceId(source.Id);

				var groupName2 = getGroupNameBySequenceId(target.Id);

				return groupName1.GroupName === groupName2.GroupName;
			};

			var validationSequence = function (sequence1, sequence2) {
				if (!sequence1.Ischangeable || !sequence2.Ischangeable) {
					return false;
				}

				if (!service.IsInSameGroup(sequence1, sequence2)) {
					return false;
				}
				return true;
			};

			var getRuleById = function (ruleCode) {
				var rules = $injector.get('boqRuleComplexLookupService').getItemById([ruleCode]);
				if (!rules || rules.length < 1) {
					return null;
				}
				return rules[0];
			};

			var madeAssignmentModification = function (source, option, entity) {
				var rule = getRuleById(source);
				if (rule) {
					var updateInfo = estimateRuleAssignmentService.createNewEntity(rule);
					updateInfo.EstEvaluationSequenceFk = source.EstEvaluationSequenceFk;
					updateInfo.IsExecution = source.IsExecution;
					$injector.get('boqRuleUpdateService').updateRuleAssignment(source, option, entity, updateInfo);
				}
			};

			var interchangeSequence = function (source, target, option, entity) {
				var tempSequenceFk = source.EstEvaluationSequenceFk;
				var tempSorting = source.Sorting;
				source.EstEvaluationSequenceFk = target.EstEvaluationSequenceFk;
				source.Sorting = target.Sorting;
				target.EstEvaluationSequenceFk = tempSequenceFk;
				target.Sorting = tempSorting;
				madeAssignmentModification(source, option, entity);
				madeAssignmentModification(target, option, entity);
			};

			service.changeSequence = function changeSequence(source, target, option, entity) {
				var sourceSequence = service.getItemById(source.EstEvaluationSequenceFk);
				var targetSequence = service.getItemById(target.EstEvaluationSequenceFk);

				if (!validationSequence(sourceSequence, targetSequence)) {
					return false;
				}

				if (sourceSequence.Sorting === targetSequence.Sorting) {
					return false;
				} else {
					// interchange the prevItem and the selectedItem
					interchangeSequence(source, target, option, entity);

					return true;
				}
			};

			service.moveUp = function moveUp(selectedItemsIndexs, assignRuleItems, option, entity) {

				/* function getPrevItem(index){
					 var prevIndex = index - 1;

					 while(prevIndex >= 0){
						  var prevItem = assignRuleItems[prevIndex];

						  if(prevItem.EstRuleExecutionTypeFk === 3){
								prevIndex--;
						  }else{
								return prevItem;
						  }
					 }

					 return null;
				} */

				var selectedItemsIndexsSort = selectedItemsIndexs.sort(function (a, b) {
					return a - b;
				}, {ascending: true});

				if (selectedItemsIndexsSort.includes(0)) {
					return;
				}

				_.forEach(selectedItemsIndexsSort, function (index) {
					var selectedItem = assignRuleItems[index];

					var prevItem = assignRuleItems[index - 1];

					if (selectedItem && prevItem) {
						service.changeSequence(selectedItem, prevItem, option, entity);
					}
				});
			};

			service.moveDown = function (selectedItemsIndexs, assignRuleItems, option, entity) {

				/* function getNextItem(index){
					 var nextIndex = index + 1;

					 while(nextIndex < assignRuleItems.length){
						  var nextItem = assignRuleItems[nextIndex];

						  if(nextItem.EstRuleExecutionTypeFk === 3){
								nextIndex++;
						  }else{
								return nextItem;
						  }
					 }

					 return null;
				} */

				var selectedItemsIndexsSort = selectedItemsIndexs.sort(function (a, b) {
					return b - a;
				}, {ascending: true});

				if (selectedItemsIndexsSort.includes(assignRuleItems.length - 1)) {
					return;
				}

				_.forEach(selectedItemsIndexsSort, function (index) {
					var selectedItem = assignRuleItems[index];

					var nextItem = assignRuleItems[index + 1];

					if (selectedItem && nextItem) {
						service.changeSequence(selectedItem, nextItem, option, entity);
					}
				});
			};

			return service;
		}]);
})();