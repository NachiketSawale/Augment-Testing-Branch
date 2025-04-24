(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @basicsCommonDragAndDropFromExplorerControllerService
	 * @Description
	 * for each grid container => define a callback function "onInitFilesDragAndDropCallBack" to the given data service to process the drag and drop files
	 * or "OnUploadFileOnItem" to update the selected item or file dropped on item
	 */
	angular.module(moduleName).factory('basicsCommonDragAndDropFromExplorerControllerService',
		['$http', '$window', '$injector','_', '$translate', 'platformModalService', 'basicsLookupdataLookupDescriptorService',

			function BasicsCommonDragAndDropFromExplorerControllerService($http, $window, $injector,_ , $translate, platformModalService, basicsLookupdataLookupDescriptorService) {

				let service = {};
				service.initDragAndDropService = function initDragAndDropService($scope, dataService) {
					let getTargetItem = null;
					manageAllowedFilesAndSetProperties();

					function manageAllowedFilesAndSetProperties() {
						if (_.isNil($scope.allowedFiles)) {
							getAllowedFiles().then(function (allowedFiles) {
								$scope.allowedFiles = allowedFiles;
							}).then(function () {
								setProperties();
							});
						} else {
							setProperties();
						}
					}

					function setProperties() {
						$scope.canDrop = canDrop;
						$scope.fileDropped = fileDropped;
						$scope.initFiles = null;
						getTargetItem = getTargetItemForDrop($scope, dataService) || dataService.getSelected;
					}

					function canDrop() {
						// if the parent status is readonly, then can not upload documents
						const parentService = dataService.parentService();
						const parentSelectItem = parentService.getSelected();
						// if the header has not been save, then show the warning message
						if (!!parentSelectItem && parentSelectItem.Version === 0 || !!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
							$('#docsaveerror').show();
							return false;
						} else {
							return true;
						}
					}

					function fileDropped(files) {
						if (canDrop()) {
							let isManagedOnEntityUpdate = manageDragedOnItem(dataService, getTargetItem);
							let isValid = validateDragAndDropFiles(files, dataService);
							if (isValid && !isManagedOnEntityUpdate) {
								$scope.initFiles = files;
								processDragAndDropFiles();
							}
						}
					}

					function validateDragAndDropFiles(files, dataService) {
						let isValid = false;
						isValid = generalValidationAndShowMessage(files, dataService);
						if (isValid) {
							isValid = vadidateFileExtensionsAndShowMessage(files, dataService);
						}
						return isValid;
					}

					function manageDragedOnItem(dataService, getTargetItem) {
						let isManagedOnItemUpdate = false;
						const entity = getTargetItem();
						const files = $window.event.dataTransfer && $window.event.dataTransfer.items;
						const file = files[0];
						if (!!dataService.OnUploadFileOnItem && !_.isNil(entity)) {
							isManagedOnItemUpdate = true;
							dataService.OnUploadFileOnItem(entity, [file]);
						}
						return isManagedOnItemUpdate;
					}

					function getTargetItemForDrop($scope, dataService) {
						let error = null;
						try {
							const entities = dataService.getList();
							const position = $injector.get('platformGridAPI').grids.element('id', $scope.gridId).instance.getCellFromEvent($window.event);
							return entities && position && entities[position.row];
						} catch (e) {
							error = e;
						}
					}

					function getAllowedFiles() {
						const defer = $injector.get('$q').defer();
						const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
						if (!documentTypes) {
							basicsLookupdataLookupDescriptorService.loadData('DocumentType').then(function () {
								defer.resolve(_.map(basicsLookupdataLookupDescriptorService.getData('DocumentType'), function (value) {
									return value.MimeType;
								}));
							});
						} else {
							defer.resolve(_.map(documentTypes, function (value) {
								return value.MimeType;
							}));
						}
						return defer.promise;
					}

					function getDocumentType(fileName) {
						const suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1).replace('.', '').replace('*', '');
						const lowercaseSuffix = _.toLower(suffix);
						const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
						return _.find(documentTypes, function (o) {
							return o.Extention !== null && o.Extention !== '' && (o.Extention.indexOf(lowercaseSuffix) !== -1 || lowercaseSuffix.indexOf(o.Extention) !== -1);
						});
					}

					function vadidateFileExtensionsAndShowMessage(files) {
						let isValid = true;
						const denyExtensions = [];
						_.forEach(files, function (file) {
							const foundType = getDocumentType(file.name);
							if (foundType === undefined || foundType === null) {
								denyExtensions.push(file.name);
							}
						});
						if (denyExtensions.length > 0) {
							isValid = false;

							let errMsg;
							if (denyExtensions.length > 1) {
								const fileNames = denyExtensions.join('<br/>');
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
							} else {
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + denyExtensions[0];
							}
							errMsg = '<div style=\'height:300px\'>' + errMsg + '</div>';
							platformModalService.showMsgBox(errMsg, 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle', 'warning');
						}
						return isValid;
					}

					function generalValidationAndShowMessage(files, dataService) {
						let isValid = true;
						if (_.isNil(files)) {
							platformModalService.showMsgBox($translate.instant('documents.project.FileUpload.validation.FileUnValid'),
								$translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'), 'warning');
							isValid = false;
						}
						if (isValid && !dataService.parentService().getSelected()) {
							const errMsg = $injector.get('$translate').instant('documents.project.FileUpload.validation.NoHeaderEntitySelectedTip');
							platformModalService.showMsgBox(errMsg, $translate.instant('documents.project.FileUpload.validation.NoHeaderSelected'), 'warning');
							isValid = false;
						}
						return isValid;
					}

					function processDragAndDropFiles() {
						if (!_.isNil($scope.initFiles)) {
							dataService.onInitFilesDragAndDropCallBack($scope.initFiles);
							clean();
						}
					}

					function clean() {
						$scope.initFiles = null;
					}

				};
				return service;
			}

		]);
})(angular);