/**
 * Created by lcn on 2/22/2018.
 */
/**
 * Created by anl on 11/23/2017.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowCreateRequistionFromPackageEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-requisition-from-package-editor.html',
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
									PackageId: getDataFromAction('PackageId'),
									SubPackageId: getDataFromAction('SubPackageId'),
									RequisitionId: getDataFromAction('RequisitionId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.PackageId = ngModelCtrl.$viewValue.PackageId;
							scope.model.SubPackageId = ngModelCtrl.$viewValue.SubPackageId;
							scope.model.RequisitionId = ngModelCtrl.$viewValue.RequisitionId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.PackageId, 'PackageId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.SubPackageId, 'SubPackageId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.RequisitionId, 'RequisitionId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								PackageId: scope.model.PackageId,
								SubPackageId: scope.model.SubPackageId,
								RequisitionId: scope.model.RequisitionId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.PackageId', watchfn);
						scope.$watch('model.SubPackageId', watchfn);
						scope.$watch('model.RequisitionId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateRequistionFromPackageEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateRequistionFromPackageEditorDirective', basicsWorkflowCreateRequistionFromPackageEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '37b82434a42145d891f11ed11c16199b',
					directive: 'basicsWorkflowCreateRequistionFromPackageEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
