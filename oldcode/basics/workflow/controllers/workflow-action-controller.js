(function (angular) {
	'use strict';

	/* jshint -W072 */
	function basicsWorkflowActionDetailController($scope, platformModuleStateService,
	                                              basicsWorkflowMasterDataService, basicsWorkflowActionType, _, basicsWorkflowGlobalContextUtil,
	                                              basicsWorkflowActionEditorService, $translate, basicsWorkflowTemplateService) {

		var state = platformModuleStateService.state('basics.workflow');
		$scope.actionTypeEnum = basicsWorkflowActionType;
		$scope.actionDetailType = 0;
		$scope.radioList = {};
		$scope.radioList.editorMode = 'default';
		$scope.radioList.editModeEndDate = 'expert';
		$scope.radioList.editorModePrio = 'default';

		$scope.clerkLookUpConfig = {
			lookupDirective: 'cloud-clerk-clerk-dialog',
			lookupOptions: {
				showClearButton: true
			}
		};

		$scope.basicRoleLookUpConfig = {
			lookupDirective: 'basics-Role-For-Workflow-Dialog',
			lookupOptions: {
				showClearButton: true
			}
		};

		$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
		$scope.codeMirrorOptionsDescription = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
		$scope.codeMirrorOptionsDescription.hintOptions = {
			get globalScope() {
				return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
			}
		};
		$scope.codeMirrorOptionsToolTip = {
			ctrlId: 'codeMirrorOptionsToolTip',
			labelText: $translate.instant('basics.workflow.action.detail.executeCondition'),
			toolTipTitle: $translate.instant('basics.workflow.action.detail.executeConditionToolTipTitle'),
			toolTipCaption: $translate.instant('basics.workflow.action.detail.executeConditionToolTipCaption')
		};
		$scope.codeMirrorOptionsMultiline = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
		//disable js validation
		$scope.codeMirrorOptionsMultiline.mode = 'javascript';
		$scope.codeMirrorOptionsMultiline.scrollbarStyle = null;
		$scope.codeMirrorOptionsMultiline.placeholder = $translate.instant('basics.workflow.action.detail.executeConditionPlaceholder') + ': Context.<Variable> != 17';
		$scope.codeMirrorOptionsMultiline.hintOptions = {
			get globalScope() {
				return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
			}
		};

		$scope.priorityOptions = {
			displayMember: 'Description',
			valueMember: 'Id',
			items: state.priority
		};

		$scope.actionTypeOptions = {
			get displayText() {
				return $scope.action.actionType;
			}
		};

		$scope.itemsWatch = $scope.$watch(function () {
				return state.currentWorkflowAction;
			},
			function actionControllerItemsWatch(newVal) {
				if (state.selectedTemplateVersion) {
					let readonly = state.selectedTemplateVersion.IsReadOnly;
					$scope.isReadOnly = readonly;
					$scope.codeMirrorOptions.readOnly = readonly ? 'nocursor' : false;
					$scope.codeMirrorOptionsMultiline.readOnly = readonly ? 'nocursor' : false;
				} else {
					$scope.isReadOnly = true;
				}

				if (newVal) {
					$scope.action = newVal;
					if (angular.isNumber($scope.action.userId) ||
						$scope.action.userId === undefined ||
						$scope.action.userId === '') {
						$scope.radioList.editorMode = 'default';
					} else {
						$scope.radioList.editorMode = 'expert';
					}

					if (angular.isDefined($scope.action.transitions)) {
						if ($scope.action.actionTypeId === basicsWorkflowActionType.start.id ||
							$scope.action.actionTypeId === basicsWorkflowActionType.end.id) {
							$scope.actionDetailType = 1;
						} else {
							$scope.actionDetailType = $scope.action.actionTypeId === basicsWorkflowActionType.userTask.id ||
							$scope.action.actionTypeId === 3 ? 3 : 0;
							if (angular.isNumber($scope.action.userId)) {
								$scope.editorMode = 1;
							} else {
								$scope.editorMode = 2;
							}
							var action = _.find(state.actions, {Id: $scope.action.actionId});
							$scope.action.action = action ? action.Description : '';
							$scope.action.actionType = $translate.instant(
								$scope.actionTypeEnum.getById($scope.action.actionTypeId).key);
						}
					} else {
						$scope.actionDetailType = 2;
					}
				} else {
					$scope.actionDetailType = 99;
				}
			});

		$scope.changeWatch = $scope.$watch(function () {
				return $scope.action;
			},
			function (newVal, oldVal) {
				// Setting mainItemIsDirty if some change has happened
				if (oldVal && newVal) {
					state.mainItemIsDirty = basicsWorkflowTemplateService.hasActionChanged();
				}
			}, true);

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: []
			});
	}

	basicsWorkflowActionDetailController.$inject = ['$scope',
		'platformModuleStateService', 'basicsWorkflowMasterDataService', 'basicsWorkflowActionType', '_',
		'basicsWorkflowGlobalContextUtil', 'basicsWorkflowActionEditorService', '$translate', 'basicsWorkflowTemplateService'];

	angular.module('basics.workflow').controller('basicsWorkflowActionDetailController',
		basicsWorkflowActionDetailController);
})(angular);
