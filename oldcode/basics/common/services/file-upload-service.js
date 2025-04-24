(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc service

	 * @name basicsCommonFileUploadServiceFactory
	 * @function
	 * @requires _,$q, $http,PlatformMessenger, globals, math,UploadBase
	 *
	 * @description a factory for creating upload file service, the upload file service is a service that manages file to upload.
	 */
	angular.module(moduleName).factory('basicsCommonFileUploadServiceFactory',
		['_', '$q', '$http', '$timeout', 'PlatformMessenger', 'globals', 'math', 'UploadBase', '$rootScope', 'platformIsPreInitState', 'basicsLookupdataLookupDescriptorService', 'platformModalService', '$translate',
			/* jshint -W072 */
			function (_, $q, $http, $timeout, PlatformMessenger, globals, math, UploadBase, $rootScope, platformIsPreInitState, basicsLookupdataLookupDescriptorService, platformModalService, $translate) {
				// default value of upload options
				let CheckUploadSizeLimitation = false;// check the file size according to the table BAS_DOCUMENT_TYPE.MAX_BYTE.
				let maxUploadingFileCount = 2; // The maximum count of uploading files at the same time
				let resumeChunkSize = '1mb'; // The maximum size of a single block. A file can be divided into several small single blocks, only one block is uploaded to the server each time.
				const imageTypes = ['jpg', 'JPG', 'Jpg', 'jpeg', 'JPEG', 'Jpeg', 'bmp', 'BMP', 'Bmp', 'png', 'PNG', 'Png', 'gif', 'GIF', 'Gif'];

				function getUploadOptions() {
					const unregisterDelegate = $rootScope.$on('$stateChangeSuccess', function (/* response */) {
						const stateName = arguments[1].name;
						if (!platformIsPreInitState(stateName)) {

							unregisterDelegate();

							// Get values of upload options from server side
							$http.get(globals.webApiBaseUrl + 'basics/common/document/uploadoptions').then(function (response) {
								maxUploadingFileCount = response.data.MaxUploadingFileCount || maxUploadingFileCount;
								resumeChunkSize = response.data.MaxUploadSingleBlockSize || resumeChunkSize;
								CheckUploadSizeLimitation = response.data.CheckUploadSizeLimitation || CheckUploadSizeLimitation;
							});
						}
					});
				}

				getUploadOptions();
				loadDocumentType();

				function getExtension(documentTypeItems, documentTypeId) {
					if (documentTypeItems) {
						if (documentTypeId === null || angular.isUndefined(documentTypeId)) {
							return _.map(documentTypeItems,
								function (value) {
									if (value.Extention !== null && value.Extention !== undefined) {
										return '.' + value.Extention.replace('.', '').replace('*', '');
									} else {
										return '.';
									}
								}).join();
						} else {
							const docType = (documentTypeItems[documentTypeId] || {Extention: 'doc'}).Extention;
							if (docType) {
								return '.' + docType.replace('.', '').replace('*', '');
							} else {
								return '';
							}
						}
					}
					return '';
				}

				function create(options) {
					const needConsiderFileType = options && angular.isDefined(options.needConsiderFileType) ? options.needConsiderFileType : true;

					const defaultService = {
						options: options ? options.uploadConfigs : {},
						getExtension: options && angular.isFunction(options.getExtension) ? options.getExtension : getExtension
					};

					let service = defaultService,
						uploadStatus = {
							success: 'success',
							error: 'error',
							pending: 'pending',
							cancel: 'cancel',
							uploading: 'uploading',
							noFile: 'noFile'
						},
						allItemsSource = [],
						itemsSource = [],
						uploadingFileCount = 0,
						fileSelected = new PlatformMessenger(),
						uploadStarting = new PlatformMessenger(),
						uploadDone = new PlatformMessenger(),
						uploadCancelled = new PlatformMessenger(),
						uploadError = new PlatformMessenger(),
						uploadFinished = new PlatformMessenger(),
						startUploadProgress = new PlatformMessenger();

					// same as uploadStarting except transfer more arguments.
					service.onUploading = new PlatformMessenger();

					/**
					 * @ngdoc function
					 * @name getItemsSource
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description create UploadItem instance then put it into the queue and upload files from the beginning.
					 * @returns {Array} file to upload
					 */
					service.getItemsSource = function getItemsSource() {
						return itemsSource;
					};

					service.setItemsSource = function setItemsSource(newItemsSource) {
						itemsSource = newItemsSource;
					};

					service.getAllItemsSource = function getAllItemsSource() {
						return allItemsSource;
					};

					/**
					 * @ngdoc function
					 * @name selectFiles
					 * @function
					 *
					 * @description select files
					 * @fileOption {multiple: false, accept: '*.vcf', autoUpload: false}
					 * @formData option {id: 1}
					 */
					service.selectFiles = function selectFiles(fileOption, formData) {
						const defaultFileOption = {multiple: false, accept: '', autoUpload: false};
						fileOption = angular.extend(defaultFileOption, fileOption);
						const multiple = fileOption.multiple;
						const accept = fileOption.accept || service.getExtension();
						const autoUpload = fileOption.autoUpload;

						const fileInput = angular.element('<input type="file">');
						if (multiple) {
							fileInput.attr('multiple', 'multiple');
						}
						if (accept) {
							fileInput.attr('accept', accept);
						}
						fileInput.bind('change', function (e) {
							itemsSource = _.filter(itemsSource, function (i) {
								return i.status !== uploadStatus.error;
							});

							allItemsSource = _.filter(allItemsSource, function (i) {
								return i.status !== uploadStatus.error;
							});

							const files = e.__files_ || (e.target && e.target.files);
							fileSelected.fire(files);

							if (autoUpload) {
								service.startUploadFiles(files, formData);
							}
						}).bind('destroy', function () {
							fileInput.unbind('change');
						});

						fileInput.click();
					};

					/**
					 * @ngdoc function
					 * @name startUploadFiles
					 * @function
					 *
					 * @description startUploadFiles
					 * @files files
					 * @formData option {id: 1}
					 */
					service.startUploadFiles = function startUploadFiles(files, formData) {

						service.uploadFiles(null, files, formData);
					};

					/*
					 * entity: not null
					 * fileType: file or [file] or fileType
					 * optionsNew:{action: 'Upload', SectionType : 'BusinessPartnerActivity', 'oneOffOptions': {needConsiderFileType: false, getExtension: function () { return '.d90, .d93, .d94'; }}}
					 */
					service.uploadFiles = function uploadFiles(entity, fileType, optionsNew, isAllowMultiple) {
						entity = entity || {};
						optionsNew = optionsNew || {};
						const uploadUrl = globals.webApiBaseUrl + 'basics/common/document/';
						const deferred = $q.defer();
						const oneOffOptions = optionsNew.oneOffOptions || {};
						let toUploadCount = 0;
						if (!angular.isUndefined(isAllowMultiple) && !_.isEmpty(isAllowMultiple)) {
							isAllowMultiple = 'multiple';
						} else {
							isAllowMultiple = '';
						}

						// files is null, so will go to select files from local.
						if (!fileType || angular.isString(fileType)) {
							angular.element('<input type="file"' + isAllowMultiple + '>').attr('accept', fileType)
								.bind('change', function handler(evt) {
									doUploadFiles(evt.__files_ || (evt.target && evt.target.files), fileType, entity);
								})
								.click();
						} else if (uploadingFileCount < maxUploadingFileCount) {
							// the data of parameter is already file or files.
							if (fileType instanceof Blob) { // if the fileType is not a string but a Blob,
								fileType = [fileType];      // it will be changed to an array of Blob as the property files in the function upload.
							}
							doUploadFiles(fileType);
						} else {
							deferred.resolve({});
						}

						// return promise.
						return deferred.promise;

						function checkFileType(files, fileType) {
							var result = true;
							angular.forEach(files, function (file) {
								const fileName = file.name;
								const suffix = fileName.substr(fileName.lastIndexOf('.'));
								const lowercaseSuffix = _.toLower(suffix);
								if (fileType.indexOf(lowercaseSuffix) === -1) {
									result = false;
								}
							});
							if (!result) {
								platformModalService.showDialog({
									templateUrl: globals.appBaseUrl + 'documents.project/partials/invalid-files-list.html',
									headerText: $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'),
									content: $translate.instant('documents.project.FileUpload.validation.FileExtensionNotMatchInfo'),
									backdrop: false
								});
							}
							return result;
						}
						// check whether need to compress files here.
						function doUploadFiles(files, fileType, entity) {
							oneOffOptions.needCompress = false;
							const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
							// check the file size according to the table BAS_DOCUMENT_TYPE.MAX_BYTE.
							// if the current uploading file exceed the limited file size, the upload will be aborted. The validation should be done before the file is uploading.
							if (CheckUploadSizeLimitation) {
								const sizeExceedFiles = getSizeExceedFiles(files, documentTypeItems);
								if (sizeExceedFiles.length !== 0) {
									var exceedFileNames = sizeExceedFiles.map(function (item) {
										return item.name;
									});
									var normalFils = _.filter(files, function (e) {
										return $.inArray(e.name, exceedFileNames) <= -1;
									});
									var hasValidFiles = normalFils.length !== 0;
									files = normalFils;
									showExceedFilesDialog(exceedFileNames, hasValidFiles).then(function (result) {
										if (result.ok) {
											uploadFileWithImageCompressCheck(files, documentTypeItems);
										}
									});
								} else {
									uploadFileWithImageCompressCheck(files, documentTypeItems);
								}
							} else {
								uploadFileWithImageCompressCheck(files, documentTypeItems);
							}
						}

						function uploadFileWithImageCompressCheck(files, documentTypeItems) {
							if (service.options.SectionType === 'Defect' || service.options.SectionType === 'DocumentsProject') {
								const exceedSizeImages = checkImageFileSizeExceed(files, documentTypeItems);
								// #110759, Enhancement of  the Defect Document Upload
								if (!_.isEmpty(exceedSizeImages)) {
									const fileStr = exceedSizeImages.join(',');
									showConfirmCompressDialog(fileStr).then(function (result) {
										if (result.yes) {
											oneOffOptions.needCompress = true;
										}
										startUploadProgress.fire();
										upload(files);
									});
								} else {
									startUploadProgress.fire();
									upload(files);
								}
							} else {
								startUploadProgress.fire();
								upload(files);
							}
						}

						// do some before update and do update.
						function upload(files) {
							itemsSource = _.filter(itemsSource, function (i) {
								return entity.Id !== i.entity.Id || i.status !== uploadStatus.error;
							});
							allItemsSource = _.filter(allItemsSource, function (i) {
								return entity.Id !== i.entity.Id || i.status !== uploadStatus.error;
							});
							let optionsToExtend = null;
							if (optionsNew) {
								for (let prop in optionsNew) {
									if (Object.prototype.hasOwnProperty.call(optionsNew, prop) && prop !== 'oneOffOptions') {
										if (!optionsToExtend) {
											optionsToExtend = {};
										}
										optionsToExtend[prop] = optionsNew[prop];
									}
								}
							}
							if (oneOffOptions.needCompress) {
								optionsToExtend = optionsToExtend || {};
								optionsToExtend.NeedCompress = true;
							}

							const uploadItemList = [];
							const createData = [];
							for (let index = 0, fileLength = files.length; index < fileLength; index++) {
								const file = files[index];
								// if( toUploadCount >= maxUploadingFileCount){
								// break;
								// }
								const uploadItem = new UploadItem(file, entity, uploadUrl + 'uploadfile', angular.extend({index: index}, service.options, optionsToExtend));
								uploadItemList.push(uploadItem);
								createData.push(uploadItem.config.fields);
								toUploadCount++;
							}
							if (uploadItemList.length === 0) {
								return deferred.resolve('No Files to Upload.');
							}
							// get Ids of documents.
							$http.post(globals.webApiBaseUrl + 'basics/common/document/getnewfilearchivedocids', createData).then(function response(res) {
								const data = res && res.data;
								if (!data || data.length === 0) {
									deferred.reject('Get Ids of Document Happen errors.');
									platformModalService.showErrorBox('basics.common.upload.failToGetNewFileArchiveDocId', 'cloud.common.errorMessage');
									return;
								}
								// start to upload files.
								angular.forEach(uploadItemList, function (uploadItem) {
									uploadItem.startTime = Date.now();
									uploadItem.config.fields.ExpectedChunkSize = UploadBase.translateScalars(resumeChunkSize);
									const index = uploadItem.config.fields.index;
									uploadItem.config.fields.FileArchiveDocId = data[index];
									itemsSource.push(uploadItem);
									allItemsSource.push(uploadItem);
									service.selectUploadItemByEntity(entity);
									uploadStarting.fire(uploadItem.file, uploadItem.entity);
									uploadNext();
								});
							}, function error() {
								uploadError.fire(null, entity);
								deferred.reject('Getting Ids of Document Happens errors.');
							});
						}

						function uploadNext() {
							const uploadItem = _.find(itemsSource, function (item) {
								return item.status === uploadStatus.pending;
							});
							// no files with such status pending and uploading.. it means upload done.
							if (!uploadItem && uploadingFileCount <= 0) {
								deferred.resolve('Upload Done or Uploading.');
								return;
							}
							if (!uploadItem) {
								return;
							}
							uploadItem.status = uploadStatus.uploading;
							uploadingFileCount += 1;
							uploadStarting.fire(uploadItem.file, uploadItem.entity);
							service.onUploading.fire({data: uploadItem});
							asyncUpload(uploadItem).then(function (data) {
								uploadDone.fire(null, uploadItem.entity);
								if (options && angular.isFunction(options.uploadFilesCallBack)) {
									if (Object.prototype.hasOwnProperty.call(uploadItem, 'CanDownload')) {
										uploadItem.CanDownload = false;
									}
									options.uploadFilesCallBack(uploadItem.entity, data);
									if (angular.isFunction(options.markItemAsModified)) {
										options.markItemAsModified(uploadItem.entity);
									}
								}
								const items = _.filter(itemsSource, function (i) {
									return i.status !== uploadStatus.error;
								});
								if (_.isEmpty(items)) {
									uploadFinished.fire();
								}
							});
						}

						function asyncUpload(uploadItem) {
							const defer = $q.defer();
							UploadBase.upload(uploadItem.config).then(function success(response) {
								if (uploadItem.status === uploadStatus.cancel) {
									if (toUploadCount <= 1) {
										deferred.reject();
									}
									defer.reject();
								} else {
									const result = angular.copy(uploadItem.config.fields);
									// angular.copy can not copy file object as expected.
									result.file = uploadItem.config.fields.file;
									angular.extend(result, response.data);
									defer.resolve(result);
									uploadItem.status = uploadStatus.success;
									service.deleteItem(uploadItem);
									if (toUploadCount <= 1) {
										deferred.resolve(result);
									}
								}
								uploadingFileCount -= 1;
								uploadNext();
							}, function error() {
								uploadError.fire(null, uploadItem.entity);
								uploadItem.status = uploadStatus.error;
								uploadingFileCount -= 1;
								service.deleteItem(uploadItem);
								defer.reject();
								uploadNext();
							}, function processBar(p) {
								if (!p.lengthComputable) {
									uploadItem.percentage = Math.floor(p.loaded / p.total * 100);
									uploadItem.restUploadTime = getTime((p.total - p.loaded) * (Date.now() - uploadItem.startTime) / 1000 / 1048576);
									uploadItem.startTime = Date.now();
								}
								// cancel on the way of uploading.
								if (uploadItem.status === uploadStatus.cancel) {
									uploadItem.config._finished = true;
									service.deleteItem(uploadItem);
									defer.reject();
									uploadNext();
								}
							});

							return defer.promise;
						}
					};

					/**
					 * @ngdoc function
					 * @name registerUploadDone
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that uploading is done.
					 * @param {Function} handler - callback function
					 */
					service.registerUploadDone = function registerUploadDone(handler) {
						uploadDone.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterUploadDone
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that uploading is done.
					 * @param {Function} handler - callback function
					 */
					service.unregisterUploadDone = function unregisterUploadDone(handler) {
						uploadDone.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name registerUploadCancelled
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that uploading is canceled.
					 * @param {Function} handler - callback function
					 */
					service.registerUploadCancelled = function registerUploadCancelled(handler) {
						uploadCancelled.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterUploadCancelled
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that uploading is canceled.
					 * @param {Function} handler - callback function
					 */
					service.unregisterUploadCancelled = function unregisterUploadCancelled(handler) {
						uploadCancelled.unregister(handler);
					};

					service.registerFileSelected = function registerFileSelected(handler) {
						fileSelected.register(handler);
					};
					service.unregisterFileSelected = function unregisterFileSelected(handler) {
						fileSelected.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name registerUploadStarting
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that uploading starts.
					 * @param {Function} handler - callback function
					 */
					service.registerUploadStarting = function registerUploadStarting(handler) {
						uploadStarting.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterUploadStarting
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that uploading starts.
					 * @param {Function} handler - callback function
					 */
					service.unregisterUploadStarting = function unregisterUploadStarting(handler) {
						uploadStarting.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name registerStartUploadProgress
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that whole upload propress started, this is not for each file upload started
					 * @param {Function} handler - callback function
					 */
					service.registerStartUploadProgress = function registerStartUploadProgress(handler) {
						startUploadProgress.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterStartUploadProgress
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that whole upload propress started, this is not for each file upload started
					 * @param {Function} handler - callback function
					 */
					service.unregisterStartUploadProgress = function unregisterStartUploadProgress(handler) {
						startUploadProgress.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name registerUploadError
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that uploading encounters error.
					 * @param {Function} handler - callback function
					 */
					service.registerUploadError = function registerUploadError(handler) {
						uploadError.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterUploadError
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that uploading encounters error.
					 * @param {Function} handler - callback function
					 */
					service.unregisterUploadError = function unregisterUploadError(handler) {
						uploadError.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name registerUploadFinished
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description register messenger for events that uploading finished.
					 * @param {Function} handler - callback function
					 */
					service.registerUploadFinished = function registerUploadFinished(handler) {
						return uploadFinished.register(handler);
					};

					/**
					 * @ngdoc function
					 * @name unregisterUploadFinished
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description unregister messenger for events that uploading finished.
					 * @param {Function} handler - callback function
					 */
					service.unregisterUploadFinished = function unregisterUploadFinished(handler) {
						uploadFinished.unregister(handler);
					};

					/**
					 * @ngdoc function
					 * @name getUploadStatus
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description get upload status
					 * @param {Object} entity to map to the UploadItem instance.
					 * @returns {string} the upload status. if the UploadItem is not found, return pending.
					 */
					service.getUploadStatus = function getUploadStatus(entity) {
						const item = findItem(entity);
						if (item) {
							return item.status;
						}
						return uploadStatus.noFile;
					};

					/**
					 * @ngdoc function
					 * @name clear
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description cancel all the uploading UploadItem instances and remove all the instances from the queue.
					 */
					service.clear = function clear() {
						cancelAll();
						itemsSource = [];
						allItemsSource = [];
					};

					/**
					 * @ngdoc function
					 * @name selectUploadItemByEntity
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description select the UploadItem instance according to the entity.
					 * @param {Object} entity to map to the UploadItem instance.
					 */
					service.selectUploadItemByEntity = function selectUploadItemByEntity(entity) {
						if (entity) {
							for (let i = 0; i < itemsSource.length; ++i) {
								const item = itemsSource[i];
								item.isSelected = entity.Id === item.entity.Id;
							}
						}
					};

					/**
					 * @ngdoc function
					 * @name cancelUpload
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description cancel uploading UploadItem.
					 * @param {Object} uploadItem - uploading UploadItem to be canceled
					 */
					function cancelUpload(uploadItem) {
						uploadItem.status = uploadStatus.cancel;
						// e, args, scope
						uploadCancelled.fire(uploadItem.file, uploadItem.entity);
					}

					function checkImageFileSizeExceed(files, documentTypeItems) {
						const exceedSizeImages = [];
						angular.forEach(files, function (file) {

							const fileName = file.name;
							const suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length - 1);
							const lowercaseSuffix = _.toLower(suffix);
							const docType = _.find(documentTypeItems, function (item) {
								return item.Extention !== null && item.Extention.indexOf(lowercaseSuffix) !== -1;
							});
							const imageType = _.find(imageTypes, function (item) {
								return item === suffix;
							});
							if (docType && docType.MaxByte !== 0 && file.size > docType.MaxByte && imageType !== null && imageType !== undefined) {
								exceedSizeImages.push(fileName);
							}
						});
						return exceedSizeImages;

					}

					function getSizeExceedFiles(files, documentTypeItems) {
						const exceedSizeFiles = [];
						angular.forEach(files, function (file) {
							const fileName = file.name;
							const suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length - 1);
							const lowercaseSuffix = _.toLower(suffix);
							const docType = _.find(documentTypeItems, function (item) {
								return item.Extention !== null && item.Extention.indexOf(lowercaseSuffix) !== -1;
							});
							if (docType && docType.MaxByte !== 0 && file.size > docType.MaxByte) {
								exceedSizeFiles.push(file);
							}
						});
						return exceedSizeFiles;
					}

					/**
					 * @ngdoc function
					 * @name deleteItem
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description delete the UploadItem instance.
					 * @param {UploadItem} uploadItem - the UploadItem instance.
					 */
					service.deleteItem = function deleteItem(uploadItem) {
						const item = uploadItem.status ? uploadItem : findItem(uploadItem);
						if (item.status === uploadStatus.uploading) {
							cancelUpload(item);
						}

						removeItem(item);
					};

					/**
					 * @ngdoc function
					 * @name deleteUploadItemByEntity
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description delete the UploadItem instance according to the entity.
					 * @param {Object} entity to map to the UploadItem instance.
					 */
					service.deleteUploadItemByEntity = function deleteUploadItemByEntity(entity) {
						const item = findItem(entity);
						if (item) {
							service.deleteItem(item);
						}
					};

					function removeItem(uploadItem) {
						const itemIndex = itemsSource.indexOf(uploadItem);
						if (itemIndex > -1) {
							itemsSource.splice(itemIndex, 1);
						}

						const allItemIndex = allItemsSource.indexOf(uploadItem);
						if (allItemIndex > -1) {
							allItemsSource.splice(allItemIndex, 1);
						}
					}

					function findItem(entity) {
						let found = null;
						for (let i = 0; i < itemsSource.length; ++i) {
							const item = itemsSource[i];
							if (_.isNil(item) || _.isNil(item.entity)) {
								continue; // skip item if its entity is undefined
							}
							if (entity.Id === item.entity.Id) {
								found = item;
								break;
							}
						}

						return found;
					}

					function cancelAll() {
						for (let i = 0; i < itemsSource.length; ++i) {
							const item = itemsSource[i];
							if (item.status === uploadStatus.uploading) {
								cancelUpload(item);
							}
						}

						for (let j = 0; j < allItemsSource.length; ++j) {
							const allItem = allItemsSource[j];
							if (allItem.status === uploadStatus.uploading) {
								cancelUpload(allItem);
							}
						}
					}

					function UploadItem(file, entity, url, fields) {
						this.file = file;
						this.uploadOptions = {fileInfo: {fileName: file.name}};
						this.status = uploadStatus.pending;
						this.entity = entity;
						this.percentage = 0;
						this.isSelected = false;
						this.restUploadTime = '';
						this.config = {
							url: url,
							file: file,
							resumeChunkSize: resumeChunkSize,
							resumeSize: function () {
								const defer = $q.defer();
								this._end = this._chunkSize;
								defer.resolve(0);
								return defer.promise;
							},
							fields: angular.extend({
								action: 'Upload',
								SectionType: '',
								fileName: file.name,
								fileType: file.type
							}, fields)
						};
					}

					function showConfirmCompressDialog(fileName) {
						const modalOptions = {
							headerTextKey: $translate.instant('basics.common.compressDialogTitle'),
							bodyTextKey: $translate.instant('basics.common.exceedImagesMessage', {p1: fileName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						return platformModalService.showDialog(modalOptions);
					}

					function showExceedFilesDialog(fileNames, hasValidFiles) {
						const modalOptions = {
							headerTextKey: $translate.instant('basics.common.compressDialogTitle'),
							templateUrl: globals.appBaseUrl + 'basics.common/templates/exceed-file-report.html',
							iconClass: 'info',
							exceedFileNames: fileNames.toString(),
							hasValidFiles: hasValidFiles
						};
						return platformModalService.showDialog(modalOptions);
					}

					function getTime(time) {
						const h = parseInt((time / 3600).toString());
						const m = parseInt((time % 3600 / 60).toString());
						const s = parseInt((time % 3600 % 60).toString());
						return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
					}

					return service;
				}

				return {
					/**
					 * @ngdoc function
					 * @name create
					 * @function
					 *
					 * @methodOf basicsCommonFileUploadServiceFactory
					 * @description create upload file service instance
					 */
					createService: create
				};

				// /////////////////////////////////

				function loadDocumentType() {
					const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
					if (!documentTypes) {
						basicsLookupdataLookupDescriptorService.loadData('DocumentType');
					}
				}
			}
		]);
})(angular);
