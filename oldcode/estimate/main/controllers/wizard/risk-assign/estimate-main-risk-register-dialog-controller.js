/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainRiskRegisterDialogController', [
		'$scope','platformCreateUuid','platformGridAPI','$timeout','estimateMainRiskEventsDataService',
		'basicsRiskRegisterStandardConfigurationService','basicsLookupdataLookupDataService',
		'platformGridControllerService',
		function ($scope,platformCreateUuid,platformGridAPI,$timeout,estimateMainRiskEventsDataService,
			basicsRiskRegisterStandardConfigurationService,basicsLookupdataLookupDataService,platformGridControllerService) {

			let myGridConfig = {
				initCalled: false
			};

			$scope.gridId = platformCreateUuid();

			let configId = platformCreateUuid();

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};
			function onClickFuc() {
				let rulesLookupOptions = {
					// lookupType: 'estimateRulesComplexLookup',
					valueMember: 'Code',
					displayMember: 'Code',

					isClientSearch: true,
					isExactSearch: true,

					showClearButton: true,
					showEditButton: false,

					eagerSearch: true,

					showCustomInputContent: true,
					// formatter: estimateRuleComplexLookupCommonService.displayFormatter,
					uuid: configId,
					columns: basicsRiskRegisterStandardConfigurationService.getStandardConfigForListView(),
					gridOptions: {
						multiSelect: true
					},
					isStaticGrid: true,
					treeOptions: {
						parentProp: 'RiskRegisterParentFk',
						childProp: 'RiskRegisters',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true,
						idProperty:'Id'
					},
					title: {
						name: 'Events',
						name$tr$: 'estimate.main.assignRiskEventWizard.riskGroupTitle2'
					},
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},
				};
				return rulesLookupOptions;
			}

			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'add',
						sort: 1,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'control-icons ico-input-add',
						fn: function onClick() {
							onClickFuc();
						}
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function onDelete() {
							let selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

							platformGridAPI.rows.delete({
								gridId: $scope.gridId,
								item: selItem
							});
							updateTools();
							platformGridAPI.grids.refresh($scope.gridId, true);
						}
					}
				],
				update: function () {
					return;
				}
			};

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, basicsRiskRegisterStandardConfigurationService, estimateMainRiskEventsDataService, null, myGridConfig);
			}
			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}
			function updateTools(isRowChange) {
				angular.forEach($scope.tools.items, function (item) {
					let disable = !isRowChange;
					if (item.id === 'delete') {
						item.disabled = disable;
					}
				});
			}
			function onSelectedRowsChanged(e, args){
				let isRowChange = args.rows.length > 0;
				updateTools(isRowChange);
			}
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onClick', onClickFuc);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				// estimateMainRuleRemoveDetailService.setDataList(null);
			});
		}
	]);
})(angular);
