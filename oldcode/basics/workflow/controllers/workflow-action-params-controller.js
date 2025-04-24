(function () {
	'use strict';

	function paramsBaseController(currentItemProp, $scope, platformModuleStateService,
	                              platformGridAPI, basicsWorkflowPreProcessorService,
	                              basicsWorkflowMasterDataService, basicsWorkflowBaseGridController, basicsWorkflowGlobalContextUtil) {

		var state = platformModuleStateService.state('basics.workflow');

		basicsWorkflowMasterDataService.getActions().then(function (response) {
			$scope.actions = response.data;
		});

		function getColumns(readOnly) {
			var valueEditor = readOnly ? '' : 'directive';

			return [
				{
					id: 'key',
					field: 'key',
					formatter: 'description',
					editor: null,
					name: 'Key',
					name$tr$: 'basics.workflow.action.key',
					toolTip: 'Key',
					sortable: true,
					keyboard: {
						enter: false
					}
				},
				{
					id: 'value',
					field: 'value',
					formatter: 'remark',
					editor: valueEditor,
					editorOptions: {
						directive: 'basics-workflow-grid-script-editor-directive',
						lineNumbers: false,
						lint: false,
						showHint: false,
						fixedGutter: false,
						gutters: [],
						hintOptions: {
							get globalScope() {
								return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
							}
						}
					},
					name: 'Value',
					name$tr$: 'basics.workflow.action.value',
					toolTip: 'Value',
					sortable: true,
					keyboard: {
						enter: true
					}
				}
			];
		}

		function updateItems(newVal) {
			if (angular.isUndefined(newVal) || newVal === null || !angular.isArray(newVal)) {
				newVal = [];
			}
			platformGridAPI.columns.configuration($scope.gridId, getColumns(state.selectedTemplateVersion ? state.selectedTemplateVersion.IsReadOnly : true));
			platformGridAPI.items.data($scope.gridId, newVal);
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow', currentItemProp);
		var gridConfig = {
			data: [],
			columns: [],
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'id',
				iconClass: ''
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
					}
				]
			});

		$scope.itemsWatch = $scope.$watch(
			function () {
				if (state.currentWorkflowAction) {
					return state.currentWorkflowAction[currentItemProp];
				} else {
					return null;
				}
			}, updateItems);

	}

	function basicsWorkflowInputParamsController($scope, platformModuleStateService,
	                                             platformGridAPI, basicsWorkflowPreProcessorService,
	                                             basicsWorkflowMasterDataService, basicsWorkflowBaseGridController,
	                                             basicsWorkflowGlobalContextUtil) {

		paramsBaseController('input', $scope, platformModuleStateService,
			platformGridAPI, basicsWorkflowPreProcessorService, basicsWorkflowMasterDataService,
			basicsWorkflowBaseGridController, basicsWorkflowGlobalContextUtil);

	}

	function basicsWorkflowOutputParamsController($scope, platformModuleStateService,
	                                              platformGridAPI, basicsWorkflowPreProcessorService,
	                                              basicsWorkflowMasterDataService, basicsWorkflowBaseGridController,
	                                              basicsWorkflowGlobalContextUtil) {

		paramsBaseController('output', $scope, platformModuleStateService,
			platformGridAPI, basicsWorkflowPreProcessorService, basicsWorkflowMasterDataService, basicsWorkflowBaseGridController,
			basicsWorkflowGlobalContextUtil);

	}

	var injects = ['$scope',
		'platformModuleStateService', 'platformGridAPI', 'basicsWorkflowPreProcessorService',
		'basicsWorkflowMasterDataService', 'basicsWorkflowBaseGridController', 'basicsWorkflowGlobalContextUtil'];

	basicsWorkflowInputParamsController.$inject = injects;
	basicsWorkflowOutputParamsController.$inject = injects;

	angular.module('basics.workflow').controller('basicsWorkflowInputParamsController', basicsWorkflowInputParamsController);
	angular.module('basics.workflow').controller('basicsWorkflowOutputParamsController', basicsWorkflowOutputParamsController);

})();
