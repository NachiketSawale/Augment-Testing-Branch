/**
 * Created by zos on 1/9/2018.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqRuleComplexLookupCommonService
	 * @function
	 *
	 * @description
	 * boqRuleComplexLookupCommonService provides all lookup common fn. for boq Rules complex lookup
	 */
	angular.module(moduleName).factory('boqRuleComplexLookupCommonService',
		['$http', '$injector', '$timeout', 'platformGridAPI', 'boqRuleComplexLookupService',
			'basicsLookupdataPopupService', 'boqRuleUpdateService', 'basicsLookupdataConfigGenerator', 'estimateRuleAssignmentService', 'boqRuleFormatterService',
			function ($http, $injector, $timeout, platformGridAPI, boqRuleComplexLookupService,
				basicsLookupdataPopupService, boqRuleUpdateService, basicsLookupdataConfigGenerator, estimateRuleAssignmentService, boqRuleFormatterService) {

				// Object presenting the service
				var service = {};
				var popupToggle = basicsLookupdataPopupService.getToggleHelper();

				function getOptions(scope) {
					var config = scope.$parent.$parent.groups;
					if (!config) {
						return;
					}
					var group = _.find(scope.$parent.$parent.groups, {gid: 'ruleAndParam'});
					if (!group) {
						return;
					}
					var ruleConfig = _.find(group.rows, {rid: 'rule'});
					return ruleConfig ? ruleConfig.formatterOptions : null;
				}

				service.getColumnsReadOnly = function getColumnsReadOnly() {
					var columns = service.getColumns();
					_.forEach(columns, function (item) {
						item.editor = null;
					});
					return columns;
				};

				let filters = [
					{
						key: 'rubriccategorytrv-for-rule-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 70 }; // Rubric 'Estimate' from [BAS_RUBRIC]
						}
					}];

				service.registerFilters = function registerFilters() {
					$injector.get ('basicsLookupdataLookupFilterService').registerFilter (filters);
				};

				service.unregisterFilters = function unregisterFilters() {
					$injector.get ('basicsLookupdataLookupFilterService').unregisterFilter (filters);
				};

				service.getColumns = function getColumns(showIsExecution) {
					// adjust the column layout display as defect #93720
					var columns = [
						{
							id: 'icon',
							field: 'Icon',
							name: 'Icon',
							width: 100,
							toolTip: 'Icon',
							editor: null,
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'basicsCustomizeRuleIconService'
							},
							name$tr$: 'cloud.common.entityIcon',
							grouping: {
								title: 'cloud.common.entityIcon',
								getter: 'Icon',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							width: 70,
							toolTip: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode',
							grouping: {
								title: 'cloud.common.entityCode',
								getter: 'Code',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'desc',
							field: 'DescriptionInfo',
							name: 'Description',
							width: 120,
							toolTip: 'Description',
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription',
							grouping: {
								title: 'cloud.common.entityDescription',
								getter: 'Description',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'comment',
							field: 'Comment',
							name: 'Comment',
							width: 120,
							toolTip: 'Comment',
							formatter: 'comment',
							editor: 'comment',
							name$tr$: 'cloud.common.entityComment',
							grouping: {
								title: 'cloud.common.entityComment',
								getter: 'Comment',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'estevalseqfk',
							field: 'EstEvaluationSequenceFk',
							name: 'EvaluationSequence',
							width: 70,
							toolTip: 'EvaluationSequence',
							grouping: {
								title: 'estimate.rule.evaluationSequence',
								getter: 'EstEvaluationSequenceFk',
								aggregators: [],
								aggregateCollapsed: true
							},
							// formatter: 'integer',
							name$tr$: 'estimate.rule.evaluationSequence',
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'boq-Rule-Sequence-Lookup',
								lookupOptions: {
									lookupType: 'estsequences',
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'estimateSequenceLookupProcessService',
									showIcon: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName: 'boqRuleSequenceLookupService',
								lookupType: 'estsequences',
								displayMember: 'DescriptionInfo.Translated',
								valueMember: 'Id',
								imageSelector: 'estimateSequenceLookupProcessService'
							}
						},
						{
							id: 'estruleexecutiontypefk',
							field: 'EstRuleExecutionTypeFk',
							name: 'EstRuleExecutionType',
							width: 70,
							toolTip: 'EstRuleExecutionType',
							formatter: 'integer',
							name$tr$: 'estimate.rule.estRuleExecutionType',
							grouping: {
								title: 'estimate.rule.estRuleExecutionType',
								getter: 'EstRuleExecutionTypeFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'estrubriccatfk',
							field: 'BasRubricCategoryFk',
							name: 'RubricCategory',
							width: 70,
							toolTip: 'BasRubricCategory',
							formatter: 'integer',
							name$tr$: 'cloud.common.entityBasRubricCategoryFk',
							grouping: {
								title: 'cloud.common.entityBasRubricCategoryFk',
								getter: 'BasRubricCategoryFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							id: 'operand',
							field: 'Operand',
							name: 'Operand',
							width: 70,
							toolTip: 'Operand',
							editor: 'decimal',
							formatter: 'decimal',
							name$tr$: 'cloud.common.operand',
							grouping: {
								title: 'cloud.common.operand',
								getter: 'Operand',
								aggregators: [],
								aggregateCollapsed: true
							}
						}

					];

					if (showIsExecution) {
						columns.splice(0, 0, {
							id: 'isexecution',
							field: 'IsExecution',
							name: 'IsExecution',
							width: 70,
							toolTip: 'IsExecution',
							formatter: 'boolean',
							editor: 'boolean',
							readonly: false,
							headerChkbox: true,
							name$tr$: 'cloud.common.isExecution',
							grouping: {
								title: 'cloud.common.isExecution',
								getter: 'IsExecution',
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					}

					var estRubricFkConfig = _.find(columns, function (item) {
						return item.field === 'BasRubricCategoryFk';
					});

					let rubricConfig = {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'RubricCategoryByRubricAndCompany',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								'lookupOptions': {
									'filterKey': 'rubriccategorytrv-for-rule-filter',
									'lookupType': 'RubricCategoryByRubricAndCompany'
								}
							}
						}
					};

					angular.extend(estRubricFkConfig, rubricConfig.grid, {editor: null});
					// angular.extend(estRubricFkConfig, rubricConfig.grid);

					var estEvalSeqFkConfig = _.find(columns, function (item) {
						return item.field === 'EstEvaluationSequenceFk';
					});

					// TODO-Walt: sequence
					angular.extend(estEvalSeqFkConfig.editorOptions.lookupOptions, {
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var scope = this;
								var optionsEx = null;
								var maxTry = 10;
								var currentTry = 1;
								var service;

								while (scope.$parent !== null && currentTry < maxTry) {
									scope = scope.$parent;
									if (angular.isDefined(scope.OptionsEx)) {
										optionsEx = scope.OptionsEx;
										service = scope.service;
										break;
									}
									++currentTry;
								}

								var EntityEx = scope.EntityEx;

								if (angular.isDefined(args) && args.entity !== null && args.selectedItem !== null && optionsEx !== null) {
									args.entity.EstEvaluationSequenceFk = args.selectedItem.Id;
									args.entity.Sorting = args.selectedItem.Sorting;
									var updateInfo = estimateRuleAssignmentService.createNewEntity(args.entity);
									updateInfo.EstEvaluationSequenceFk = args.selectedItem.Id;
									boqRuleUpdateService.updateRuleAssignment(args.entity, optionsEx, EntityEx, updateInfo);
								}

								if (service) {
									service.getGrid().getData().sort(function (a, b) {
										return a.Sorting - b.Sorting;
									}, {ascending: true});
									var index = service.getGrid().getData().getIdxById(args.entity.Id);
									service.getGrid().setSelectedRows([index]);
									service.getGrid().invalidate();
								}
							}
						}]
					});

					var estRuleExecutionTypeFkConfig = _.find(columns, function (item) {
						return item.field === 'EstRuleExecutionTypeFk';
					});

					angular.extend(estRuleExecutionTypeFkConfig, basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.estRuleExecutionType', 'Description').grid, {editor: null});// , {editor:null}

					return columns;
				};

				service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
					if (!entity) {
						return;
					}
					var column = {formatterOptions: {serviceName: 'basicsCustomizeRuleIconService'}},
						service = $injector.get('platformGridDomainService'),
						icons = _.map(boqRuleComplexLookupService.getItemById(entity.RuleAssignment), 'Icon');
					return service.formatter('imageselect')(null, null, icons, column, entity, null, null);
				};

				// this function is used to construct the right boqRule for display
				service.generateCompositeBoqRuleItem = function generateCompositeBoqRuleItem(boq2Rule, prjOrMdcRule) {
					if (prjOrMdcRule && boq2Rule) {
						boq2Rule.MainId = prjOrMdcRule.Id;
						boq2Rule.Icon = prjOrMdcRule.Icon;
						boq2Rule.DescriptionInfo = prjOrMdcRule.DescriptionInfo;
						boq2Rule.EstRuleExecutionTypeFk = prjOrMdcRule.EstRuleExecutionTypeFk;
						boq2Rule.MdcLineItemContextFk = prjOrMdcRule.MdcLineItemContextFk;
						boq2Rule.HasChildren = prjOrMdcRule.HasChildren;
						boq2Rule.IsForBoq = prjOrMdcRule.IsForBoq;
						boq2Rule.IsForEstimate = prjOrMdcRule.IsForEstimate;
						boq2Rule.IsLive = prjOrMdcRule.IsLive;
						boq2Rule.Operand = prjOrMdcRule.Operand;
						boq2Rule.Remark = prjOrMdcRule.Remark;

						boq2Rule.BasRubricCategoryFk = prjOrMdcRule.BasRubricCategoryFk;

						boq2Rule.Code = prjOrMdcRule.Code;
						boq2Rule.EstEvaluationSequenceFk = prjOrMdcRule.EstEvaluationSequenceFk;
						boq2Rule.Comment = prjOrMdcRule.Comment;
						boq2Rule.IsExecution = true;
						boq2Rule.FormFk = prjOrMdcRule.FormFk;
						boq2Rule.IsPrjRule = prjOrMdcRule.IsPrjRule;
					}
					return boq2Rule;
				};

				var refreshBoqItemRuleAssign = function refreshBoqItemRuleAssign(effectedBoqItem) {
					var boqMainService = $injector.get('boqMainService');
					var item = _.find(boqMainService.getList(), {Id: effectedBoqItem.Id});
					if (item) {
						item.RuleAssignment = effectedBoqItem.RuleAssignment;
						item.RuleFormula = effectedBoqItem.RuleFormula;
						item.RuleFormulaDesc = effectedBoqItem.RuleFormulaDesc;
						boqMainService.fireItemModified(item);
					}
				};

				service.onSelectionChange = function onSelectionChange(args, scope) {
					var entity = args.entity || scope.$parent.entity;
					entity.RuleAssignment = entity.RuleAssignment ? entity.RuleAssignment : [];
					entity.Rule = null;

					if (!args.selectedItems) {
						return;
					}

					_.forEach(args.selectedItems, function (selectedItem) {
						// var assignment = _.find(entity.RuleAssignment? entity.RuleAssignment : [], {Code : args.selectedItem.Code});
						var assignment = _.find(entity.RuleAssignment, {Code: selectedItem.Code});
						if (assignment) {
							if (!assignment.IsExecution) {
								assignment.IsExecution = true;// set the IsExecution default value is true
								if (boqRuleComplexLookupService.isNavFromBoqProject()) {
									boqRuleUpdateService.setPrjBoqRulesToModified([assignment], entity);
								} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
									boqRuleUpdateService.setWicBoqRulesToModified([assignment], entity);
								}
							}
						} else {
							if (boqRuleComplexLookupService.isNavFromBoqProject()) {
								var newPrjBoq2Rule = {};
								// can't use the asynchronous request to get a new ID for the newPrjBoq2Rule,
								// because of when select one composite rule it will
								// trigger a update action. Then two asynchronous request will open, it will make errors.
								newPrjBoq2Rule.Id = -1;
								newPrjBoq2Rule.BoqHeaderFk = entity.BoqHeaderFk;
								newPrjBoq2Rule.BoqItemFk = entity.Id;
								// this selected rule is a EstRule
								newPrjBoq2Rule.PrjEstRuleFk = -1;
								if (selectedItem.IsPrjRule) {
									// wrong prjEstRuleFk here, this mainId is the estRuleFk
									var boqRuleFormatterService = $injector.get('boqRuleFormatterService');
									if (boqRuleFormatterService) {
										var prjRules = boqRuleFormatterService.getEstPrjOrMdcRules();
										if (_.isArray(prjRules)) {
											var selectedPrjRule = _.find(prjRules, {Code: selectedItem.Code});
											if (selectedPrjRule) {
												newPrjBoq2Rule.PrjEstRuleFk = selectedPrjRule.Id;
											}
										}
									}
								}

								service.generateCompositeBoqRuleItem(newPrjBoq2Rule, selectedItem);
								boqRuleUpdateService.setPrjBoqRulesToSave([newPrjBoq2Rule], entity, selectedItem);

								refreshBoqItemRuleAssign(entity);
								scope.ngModel = entity.RuleAssignment;
							} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
								var newWicBoq2Rule = {};
								// can't use the asynchronous request to get a new ID for the newPrjBoq2Rule,
								// because of when select one composite rule it will
								// trigger a update action. Then two asynchronous request will open, it will make errors.
								newWicBoq2Rule.Id = -1;
								newWicBoq2Rule.BoqHeaderFk = entity.BoqHeaderFk;
								newWicBoq2Rule.BoqItemFk = entity.Id;

								// not use Id here, use the MainId, this is the right Id for estRule table
								newWicBoq2Rule.EstRuleFk = selectedItem.MainId;
								service.generateCompositeBoqRuleItem(newWicBoq2Rule, selectedItem);
								boqRuleUpdateService.setWicBoqRulesToSave([newWicBoq2Rule], entity);

								refreshBoqItemRuleAssign(entity);
								scope.ngModel = entity.RuleAssignment;
							}
						}
					});
				};

				service.clearAllItems = function clearAllItems(args, scope) {
					var entity = args.entity;

					var boqMainService = $injector.get('boqMainService');
					if (!boqMainService) {
						return;
					}

					if (boqRuleComplexLookupService.isNavFromBoqProject()) {
						boqRuleUpdateService.setPrjBoqRulesToDelete(entity.RuleAssignment, entity);
					} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
						boqRuleUpdateService.setWicBoqRulesToDelete(entity.RuleAssignment, entity);
					}

					entity.RuleAssignment = [];
					entity.RuleFormula = '';
					entity.RuleFormulaDesc = '';
					scope.ngModel = [];

					refreshBoqItemRuleAssign(entity);
				};

				var initController = function initController(scope, lookupControllerFactory, opt, entityEx, selectItemIcon, popupInstance) {
					// fix defect 82055, when delete Item record in Items container,the Line Item record disappear
					var tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = function temp() {
					};

					var gridId = '7a9f7da5c9b44e339d49ba149a905987';// platformCreateUuid();
					var self = lookupControllerFactory.create({grid: true,dialog: true}, scope, {
						gridId: gridId,
						columns: service.getColumns(true),
						idProperty: 'Id',
						rowSelection: true,
						lazyInit: false,
						grouping: true,
						enableDraggableGroupBy: true
					});

					var isSequenceReadonly = false;

					var displayData = scope.entity.RuleAssignment;

					displayData = $injector.get('boqRuleSequenceLookupService').fillWithSorting(displayData);

					$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isSequenceReadonly').then(function (response) {
						isSequenceReadonly = response.data;
						$injector.get('estimateRuleComplexLookupProcessService').proressItems(displayData, response.data);// TODO-Walt: sequence
						self.updateData(displayData);
						scope.tools.update();
					});

					scope.service = self;

					popupInstance.onResizeStop.register(function () {
						$injector.get('platformGridAPI').grids.resize(scope.grid.state);
					});

					$timeout(function () {
						var item = _.find(displayData, {Icon: parseInt(selectItemIcon)});
						if (item) {
							self.selectRowById(item.Id);
						}

						updateTools();
					});

					scope.getTitle = function () {
						return 'Rules';
					};

					// sequence
					scope.OptionsEx = opt;
					scope.EntityEx = entityEx;

					scope.moveUpItem = function () {
						// as this popup support item muti selected, so should use the selected items' index to locate the selected items's place
						var assignmentItems = scope.service.getGrid().getData().getItems();
						var selectedIndexs = scope.service.getGrid().getSelectedRows();

						$injector.get('boqRuleSequenceLookupService').moveUp(selectedIndexs, assignmentItems, scope.OptionsEx, scope.EntityEx);
						self.getGrid().getData().sort(function (a, b) {
							return a.Sorting - b.Sorting;
						}, {ascending: true});
						var newSelectIndexs = [];
						var i = 0;
						_.forEach(selectedIndexs, function (index) {
							newSelectIndexs[i] = index - 1;
							i++;
						});
						self.getGrid().setSelectedRows(newSelectIndexs);
						self.getGrid().invalidate();
					};

					scope.moveDownItem = function () {
						// as this popup support item muti selected, so should use the selected items' index to locate the selected items's place
						var assignmentItems = scope.service.getGrid().getData().getItems();
						var selectedIndexs = scope.service.getGrid().getSelectedRows();

						$injector.get('boqRuleSequenceLookupService').moveDown(selectedIndexs, assignmentItems, scope.OptionsEx, scope.EntityEx);
						self.getGrid().getData().sort(function (a, b) {
							return a.Sorting - b.Sorting;
						}, {ascending: true});
						var newSelectIndexs = [];
						var i = 0;
						_.forEach(selectedIndexs, function (index) {
							newSelectIndexs[i] = index + 1;
							i++;
						});
						self.getGrid().setSelectedRows(newSelectIndexs);
						self.getGrid().invalidate();
					};

					scope.deleteItem = function () {
						var items = self.getSelectedItems();
						if (boqRuleComplexLookupService.isNavFromBoqProject()) {
							boqRuleUpdateService.setPrjBoqRulesToDelete(items, scope.entity);
						} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
							boqRuleUpdateService.setWicBoqRulesToDelete(items, scope.entity);
						}

						scope.ngModel = scope.entity.RuleAssignment;
						self.updateData(scope.entity.RuleAssignment);

						refreshBoqItemRuleAssign(scope.entity);
					};

					if (scope.tools) {
						// show the system and role level configuratio
						_.forEach(scope.tools.items, function (item) {
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
								fn: scope.moveUpItem,
								disabled: true
							},
							{
								id: 't2',
								sort: 21,
								caption: 'cloud.common.taskBarMoveDown',
								type: 'item',
								iconClass: 'tlb-icons ico-grid-row-down',
								fn: scope.moveDownItem,
								disabled: true
							},
							{
								id: 't3',
								sort: 31,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								fn: scope.deleteItem,
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
						scope.tools.items = toolItems.concat(scope.tools.items);
					}
					function overloadItem(level, func) {
						func(level);
					}

					function onCellChange(e, args) {
						var item = args.item,
							col = args.grid.getColumns()[args.cell].field;
						if (col === 'IsExecution' || col === 'Comment' || col === 'Operand') {
							boqRuleUpdateService.updateRuleAssignment(item, opt, entityEx, estimateRuleAssignmentService.createNewEntity(item));
						}

						if (col === 'IsExecution') {
							entityEx.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(entityEx.RuleAssignment);
							entityEx.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(entityEx.RuleAssignment);
						}
					}

					function checkAll(e) {
						_.forEach(displayData, function (item) {
							boqRuleUpdateService.updateRuleAssignment(item, opt, entityEx, estimateRuleAssignmentService.createNewEntity(item, e.target.checked));
						});

						entityEx.RuleFormula = boqRuleFormatterService.GeneratedRuleFormula(entityEx.RuleAssignment);
						entityEx.RuleFormulaDesc = boqRuleFormatterService.GeneratedRuleFormulaDesc(entityEx.RuleAssignment);
					}

					function onSelectedRowsChanged() {
						updateTools();
					}

					function updateTools() {

						var toolsStatues = $injector.get('estimateRuleSequenceLookupService').getToolsStatues(scope.service.getGrid(), scope.service.getSelectedItems(), isSequenceReadonly);

						angular.forEach(scope.tools.items, function (item) {
							if (item.id === 't1') {
								item.disabled = toolsStatues.isSequenceMoveUpReadonly;
							} else if (item.id === 't2') {
								item.disabled = toolsStatues.isSequenceMoveDownReadonly;
							}
							if (item.id === 't3') {
								item.disabled = toolsStatues.deleteButtonReadonly;
							}
						});

						$timeout(function () {
							scope.tools.update();
						});
					}

					platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register(gridId, 'onHeaderCheckboxChanged', checkAll);
					platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					service.registerFilters();

					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(gridId, 'onCellChange', onCellChange);
						platformGridAPI.events.register(gridId, 'onHeaderCheckboxChanged', checkAll);
						platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

						basicsLookupdataPopupService.hidePopup = tempHidePopup;

						service.unregisterFilters();
					});
				};

				service.openPopup = function openPopup(e, scope) {
					scope.ngModel = scope.entity.RuleAssignment;
					var cl = e.target.classList;
					var currentIcon = cl && cl.length ? cl[cl.length - 1] : null;
					var popupOptions = {
						templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
						title: 'estimate.rule.ruleContainer',
						showLastSize: true,
						controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
						width: 700,
						height: 300,
						focusedElement: angular.element(e.target.parentElement),
						relatedTarget: angular.element(e.target),
						scope: scope.$new(),
						zIndex: 1000,
						formatter: service.displayFormatter // return custom input content
					};
					// toggle popup
					popupToggle.toggle(popupOptions);

					function controller($scope, lookupControllerFactory, $popupInstance) {
						var options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : getOptions(scope);
						var entity = scope.$parent.$parent.entity;
						$scope.showParamGrid = true;
						initController($scope, lookupControllerFactory, options, entity, currentIcon, $popupInstance);

						$scope.$on('$destroy', function () {
							if ($scope.$close) {
								$scope.$close();
							}
						});
					}
				};

				return service;
			}]);
})(angular);
