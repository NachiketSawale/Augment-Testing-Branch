/**
 * Created by baitule on 02.10.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowPortalClientActionSelectContactFromBusinessPartnerDirective(basicsWorkflowActionEditorService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/portal-clientaction-select-contact-from-business-partner-container.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var userEntity = basicsWorkflowActionEditorService.getEditorInput('User.Ext.Provider.Entity', action);
								var list = basicsWorkflowActionEditorService.getEditorInput('PortalAccessGroupList', action);
								var contactId = basicsWorkflowActionEditorService.getEditorOutput('ContactId', action);
								var groupId = basicsWorkflowActionEditorService.getEditorOutput('PortalAccessGroupId', action);

								return {
									userEntity: userEntity ? userEntity.value : '',
									list: list ? list.value : '',
									contactId: contactId ? contactId.value : '',
									groupId: groupId ? groupId.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.userEntity = ngModelCtrl.$viewValue.userEntity;
								scope.input.list = ngModelCtrl.$viewValue.list;
								scope.output.contactId = ngModelCtrl.$viewValue.contactId;
								scope.output.groupId = ngModelCtrl.$viewValue.groupId;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.userEntity, 'User.Ext.Provider.Entity', action);
							basicsWorkflowActionEditorService.setEditorInput(value.list, 'PortalAccessGroupList', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.contactId, 'ContactId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.groupId, 'PortalAccessGroupId', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								userEntity: scope.input.userEntity,
								list: scope.input.list,
								contactId: scope.output.contactId,
								groupId: scope.output.groupId
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.userEntity', watchfn);
						scope.$watch('input.list', watchfn);
						scope.$watch('output.contactId', watchfn);
						scope.$watch('output.groupId', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowPortalClientActionSelectContactFromBusinessPartnerDirective.$inject = ['basicsWorkflowActionEditorService', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowPortalClientActionSelectContactFromBusinessPartnerDirective', basicsWorkflowPortalClientActionSelectContactFromBusinessPartnerDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00009f045b629af442a5dba29c4503d9',
					directive: 'basicsWorkflowPortalClientActionSelectContactFromBusinessPartnerDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
