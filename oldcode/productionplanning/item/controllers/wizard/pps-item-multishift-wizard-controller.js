/**
 * Created by saa.mik on 09/07/2020.
 */

(function (angular) {
	'use strict';
	/* globals angular,_,globals,Slick */
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningMultishiftWizardDialogController', Controller);
	Controller.$inject = ['$injector','$scope', 'WizardHandler', '$translate', 'cloudCommonGridService', 'productionplanningItemMultishiftDataService',
		'platformWatchListService','platformGridAPI', 'ppsCommonGridToolbarBtnService', 'platformModuleStateService'];

	function Controller($injector, $scope, WizardHandler, $translate, cloudCommonGridService, productionplanningItemMultishiftDataService,
		platformWatchListService,platformGridAPI,gridToolbarBtnService, platformModuleStateService) {

		function fireOnStepChanging() {
			const eventArgs = {
				step: $scope.currentStep,
				stepIndex: $scope.getCurrentStepNumber() - 1,
				scope: $scope,
				wizard: $scope.wizard,
				commands: $scope.wizardCommands,
				model: $scope.entity
			};

			if ($scope.wizard.onStepChanging) {
				if (angular.isFunction($scope.wizard.onStepChanging)) {
					$scope.wizard.onStepChanging(eventArgs);
				} else if (angular.isArray($scope.wizard.onStepChanging)) {
					$scope.wizard.onStepChanging.forEach(function (osc) {
						if (angular.isFunction(osc)) {
							osc(eventArgs);
						}
					});
				}
			}
		}

		$scope.wizardTemplateUrl = globals.appBaseUrl + 'productionplanning.item/templates/pps-item-multishift-wizard-dialog.html';

		$scope.wizardName = $scope.dialog.modalOptions.value.wizardName;
		$scope.wizard = $scope.dialog.modalOptions.value.wizard;
		$scope.entity = $scope.dialog.modalOptions.value.entity;
		$scope.wizardCommands = {
			goToNext: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.next();
			},
			goToPrevious: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
			},
			finish: function () {
				fireOnStepChanging();
				const wz = WizardHandler.wizard($scope.wizardName);
				wz.finish();
			}
		};

		platformWatchListService.createWatches($scope.wizard.watches, $scope, 'entity.', function (infoObj) {
			infoObj.wizard = infoObj.scope.wizard;
			infoObj.commands = infoObj.scope.wizardCommands;
			infoObj.model = infoObj.scope.entity;
		});

		$scope.getEnabledSteps = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.getEnabledSteps();
			} else {
				return [];
			}
		};

		$scope.getCurrentStepNumber = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.currentStepNumber();
			} else {
				return '';
			}
		};
		$scope.getTotalStepCount = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz) {
				return wz.totalStepCount();
			} else {
				return '';
			}
		};
		$scope.getCurrentStepTitle = function () {
			const wz = WizardHandler.wizard($scope.wizardName);
			if (wz && wz.currentStepNumber()) {
				return wz.currentStepTitle();
			} else {
				return '';
			}
		};

		$scope.getNextStep = function getNextStep(titleOnly) {
			const wz = WizardHandler.wizard($scope.wizardName);
			const nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
			if (titleOnly) {
				return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
			} else {
				return nextStep;
			}
		};

		let selectedColumn = {
			id: 'upSelected',
			field: 'Selected',
			name: 'Selected',
			name$tr$: 'project.main.selected',
			formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
				var html = '';
				if (value === true) {
					html = '<input type="checkbox" checked />';
				} else if (value === 'false') {
					html = '<input type="checkbox" disabled />';
				} else if (value === 'true') {
					html = '<input type="checkbox" checked disabled />';
				} else if (value === 'unknown') {
					setTimeout(function () {
						angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
					}, 0);

					html = '<input type="checkbox"/>';
				} else {
					html = '<input type="checkbox" unchecked/>';
				}
				return '<div class="text-center" >' + html + '</div>';
			},
			editor: 'directive',
			editorOptions: {
				directive: 'material-group-checkbox'
			},
			width: 70,
			pinned: true,
		};

		// let flattenItems = [];
		let projectLocationGridId = $injector.get('productionplanningItemMultishiftWizardConfigService').projectLocationGridId;// '86de471e296f4b158013ab88ffbe853a';
		let multiShiftGridId = $injector.get('productionplanningItemMultishiftWizardConfigService').multiShiftGridId;// '60882534a3a54ea09d80e5d7de396418';
		let resultGridId = $injector.get('productionplanningItemMultishiftWizardConfigService').resultGridId; // '17e8352cf06d4b56beb667365dc9a526';

		function initGridOptions() {
			$scope.formOptions = $injector.get('productionplanningItemMultishiftWizardConfigService').formOptions;
			$scope.resultFormOptions = $injector.get('productionplanningItemMultishiftWizardConfigService').resultFormOptions;
			let array = [{
				gridName: 'prjLocationGrid',
				gridId: projectLocationGridId,
				columns: [selectedColumn].concat(getReadOnlyColumns($injector.get('projectLocationStandardConfigurationService'))),
				data: $scope.entity.locations
			}, {
				gridName: 'multiShiftGrid',
				gridId: multiShiftGridId,
				columns: [selectedColumn].concat($injector.get('productionplanningItemMultishiftWizardConfigService').CommonColumns),
				data: $scope.entity.itemList
			}, {
				gridName: 'resultGrid',
				gridId: resultGridId,
				columns: $injector.get('productionplanningItemMultishiftWizardConfigService').CommonColumns.concat([{
					id: 'plannedStartModified',
					name: '*Planned Start Modified',
					name$tr$: 'productionplanning.common.event.plannedStartModified',
					formatter: 'datetimeutc',
					field: 'PlannedStartShifted',
					sortOrder: 7
				}, {
					id: 'plannedFinishModified',
					name: '*Planned Finish Modified',
					name$tr$: 'productionplanning.common.event.plannedFinishModified',
					formatter: 'datetimeutc',
					field: 'PlannedFinishShifted',
					sortOrder: 8
				}]),
				data: $scope.entity.itemList
			}];
			$scope.gridOptions = {};
			_.each(array, (item) => {
				$scope.gridOptions[item.gridName] = {
					id: item.gridId,
					state: item.gridId,
					gridId: item.gridId, // it uses for toolbar of grid
					columns: item.columns,
					options: {
						tree: true,
						indicator: true,
						enableConfigSave: true, // it's required for functionality of layoutBtns
						enableModuleConfig: true,
						hierarchyEnabled: true,
						treeWidth: 70,
						saveSearch: false
					},
					tools: {
						showImages: false,
						showTitles: true,
						cssClass: 'tools',
						items: []
					},
					data: item.data
				};
				if(item.gridName === 'multiShiftGrid') {
					_.extend($scope.gridOptions[item.gridName].options, {
						childProp: 'ChildItems',
					});
					setButtons4Grid($scope.gridOptions[item.gridName]);
				}
				if(item.gridName === 'resultGrid') {
					_.extend($scope.gridOptions[item.gridName].options, {
						childProp: 'CheckedChildren',
					});
					setButtons4Grid($scope.gridOptions[item.gridName]);
				}
				if(item.gridName === 'prjLocationGrid') {
					_.extend($scope.gridOptions[item.gridName].options, {
						childProp: 'Locations'
					});
					$injector.get('basicsCommonToolbarExtensionService').addBtn($scope.gridOptions[item.gridName], null, 'L', null);
				}
				// remark: platformGridAPI.grids.config() will be called indirectly when calling addToolsIncludesLayoutBtns() in advanced.
				if (!platformGridAPI.grids.exist(item.gridId)) {
					platformGridAPI.grids.config($scope.gridOptions[item.gridName]);
				}
			});
			// cloudCommonGridService.flatten($scope.entity.itemList,flattenItems,'ChildItems');
		}

		function setButtons4Grid(gridConfig){
			gridToolbarBtnService.addToolsIncludesLayoutBtns(gridConfig);
			gridConfig.tools.items = _.filter(gridConfig.tools.items, function (item){
				return item.id !== 't12';
			}); // remove id: 't12'
			addExpandCollapseBtn(gridConfig);
			platformGridAPI.events.unregister(gridConfig.gridId, 'onInitialized');
		}

		function addExpandCollapseBtn(gridOption){
			if(_.isNil(gridOption.tools.items)){
				return;
			}
			gridOption.tools.items.unshift({
				id: 'collapsenode',
				sort: 60,
				caption: 'cloud.common.toolbarCollapse',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-collapse',
				fn: function collapseSelected() {
					platformGridAPI.rows.collapseNextNode(gridOption.gridId);
				}
			},
			{
				id: 'expandnode',
				sort: 70,
				caption: 'cloud.common.toolbarExpand',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-expand',
				fn: function expandSelected() {
					platformGridAPI.rows.expandNextNode(gridOption.gridId);
				}
			},
			{
				id: 'collapseall',
				sort: 80,
				caption: 'cloud.common.toolbarCollapseAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-collapse-all',
				fn: function collapseAll() {
					platformGridAPI.rows.collapseAllSubNodes(gridOption.gridId);
				}
			},
			{
				id: 'expandall',
				sort: 90,
				caption: 'cloud.common.toolbarExpandAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-expand-all',
				fn: function expandAll() {
					platformGridAPI.rows.expandAllSubNodes(gridOption.gridId);
				}
			},
			{
				id: 'd2',
				sort: 100,
				type: 'divider'
			});
		}

		function getReadOnlyColumns(uiStandardService) {
			let layout = uiStandardService.getStandardConfigForListView();
			let columns = angular.copy(layout.columns);
			_.forEach(columns, function (column) {
				column.editor = null;
			});
			return columns;
		}

		$scope.wzStrings = {
			stepFinish: $translate.instant('platform.wizard.stepFinish'),
			back: $translate.instant('platform.wizard.back'),
			next: $translate.instant('platform.wizard.next'),
			cancel: $translate.instant('platform.cancelBtn'),
			finish: $translate.instant('platform.wizard.finish'),
			nextStep: $translate.instant('platform.wizard.nextStep')
		};

		initGridOptions();

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Selected') {
				var childProp = 'ChildItems';
				var relatedSiteIds = [];
				checkChildren(args.item, childProp, relatedSiteIds);
				if(args.item.parentId){
					let parent = _.find(productionplanningItemMultishiftDataService.getFlattenItems(multiShiftGridId, childProp), function (item) {
						return item.Id === args.item.parentId;
					});
					if(parent){
						checkParnet(parent, childProp, multiShiftGridId);
					}
				}
				platformGridAPI.grids.refresh(args.grid.id, true);
				args.grid.resizeGrid();

				// check the site and update
				if(relatedSiteIds.length > 0){
					var entities = productionplanningItemMultishiftDataService.getFlattenItems(multiShiftGridId, childProp);
					relatedSiteIds = _.uniq(relatedSiteIds);
					var siteParentsIds = [];
					var siteEntities = productionplanningItemMultishiftDataService.getFlattenItems(projectLocationGridId, 'Locations');
					var checked = args.item.Selected === 'true' || args.item.Selected === true;
					_.forEach(relatedSiteIds, function (siteId){
						var site = _.find(siteEntities, function (item){
							return item.Id === siteId;
						});
						if(site){
							var unHandleItems = _.filter(entities, function (entity){
								if(entity.PrjLocationFk === siteId){
									return checked ? entity.Selected === 'false' || entity.Selected === false :  entity.Selected === 'true' || entity.Selected === true;
								}
								return false;
							});
							if(unHandleItems.length > 0){
								site.Selected = 'unknown';
							} else {
								site.Selected = args.item.Selected;
							}
							if(site.LocationParentFk){
								siteParentsIds.push(site.LocationParentFk);
							}
						}
					});

					// handle site parents
					if(siteParentsIds.length > 0){
						siteParentsIds = _.uniq(siteParentsIds);
						_.forEach(siteParentsIds, function (siteParentsId){
							var parent = _.find(siteEntities, function (item) {
								return item.Id === siteParentsId;
							});
							if(parent){
								checkParnet(parent, 'Locations', projectLocationGridId, 'LocationParentFk');
							}
						});
					}
					platformGridAPI.grids.refresh(projectLocationGridId, true);
					platformGridAPI.grids.resize(projectLocationGridId);
				}
			}
		}

		function checkParnet(parent, childProp, gridId, parentProp) {
			childProp = _.isNil(childProp) ? 'ChildItems' : childProp;
			parentProp = _.isNil(parentProp) ? 'parentId' : parentProp;
			let unSelectChilds = _.filter(parent[childProp], function (item) {
				return item.Selected === 'false' || item.Selected === false;
			});
			if(unSelectChilds.length === parent[childProp].length){
				parent.Selected = false;
				parent.CheckedChildren = null;
			}
			if(unSelectChilds.length < parent[childProp].length){
				parent.Selected = 'unknown';
				parent.CheckedChildren = _.filter(parent[childProp], function (child) {
					return child.Selected === 'unknown' || child.Selected === 'true' || child.Selected === true;
				});
			}
			if(unSelectChilds.length === 0){
				parent.Selected = true;
				// in case 'unknown' children are excluded
				if(_.find(parent[childProp], function (item) {
					return item.Selected === 'unknown';
				})){
					parent.Selected = 'unknown';
				}
				parent.CheckedChildren = parent[childProp];
			}

			if(parent[parentProp]){
				parent = _.find(productionplanningItemMultishiftDataService.getFlattenItems(gridId, childProp), function (item) {
					return item.Id === parent[parentProp];
				});
				checkParnet(parent, childProp, gridId, parentProp);
			}
		}

		function checkChildren(self, childProp, relatedSiteIds) {
			childProp = _.isNil(childProp) ? 'ChildItems' : childProp;
			relatedSiteIds = _.isNil(relatedSiteIds) ? [] : relatedSiteIds;
			_.forEach(self[childProp], function (item) {
				if(_.isString(item.Selected) && item.Selected !== 'unknown'){
					item.Selected = self.Selected.toString();
				}
				else{
					item.Selected = self.Selected;
				}
				if(childProp === 'ChildItems' && item.PrjLocationFk !== null){
					relatedSiteIds.push(item.PrjLocationFk);
				}
				if(item[childProp]){
					checkChildren(item, childProp, relatedSiteIds);
				}
			});
			if(self.Selected.toString() === 'true'){
				self.CheckedChildren = self[childProp];
			} else {
				self.CheckedChildren = null;
			}
			if(childProp === 'ChildItems' && self.PrjLocationFk !== null){
				relatedSiteIds.push(self.PrjLocationFk);
			}
		}

		function onPrjLocationCellChange(e, args){
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Selected') {
				var childProp = 'Locations';
				checkChildren(args.item, childProp);
				if(args.item.LocationParentFk){
					let parent = _.find(productionplanningItemMultishiftDataService.getFlattenItems(projectLocationGridId, childProp), function (item) {
						return item.Id === args.item.LocationParentFk;
					});
					if(parent){
						checkParnet(parent, childProp, projectLocationGridId, 'LocationParentFk');
					}
				}
				platformGridAPI.grids.refresh(args.grid.id, true);
				args.grid.resizeGrid();

				// check all related entity and update mutishift grid
				var entities =  productionplanningItemMultishiftDataService.getFlattenItems(multiShiftGridId, 'ChildItems');
				var matchLocIds = [args.item.Id];
				_.forEach(args.item.Locations, function (loc){
					matchLocIds.push(loc.Id);
				});

				var parentIds = [];
				_.forEach(entities, function (entity){
					if(entity.PrjLocationFk && matchLocIds.indexOf(entity.PrjLocationFk) !== -1){
						entity.Selected = args.item.Selected;
						checkChildren(entity, 'ChildItems');
						if(entity.parentId){
							parentIds.push(entity.parentId);
						}
					}
				});

				var parents = _.filter(entities, function (entity){
          	return parentIds.indexOf(entity.Id) !== -1;
				});

				_.forEach(parents, function (parent){
          	checkParnet(parent, 'ChildItems',multiShiftGridId, 'parentId');
				});
				platformGridAPI.grids.refresh(multiShiftGridId, true);
				platformGridAPI.grids.resize(multiShiftGridId);
			}
		}

		function onTreeInitialized() {
			//platformGridAPI.rows.expandAllNodes(multiShiftGridId);
			let multishiftGrid = platformGridAPI.grids.element('id', multiShiftGridId);
			if(multishiftGrid && multishiftGrid.dataView){
				multishiftGrid.dataView.expandAllNodes(2);
			}
			platformGridAPI.rows.expandAllNodes(resultGridId);
			platformGridAPI.filters.showColumnSearch(multiShiftGridId, false);
			setTimeout(function () {
				$scope.$broadcast('forceInitOnceKendoSplitter', 'mutiShiftWizard');
				// platformGridAPI.grids.resize(multiShiftGridId);
				// platformGridAPI.grids.resize(projectLocationGridId);
			}, 200);
		}

		platformGridAPI.events.register($scope.gridOptions.multiShiftGrid.state, 'onInitialized', onTreeInitialized);
		platformGridAPI.events.register($scope.gridOptions.multiShiftGrid.state, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridOptions.prjLocationGrid.state, 'onCellChange', onPrjLocationCellChange);

		$injector.get('productionplanningItemMultishiftDataService').lastSelectType = $scope.entity.selectedType;

		// $scope.entity.flattenItems = flattenItems;

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.multiShiftGrid.state, 'onInitialized', onTreeInitialized);
			productionplanningItemMultishiftDataService.ClearCache();
			let modState = platformModuleStateService.state($injector.get('productionplanningItemDataService').getModule());
			if (modState.validation && modState.validation.issues) {
				modState.validation.issues.length = 0;// delete all the issues
			}
			if (platformGridAPI.grids.exist(multiShiftGridId)){
				platformGridAPI.events.unregister($scope.gridOptions.multiShiftGrid.state, 'onCellChange', onCellChange);
			}
			if (platformGridAPI.grids.exist(projectLocationGridId)){
				platformGridAPI.events.unregister($scope.gridOptions.prjLocationGrid.state, 'onCellChange', onPrjLocationCellChange);
			}
		});

		setTimeout(function () {
			platformGridAPI.grids.resize(multiShiftGridId);
			platformGridAPI.grids.resize(projectLocationGridId);
		}, 50);
	}
})(angular);