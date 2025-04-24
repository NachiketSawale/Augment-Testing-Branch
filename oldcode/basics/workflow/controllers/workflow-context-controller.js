(function (angular) {
	'use strict';

	function workflowTemplateContextController($scope, _, basicsWorkflowBaseContextController, platformModuleStateService, platformGridAPI, basicsWorkflowPreProcessorService) {
		var state = platformModuleStateService.state('basics.workflow');
		var columns = [
			{
				id: 'key',
				formatter: 'description',
				field: 'key',
				name: 'Key',
				name$tr$: 'basics.workflow.template.context.key',
				toolTip: 'Key',
				domain: 'description',
				editor: 'description',
				sortable: true,
				keyboard: {
					enter: true
				}
			},
			{
				id: 'value',
				field: 'value',
				keyboard: {
					enter: true
				},
				name: 'Value',
				name$tr$: 'basics.workflow.template.context.value',
				toolTip: 'Value',
				formatter: 'dynamic',
				sortable: true,
				editor: 'dynamic',
				domain: function (item, column) {
					if (angular.isDefined(item) && item !== null && item.key === 'entity') {
						column.editorOptions = {
							items: [{description: 'Invoice'}, {description: 'UoM'}, {description: 'Project'}],
							valueMember: 'description',
							displayMember: 'description'
						};
						return 'select';
					}

					return 'remark';
				}
			}
		];

		var insertButton = {
			id: 'insert',
			caption: 'cloud.common.toolbarInsert',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-new',
			disabled: $scope.isNewButtonDisabled,
			fn: function () {
				var selectedEntity = state.selectedTemplateVersion;

				if (!angular.isArray(selectedEntity.Context)) {
					selectedEntity.Context = [];
				}
				var newItem = basicsWorkflowPreProcessorService.getContextObj('', '');
				selectedEntity.Context.push(newItem);
				state.currentContexProperty = newItem;
				state.mainItemIsDirty = true;
				platformGridAPI.items.data($scope.gridId, selectedEntity.Context);

			}
		};
		var deleteButton = {
			id: 'delete',
			caption: 'cloud.common.toolbarDelete',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-delete',
			disabled: $scope.isDeleteButtonDisabled,
			fn: function () {
				var index = _.findIndex(state.selectedTemplateVersion.Context, {id: state.currentContexProperty.id});
				state.selectedTemplateVersion.Context.splice(index, 1);
				state.mainItemIsDirty = true;
				platformGridAPI.items.data($scope.gridId, state.selectedTemplateVersion.Context);
			}
		};

		basicsWorkflowBaseContextController.extend($scope, 'currentTemplateContexProperty', 'selectedTemplateVersion', columns);

		$scope.$watch(function () {
			if (!state.selectedTemplateVersion) {
				return true;
			}
			return state.selectedTemplateVersion.IsReadOnly;
		}, function (newVal) {
			insertButton.disabled = newVal;
			deleteButton.disabled = newVal;
		});

		$scope.changeToolbar(false, false);
		$scope.currentItemWatch = $scope.$watch(function () {
				return state.currentTemplateContexProperty;
			},
			function (newVal) {
				if (newVal !== null) {
					if (angular.isArray(newVal)) {
						$scope.changeToolbar(null, false);
					} else {
						$scope.changeToolbar(null, true);
					}
				} else {
					$scope.changeToolbar(null, false);
				}
			});

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [{
					id: 't4',
					caption: 'cloud.common.toolbarSearch',
					type: 'check',
					value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),
					iconClass: 'tlb-icons ico-search',
					fn: function () {
						platformGridAPI.filters.showSearch($scope.gridId, this.value);
					}
				}, insertButton, deleteButton]
			});
	}

	function workflowBaseContextController(_, platformGridAPI, platformModuleStateService, basicsWorkflowBaseGridController) {
		var service = {};
		service.extend = function ($scope, contextProp, mainEntityProp, columns) {
			var state = platformModuleStateService.state('basics.workflow');

			state[contextProp] = [];

			basicsWorkflowBaseGridController.extend($scope, 'basics.workflow', contextProp);

			$scope.configGrid({
				data: [],
				columns: angular.copy(columns),
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'id',
					showFooter: false
				}
			});

			$scope.itemsWatch = $scope.$watch(
				function () {
					return state[mainEntityProp];
				},
				function (newVal, oldVal) {
					$scope.changeToolbar(false, false);
					if (angular.isDefined(newVal) && newVal !== null) {
						$scope.changeToolbar(true, null);
						if (!angular.isArray(newVal.Context)) {
							newVal.Context = [];
						}

						if (oldVal) {
							var newItems = _.difference(newVal.Context, oldVal.Context);
							if (newItems.length > 0) {
								$scope.newItemIsAdded = true;
							}
						}
						platformGridAPI.items.data($scope.gridId, newVal.Context);
						$scope.changeToolbar(true, false);
					} else {
						platformGridAPI.items.data($scope.gridId, []);
					}
				}
			);

		};

		return service;

	}

	workflowBaseContextController.$inject = ['_', 'platformGridAPI', 'platformModuleStateService', 'basicsWorkflowBaseGridController'];
	workflowTemplateContextController.$inject = ['$scope', '_', 'basicsWorkflowBaseContextController',
		'platformModuleStateService', 'platformGridAPI', 'basicsWorkflowPreProcessorService'];

	angular.module('basics.workflow').factory('basicsWorkflowBaseContextController', workflowBaseContextController)
		.controller('basicsWorkflowTemplateContextController', workflowTemplateContextController);

})(angular);
