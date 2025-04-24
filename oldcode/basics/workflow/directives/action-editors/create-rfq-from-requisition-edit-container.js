/**
 * Created by lst on 03/29/2021.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowCreateRfqFromRequisitionEditorDirective(basicsWorkflowActionEditorService, globals, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-rfq-from-requisition-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions2requisitionId = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptions2requisitionId.placeholder = $translate.instant('basics.workflow.action.customEditor.requisitionIdTips');

						scope.codeMirrorOptions2autoCopyBidder = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptions2autoCopyBidder.placeholder = $translate.instant('basics.workflow.action.customEditor.autoCopyBidderTips');

						scope.codeMirrorOptions2bpIds = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptions2bpIds.placeholder = $translate.instant('basics.workflow.action.customEditor.bpIdsTips');

						scope.codeMirrorOptions2contactIds = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptions2contactIds.placeholder = $translate.instant('basics.workflow.action.customEditor.contactIdsTips');

						scope.codeMirrorOptions2result = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? (typeof param.value === 'boolean') ? param.value.toString() : param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									ReqHeaderId: getDataFromAction('ReqHeaderId'),
									AutoCopyBidder: getDataFromAction('AutoCopyBidder'),
									BusinessPartnerIds: getDataFromAction('BusinessPartnerIds'),
									ContactIds: getDataFromAction('ContactIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.ReqHeaderId = ngModelCtrl.$viewValue.ReqHeaderId;
							scope.model.AutoCopyBidder = ngModelCtrl.$viewValue.AutoCopyBidder;
							scope.model.BusinessPartnerIds = ngModelCtrl.$viewValue.BusinessPartnerIds;
							scope.model.ContactIds = ngModelCtrl.$viewValue.ContactIds;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.ReqHeaderId, 'ReqHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AutoCopyBidder, 'AutoCopyBidder', action);
							basicsWorkflowActionEditorService.setEditorInput(value.BusinessPartnerIds, 'BusinessPartnerIds', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ContactIds, 'ContactIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								ReqHeaderId: scope.model.ReqHeaderId,
								AutoCopyBidder: scope.model.AutoCopyBidder,
								BusinessPartnerIds: scope.model.BusinessPartnerIds,
								ContactIds: scope.model.ContactIds,
								Result: scope.output.Result
							});
						}

						scope.$watch(function () {
							return scope.model.AutoCopyBidder;
						}, function () {
							scope.isAutoCopyBidderCheckbox = scope.model.AutoCopyBidder === true || scope.model.AutoCopyBidder === 'true';
						});

						scope.changeCheckbox = function () {
							scope.model.AutoCopyBidder = _.toString(!scope.isAutoCopyBidderCheckbox);
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.ReqHeaderId', watchfn);
						scope.$watch('model.AutoCopyBidder', watchfn);
						scope.$watch('model.BusinessPartnerIds', watchfn);
						scope.$watch('model.ContactIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateRfqFromRequisitionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'globals', '$translate'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateRfqFromRequisitionEditorDirective', basicsWorkflowCreateRfqFromRequisitionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '016f7966f0ae456b91581c28102c34af',
					directive: 'basicsWorkflowCreateRfqFromRequisitionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
