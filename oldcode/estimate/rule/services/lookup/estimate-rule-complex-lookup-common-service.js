/**
 * Created by joshi on 25.02.2016.
 */

(function (angular) {
	/* global globals,$q */
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleComplexLookupCommonService
	 * @function
	 *
	 * @description
	 * estimateRuleComplexLookupCommonService provides all lookup common fn. for estimate Rules complex lookup
	 */
	angular.module(moduleName).factory('estimateRuleComplexLookupCommonService',
		['_', '$http', '$injector', '$timeout', 'platformGridAPI', 'cloudCommonGridService', 'estimateRuleComplexLookupService', 'platformCreateUuid', 'basicsLookupdataPopupService',
			'estimateMainRuleUpdateService', 'basicsLookupdataConfigGenerator','$q','platformModalService', 'estimateRuleAssignmentService',
			function (
				_, $http, $injector, $timeout, platformGridAPI, cloudCommonGridService, estimateRuleComplexLookupService, platformCreateUuid, basicsLookupdataPopupService,
				estimateMainRuleUpdateService, basicsLookupdataConfigGenerator,$q, platformModalService, estimateRuleAssignmentService) {

				// Object presenting the service
				let service = {};
				let popupToggle = basicsLookupdataPopupService.getToggleHelper();
				let systemOptionEditEvaSeqValue = 0;
				let estMainSer = $injector.get('estimateMainService');
				let _GridId;

				$http.post(globals.webApiBaseUrl + 'basics/customize/SystemOption/list').then(function (response) {
					let systemOptionEditEvaSeq = 0;
					_.forEach(response.data, function(itemRecord){
						if(itemRecord.Id === 801){
							systemOptionEditEvaSeq = itemRecord.ParameterValue;
						}
					});
					service.setSystemOptionEditEvaSeqVaule(systemOptionEditEvaSeq);
				},
				function(){}
				);

				function getData (assignments, config){
					let ruleList = estimateRuleComplexLookupService.getList(config);
					let list = [];
					cloudCommonGridService.flatten(ruleList, list, 'CustomEstRules');

					let result = [];

					angular.forEach(_.uniq(assignments),function(ruleAssign){

						let item = _.find(list, {'Code':ruleAssign.Code});

						if(item && item.Id){
							let itemCopy = angular.copy(item);
							itemCopy.Comment = ruleAssign.Comment;
							itemCopy.Operand = ruleAssign.Operand;
							result.push(itemCopy);
						}
					});

					if (estMainSer.getHeaderStatus() || !estMainSer.hasCreateUpdatePermission()) {
						angular.forEach(result, function (item) {
							var fields = setReadOnly(item, true);
							$injector.get('platformRuntimeDataService').readonly(item, fields);

						});
					}
					return $injector.get('estimateRuleSequenceLookupService').setSorting(result, assignments);
				}

				function setReadOnly(items, isReadOnly) {
					var fields = [];
					// item = _.isArray(items) ? items[0] : null;

					_.forOwn(items, function (value, key) {
						var field = { field: key, readonly: isReadOnly };
						fields.push(field);
					});
					return fields;
				}

				function getOptions(scope){
					let config = scope.$parent.$parent.groups;
					if(!config){return;}
					let group = _.find(scope.$parent.$parent.groups, {gid : 'ruleAndParam'});
					if(!group){return;}
					let ruleConfig = _.find(group.rows, {rid : 'rule'});
					return ruleConfig ? ruleConfig.formatterOptions : null;
				}

				function refreshRootRule(entity, rootServices){
					if(entity.IsRoot || entity.IsEstHeaderRoot){
						angular.forEach(rootServices, function(serv){
							if(serv){
								let rootService = $injector.get(serv);
								let affectedRoot = _.find(rootService.getList(), {IsRoot : true});
								if(!affectedRoot){
									affectedRoot = _.find(rootService.getList(), {IsEstHeaderRoot : true});
								}
								if(affectedRoot){
									affectedRoot.RuleAssignment = entity.RuleAssignment;
									rootService.fireItemModified(affectedRoot);
								}
							}
						});
					}
				}

				service.getColumnsReadOnly = function getColumnsReadOnly(){
					let columns = service.getColumns();
					_.forEach(columns, function(item){
						item.editor = null;
					});

					return columns;
				};
				service.getColumns = function getColumns(showIsExecution){
					// adjust the column layout display as defect #93720
					let columns = [
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
							},
							sortOrder:1
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
							},
							sortOrder:2
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
							},
							sortOrder:3
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
							},
							sortOrder:4
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
							editor : 'lookup',
							editorOptions : {
								lookupDirective: 'estimate-Rule-Sequence-Lookup',
								lookupOptions: {
									lookupType: 'estsequences',
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'estimateSequenceLookupProcessService',
									showIcon: true
								}
							},
							formatter : 'lookup',
							formatterOptions : {
								lookupType: 'estsequences',
								dataServiceName: 'estimateRuleSequenceLookupService',
								displayMember: 'DescriptionInfo.Translated',
								valueMember: 'Id',
								imageSelector: 'estimateSequenceLookupProcessService'
							},
							sortOrder:5
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
							},
							sortOrder:6
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
							formatter: 'decimal',
							editor: 'decimal',
							name$tr$: 'cloud.common.operand',
							grouping: {
								title: 'cloud.common.operand',
								getter: 'Operand',
								aggregators: [],
								aggregateCollapsed: true
							},
							sortOrder:7
						},
						{
							id: 'formfk',
							editor: null,
							editorOptions: null,
							field: 'FormFk',
							formatter: 'lookup',
							formatterOptions:{
								dataServiceName: 'estimateRuleUserformLookupService',
								displayMember: 'Description',
								lookupType: 'estimateRuleUserformLookupService'
							},
							grouping:{
								aggregateCollapsed: true,
								aggregators: [],
								getter: 'FormFk',
								title: 'estimate.rule.userForm'
							},
							name: 'User Form',
							name$tr$: 'estimate.rule.userForm',
							toolTip: 'User Form',
							toolTip$tr$: 'estimate.rule.userForm',
							sortOrder:8
						}
					];

					let headerChkbox;
					if (estMainSer.getHeaderStatus() || !estMainSer.hasCreateUpdatePermission()) {
						headerChkbox = false;
					} else {
						headerChkbox = true;
					}

					if(showIsExecution){
						columns.splice(0,0, {
							id: 'isexecution',
							field: 'IsExecution',
							name: 'IsExecution',
							width: 70,
							toolTip: 'IsExecution',
							formatter: 'boolean',
							editor: 'boolean',
							readonly : false,
							headerChkbox,
							name$tr$: 'cloud.common.isExecution',
							grouping: {
								title: 'cloud.common.isExecution',
								getter: 'IsExecution',
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					}

					let estRubricFkConfig = _.find(columns, function (item) {
						return item.field === 'BasRubricCategoryFk';
					});

					let rubricConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
						enableCache: true,
						readonly : true,
						filter: function () {
							return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
						}
					});

					angular.extend(estRubricFkConfig, rubricConfig.grid, {editor:null});

					let estEvalSeqFkConfig = _.find(columns, function (item) {
						return item.field === 'EstEvaluationSequenceFk';
					});


					angular.extend(estEvalSeqFkConfig.editorOptions.lookupOptions,{events: [{
						name: 'onSelectedItemChanged',
						handler: function(e, args){
							let scope = this;
							let optionsEx = null;
							let maxTry = 10;
							let currentTry = 1;
							let service;

							while(scope.$parent !== null && currentTry < maxTry){
								scope = scope.$parent;
								if(angular.isDefined(scope.OptionsEx)){
									optionsEx = scope.OptionsEx;
									service = scope.service;
									break;
								}
								++currentTry;
							}

							let EntityEx = scope.EntityEx;

							if (angular.isDefined(args) && args.entity !== null && args.selectedItem !== null && optionsEx !== null){
								args.entity.EstEvaluationSequenceFk = args.selectedItem.Id;
								args.entity.Sorting = args.selectedItem.Sorting;
								estimateMainRuleUpdateService.updateRuleAssignment(args.entity, optionsEx, EntityEx, estimateRuleAssignmentService.createNewEntity(args.entity));

								// if IsChangeable is false, make the entity readonly
								args.entity.Ischangeable = args.selectedItem.Ischangeable;
							}

							if(service){
								service.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
								let index = service.getGrid().getData().getIdxById(args.entity.Id);
								service.getGrid().setSelectedRows([index]);
								service.getGrid().invalidate();
							}
						}
					}]});

					let estRuleExecutionTypeFkConfig = _.find(columns, function (item) {
						return item.field === 'EstRuleExecutionTypeFk';
					});

					angular.extend(estRuleExecutionTypeFkConfig, basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.estRuleExecutionType', 'Description').grid, {editor:null});// , {editor:null}

					return columns;
				};

				service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
					if(!entity){return;}
					let column = { formatterOptions: {serviceName: 'basicsCustomizeRuleIconService', acceptFalsyValues: true}},
						service = $injector.get('platformGridDomainService'),
						icons = _.map(estimateRuleComplexLookupService.getItemById(entity.RuleAssignment), 'Icon');
					return  service.formatter('imageselect')(null,null, icons, column, entity, null, null);
				};

				let canDeleteLS2RuleItems = function canDeleteLS2RuleItems(ls2RuleData){
					return $http.post(globals.webApiBaseUrl + 'estimate/main/ls2rule/candeletels2rule', ls2RuleData);
				};
				service.canDeleteLS2RuleItems = canDeleteLS2RuleItems;

				service.onSelectionChange = function onSelectionChange(args, scope){
					let entity = args.entity || scope.$parent.entity,
						opt = scope.$parent.$parent.$parent.config ? scope.$parent.$parent.$parent.config.formatterOptions : getOptions(scope);

					estimateMainRuleUpdateService.setRuleToSave(args.selectedItems, entity, opt.itemServiceName, opt.itemName);

					entity.RuleAssignment = entity.RuleAssignment ? entity.RuleAssignment : [];

					_.forEach(args.selectedItems, function (selectedItem) {
						let assignment = _.find(entity.RuleAssignment, {Code : selectedItem.Code});

						if (assignment) {
							assignment.IsExecution = true;
							// set the IsExecution default value is true
						}else{
							let newAssignment = estimateRuleAssignmentService.createNewEntity(selectedItem, true);
							newAssignment.Code = selectedItem.Code;
							entity.RuleAssignment.push(newAssignment);

							// used for the situation that user choose one prjRule then delete the one immediately
							if(!_.find(estimateMainRuleUpdateService.getTempAddedRule(),{Code: selectedItem.Code})){
								estimateMainRuleUpdateService.getTempAddedRule().push(selectedItem);
							}
						}
					});


					scope.ngModel = entity.RuleAssignment;
					let rootServices = _.filter(opt.RootServices, function(serv){
						return serv !== opt.itemServiceName;
					});
					refreshRootRule(scope.entity,rootServices);
				};

				service.onSelectionChangeInLineItemDetailForm = function onSelectionChangeInLineItemDetailForm(args, scope){
					let entity = args.entity || scope.$parent.entity;

					estimateMainRuleUpdateService.setRuleToSave(args.selectedItems, entity, 'estimateMainService', 'EstLineItems');

					entity.RuleAssignment = entity.RuleAssignment ? entity.RuleAssignment : [];

					_.forEach(args.selectedItems, function (selectedItem) {
						let assignment = _.find(entity.RuleAssignment, {Code : selectedItem.Code});

						if(assignment){
							assignment.IsExecution = true; // set the IsExecution default value is true
						}else{
							let newAssignment = estimateRuleAssignmentService.createNewEntity(selectedItem, true);
							newAssignment.Code = selectedItem.Code;
							entity.RuleAssignment.push(newAssignment);

							// used for the situation that user choose one prjRule then delete the one immediately
							if(!_.find(estimateMainRuleUpdateService.getTempAddedRule(),{Code: selectedItem.Code})){
								estimateMainRuleUpdateService.getTempAddedRule().push(selectedItem);
							}
						}
					});

					scope.ngModel = entity.RuleAssignment;

					// refresh lineItem grid's lineItem
					let estimateMainService = $injector.get('estimateMainService');
					let item = _.find(estimateMainService.getList(), {Id : scope.entity.Id});
					if(item){
						item.RuleAssignment = entity.RuleAssignment;
						estimateMainService.fireItemModified(item);
					}
				};

				service.clearAllItems = function clearAllItems(args, scope, canDelete){
					let entity = args.entity,
						opt = scope.$parent.$parent.config.formatterOptions,
						lookupItems = _.isArray(args.entity.RuleAssignment) ? args.entity.RuleAssignment : args.entity.RuleAssignment ? [args.entity.RuleAssignment] : [];

					let estimateMainService = $injector.get('estimateMainService');
					if(!estimateMainService && lookupItems){ return $q.when();}
					let ls2RuleData = {
						PrjEstRulesToSave : lookupItems,
						LSItemId : entity.IsRoot ? entity.EstHeaderFk : entity.Id,
						LSName : opt.itemName,
						ProjectId : estimateMainService.getSelectedProjectId(),
						EstHeaderId : estimateMainService.getSelectedEstHeaderId()
					};
					if(canDelete){
						// the leadingStructure2Rule can be delete, continue
						estimateMainRuleUpdateService.setRuleToDelete(lookupItems, entity, opt.itemServiceName, opt.itemName);
						entity.RuleAssignment = [];
						scope.ngModel = [];
						refreshRootRule(scope.entity, opt.RootServices);
					}
					else {
						return canDeleteLS2RuleItems(ls2RuleData).then(function (response) {
							let res = response.data;
							if (!res) {
								// can't delete here
								// add a confirm dialog to confirm whether delete it or not
								platformModalService.showErrorBox('estimate.rule.dialog.canDeleteLineItem2PrjRuleOrNot', 'cloud.common.errorMessage');
							} else {
								// the leadingStructure2Rule can be delete, continue
								estimateMainRuleUpdateService.setRuleToDelete(lookupItems, entity, opt.itemServiceName, opt.itemName);
								entity.RuleAssignment = [];
								scope.ngModel = [];
								refreshRootRule(scope.entity, opt.RootServices);
							}
						});
					}
					return $q.when();
				};

				service.clearAllItemsInLineItemDetailForm = function clearAllItemsFromDetailForm(args, scope, canDelete){
					let entity = args.entity,
						// opt = scope.$parent.$parent.config.formatterOptions,
						lookupItems = _.isArray(args.entity.RuleAssignment) ? args.entity.RuleAssignment : args.entity.RuleAssignment ? [args.entity.RuleAssignment] : [];

					let estimateMainService = $injector.get('estimateMainService');
					if(!estimateMainService && lookupItems){ return $q.when(); }
					let ls2RuleData = {
						PrjEstRulesToSave : lookupItems,
						LSItemId : entity.IsRoot ? entity.EstHeaderFk : entity.Id,
						LSName : 'EstLineItems',
						ProjectId : estimateMainService.getSelectedProjectId(),
						EstHeaderId : estimateMainService.getSelectedEstHeaderId()
					};
					if(canDelete){
						// the leadingStructure2Rule can be delete, continue
						estimateMainRuleUpdateService.setRuleToDelete(lookupItems, entity, 'estimateMainService', 'EstLineItems');
						entity.RuleAssignment = [];
						scope.ngModel = [];
						refreshRootRule(scope.entity);
					}
					else {
						return canDeleteLS2RuleItems(ls2RuleData).then(function (response) {
							let res = response.data;
							if (!res) {
								// can't delete here
								// add a confirm dialog to confirm whether delete it or not
								platformModalService.showErrorBox('estimate.rule.dialog.canDeleteLineItem2PrjRuleOrNot', 'cloud.common.errorMessage');
							} else {
								// the leadingStructure2Rule can be delete, continue
								estimateMainRuleUpdateService.setRuleToDelete(lookupItems, entity, 'estimateMainService', 'EstLineItems');
								entity.RuleAssignment = [];
								scope.ngModel = [];

								let item = _.find(estimateMainService.getList(), {Id : scope.entity.Id});
								if(item){
									item.RuleAssignment = [];
									estimateMainService.fireItemModified(item);
								}
							}
						});
					}
					return $q.when();
				};

				let initController = function initController(scope, lookupControllerFactory, opt, entityEx, selectItemIcon, popupInstance) {
					// fix defect 82055, when delete Item record in Items container,the Line Item record disappear
					let tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = function temp(){};

					let gridId =  '7a9f7da5c9b44e339d49ba149a905987'; // platformCreateUuid();
					_GridId = gridId;
					let self = lookupControllerFactory.create({grid: true,dialog: true}, scope, {
						gridId: gridId,
						columns: service.getColumns(true),
						idProperty : 'Id',
						lazyInit: true,
						grouping: true,
						enableDraggableGroupBy: true
					});

					let isSequenceReadonly = false;

					let displayData = getData(scope.entity.RuleAssignment, scope.options);

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
						let item = _.find(displayData, {Icon:parseInt(selectItemIcon)});
						if(item){
							self.selectRowById(item.Id);
						}

						updateTools();
					});

					scope.getTitle = function(){
						return 'Rules';
					};

					// sequence
					scope.OptionsEx = opt;
					scope.EntityEx = entityEx;

					scope.moveUpItem = function () {
						// as this popup support item muti selected, so should use the selected items' index to locate the selected items's place
						let assignmentItems = scope.service.getGrid().getData().getItems();
						let selectedIndexs = scope.service.getGrid().getSelectedRows();

						$injector.get('estimateRuleSequenceLookupService').moveUp(selectedIndexs, assignmentItems, scope.OptionsEx, scope.EntityEx);
						self.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
						let newSelectIndexs = [];
						let i = 0;
						_.forEach(selectedIndexs, function(index){
							newSelectIndexs[i] = index - 1;
							i++;
						});
						self.getGrid().setSelectedRows(newSelectIndexs);
						self.getGrid().invalidate();
					};

					scope.moveDownItem = function(){
						// as this popup support item muti selected, so should use the selected items' index to locate the selected items's place
						let assignmentItems = scope.service.getGrid().getData().getItems();
						let selectedIndexs = scope.service.getGrid().getSelectedRows();

						$injector.get('estimateRuleSequenceLookupService').moveDown(selectedIndexs, assignmentItems, scope.OptionsEx, scope.EntityEx);
						self.getGrid().getData().sort(function(a, b){ return a.Sorting - b.Sorting;}, {ascending : true});
						let newSelectIndexs = [];
						let i = 0;
						_.forEach(selectedIndexs, function(index){
							newSelectIndexs[i] = index + 1;
							i++;
						});
						self.getGrid().setSelectedRows(newSelectIndexs);
						self.getGrid().invalidate();
					};

					scope.deleteParamOfRule = function deleteParamOfRule(entity,itemName){
						let estimateMainService = $injector.get('estimateMainService');
						let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
						let updateData = modTrackServ.getModifications(estimateMainService);

						let rule2Delete =[];
						switch (itemName) {
							case 'EstBoq':
								if(entity.IsRoot){
									rule2Delete = updateData.EstHeaderRuleToDelete;
								}else{
									rule2Delete = updateData.EstBoqRuleToDelete;
								}
								break;
							case 'EstActivity':
								if(entity.IsRoot){
									rule2Delete = updateData.EstHeaderRuleToDelete;
								}else{
									rule2Delete = updateData.EstActivityRuleToDelete;
								}
								break;
							case 'EstPrjLocation':
								rule2Delete = updateData.EstPrjLocationRuleToDelete;
								break;
							case 'EstCtu':
								rule2Delete = updateData.EstCtuRuleToDelete;
								break;
							case 'EstPrcStructure':
								rule2Delete = updateData.EstPrcStructureRuleToDelete;
								break;
							case 'EstAssemblyCat':
								rule2Delete = updateData.EstAssemblyCatRuleToDelete;
								break;
							case  'EstCostGrp':
								rule2Delete = updateData.EstCostGrpRuleToDelete;
								break;
							case 'EstLineItems':
								rule2Delete = updateData.EstLineItemsRuleToDelete;
								break;
							case 'EstHeader':
								rule2Delete = updateData.EstHeaderRuleToDelete;
								break;
						}
						if(rule2Delete && rule2Delete.length) {
							let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
							platformDeleteSelectionDialogService.showDialog ({
								dontShowAgain: true,
								id: '7a9f7da5c9b44e339d49ba149a905987'
							}).then (result => {
								if (result.ok || result.delete) {
									estimateMainService.deleteParamByPrjRule (entity, rule2Delete,itemName);
								}
							});
						}

					};

					scope.deleteItem = function(){

						let items = self.getSelectedItems();

						let estimateMainService = $injector.get('estimateMainService');
						if(!estimateMainService){
							return;
						}
						let ls2RuleData = {
							PrjEstRulesToSave : items,
							LSItemId : scope.entity.IsRoot ? scope.entity.EstHeaderFk : scope.entity.Id,
							LSName : opt.itemName,
							ProjectId : estimateMainService.getSelectedProjectId(),
							EstHeaderId : estimateMainService.getSelectedEstHeaderId()
						};
						canDeleteLS2RuleItems(ls2RuleData).then(function(response){
							let res = response.data;
							if (!res) {
								estimateMainRuleUpdateService.clear();
								// can't delete here
								// add a confirm dialog to confirm whether delete it or not
								platformModalService.showErrorBox('estimate.rule.dialog.canDeleteLineItem2PrjRuleOrNot', 'cloud.common.errorMessage');
							} else {
								// the leadingStructure2Rule can be delete, continue
								estimateMainRuleUpdateService.setRuleToDelete(items, scope.entity, opt.itemServiceName, opt.itemName);

								angular.forEach(items,function(item){
									scope.entity.RuleAssignment = _.filter(scope.entity.RuleAssignment, function(ruleAssign) {
										return item.Code !== ruleAssign.Code;
									});
								});
								scope.ngModel = scope.entity.RuleAssignment;

								let displayData = getData(scope.entity.RuleAssignment, scope.options);
								self.updateData(displayData);
								let itemService = $injector.get(opt.itemServiceName);
								itemService.fireItemModified(scope.entity);

								refreshRootRule(scope.entity, opt.RootServices);
								scope.deleteParamOfRule(scope.entity,opt.itemName);
								estimateMainService.update();
							}
						});
					};

					scope.toggleFilter = function (active, clearFilter) {
						platformGridAPI.filters.showSearch(gridId, active, clearFilter);
					};

					scope.toggleColumnFilter = function (active, clearFilter) {
						platformGridAPI.filters.showColumnSearch(gridId, active, clearFilter);
					};

					let searchAllToggle = {
						id: 'gridSearchAll',
						sort: 150,
						caption: 'cloud.common.taskBarSearch',
						type: 'check',
						iconClass: 'tlb-icons ico-search-all',
						fn: function () {
							scope.toggleFilter(this.value);

							if (this.value) {
								searchColumnToggle.value = false;
								scope.toggleColumnFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
					};

					let searchColumnToggle = {
						id: 'gridSearchColumn',
						sort: 160,
						caption: 'cloud.common.taskBarColumnFilter',
						type: 'check',
						iconClass: 'tlb-icons ico-search-column',
						fn: function () {
							scope.toggleColumnFilter(this.value);

							if (this.value) {
								searchAllToggle.value = false;
								scope.toggleFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
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
							searchAllToggle,
							searchColumnToggle,
							{
								id: 't4',
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

					function onCellChange(e, args){
						let item = args.item,
							col = args.grid.getColumns()[args.cell].field;
						if(col === 'IsExecution' || col === 'Comment' || col === 'Operand'){
							estimateMainRuleUpdateService.updateRuleAssignment(item, opt, entityEx, estimateRuleAssignmentService.createNewEntity(item));
						}
					}

					function checkAll(e){
						_.forEach(displayData, function (item) {
							estimateMainRuleUpdateService.updateRuleAssignment(item, opt, entityEx, estimateRuleAssignmentService.createNewEntity(item, e.target.checked));
						});
					}

					function onSelectedRowsChanged(){
						// updateTools(args && _.isArray(args.rows) && args.rows.length>0);
						updateTools();
					}

					function updateTools() {
						// To remove delete button from tools beacuse estimate is in readonly state
						if ($injector.get('estimateMainService').getHeaderStatus() || !$injector.get('estimateMainService').hasCreateUpdatePermission()) {
							angular.forEach(scope.tools.items, function (item) {
								if (item.id === 't3') {
									item.disabled = true;
								}
							});
						}
						if(scope.service.getGrid()) {
							let toolsStatues = $injector.get('estimateRuleSequenceLookupService').getToolsStatues(scope.service.getGrid(), scope.service.getSelectedItems(), isSequenceReadonly);
							let estMainSer = $injector.get('estimateMainService');
							angular.forEach(scope.tools.items, function (item) {
								if (item.id === 't1') {
									item.disabled = toolsStatues.isSequenceMoveUpReadonly;
								}
								else if (item.id === 't2') {
									item.disabled = toolsStatues.isSequenceMoveDownReadonly;
								}
								if (item.id === 't3') {
									if (estMainSer.getHeaderStatus() || !estMainSer.hasCreateUpdatePermission()) {
										item.disabled = true;
									} else {
										item.disabled = toolsStatues.deleteButtonReadonly;
									}
								}
							});


							$timeout(function () {
								scope.tools.update();
							});
						}
					}

					platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register(gridId, 'onHeaderCheckboxChanged', checkAll);
					platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(gridId, 'onCellChange', onCellChange);
						platformGridAPI.events.unregister(gridId, 'onHeaderCheckboxChanged', checkAll);
						platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

						basicsLookupdataPopupService.hidePopup = tempHidePopup;
					});
				};

				let clickFromDetailForm;
				service.openPopup = function openPopup(e, scope, fromDetailForm){
					clickFromDetailForm = fromDetailForm;

					scope.ngModel = scope.entity.RuleAssignment;
					let cl = e.target.classList;
					let currentIcon = cl && cl.length ? cl[cl.length-1]: null;
					let popupOptions = {
						templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
						title: 'estimate.rule.ruleContainer',
						showLastSize: true,
						controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
						width: 900,
						height: 400,
						focusedElement: angular.element(e.target.parentElement),
						relatedTarget: angular.element(e.target),
						scope: scope.$new(),
						zIndex: 1000,
						showActionButtons: true,
						formatter: service.displayFormatter // return custom input content
					};
					// toggle popup
					let instance = popupToggle.toggle(popupOptions);

					if(instance) {
						instance.okClicked.then(function () {
							let _gridId = _GridId;
							let gRows = platformGridAPI.grids.element('id', _gridId).instance.getData().getRows();

							if(_gridId && (gRows.length > 0)) {
								platformGridAPI.grids.commitEdit(_gridId);
								platformGridAPI.grids.cancelEdit(_gridId);

								$timeout(function () {
									let platformNavBarService = $injector.get('platformNavBarService');
									platformNavBarService.getActionByKey('save').fn();
									$injector.get('estimateRuleFormatterService').updateRuleAssignment(scope.ngModel);
									scope.entity.RuleAssignment = scope.ngModel;
									instance.close();
								}, 300);
							}
						});
					}

					function controller($scope, lookupControllerFactory, $popupInstance) {
						let options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : getOptions(scope);
						let entity = scope.$parent.$parent.entity;
						$scope.showParamGrid = true;
						initController($scope, lookupControllerFactory, options, entity, currentIcon, $popupInstance);

						$scope.$on('$destroy', function() {
							if($scope.$close) {
								$scope.$close();
							}
						});
					}
				};

				service.getIfClickFromDetailForm = function(){
					return clickFromDetailForm;
				};
				service.setIfClickFromDetailForm = function(value){
					clickFromDetailForm = value;
				};

				service.setSystemOptionEditEvaSeqVaule = function(value){
					systemOptionEditEvaSeqValue = value;
				};

				service.getSystemOptionEditEvaSeqVaule = function(){
					return  systemOptionEditEvaSeqValue;
				};

				return service;
			}]);
})(angular);
