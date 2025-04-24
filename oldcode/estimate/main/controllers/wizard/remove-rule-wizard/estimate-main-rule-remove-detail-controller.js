
(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainRulesRemoveDetailController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateMainRuleRemoveDetailService',  'platformGridControllerService',  'estimateRuleRemoveLookupService', 'estimateRuleComplexLookupCommonService',
		'basicsLookupdataLookupViewService','basicsLookupdataLookupDataService','basicsLookupdataLookupDefinitionService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid,  estimateMainRuleRemoveDetailService,  platformGridControllerService,estimateRuleRemoveLookupService,  estimateRuleComplexLookupCommonService, basicsLookupdataLookupViewService,lookupDataService,lookupDefinitionService) {

			let myGridConfig = {
				initCalled: false
			};

			$scope.gridId = platformCreateUuid();

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
					lookupType: 'estimateRulesComplexLookup',
					valueMember: 'Code',
					displayMember: 'Icon',

					isClientSearch: true,
					isExactSearch: true,

					showClearButton: true,
					showEditButton: false,

					eagerSearch: true,

					showCustomInputContent: true,
					formatter: estimateRuleComplexLookupCommonService.displayFormatter,
					uuid: '223d60f03cf447ab90aa7044ccaab31d',
					columns: estimateRuleComplexLookupCommonService.getColumnsReadOnly(),
					gridOptions: {
						multiSelect: true
					},
					isStaticGrid: true,
					treeOptions: {
						parentProp: 'PrjEstRuleFk',
						childProp: 'PrjEstRules',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true,
						idProperty:'Id'
					},
					title: {
						name: 'Rules',
						name$tr$: 'estimate.rule.rules'
					},
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},
					onDataRefresh: function ($scope) {
						// refresh it, and check it refresh or not
						return estimateRuleRemoveLookupService.getEstRuleItemsPromise().then (function (response) {
							let prjRules = response.data;

							if ($scope.settings) {
								prjRules = estimateRuleRemoveLookupService.buildTree (prjRules, $scope.settings);
							}
							platformGridAPI.items.data($scope.gridId, prjRules);
							platformGridAPI.rows.expandAllNodes($scope.gridId);
						});
					}
				};

				let customConfiguration ={
					dataProvider: {
						getList: function (config, scope) {
							return estimateRuleRemoveLookupService.getListAsync(config, scope);
						},

						getItemByKey: function (value, config, scope) {
							return estimateRuleRemoveLookupService.getSearchList(value, config, scope);
						},

						getSearchList: function (value, config, scope) {
							return estimateRuleRemoveLookupService.getSearchList(value, config, scope);
						}
					},
				};

				function handleDataProvider(lookupOptions, customConfiguration) {
					if (lookupOptions.lookupType) {
						if (customConfiguration.dataProvider) {
							customConfiguration.dataProvider = lookupDataService.registerDataProvider(lookupOptions.lookupType, customConfiguration.dataProvider, true);
						}
						else {
							customConfiguration.dataProvider = lookupDataService.registerDataProviderByType(lookupOptions.lookupType, customConfiguration.url, true);
						}
					}
					rulesLookupOptions.dataProvider = customConfiguration.dataProvider;
				}

				handleDataProvider(rulesLookupOptions,customConfiguration);

				lookupDefinitionService.set(rulesLookupOptions);

				basicsLookupdataLookupViewService.showDialog(rulesLookupOptions).then(function (result) {
					// handle result here.
					if (result && result.isOk) {
						if (result.data && result.data.length > 0) {
							estimateMainRuleRemoveDetailService.setDataList(result.data);
							estimateMainRuleRemoveDetailService.refreshGrid();

							let prjEstRuleFks = _.map(result.data,'Id');
							$injector.get('estimateMainParamRemoveDetailService').loadParam(prjEstRuleFks);
						}
					}
				});
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
						disabled: function(){
							const items = estimateMainRuleRemoveDetailService.getSelectedEntities();
							return !items || items.length === 0;
						},
						fn: function onDelete() {
							let selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

							platformGridAPI.rows.delete({
								gridId: $scope.gridId,
								item: selItem
							});
							updateTools();

							$injector.get('estimateMainParamRemoveDetailService').removeParam(selItem.Id);

							platformGridAPI.grids.refresh($scope.gridId, true);
						}
					}
				],
				update: function () {
					return;
				}
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, estimateMainRuleRemoveDetailService, estimateMainRuleRemoveDetailService, null, myGridConfig);
			}

			function updateTools() {
				$scope.tools.update();
			}

			function onSelectedRowsChanged(e, args){
				updateTools();
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			init();

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onClick', onClickFuc);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				estimateMainRuleRemoveDetailService.setSelectedEntities([]);
				estimateMainRuleRemoveDetailService.setDataList(null);
				$injector.get('estimateMainParamRemoveDetailService').setDataList(null);
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
	]);
})();
