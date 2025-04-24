/* global angular */
(function (angular) {
	'use strict';

	function getActionColumns(platformTranslateService) {
		var columns = [
			{
				id: 'include',
				formatter: 'boolean',
				field: 'Include',
				name$tr$: 'basics.workflow.template.version.globalScripts.include',
				name: 'include',
				toolTip: 'basics.workflow.template.version.globalScripts.include',
				editor: 'boolean',
				width: 50,
				sortable: true,
				grouping: {
					title: 'include',
					title$tr$: 'basics.workflow.template.version.globalScripts.include',
					getter: 'include',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Id',
				formatter: 'comment',
				field: 'Id',
				sortable: true,
				name$tr$: 'basics.workflow.template.version.globalScripts.hash',
				width: 30,
				name: 'hash',
				grouping: {
					title: 'FileName',
					getter: 'FileName',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'FileName',
				formatter: 'comment',
				field: 'FileName',
				sortable: true,
				name$tr$: 'basics.workflow.template.version.globalScripts.fileName',
				width: 50,
				name: 'FileName',
				grouping: {
					title: 'FileName',
					getter: 'FileName',
					aggregators: [],
					aggregateCollapsed: false
				}

			},
			{
				id: 'FilePath',
				formatter: 'comment',
				field: 'FilePath',
				name$tr$: 'basics.workflow.template.version.globalScripts.filePath',
				name: 'filePath',
				toolTip: 'basics.workflow.template.version.globalScripts.filePath',
				editor: null,
				width: 300,
				sortable: true,
				grouping: {
					title: 'FilePath',
					title$tr$: 'basics.workflow.template.version.globalScripts.filePath',
					getter: 'FilePath',
					aggregators: [],
					aggregateCollapsed: false
				}
			}
		];

		return platformTranslateService.translateGridConfig(columns);
	}

	/* jshint -W072 */
	function basicsWorkflowGlobalScriptsController($scope, basicsWorkflowBaseGridController,
	                                               platformGridAPI, platformModuleStateService,
	                                               platformTranslateService, $timeout, platformRuntimeDataService, basicsWorkflowScriptPreviewService) {

		platformModuleStateService.state('basics.workflow');
		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			'currentGlobalScript', 'globalScriptFiles');

		var state = platformModuleStateService.state('basics.workflow');

		$scope.missingParentText = 'basics.workflow.template.version.globalScripts.selectedTemplateVersionMissing';

		function itemsListWatchExpression() {
			return state.globalScriptFiles;
		}

		function addScriptToVersion(script) {
			if (state.selectedTemplateVersion) {
				if (_.isArray(state.selectedTemplateVersion.IncludedScripts)) {
					// remove it first
					state.selectedTemplateVersion.IncludedScripts = _.filter(state.selectedTemplateVersion.IncludedScripts, function (saveScript) {
						return saveScript.FilePath !== script.FilePath;
					});
					state.selectedTemplateVersion.IncludedScripts.push(script);
				} else {
					state.selectedTemplateVersion.IncludedScripts = [script];
				}
			}
		}

		function currentItemListener(newVal) {
			if (newVal) {
				addScriptToVersion(newVal);
			}
		}

		function currentItemWatchExpression() {
			return state.selectedScript;
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{
				expression: currentItemWatchExpression,
				listener: currentItemListener,
				name: 'selectedScript'
			},
			{
				expression: itemsListWatchExpression,
				listener: _.noop,
				name: 'globalScriptFiles'
			},
			{
				isParentSelected: function () {
					return state.selectedTemplateVersion;
				},
				listener: function (newVal, oldVal) {
					if (newVal !== oldVal) {
						$scope.gridVisible = _.isObject(newVal) && newVal.Id;

						decorateGlobalFiles(newVal);

						$timeout(function () {
							$scope.refreshGrid();
							$scope.resizeGrid();
						});
					}
				}
			});

		var columns = getActionColumns(platformTranslateService);

		function decorateGlobalFiles() {
			_.each(state.globalScriptFiles, function (globalScript) {
				globalScript.Include = false;
				if (state.selectedTemplateVersion) {
					var includedFileFound = _.find(state.selectedTemplateVersion.IncludedScripts, {FilePath: globalScript.FilePath});
					if (includedFileFound) {
						globalScript.Include = true;
					}
					platformRuntimeDataService.readonly(globalScript, [{
						field: 'Include',
						readonly: state.selectedTemplateVersion.IsReadOnly
					}]);
				}
			});
			platformGridAPI.items.data($scope.gridId, state.globalScriptFiles);
		}

		$scope.$watch(
			function () {
				return state.selectedScript === undefined || state.selectedScript === null || _.isArray(state.selectedScript);
			}, function (newVal, oldVal, scope) {
				scope.tools.update();
			});

		var gridConfig = {
			data: [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
				iconClass: '',
				enableDraggableGroupBy: true,
				grouping: true
			}
		};
		$scope.configGrid(gridConfig);
		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),
						iconClass: 'tlb-icons ico-search',
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, this.value);
						}
					},
					{
						id: 't15',
						caption: 'cloud.common.documentProperties',
						type: 'item',
						iconClass: 'tlb-icons ico-settings',
						fn: function () {
							$scope.showGridLayoutConfigDialog();
						}
					},
					{
						id: 't16',
						sort: 10,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						disabled: false
					},
					{
						id: 't100',
						caption: 'cloud.common.preview',
						type: 'item',
						iconClass: 'tlb-icons ico-preview-form',
						fn: function () {
							basicsWorkflowScriptPreviewService.showPreviewDialog();
						},
						disabled: function () {
							return state.selectedScript === null || state.selectedScript === undefined || _.isArray(state.selectedScript);
						}
					}
				]
			});
	}

	angular.module('basics.workflow').controller('basicsWorkflowGlobalScriptsController',
		['$scope', 'basicsWorkflowBaseGridController',
			'platformGridAPI', 'platformModuleStateService',
			'platformTranslateService', '$timeout', 'platformRuntimeDataService', 'basicsWorkflowScriptPreviewService',
			basicsWorkflowGlobalScriptsController]);

})(angular);
