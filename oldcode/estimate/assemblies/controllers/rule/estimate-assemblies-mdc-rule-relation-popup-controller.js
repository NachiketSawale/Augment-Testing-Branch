/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesMdcRuleRelationPopupController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angular.module(moduleName).controller('estimateAssembliesMdcRuleRelationPopupController',
		['$scope','$http','$timeout','platformGridAPI', '$injector', '_',
			'estimateRuleComplexLookupCommonService',
			'basicsLookupdataLookupControllerFactory',
			'estimateAssembliesMdcRuleRelationService',
			'$popupContext',
			'$popupInstance',
			'estimateAssembliesRuleUpdateService',
			'basicsLookupdataPopupService',
			function ($scope, $http, $timeout, platformGridAPI, $injector, _,
				estimateRuleComplexLookupCommonService,
				basicsLookupdataLookupControllerFactory,
				estimateAssembliesMdcRuleRelationService,
				$popupContext,
				$popupInstance,
				estimateAssembliesRuleUpdateService, basicsLookupdataPopupService) {

				// fix defect 82055, when delete Item record in Items container,the Line Item record disappear
				let tempHidePopup = basicsLookupdataPopupService.hidePopup;
				basicsLookupdataPopupService.hidePopup = function temp(){};

				let gridId = '7a9f7da5c9b44e339d49ba149a905987';
				// let gridId = $injector.get('platformCreateUuid')();
				let columns = angular.copy(estimateRuleComplexLookupCommonService.getColumns(false));
				let self = basicsLookupdataLookupControllerFactory.create({grid: true,dialog: true}, $scope, {
					gridId: gridId,
					columns: columns,
					idProperty : 'Id',
					rowSelection : true,
					lazyInit: true,
					grouping: true,
					enableDraggableGroupBy: true
				});

				// $scope.service = self;
				// ex: dataService is estimateAssembliesMdcRuleRelationService
				let dataService = $injector.get($popupContext.controllerDataService);
				// estimateAssembliesMdcRuleRelationService.setPopupService(self);
				dataService.setPopupService(self);

				// the dataList is from local, no promise here
				// self.updateData(displayData); the data is set from load function here
				let displayData = dataService.popGridService.load() || [];

				let isSequenceReadonly = false;
				$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isSequenceReadonly').then(function (response) {
					$injector.get('estimateAssemblyRuleComplexLookupProcessService').processItems(displayData, response.data);// TODO-Walt: sequence
					self.updateData(displayData);
					isSequenceReadonly = response.data;
					$scope.tools.update();
				});

				$scope.showParamGrid = true;
				// Define standard toolbar Icons and their function on the scope
				if ($scope.tools) {
					// show the system and role level configuratio
					_.forEach($scope.tools.items, function (item) {
						if (item.type === 'dropdown-btn') {
							item.list.level = 1;
							overloadItem(item.list.level, function (level) {
								_.forEach(item.list.items, function (subItem) {
									let tempFn = subItem.fn;
									subItem.fn = function () {
										if (item.list.level !== level) {
											item.list.level = level;
										}
										tempHidePopup(level);
										tempFn();
									};
								});
							});
						}
					});
					let toolItems = [
						{
							id: 't1',
							sort: 11,
							caption: 'cloud.common.taskBarMoveUp',
							type: 'item',
							iconClass: 'tlb-icons ico-grid-row-up',
							fn: moveUpItem,
							// disabled: displayData.length === 0
							disabled: true
						},
						{
							id: 't2',
							sort: 21,
							caption: 'cloud.common.taskBarMoveDown',
							type: 'item',
							iconClass: 'tlb-icons ico-grid-row-down',
							fn: moveDownItem,
							// disabled: displayData.length === 0
							disabled: true
						},
						{
							id: 't3',
							sort: 31,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: deleteItem,
							disabled: true
						},
						{
							id: 't4',
							sort: 100,
							caption: 'cloud.common.toolbarSearch',
							type: 'check',
							value: platformGridAPI.filters.showSearch(gridId),
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								platformGridAPI.filters.showSearch(gridId, this.value);
							}
						},
						{
							id: 't5',
							sort: 110,
							caption: 'cloud.common.print',
							iconClass: 'tlb-icons ico-print-preview',
							type: 'item',
							fn: function () {
								$injector.get('reportingPrintService').printGrid(gridId);
							}
						}
					];
					$scope.tools.items = toolItems.concat($scope.tools.items);
				}
				function overloadItem(level, func) {
					func(level);
				}

				function onChangeGridContent(){
					updateTools();
				}

				function updateTools(){

					let toolsStatues = $injector.get('estimateRuleSequenceLookupService').getToolsStatues(self.getGrid(), self.getSelectedItems(), isSequenceReadonly);

					angular.forEach($scope.tools.items, function (item) {
						if(item.id === 't1'){
							item.disabled = toolsStatues.isSequenceMoveUpReadonly;
						}
						else if(item.id === 't2'){
							item.disabled = toolsStatues.isSequenceMoveDownReadonly;
						}
						if(item.id === 't3'){
							item.disabled = toolsStatues.deleteButtonReadonly;
						}
					});

					$timeout(function () {
						$scope.tools.update();
					});
				}

				$scope.getTitle = function(){
					return 'Rules';
				};

				function moveUpItem() {

					let assignmentItems = self.getGrid().getData().getItems();
					let selectedIndexs = self.getGrid().getSelectedRows();

					let isFromAssembly = true;
					$injector.get('estimateRuleSequenceLookupService').moveUp(selectedIndexs, assignmentItems, $scope.OptionsEx, $scope.EntityEx, isFromAssembly);
					let estimateAssembliesRuleUpdateService = $injector.get('estimateAssembliesRuleUpdateService');
					if(!estimateAssembliesRuleUpdateService){ return; }

					$timeout(function(){
						let selectItem = assignmentItems[selectedIndexs.pop()];
						let updateRulePostURL;
						let modifiedRuleItems;

						if(selectItem.EstLineItemFk > 0)
						{
							updateRulePostURL = globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/updateitem/';
							modifiedRuleItems = estimateAssembliesRuleUpdateService.getRuleToSave();
						}
						else if(selectItem.EstAssemblyCatFk > 0){
							updateRulePostURL = globals.webApiBaseUrl + 'estimate/rule/mdcruleassemblycategory/updateitem/';
							modifiedRuleItems = estimateAssembliesRuleUpdateService.getAssemblyCategoryRuleToSave();
						}
						else{
							return;
						}

						if(updateRulePostURL && modifiedRuleItems && modifiedRuleItems.length > 0){

							$http.post(updateRulePostURL, modifiedRuleItems).then(function (response) {

								let modifiedItems = response.data;
								_.forEach(modifiedItems, function(modifiedItem){

									let sourceAssign = _.find(assignmentItems,{Id : modifiedItem.Id});
									if(sourceAssign){
										// get the right value
										sourceAssign.Version = modifiedItem.Version;
										sourceAssign.InsertedAt = modifiedItem.InsertedAt;
										sourceAssign.InsertedBy = modifiedItem.InsertedBy;
										sourceAssign.UpdatedAt = modifiedItem.UpdatedAt;
										sourceAssign.UpdatedBy = modifiedItem.UpdatedBy;
									}
								});

								let estimateAssembliesAssembliesStructureService = $injector.get('estimateAssembliesAssembliesStructureService');
								let selectedCategoryItem = estimateAssembliesAssembliesStructureService.getSelected();
								if(selectedCategoryItem && selectedCategoryItem.rule){
									selectedCategoryItem.rule = _.map(assignmentItems,'Code');
								}

								// update the assembly2rule cache data and grid data
								let estimateAssembliesMdcRuleRelationService = $injector.get('estimateAssembliesMdcRuleRelationService');
								if(estimateAssembliesMdcRuleRelationService){
									estimateAssembliesMdcRuleRelationService.mergeRuleDataIntoRelation(modifiedItems);
								}

								estimateAssembliesRuleUpdateService.clear();
							});
						}
					}, 100);

					self.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
					let newSelectIndexs = [];
					let i = 0;
					_.forEach(selectedIndexs, function(index){
						newSelectIndexs[i] = index - 1;
						i++;
					});
					self.getGrid().setSelectedRows(newSelectIndexs);
					self.getGrid().invalidate();
				}

				function moveDownItem (){
					let assignmentItems = self.getGrid().getData().getItems();
					let selectedIndexs = self.getGrid().getSelectedRows();

					let isFromAssembly = true;
					$injector.get('estimateRuleSequenceLookupService').moveDown(selectedIndexs, assignmentItems, $scope.OptionsEx, $scope.EntityEx, isFromAssembly);
					let estimateAssembliesRuleUpdateService = $injector.get('estimateAssembliesRuleUpdateService');
					if(!estimateAssembliesRuleUpdateService){ return; }

					$timeout(function(){

						let selectItem = assignmentItems[selectedIndexs.pop()];
						let updateRulePostURL;
						let modifiedRuleItems;

						if(selectItem.EstLineItemFk > 0)
						{
							updateRulePostURL = globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/updateitem/';
							modifiedRuleItems = estimateAssembliesRuleUpdateService.getRuleToSave();
						}
						else if(selectItem.EstAssemblyCatFk > 0){
							updateRulePostURL = globals.webApiBaseUrl + 'estimate/rule/mdcruleassemblycategory/updateitem/';
							modifiedRuleItems = estimateAssembliesRuleUpdateService.getAssemblyCategoryRuleToSave();
						}
						else{
							return;
						}

						if(updateRulePostURL && modifiedRuleItems && modifiedRuleItems.length > 0){

							$http.post(updateRulePostURL, modifiedRuleItems).then(function (response) {

								let modifiedItems = response.data;
								_.forEach(modifiedItems, function(modifiedItem){

									let sourceAssign = _.find(assignmentItems,{Id : modifiedItem.Id});
									if(sourceAssign){
										// get the right value
										sourceAssign.Version = modifiedItem.Version;
										sourceAssign.InsertedAt = modifiedItem.InsertedAt;
										sourceAssign.InsertedBy = modifiedItem.InsertedBy;
										sourceAssign.UpdatedAt = modifiedItem.UpdatedAt;
										sourceAssign.UpdatedBy = modifiedItem.UpdatedBy;
									}
								});

								let estimateAssembliesAssembliesStructureService = $injector.get('estimateAssembliesAssembliesStructureService');
								let selectedCategoryItem = estimateAssembliesAssembliesStructureService.getSelected();
								if(selectedCategoryItem && selectedCategoryItem.rule){
									selectedCategoryItem.rule = _.map(assignmentItems,'Code');
								}

								// update the assembly2rule cache data and grid data
								let estimateAssembliesMdcRuleRelationService = $injector.get('estimateAssembliesMdcRuleRelationService');
								if(estimateAssembliesMdcRuleRelationService){
									estimateAssembliesMdcRuleRelationService.mergeRuleDataIntoRelation(modifiedItems);
								}

								estimateAssembliesRuleUpdateService.clear();
							});
						}
					}, 100);

					self.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
					let newSelectIndexs = [];
					let i = 0;
					_.forEach(selectedIndexs, function(index){
						newSelectIndexs[i] = index + 1;
						i++;
					});
					self.getGrid().setSelectedRows(newSelectIndexs);
					self.getGrid().invalidate();
				}

				function deleteItem () {
					dataService.popGridService.deleteRelations().then(function(deleteToRules) {
						if ($scope.entity && $scope.entity.RuleRelationServiceNames) {
							let mainService = $injector.get($scope.entity.RuleRelationServiceNames.m);
							if (mainService) {
								let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
								if (deleteToRules && deleteToRules.length > 0) {
									let delOption = {
										entity: $scope.entity,
										itemName: mainService.getItemName(),
										mainServiceName: $scope.entity.RuleRelationServiceNames.m,
										isPrjAssembly: false,
										projectId: 0,
										estHeaderFk: $scope.entity.EstHeaderFk,
										ruleToDelete: deleteToRules
									};
									estimateRuleFormatterService.deleteParamByRule(delOption);
								}
							}
						}
					});

					let selectedItems = self.getSelectedItems();
					let rules = [];
					_.forEach(selectedItems,function(item){
						rules.push(item.EstRuleFk);
					});
					if (rules.length > 0){
						estimateAssembliesRuleUpdateService.removeRule(rules);
					}

					if($scope.entity && $scope.entity.Rule){
						$scope.entity.Rule = $scope.entity.Rule.filter(function (id) {
							return !_.includes(rules, id);
						});
					}

					if($scope.entity && $scope.entity.RuleIcons){
						$scope.entity.RuleIcons = $scope.entity.RuleIcons.filter(function (id) {
							return !_.includes(rules, id);
						});
					}

					if($scope.entity && $scope.entity.RuleAssignment){
						$scope.entity.RuleAssignment = $scope.entity.RuleAssignment.filter(function (item) {
							return !_.includes(rules, item.Id);
						});
					}
				}

				function onCellChange(e, args) {
					let item = args.item,
						col = args.grid.getColumns()[args.cell].field;
					if(col === 'EstEvaluationSequenceFk' || col === 'Comment' || col === 'Operand'){
						// update
						dataService.popGridService.updateRelations([item]);
					}
				}

				platformGridAPI.events.register(gridId, 'onRenderCompleted', onChangeGridContent);
				platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onChangeGridContent);

				angular.extend($scope, {
					moveUpItem: moveUpItem,
					deleteItem: deleteItem,
					moveDownItem: moveDownItem
				});

				function onResizeStop () {
					$injector.get('platformGridAPI').grids.resize($scope.gridId);
				}
				$popupInstance.onResizeStop.register(onResizeStop);

				$scope.$on('$destroy', function() {
					if($scope.$close) {
						$scope.$close();
					}
					platformGridAPI.events.unregister(gridId, 'onRenderCompleted', onChangeGridContent);
					platformGridAPI.events.unregister(gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onChangeGridContent);
					$popupInstance.onResizeStop.unregister(onResizeStop);
					basicsLookupdataPopupService.hidePopup = tempHidePopup;
				});

			}

		]);
})();
