/**
 * Created by lav on 2018-4-13.
 * Remark: At the moment, because wizard “Import Product Description” is discarded, code of this file will not be used any more. 
 * But here we will still keep the code, in case we will reuse it in the future(e.g. reuse to patch CAD data in DB without accounting).(by zwz 2019/11/12)
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productDescriptionDocumentFileHandlerConfigurations',
		['$translate',
			function ($translate) {
				return {
					'fid': 'productDescription.document.fileUpload',
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
							'label': $translate.instant('productionplanning.engineering.fileUpload'),
							'type': 'directive',
							'directive': 'product-description-document-file-upload-lookup',
							'required': true,
							options: {
								upload: {
									serviceName: 'productDescriptionDocumentDocumentFileUploadDataService'
								}
							}
						},
						{
							'gid': 'fileUpload',
							'rid': 'material',
							'model': 'MaterialFK',
							'label': $translate.instant('productionplanning.item.materialFk'),
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'required': true,
							//'validator': productionplanningItemDescriptionValidationService.validateMaterialFk,
							'options': {
								'displayMember': 'Code',
								'showClearButton': false,
								'gridOptions': {
									'disableCreateSimilarBtn': true
								}
							}
						},
						{
							'gid': 'fileUpload',
							'rid': 'uom',
							'model': 'UomFK',
							'label': $translate.instant('cloud.common.entityUoM'),
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'required': true,
							//'validator': productionplanningItemDescriptionValidationService.validateUomFk,
							'options': {
								'displayMember': 'Unit'
							}
						}
					]
				};
			}]
	);

	angular.module(moduleName).controller('productDescriptionDocumentFileHandlerController',
		[
			'$scope',
			'$translate',
			'productDescriptionDocumentFileHandlerConfigurations',
			'productDescriptionDocumentDocumentFileUploadDataService',
			'basicsCommonUploadDownloadControllerService',
			function ($scope, $translate, config, fileUploadDataService, basicsCommonUploadDownloadControllerService) {

				$scope.fileUploadEntity = {
					FileInfo: [],
					UomFK: null,
					MaterialFK: null
				};

				$scope.formOptions = {
					configure: config
				};

				$scope.onOK = function () {
					if (validationModel()) {
						fileUploadDataService.importProductDesc($scope.fileUploadEntity, closeLoadingAndDialog);
					}
				};
				$scope.onCancel = function () {
					$scope.$close(false);
				};

				$scope.progressBarOptions = {
					fileNameVisible: true,
					cancelButtonVisible: true,
					uploadStatusVisible: true,
					useFixedWidth: false
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, fileUploadDataService, {enableDragAndDrop: false});

				function showError(isShow, message) {
					$scope.error = {
						show: isShow,
						message: message
					};
				}

				function onFileSelected(files) {
					var errorMsg = fileUploadDataService.onFileSelected(files);
					showError(!!errorMsg, errorMsg);
					$scope.$evalAsync();
				}

				//get the chosen file message when the file is uploaded
				var unWatchFileChosen = $scope.$on('fileChosen', function (scope, data, isClear) {
					if (isClear === true) {
						$scope.fileUploadEntity.FileInfo = [];
					}
					else {
						$scope.fileUploadEntity.FileInfo.push(data);
						showError(false);
					}
				});

				//close loading and dialog
				function closeLoadingAndDialog() {
					$scope.$close(false);
				}

				function validationModel() {
					var result = true;
					if (!($scope.fileUploadEntity.FileInfo && angular.isArray($scope.fileUploadEntity.FileInfo) && $scope.fileUploadEntity.FileInfo.length > 0)) {
						showError(true, $translate.instant('productionplanning.engineering.errors.fileUnValid'));
						result = false;
					}
					/*
					// Remark: First, productionplanningItemDescriptionValidationService will be removed from PPS Item module.
					//         Second, if we reuse the code in the future(e.g. reuse to patch CAD data in DB without accounting), here we need to refactor function validationModel().(by zwz 2019/11/12)
					if (!$scope.fileUploadEntity.UomFK) {
						platformRuntimeDataService.applyValidationResult(productionplanningItemDescriptionValidationService.validateUomFk($scope.fileUploadEntity, $scope.fileUploadEntity.UomFK, 'UomFK'), $scope.fileUploadEntity, 'UomFK');
						result = false;
					}
					if (!$scope.fileUploadEntity.MaterialFK) {
						platformRuntimeDataService.applyValidationResult(productionplanningItemDescriptionValidationService.validateMaterialFk($scope.fileUploadEntity, $scope.fileUploadEntity.MaterialFK, 'MaterialFK'), $scope.fileUploadEntity, 'MaterialFK');
						result = false;
					}
					*/
					return result;
				}

				var uploadService = fileUploadDataService.getUploadService();
				uploadService.registerFileSelected(onFileSelected);

				$scope.$on('$destroy', function () {
					unWatchFileChosen();
					uploadService.clear();
					uploadService.unregisterFileSelected(onFileSelected);
				});
			}]);
})(angular);