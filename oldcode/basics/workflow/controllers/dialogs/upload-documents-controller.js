/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	function basicsWorkflowUploadDocumentsDialog(_, $scope, $translate, platformGridAPI, basicsWorkflowEditModes) {
		var editModes = basicsWorkflowEditModes;

		$scope.input = {};
		var editorMode = $scope.modalOptions.value.editorMode;

		$scope.input.editorMode = _.isUndefined(editorMode) ? editModes.default : editorMode;
		$scope.input.editorMode = editorMode;

		$scope.input.radioGroupOpt = {
			displayMember: 'description',
			valueMember: 'value',
			cssMember: 'cssClass',
			items: [
				{
					value: 1,
					description: $translate.instant('basics.workflow.modalDialogs.singleDocument'),
					cssClass: 'pull-left spaceToUp'
				},
				{
					value: 2,
					description: $translate.instant('basics.workflow.modalDialogs.mulTipleDocument'),
					cssClass: 'pull-left margin-left-ld'
				}
			]
		};

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;
		};

		$scope.modalOptions.ok = function ok(result) {
			$scope.modalOptions.value.editorMode = $scope.input.editorMode;
			// create result object with values
			var customResult = result || {};
			if (_.isObject($scope.modalOptions.value)) {
				customResult.value = $scope.modalOptions.value;
			}
			customResult.ok = true;

			// close modal dialog
			$scope.$close(customResult);
		};

		$scope.$on('$destroy', function () {
		});
	}

	angular.module(moduleName).controller('basicsWorkflowUploadDocumentsDialog',
		['_', '$scope', '$translate', 'platformGridAPI', 'basicsWorkflowEditModes',
			basicsWorkflowUploadDocumentsDialog]);

	angular.module(moduleName).controller('basicsWorkflowUploadDocumentsController',
		['_', '$timeout', '$q', '$scope', '$rootScope',
			'$translate',
			'basicsWorkflowMultiDocumentsFileUploadService',
			'basicsCommonUploadDownloadControllerService',
			'basicsWorkflowCommonService',
			'basicsWorkflowEditModes',
			function (_, $timeout, $q, $scope, $rootScope, $translate, fileUploadDataService, basicsCommonUploadDownloadControllerService,
				basicsWorkflowCommonService,basicsWorkflowEditModes) {
				var config = {
					'fid': 'documents.project.fileUpload',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'fileUpload',
							'header': 'fileUpload',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'gid': 'fileUpload',
							'rid': 'FileUpload',
							'type': 'directive',
							'directive': 'basics-workflow-documents-file-upload-lookup',
							'options': {
								option: $scope.options,
								entity: $scope.entity,
								parentScope : $scope
							}
						}
					]
				};

				$scope.modalOptions = {
					parentScope: $scope.modalOptions ? $scope.modalOptions.scope : undefined,
					gridFlag: $scope.gridFlag,
					headerText: $translate.instant('basics.workflow.fileUpload.title'),
					body: {
						formOptions: {
							configure: config,
							validationMethod: angular.noop
						}
					},
					loading: {
						dialogLoading: false,
						loadingInfo: null
					},
					cancel: function () {
						$scope.$parent.$close(false);
					}
				};

				$scope.progressBarOptions = {
					fileNameVisible: true,
					cancelButtonVisible: true,
					useFixedWidth: false
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, fileUploadDataService, {enableDragAndDrop: false});

				var p = $q.defer();
				function ok(){
					var isUpload = false;
					var id = $scope.$id;
					_.forEach(fileUploadDataService.getSelectedFile(),function(item){
						if(id === item.id && item.fileArr.length > 0){
							fileUploadDataService.onFileSelected(item.fileArr);
							isUpload = true;
						}
					});

					if (isUpload){
						return p.promise;
					}
					else{
						return $q.when(true);
					}
				}

				basicsWorkflowCommonService.registerFn(ok);

				var uploadService = fileUploadDataService.getUploadService();
				uploadService.registerFileSelected(onFileSelected);
				function onFileSelected(files) {
					if (!$scope.isClicked){
						return;
					}
					delete $scope.isClicked;
					var scopeId = $scope.$id;
					var allFile = fileUploadDataService.getSelectedFile(scopeId);
					fileUploadDataService.isDragOrSelect = 'select';

					_.forEach(files, function (file) {
						if ($scope.options.editorMode === basicsWorkflowEditModes.default){
							allFile.length = 0;
						}
						file.Id = allFile.length + 1;
						file.scopeId = scopeId;
						allFile.push(file);
					});
					fileUploadDataService.setSelectedFile(scopeId, allFile);

					$scope.refresh($scope);
				}

				$scope.refresh = function (scope) {
					var curScope = $scope || scope;
					if (!$rootScope.$$phase) {
						curScope.$digest();
					} else {
						curScope.$evalAsync();
					}
				};

				//get the chosen file message when the file is uploaded
				var unWatchFileChosen = $scope.$on('fileChosen', function (scope, data) {
					if (data) {
						if (data.file.scopeId === $scope.$id){
							if (!$scope.model){
								$scope.model = [];
							}
							$scope.model.push(data.FileArchiveDocId);
							$scope.model = _.sortBy($scope.model);
							$scope.$setViewValue($scope.model);
							var fileArr = fileUploadDataService.getSelectedFile(data.file.scopeId);
							if (fileArr.length > 0) {
								var file = _.find(fileArr, {Id: data.file.Id});
								if (file){
									_.remove(fileArr, {Id: file.Id});
									if (fileArr.length === 0){
										$timeout(function () {
											p.resolve(true);
										}, 0);
									}
								}
							}
						}
					}
				});

				$scope.$on('$destroy', function () {
					var allFile = fileUploadDataService.getSelectedFile();
					allFile.length = 0;
					unWatchFileChosen();
					uploadService.clear();
					uploadService.unregisterFileSelected(onFileSelected);
					basicsWorkflowCommonService.unregisterFn(ok);
				});
			}]
	);
})(angular);



