/**
 * Created by lcn on 3/2/2020.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowReCalculateTransactionsEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/recalculate-transactions-editor.html',
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
									PrjStockID: getDataFromAction('PrjStockID'),
									MaterialID: getDataFromAction('MaterialID'),
									ProductID: getDataFromAction('ProductID'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.PrjStockID = ngModelCtrl.$viewValue.PrjStockID;
							scope.model.MaterialID = ngModelCtrl.$viewValue.MaterialID;
							scope.model.ProductID = ngModelCtrl.$viewValue.ProductID;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.PrjStockID, 'PrjStockID', action);
							basicsWorkflowActionEditorService.setEditorInput(value.MaterialID, 'MaterialID', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ProductID, 'ProductID', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								PrjStockID: scope.model.PrjStockID,
								MaterialID: scope.model.MaterialID,
								ProductID: scope.model.ProductID,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.PrjStockID', watchfn);
						scope.$watch('model.MaterialID', watchfn);
						scope.$watch('model.ProductID', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowReCalculateTransactionsEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowReCalculateTransactionsEditorContainer', basicsWorkflowReCalculateTransactionsEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '76DDF067FCC4414F90EE5010BF9F96BF',
					directive: 'basicsWorkflowReCalculateTransactionsEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
