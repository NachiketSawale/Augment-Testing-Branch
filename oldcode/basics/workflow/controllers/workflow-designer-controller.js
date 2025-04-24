/* global angular */
(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsWorkflowDesignerController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/

	function basicsWorkflowDesignerController($scope, _, basicsWorkflowTemplateService, platformModuleStateService,
		basicsWorkflowActionType, basicsWorkflowUIService) {

		$scope.data = {};
		$scope.item = {};
		$scope.item.current = null;
		$scope.dropDownIsOpen = false;
		var state = platformModuleStateService.state('basics.workflow');

		var disabledAddFn = function () {
			var disabled = false;
			if (state.selectedTemplateVersion && state.selectedTemplateVersion.IsReadOnly) {
				disabled = true;
			} else {
				if (state.currentWorkflowAction) {
					disabled = state.currentWorkflowAction.actionTypeId === basicsWorkflowActionType.end.id;
				} else {
					disabled = true;
				}
			}

			return disabled;
		};

		var disabledPasteFn = function () {																				// --Defect #111557 - New - Workflow Paste functionality throws error
			var disabled = false;
			if (!_.isUndefined(state.copyWorkflowAction) && state.selectedTemplateVersion && state.selectedTemplateVersion.IsReadOnly) {
				disabled = true;
			} else {
				if (!_.isUndefined(state.copyWorkflowAction) && state.currentWorkflowAction) {
					disabled = state.currentWorkflowAction.actionTypeId === basicsWorkflowActionType.end.id;
				} else {
					disabled = true;
				}
			}
			if (!state.copyWorkflowAction) {
				disabled = true;
			}

			return disabled;
		};

		var disabledFn = function () {
			var _disabled = disabledAddFn();
			if (state.currentWorkflowAction && state.currentWorkflowAction.actionTypeId === basicsWorkflowActionType.start.id) {
				_disabled = true;
			}

			return _disabled;
		};

		$scope.$watch(function () {
			return state.selectedTemplateVersion;
		}, function (newVal, oldVal) {
			$scope.data.workflow = newVal;
			if (!(newVal && oldVal) || (newVal.Id !== oldVal.Id)) {
				state.CurrentWorkflowAction = null;
			}
		});

		$scope.$watch(function () {
			return state.actions;
		}, function () {
			refreshToolbar();
		});

		// A watch for disabling the toolbars when there is no action has been selected in the newly selected template.
		$scope.$watch(function () {
			return state.currentWorkflowAction;
		}, function () {
			if (!state.currentWorkflowAction) {
				refreshToolbar();
			}
		});

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: []
		});

		function buttonFnFactory(action) {
			return function () {
				addElement(action);
			};
		}

		function refreshToolbar() {
			var designerTools = [];

			_.each(basicsWorkflowActionType.asArray, function (item) {
				if (item.icon) {
					designerTools.push(
						{
							id: item.id,
							caption: item.key,
							cssClass: 'tlb-icons ' + item.icon,
							sort: item.sort,
							disabled: disabledAddFn,
							type: 'dropdown-btn',
							list: {
								listCssClass: 'dropdown-menu-right',
								items: getSubItems(item.id)
							}
						}
					);
				}
			});

			function getSubItems(parentId) {
				var result = [];
				var actions = _.filter(state.actions, {ActionType: parentId});
				actions = _.groupBy(actions, 'Namespace');

				var sortedKeys = Object.keys(actions).sort();

				_.each(sortedKeys, function (groupKey) {
					if (actions.hasOwnProperty(groupKey)) {
						var fallback = groupKey !== 'undefined' ? groupKey : 'Custom';

						result.push({
							id: groupKey + Date.now(),
							caption: fallback,
							type: 'item',
							disabled: true,
							cssClass: 'title'
						});
						_.each(actions[groupKey], function (a) {
							result.push({
								id: a.Id,
								caption: a.Description,
								iconClass: a.Id,
								type: 'item',
								fn: buttonFnFactory(a)
							});
						});
					}
				});

				return result;
			}

			designerTools = _.sortBy(designerTools, function (i) {
				return i.sort;
			});

			designerTools.push(
				{
					id: 'd0',
					type: 'divider',
					isSet: true
				}
			);

			designerTools.push({
				id: 'delte',
				caption: 'Delete',
				captionTR: 'basics.workflow.designer.menu.delete',
				type: 'item',
				disabled: disabledFn,
				iconClass: 'tlb-icons ico-rec-delete',
				fn: function () {
					if (!disabledFn()) {
						basicsWorkflowTemplateService.deleteElement(state.currentWorkflowAction, state.selectedTemplateVersion);
						$scope.tools.refresh();
					}
				}

			});

			designerTools.push({
				id: 'copy',
				caption: 'Copy',
				captionTR: 'basics.workflow.designer.menu.copy',
				type: 'item',
				disabled: disabledFn,
				iconClass: 'tlb-icons ico-copy',
				fn: function () {
					if (!disabledFn()) {
						state.copyWorkflowAction = basicsWorkflowTemplateService.copyElement(state.currentWorkflowAction);
						$scope.tools.refresh();
					}
				}
			});

			designerTools.push({
				id: 'cut',
				caption: 'Cut',
				captionTR: 'basics.workflow.designer.menu.cut',
				type: 'item',
				disabled: disabledFn,
				iconClass: 'tlb-icons ico-cut',
				fn: function () {
					if (!disabledFn()) {
						state.copyWorkflowAction = basicsWorkflowTemplateService.cutElement(state.currentWorkflowAction, state.selectedTemplateVersion);
						$scope.tools.refresh();
					}
				}

			});

			designerTools.push({
				id: 'paste',
				caption: 'Paste',
				captionTR: 'basics.workflow.designer.menu.paste',
				type: 'item',
				disabled: disabledPasteFn,																				// --Defect #111557 - New - Workflow Paste functionality throws error
				iconClass: 'tlb-icons ico-paste',
				fn: function () {
					if (!disabledPasteFn()) {
						basicsWorkflowTemplateService.pasteElement(state.currentWorkflowAction, state.copyWorkflowAction, state.selectedTemplateVersion);
						$scope.tools.refresh();
					}
				}
			});

			designerTools.push(
				{
					id: 'd1',
					type: 'divider',
					isSet: true
				}
			);

			$scope.tools.items = designerTools;
			$scope.tools.update();
			filterAction();

		}

		function addElement(action) {
			basicsWorkflowTemplateService.addElementAfter(state.currentWorkflowAction, action.ActionType, action);
			state.mainItemIsDirty = true;
		}

		// init toolbar-items(for disabled, !disabled)
		$scope.$watch(function () {
				return $scope.item.current;
			},
			function (newVal) {
				if (newVal) {
					basicsWorkflowUIService.prepareSave();
					$scope.tools.refresh();
					state.currentWorkflowAction = newVal;
				}
			});

		$scope.$watch(function () {
			return state.currentWorkflowAction;
		}, function (newVal) {
			$scope.item.current = newVal;
		});

		// change by joy: remove chatbot question action once workflow kind is not chatbot kind
		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function (newValue, oldValue) {
			if (newValue && oldValue && newValue.hasOwnProperty('KindId')) {
				if ((newValue.Id === oldValue.Id && newValue.KindId !== oldValue.KindId) || // change kindid
					newValue.Id !== oldValue.Id  // switch between different entity
				) {
					refreshToolbar();
				}
			}
		}, true);

		function filterAction() {
			if (state.selectedMainEntity.hasOwnProperty('KindId') && state.selectedMainEntity.KindId !== 3) {
				var chatbotActions = ['00006D1F021542C798756F136F0F716B', '3B2AFEBA74A548F3A4CAEF7F35D46702'];
				_.each($scope.tools.items, function (toolItem) {
					if (toolItem.hasOwnProperty('list')) {
						if (toolItem.list.hasOwnProperty('items')) {
							toolItem.list.items = _.filter(toolItem.list.items, function (childItem) {
								var notFound = true;
								if (childItem.id && _.isString(childItem.id) && (chatbotActions.includes(childItem.id) || childItem.id.toLowerCase().indexOf('mtwo.chatbot') > -1)) {
									notFound = false;
								}
								return notFound;
							});
						}
					}
				});
			}
		}

		//  change  end

	}

	angular.module('basics.workflow').controller('basicsWorkflowDesignerController',
		['$scope', '_', 'basicsWorkflowTemplateService', 'platformModuleStateService', 'basicsWorkflowActionType',
			'basicsWorkflowUIService', 'basicsWorkflowMasterDataService', 'basicsWorkflowPreProcessorService',
			basicsWorkflowDesignerController]);
})();
