/**
 * Created by lcn on 12/13/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowUpdateCompanyTransHeaderEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-company-transHeader-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									TransIds: getDataFromAction('TransIds'),
									Description: getDataFromAction('Description'),
									IsSuccess: getDataFromAction('IsSuccess'),
									ReturnValue: getDataFromAction('ReturnValue'),
									CommentText: getDataFromAction('CommentText'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.TransIds = ngModelCtrl.$viewValue.TransIds;
							scope.model.Description = ngModelCtrl.$viewValue.Description;
							scope.model.IsSuccess = ngModelCtrl.$viewValue.IsSuccess;
							scope.model.ReturnValue = ngModelCtrl.$viewValue.ReturnValue;
							scope.model.CommentText = ngModelCtrl.$viewValue.CommentText;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.TransIds, 'TransIds', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Description, 'Description', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsSuccess, 'IsSuccess', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReturnValue, 'ReturnValue', action);
							basicsWorkflowActionEditorService.setEditorInput(value.CommentText, 'CommentText', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								TransIds: scope.model.TransIds,
								Description: scope.model.Description,
								IsSuccess: scope.model.IsSuccess,
								ReturnValue: scope.model.ReturnValue,
								CommentText: scope.model.CommentText,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.TransIds', watchfn);
						scope.$watch('model.Description', watchfn);
						scope.$watch('model.IsSuccess', watchfn);
						scope.$watch('model.ReturnValue', watchfn);
						scope.$watch('model.CommentText', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateCompanyTransHeaderEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateCompanyTransHeaderEditorContainer', basicsWorkflowUpdateCompanyTransHeaderEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'FA784F38081847FE911CB077B269139B',
					directive: 'basicsWorkflowUpdateCompanyTransHeaderEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);

