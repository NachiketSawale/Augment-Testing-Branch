(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowCompressFilesEditorDirective(_, basicsWorkflowActionEditorService, platformModuleStateService,
	                                                    basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/compress-files-editor.html',
			compile: function compile() {
				return {
					pre: function postLink($scope, iElement, attr, ngModelCtrl) {
						let action = {};
						$scope.output = {};

						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						//radio-button
						$scope.input = {};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						$scope.onFileListBlur = function () {
							if ($scope.input.fileList) {
								$scope.input.fileStructure = '';
							}
						};

						$scope.onFileStructureBlur = function () {
							if ($scope.input.fileStructure) {
								$scope.input.fileList = '';
							}
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let docId = basicsWorkflowActionEditorService.getEditorOutput('DocId', action);
								let archiveName = _.find(value.input, {key: 'ArchiveName'});
								let fileList = _.find(value.input, {key: 'FileList'});
								let fileStructure = _.find(value.input, {key: 'FileStructure'});
								return {
									archiveName: archiveName ? archiveName.value : '',
									fileList: fileList ? fileList.value : '',
									fileStructure: fileStructure ? fileStructure.value : '',
									docId: docId ? docId.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.input.archiveName = ngModelCtrl.$viewValue.archiveName;
							$scope.input.fileStructure = ngModelCtrl.$viewValue.fileStructure;
							$scope.input.fileList = ngModelCtrl.$viewValue.fileList;
							$scope.output.docId = ngModelCtrl.$viewValue.docId;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.archiveName, 'ArchiveName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.fileList, 'FileList', action);
							basicsWorkflowActionEditorService.setEditorInput(value.fileStructure, 'FileStructure', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.docId, 'DocId', action);

							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								ngModelCtrl.$setViewValue({
									archiveName: $scope.input.archiveName,
									fileList: $scope.input.fileList,
									fileStructure: $scope.input.fileStructure,
									docId: $scope.output.docId
								});
							}
						}

						$scope.$watch('input.archiveName', watchfn);
						$scope.$watch('input.fileList', watchfn);
						$scope.$watch('input.fileStructure', watchfn);
						$scope.$watch('output.docId', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCompressFilesEditorDirective.$inject = ['_', 'basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCompressFilesEditorDirective', basicsWorkflowCompressFilesEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: 'aa2fc39fb58a4d15b8a194259ddab2eb',
				directive: 'basicsWorkflowCompressFilesEditorDirective',
				prio: null,
				tools: []
			});
		}]);

})(angular);
