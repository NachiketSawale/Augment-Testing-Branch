/* global angular */
(function (angular) {
	'use strict';

	function basicsWorkflowSelectDialog($scope, $translate, platformGridAPI, basicsWorkflowActionEditorService,
	                                    basicsWorkflowEditModes, basicsWorkflowtypeSelectedModes,
	                                    $timeout, $log, platformManualGridService) {
		var sysDisplayMember = 'dM_dM';
		var sysValueMember = 'vM_vM';
		var editModes = basicsWorkflowEditModes;
		var typeSelectedModes = basicsWorkflowtypeSelectedModes;
		var manualGridService = platformManualGridService;

		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		var typeSelectedMode = $scope.modalOptions.value.typeSelectedMode;
		$scope.input.typeSelectedMode = angular.isUndefined(typeSelectedMode) ?
			typeSelectedModes.single : typeSelectedMode;
		$scope.input.typeRadioGroupOpt = [
			{
				value: typeSelectedModes.single,
				description: $translate.instant('basics.workflow.modalDialogs.singleRadio'),
				cssClass: 'pull-left spaceToUp'
			},
			{
				value: typeSelectedModes.multi,
				description: $translate.instant('basics.workflow.modalDialogs.multiRadio'),
				cssClass: 'pull-left margin-left-ld'
			}
		];

		var displayMember = $scope.modalOptions.value.displayMember;
		$scope.input.editorMode = (angular.isUndefined(displayMember) || _.isEmpty(displayMember) || displayMember === sysDisplayMember) ? editModes.default : editModes.expert;

		$scope.input.radioGroupOpt = {
			displayMember: 'description',
			valueMember: 'value',
			cssMember: 'cssClass',
			items: [
				{
					value: 1,
					description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
					cssClass: 'pull-left spaceToUp'
				},
				{
					value: 2,
					description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
					cssClass: 'pull-left margin-left-ld'
				}
			]
		};

		var toolsItems = [
			{
				id: '1',
				sort: 10,
				caption: 'cloud.common.toolbarInsert',
				iconClass: 'tlb-icons ico-rec-new',
				type: 'item',
				fn: function () {
					manualGridService.addNewRowInGrid($scope.gridId, getNewItem());
				}
			},
			{
				id: '2',
				sort: 20,
				caption: 'cloud.common.toolbarDelete',
				iconClass: 'tlb-icons ico-rec-delete',
				type: 'item',
				disabled: function () {
					return manualGridService.isDeleteBtnDisabled($scope.gridId, function (selected) {
						return !(angular.isDefined(selected) && selected.length > 0) || selected[0].type === 'userDecision' || selected[0].type === 'title' || selected[0].type === 'subtitle';
					});
				},
				fn: function () {
					manualGridService.deleteSelectedRow($scope.gridId, true);
				}
			},
			{
				caption: 'Move Buttons',
				type: 'sublist',
				list: {
					showTitles: true,
					items: [
						{
							id: 't5',
							sort: 30,
							caption: 'cloud.common.toolbarMoveUp',
							type: 'item',
							iconClass: 'tlb-icons ico-grid-row-up',
							disabled: function () {
								return manualGridService.isMoveBtnDisabled($scope.gridId, 'up');
							},
							fn: function () {
								manualGridService.moveRowInGrid($scope.gridId, 'up');
							}

						},
						{
							id: 't6',
							sort: 40,
							caption: 'cloud.common.toolbarMoveDown',
							type: 'item',
							iconClass: 'tlb-icons ico-grid-row-down',
							disabled: function () {
								return manualGridService.isMoveBtnDisabled($scope.gridId, 'down');
							},
							fn: function () {
								manualGridService.moveRowInGrid($scope.gridId, 'down');
							}
						}
					]
				}
			}
		];

		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: toolsItems
		};

		$scope.gridId = 'A429224BDB7340408A5330B43A0593B9';

		$scope.gridData = {
			state: $scope.gridId
		};

		var dmColumns = [
			{
				id: 'dm',
				field: 'displayMember',
				formatter: 'description',
				editor: 'description',
				name: 'DisplayMember',
				name$tr$: 'cloud.common.displayMember',
				width: 551
			}
		];

		// create grid
		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: dmColumns,
				data: [],
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'id'
				}
			};
			platformGridAPI.grids.config(grid);
		}

		// set values to the fields
		if ($scope.input.editorMode === editModes.expert) {
			$scope.input.itemsScriptValue = $scope.modalOptions.value.items;
			$scope.input.valueMemberScriptValue = $scope.modalOptions.value.valueMember;
			$scope.input.displayMemberScriptValue = $scope.modalOptions.value.displayMember;
		} else {
			setGridData(getGridRowsFromItems($scope.modalOptions.value.items));
		}

		$scope.onTypeSelectedChanged = function (radioValue) {
			$scope.input.typeSelectedMode = radioValue;
		};

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;

			if (radioValue === editModes.default) {
				$timeout(function () {
					var grid = platformGridAPI.grids.element('Id', $scope.gridId);
					grid.instance.resizeCanvas();
				}, 0);
			}
		};

		$scope.modalOptions.ok = function ok(result) {
			$scope.modalOptions.value.typeSelectedMode = $scope.input.typeSelectedMode;
			$scope.modalOptions.value.editorMode = $scope.input.editorMode;

			// determine the values of all controls
			if ($scope.input.editorMode === editModes.expert) {
				$scope.modalOptions.value.items = $scope.input.itemsScriptValue;
				$scope.modalOptions.value.valueMember = $scope.input.valueMemberScriptValue;
				$scope.modalOptions.value.displayMember = $scope.input.displayMemberScriptValue;
			} else {
				platformGridAPI.grids.commitEdit($scope.gridId);
				$scope.modalOptions.value.items = getItemsFromGrid(getGridData());
				$scope.modalOptions.value.valueMember = sysValueMember;
				$scope.modalOptions.value.displayMember = sysDisplayMember;
			}

			// create result object with values
			var customResult = result || {};
			if (_.isObject($scope.modalOptions.value)) {
				customResult.value = $scope.modalOptions.value;
			}
			customResult.ok = true;

			// close modal dialog
			$scope.$close(customResult);
		};

		function getGridRowsFromItems(items) {
			if (items) {
				try {
					var newItems = [];

					if (angular.isArray(items)) {
						for (var i = 0; i < items.length; i++) {
							var item = items[i];
							newItems.push(getNewItem(item));
						}
					}
					return newItems;
				} catch (e) {
					$log.error(e);
				}
			}

			return null;
		}

		function getNewItem(item) {
			var rowItem = {
				id: _.uniqueId(),
				displayMember: item ? item[sysDisplayMember] : ''
			};

			return rowItem;
		}

		function getItemsFromGrid(gridItems) {
			if (gridItems) {
				try {
					// push only needed columns
					var items = [];
					_.forEach(gridItems, function (value) {
						var item = {};
						item[sysDisplayMember] = value.displayMember;
						item[sysValueMember] = value.displayMember;

						items.push(item);
					});

					return items;
				} catch (e) {
					$log.error(e);
				}
			}

			return null;
		}

		function setGridData(data) {
			platformGridAPI.items.data($scope.gridId, data);
		}

		function getGridData() {
			return platformGridAPI.items.data($scope.gridId);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}

	angular.module('basics.workflow').controller('basicsWorkflowSelectDialog', ['$scope', '$translate',
		'platformGridAPI', 'basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', 'basicsWorkflowtypeSelectedModes',
		'$timeout', '$log', 'platformManualGridService', basicsWorkflowSelectDialog]);

})(angular);
