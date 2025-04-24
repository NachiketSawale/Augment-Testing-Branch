/**
 * Created by clv on 5/15/2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowSetAddressGeoLocationEditorContainer(basicsWorkflowActionEditorService,
	                                                            platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowChangeStatusService, _) {

		return {

			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/set-address-geo-location-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {

						var action = {};
						scope.output = {};
						scope.model = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.model.name = 'AddressGeoLocation';

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									statusName: scope.model.name,
									AddressId: getDataFromAction('AddressId'),
									Result: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							scope.model.name = ngModelCtrl.$viewValue.statusName;
							scope.model.AddressId = ngModelCtrl.$viewValue.AddressId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.Result;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.AddressId, 'AddressId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								name: scope.model.name,
								AddressId: scope.model.AddressId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.AddressId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}

		};
	}

	basicsWorkflowSetAddressGeoLocationEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowChangeStatusService', '_'];
	angular.module('basics.workflow')
		.directive('basicsWorkflowSetAddressGeoLocationEditorContainer', basicsWorkflowSetAddressGeoLocationEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '47db6eef5fdc42ea90928a46353c9b67',
				directive: 'basicsWorkflowSetAddressGeoLocationEditorContainer',
				prio: null,
				tools: []
			});
		}]);

})(angular);
