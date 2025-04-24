/**
 * Created by uestuenel on 30.06.2016.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowGetProjectDocumentEditorDirective(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-project-document-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						$scope.input = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('DocumentList', action);
								var project = _.find(value.input, {key: 'ProjectId'});
								var business = _.find(value.input, {key: 'BusinessPartnerId'});
								var certificate = _.find(value.input, {key: 'CertificateId'});
								var structure = _.find(value.input, {key: 'StructureId'});
								var materialCatalog = _.find(value.input, {key: 'MaterialCatalogId'});
								var packageid = _.find(value.input, {key: 'PackageId'});
								var rfq = _.find(value.input, {key: 'RFQId'});
								var qtn = _.find(value.input, {key: 'QTNId'});
								var con = _.find(value.input, {key: 'CONId'});
								var pes = _.find(value.input, {key: 'PESId'});
								var inv = _.find(value.input, {key: 'INVId'});
								var schedule = _.find(value.input, {key: 'ScheduleId'});
								var activity = _.find(value.input, {key: 'ActivityId'});
								var est = _.find(value.input, {key: 'ESTId'});
								var req = _.find(value.input, {key: 'REQId'});

								return {
									inputproject: project ? project.value : '',
									inputbusiness: business ? business.value : '',
									inputcertificate: certificate ? certificate.value : '',
									inputstructure: structure ? structure.value : '',
									inputmaterialCatalog: materialCatalog ? materialCatalog.value : '',
									inputpackageid: packageid ? packageid.value : '',
									inputrfq: rfq ? rfq.value : '',
									inputqtn: qtn ? qtn.value : '',
									inputcon: con ? con.value : '',
									inputpes: pes ? pes.value : '',
									inputinv: inv ? inv.value : '',
									inputschedule: schedule ? schedule.value : '',
									inputactivity: activity ? activity.value : '',
									inputest: est ? est.value : '',
									inputreq: req ? req.value : '',
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							$scope.input.project = ngModelCtrl.$viewValue.inputproject;
							$scope.input.bp = ngModelCtrl.$viewValue.inputbusiness;
							$scope.input.certificate = ngModelCtrl.$viewValue.inputcertificate;
							$scope.input.structure = ngModelCtrl.$viewValue.inputstructure;
							$scope.input.materialCatalog = ngModelCtrl.$viewValue.inputmaterialCatalog;
							$scope.input.package = ngModelCtrl.$viewValue.inputpackageid;
							$scope.input.rfq = ngModelCtrl.$viewValue.inputrfq;
							$scope.input.qtn = ngModelCtrl.$viewValue.inputqtn;
							$scope.input.con = ngModelCtrl.$viewValue.inputcon;
							$scope.input.pes = ngModelCtrl.$viewValue.inputpes;
							$scope.input.inv = ngModelCtrl.$viewValue.inputinv;
							$scope.input.schedule = ngModelCtrl.$viewValue.inputschedule;
							$scope.input.activity = ngModelCtrl.$viewValue.inputactivity;
							$scope.input.est = ngModelCtrl.$viewValue.inputest;
							$scope.input.req = ngModelCtrl.$viewValue.inputreq;
							//output
							$scope.outputKey = ngModelCtrl.$viewValue.outputKey;
							$scope.output.document = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							//input
							basicsWorkflowActionEditorService.setEditorInput(value.project, 'ProjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.bp, 'BusinessPartnerId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.certificate, 'CertificateId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.structure, 'StructureId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.materialCatalog, 'MaterialCatalogId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.package, 'PackageId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.rfq, 'RFQId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.qtn, 'QTNId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.con, 'CONId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.pes, 'PESId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.inv, 'INVId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.schedule, 'ScheduleId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.activity, 'ActivityId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.est, 'ESTId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.req, 'REQId', action);

							//output
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'DocumentList', action);
							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								ngModelCtrl.$setViewValue({
									project: $scope.input.project,
									bp: $scope.input.bp,
									certificate: $scope.input.certificate,
									structure: $scope.input.structure,
									materialCatalog: $scope.input.materialCatalog,
									package: $scope.input.package,
									rfq: $scope.input.rfq,
									qtn: $scope.input.qtn,
									con: $scope.input.con,
									pes: $scope.input.pes,
									inv: $scope.input.inv,
									schedule: $scope.input.schedule,
									activity: $scope.input.activity,
									est: $scope.input.est,
									req: $scope.input.req,
									scriptOutput: $scope.output.document
								});
							}
						}

						$scope.$watch('input.project', watchfn);
						$scope.$watch('input.bp', watchfn);
						$scope.$watch('input.certificate', watchfn);
						$scope.$watch('input.structure', watchfn);
						$scope.$watch('input.materialCatalog', watchfn);
						$scope.$watch('input.package', watchfn);
						$scope.$watch('input.rfq', watchfn);
						$scope.$watch('input.qtn', watchfn);
						$scope.$watch('input.con', watchfn);
						$scope.$watch('input.pes', watchfn);
						$scope.$watch('input.inv', watchfn);
						$scope.$watch('input.schedule', watchfn);
						$scope.$watch('input.activity', watchfn);
						$scope.$watch('input.est', watchfn);
						$scope.$watch('input.req', watchfn);

						$scope.$watch('output.document', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowGetProjectDocumentEditorDirective.$inject = ['_', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetProjectDocumentEditorDirective', basicsWorkflowGetProjectDocumentEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '81b913cfd9284eb5a88752c5387e090a',
					directive: 'basicsWorkflowGetProjectDocumentEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
