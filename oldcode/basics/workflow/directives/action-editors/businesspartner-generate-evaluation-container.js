/**
 * Created by lvy on 8/10/2019.
 */
(function (angular) {
	'use strict';

	/*global globals,_,moment*/

	function bpGeneratEvaluationDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/businesspartner-generate-evaluation.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						var sampleTest = new RegExp(/sample/i);
						var sampleText = 'Sample:';
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.model.clerkRoleArrayColor = {color: 'inherit'};
						scope.model.clerkRoleArrayFocus = function () {
							if (sampleTest.test(scope.model.clerkRoleArray)) {
								scope.model.clerkRoleArray = scope.model.clerkRoleArray.replace('Sample:', '');
								scope.model.clerkRoleArrayColor = {color: 'inherit'};
							}
						};

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							var data = _.find(value.input, {key: 'EvaluationDate'});
							data.value = data.value || moment.utc(Date.now());
							var level = _.find(value.input, {key: 'AuthorizationLevel'});
							level.value = level.value || 'evaluation';
							var array = _.find(value.input, {key: 'ClerkRoleArray'});
							var validDate = moment.utc(Date.now()).format('YYYY-MM-DD');
							array.value = array.value || sampleText + '[{"roleId":0,"clerkId":0,"validFrom":"' + validDate + '","validTo":""}]';
							if (sampleTest.test(array.value)) {
								scope.model.clerkRoleArrayColor = {color: '#ccc'};
							}
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									schemaId: getDataFromAction('SchemaId'),
									motiveId: getDataFromAction('MotiveId'),
									code: getDataFromAction('Code'),
									description: getDataFromAction('Description'),
									evaluationDate: getDataFromAction('EvaluationDate') || moment.utc(Date.now()),
									bpId: getDataFromAction('BpId'),
									subsidiaryId: getDataFromAction('SubsidiaryId'),
									contact1Id: getDataFromAction('Contact1Id'),
									contact2Id: getDataFromAction('Contact2Id'),
									prcClerkId: getDataFromAction('PrcClerkId'),
									reqClerkId: getDataFromAction('ReqClerkId'),
									remarks: getDataFromAction('Remarks'),
									projectId: getDataFromAction('ProjectId'),
									qtnId: getDataFromAction('QtnId'),
									conId: getDataFromAction('ConId'),
									invId: getDataFromAction('InvId'),
									authorizationLevel: getDataFromAction('AuthorizationLevel') || 'evaluation',
									clerkRoleArray: getDataFromAction('ClerkRoleArray'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.schemaId = ngModelCtrl.$viewValue.schemaId;
							scope.model.motiveId = ngModelCtrl.$viewValue.motiveId;
							scope.model.code = ngModelCtrl.$viewValue.code;
							scope.model.description = ngModelCtrl.$viewValue.description;
							scope.model.evaluationDate = ngModelCtrl.$viewValue.evaluationDate;
							scope.model.bpId = ngModelCtrl.$viewValue.bpId;
							scope.model.subsidiaryId = ngModelCtrl.$viewValue.subsidiaryId;
							scope.model.contact1Id = ngModelCtrl.$viewValue.contact1Id;
							scope.model.contact2Id = ngModelCtrl.$viewValue.contact2Id;
							scope.model.prcClerkId = ngModelCtrl.$viewValue.prcClerkId;
							scope.model.reqClerkId = ngModelCtrl.$viewValue.reqClerkId;
							scope.model.remarks = ngModelCtrl.$viewValue.remarks;
							scope.model.projectId = ngModelCtrl.$viewValue.projectId;
							scope.model.qtnId = ngModelCtrl.$viewValue.qtnId;
							scope.model.conId = ngModelCtrl.$viewValue.conId;
							scope.model.invId = ngModelCtrl.$viewValue.invId;
							scope.model.authorizationLevel = ngModelCtrl.$viewValue.authorizationLevel;
							scope.model.clerkRoleArray = ngModelCtrl.$viewValue.clerkRoleArray;
							//output
							scope.output.result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.schemaId, 'SchemaId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.motiveId, 'MotiveId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorInput(value.description, 'Description', action);
							basicsWorkflowActionEditorService.setEditorInput(value.evaluationDate, 'EvaluationDate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.bpId, 'BpId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.subsidiaryId, 'SubsidiaryId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.contact1Id, 'Contact1Id', action);
							basicsWorkflowActionEditorService.setEditorInput(value.contact2Id, 'Contact2Id', action);
							basicsWorkflowActionEditorService.setEditorInput(value.prcClerkId, 'PrcClerkId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.reqClerkId, 'ReqClerkId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.remarks, 'Remarks', action);
							basicsWorkflowActionEditorService.setEditorInput(value.projectId, 'ProjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.qtnId, 'QtnId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.conId, 'ConId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.invId, 'InvId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.authorizationLevel, 'AuthorizationLevel', action);
							basicsWorkflowActionEditorService.setEditorInput(value.clerkRoleArray, 'ClerkRoleArray', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.result, 'Result', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								schemaId: scope.model.schemaId,
								motiveId: scope.model.motiveId,
								code: scope.model.code,
								description: scope.model.description,
								evaluationDate: scope.model.evaluationDate,
								bpId: scope.model.bpId,
								subsidiaryId: scope.model.subsidiaryId,
								contact1Id: scope.model.contact1Id,
								contact2Id: scope.model.contact2Id,
								prcClerkId: scope.model.prcClerkId,
								reqClerkId: scope.model.reqClerkId,
								remarks: scope.model.remarks,
								projectId: scope.model.projectId,
								qtnId: scope.model.qtnId,
								conId: scope.model.conId,
								invId: scope.model.invId,
								authorizationLevel: scope.model.authorizationLevel,
								clerkRoleArray: scope.model.clerkRoleArray,
								result: scope.output.result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function watchfnForLevel(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								var validDate = moment.utc(Date.now()).format('YYYY-MM-DD');
								if (newVal === 'evaluation') {
									scope.model.clerkRoleArray = sampleText + '[{"roleId":0,"clerkId":0,"validFrom":"' + validDate + '","validTo":""}]';
									scope.model.clerkRoleArrayColor = {color: '#ccc'};
								} else if (newVal === 'group') {
									scope.model.clerkRoleArray = sampleText + '[{"groupId":0,"roleId":0,"clerkId":0,"validFrom":"' + validDate + '","validTo":""}]';
									scope.model.clerkRoleArrayColor = {color: '#ccc'};
								} else if (newVal === 'subgroup') {
									scope.model.clerkRoleArray = sampleText + '[{"subGroupId":0,"roleId":0,"clerkId":0,"validFrom":"' + validDate + '","validTo":""}]';
									scope.model.clerkRoleArrayColor = {color: '#ccc'};
								}
								saveNgModel();
							}
						}

						scope.$watch('model.schemaId', watchfn);
						scope.$watch('model.motiveId', watchfn);
						scope.$watch('model.code', watchfn);
						scope.$watch('model.description', watchfn);
						scope.$watch('model.evaluationDate', watchfn);
						scope.$watch('model.bpId', watchfn);
						scope.$watch('model.subsidiaryId', watchfn);
						scope.$watch('model.contact1Id', watchfn);
						scope.$watch('model.contact2Id', watchfn);
						scope.$watch('model.prcClerkId', watchfn);
						scope.$watch('model.reqClerkId', watchfn);
						scope.$watch('model.remarks', watchfn);
						scope.$watch('model.projectId', watchfn);
						scope.$watch('model.qtnId', watchfn);
						scope.$watch('model.conId', watchfn);
						scope.$watch('model.invId', watchfn);
						scope.$watch('model.authorizationLevel', watchfnForLevel);
						scope.$watch('model.clerkRoleArray', watchfn);
						scope.$watch('output.result', watchfn);
					}
				};
			}
		};
	}

	bpGeneratEvaluationDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowGeneratEvaluationDirective', bpGeneratEvaluationDirective).config([
		'basicsWorkflowModuleOptions',
		function (
			basicsWorkflowModuleOptions
		) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '5e97ded434ed46ada84deb7ca11700a6',
					directive: 'basicsWorkflowGeneratEvaluationDirective',
					prio: null,
					tools: []
				}
			);
		}
	]);
})(angular);
