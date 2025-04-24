/**
 * Created by maj on 09.27.2022.
 */
(function (angular) {
	'use strict';
	/* global globals _ */
	function basicsWorkflowDateShiftEditorContainer(
		basicsWorkflowActionEditorService,
		$translate,
		platformTranslateService,
		basicsLookupdataConfigGenerator,
		platformCreateUuid,
		ppsCommonLoggingHelper,
		basicsLookupdataLookupFilterService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/dateshift-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						let action = {};
						$scope.output = {};
						$scope.model = {};
						$scope.input = {};
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						$scope.getEditorInput = basicsWorkflowActionEditorService.getEditorInput;

						function getDataFromAction(key) {
							const param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								EventId: $scope.model.EventId || '',
								IsFullShift: $scope.model.IsFullShift || '',
								DateShiftMode: $scope.model.DateShiftMode || '',
								StartDate: $scope.model.DateType !== 'startDate' ? '' : $scope.model.StartDate || '',
								EndDate: $scope.model.DateType !== 'endDate' ? '' : $scope.model.EndDate || '',
								LogReasonGroup: $scope.model.LogReasonGroup || '',
								LogReason: $scope.model.LogReason || '',
								Remark: $scope.model.Remark || '',
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							// input
							$scope.model.EventId = ngModelCtrl.$viewValue.EventId;
							$scope.model.IsFullShift = ngModelCtrl.$viewValue.IsFullShift;
							$scope.model.DateShiftMode = ngModelCtrl.$viewValue.DateShiftMode;
							$scope.model.StartDate = ngModelCtrl.$viewValue.StartDate;
							$scope.model.EndDate = ngModelCtrl.$viewValue.EndDate;
							$scope.model.DateType = ngModelCtrl.$viewValue.EndDate ? 'endDate' : 'startDate';
							$scope.model.LogReasonGroup = ngModelCtrl.$viewValue.LogReasonGroup;
							$scope.model.LogReason = ngModelCtrl.$viewValue.LogReason;
							$scope.model.Remark = ngModelCtrl.$viewValue.Remark;
							// output
							$scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								const outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									EventId: getDataFromAction('EventId'),
									IsFullShift: getDataFromAction('IsFullShift'),
									DateShiftMode: getDataFromAction('DateShiftMode'),
									StartDate: getDataFromAction('StartDate'),
									EndDate: getDataFromAction('EndDate'),
									LogReasonGroup: getDataFromAction('LogReasonGroup'),
									LogReason: getDataFromAction('LogReason'),
									Remark: getDataFromAction('Remark'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}

							return '';
						});

						// parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.EventId, 'EventId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsFullShift, 'IsFullShift', action);
							basicsWorkflowActionEditorService.setEditorInput(value.DateShiftMode, 'DateShiftMode', action);
							basicsWorkflowActionEditorService.setEditorInput(value.StartDate, 'StartDate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.EndDate, 'EndDate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.LogReasonGroup, 'LogReasonGroup', action);
							basicsWorkflowActionEditorService.setEditorInput(value.LogReason, 'LogReason', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Remark, 'Remark', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.$watch('model.EventId', watchfn);
						$scope.$watch('model.IsFullShift', watchfn);
						$scope.$watch('model.DateShiftMode', watchfn);
						$scope.$watch('model.StartDate', watchfn);
						$scope.$watch('model.EndDate', watchfn);
						$scope.$watch('model.DateType', watchfn);
						$scope.$watch('model.LogReasonGroup', watchfn);
						$scope.$watch('model.LogReason', watchfn);
						$scope.$watch('model.Remark', watchfn);
						$scope.$watch('output.Result', watchfn);

						$scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'value',
							items: [{
								value: 'both',
								description: $translate.instant('platform.gantt.both')
							}, {
								value: 'right',
								description: $translate.instant('platform.gantt.right')
							}, {
								value: 'left',
								description: $translate.instant('platform.gantt.left')
							}, {
								value: 'self',
								description: $translate.instant('platform.gantt.self')
							}, {
								value: 'push',
								description: $translate.instant('platform.gantt.push')
							}]
						};

						$scope.selectOptionsDateType = {
							displayMember: 'description',
							valueMember: 'value',
							items: [{
								value: 'startDate',
								description: $translate.instant('basics.workflow.action.customEditor.dateShift.startDate')
							}, {
								value: 'endDate',
								description: $translate.instant('basics.workflow.action.customEditor.dateShift.endDate')
							}]
						};

						function generateFormOption(row){
							return {
								configure: platformTranslateService.translateFormConfig({
									showGrouping: false,
									groups: [
										{
											gid: 'baseGroup'
										}
									],
									rows: [
										row
									]
								})
							};
						}
						$scope.formOptionsForLogReasonGroup = generateFormOption(basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.ppslogreasongroup',
							null,
							{
								gid: 'baseGroup',
								rid: 'LogReasonGroup',
								model: 'LogReasonGroup'
							},
							false,
							{
								required: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											$scope.model.LogReason = null;
										}
									}
								]
							}
						));

						let filters = [];
						$scope.formOptionsForLogReason = generateFormOption(basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.ppslogreason',
							null,
							{gid: 'baseGroup',
								rid: 'LogReason',
								model: 'LogReason'},
							false,
							{
								filterKey: (function () {
									let filter = {
										key: 'pps-common-log-reason-filter-' + platformCreateUuid(),
										fn: function (lookupItem) {
											if (ppsCommonLoggingHelper.dto2DbMappingCache && ppsCommonLoggingHelper.logConfigCache) { // only do filter after mapping loaded
												return lookupItem.PpsLogreasonGroupFk === $scope.model.LogReasonGroup;
											}
											return true;
										}
									};
									filters.push(filter);
									return filter.key;
								})(),
								customIntegerProperty: 'PPS_LOGREASON_GROUP_FK'
							}
						));

						basicsLookupdataLookupFilterService.registerFilter(filters);
						$scope.$on('$destroy', function () {
							basicsLookupdataLookupFilterService.unregisterFilter(filters);
						});

					}
				};
			}
		};
	}

	basicsWorkflowDateShiftEditorContainer.$inject = [
		'basicsWorkflowActionEditorService',
		'$translate',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'platformCreateUuid',
		'ppsCommonLoggingHelper',
		'basicsLookupdataLookupFilterService'
	];

	angular.module('basics.workflow')
		.directive('basicsWorkflowDateShiftEditorContainer', basicsWorkflowDateShiftEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '444e3ba4ee434895a14bdbef287b2085',
					directive: 'basicsWorkflowDateShiftEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
