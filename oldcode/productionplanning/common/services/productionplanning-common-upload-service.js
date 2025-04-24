/**
 * Created by lav on 4/3/2019.
 */
/**
 * Created by lav on 2018-4-13.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonUploadService',
		['platformModalService',
			'$q',
			'basicsCommonServiceUploadExtension',
			'$http', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService',
			'$translate',
			/* jshint -W072 */
			function (platformModalService,
					  $q,
					  basicsCommonServiceUploadExtension,
					  $http, PlatformMessenger, basicsLookupdataLookupDescriptorService,
					  $translate) {

				function getFileExtension(fileName) {
					return fileName.substr(fileName.lastIndexOf('.') + 1);
				}

				function createNewService(option) {
					var service = {
						filesHaveBeenUploaded: new PlatformMessenger(),
						fileExtensionArray: null
					};
					var uploadOptions = {
						uploadFilesCallBack: uploadFilesCallBack,
						uploadServiceKey: option.uploadServiceKey,
						uploadConfigs: option.uploadConfigs
					};
					basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);

					service.onFileSelected = function (files) {
						if (!!files && !!files.length && files.length > 0) {
							var invalidFileExtension = [];
							var invalidFileLength = [];
							for (var prop in files) {
								if (Object.prototype.hasOwnProperty.call(files,prop) && !!(files[prop].name)) {
									var fileFullName = files[prop].name;
									var fileExtension = getFileExtension(fileFullName).toLowerCase();
									var findResult = false;
									for (var i = 0; i < service.fileExtensionArray.length; i++) {
										if (service.fileExtensionArray[i].Extention.toLowerCase() === fileExtension) {
											findResult = true;
											break;
										}
									}
									if (!findResult) {
										invalidFileExtension.push(fileFullName);
									}
									if (option.maxLengthFileName) {
										var fileName = fileFullName.substr(0, fileFullName.lastIndexOf('.'));
										if (fileName.length > 16) {
											invalidFileLength.push(fileFullName);
										}
									}
								}
							}
							if (invalidFileExtension.length > 0 || invalidFileLength.length > 0) {
								var errMsg = '';
								var separateChar = '&nbsp&nbsp&nbsp&nbsp*';
								if (invalidFileExtension.length > 0) {
									errMsg += '<b>' + $translate.instant('productionplanning.engineering.errors.fileExtensionsErrorInfo') + '</b><br/>' + separateChar + invalidFileExtension.join('<br/>' + separateChar);
								}
								if (invalidFileLength.length > 0) {
									if (errMsg) {
										errMsg += '<br/><br/>';
									}
									errMsg += '<b>' + $translate.instant('productionplanning.engineering.errors.fileLengthErrorInfo') + '</b><br/>' + separateChar + invalidFileLength.join('<br/>' + separateChar);
								}
								return errMsg;
							} else {
								service.getUploadService().startUploadFiles(files);
							}
						}
					};

					service.initialize = function () {
						service.getAllowExtentions().then(function (response) {
							initializeAllSupportedFileExtensionArray(response);
						});
					};

					service.getAllowExtentions = function () {
						return basicsLookupdataLookupDescriptorService.loadData('DocumentType');
					};

					function initializeAllSupportedFileExtensionArray(basDocumentTypeArray) {
						service.fileExtensionArray = [];
						var j = 0;
						for (var i in basDocumentTypeArray) {
							if (Object.prototype.hasOwnProperty.call(basDocumentTypeArray,i)) {
								var basDocumentTypeId = basDocumentTypeArray[i].Id;
								var fileExtention = basDocumentTypeArray[i].Extention;

								var tempArray = [];
								if (fileExtention) {
									if (fileExtention.indexOf(';') !== -1) {
										tempArray = fileExtention.split(';');
										for (j = 0; j < tempArray.length; j++) {
											service.fileExtensionArray.push({
												id: basDocumentTypeId,
												Extention: tempArray[j].replace(/[\*\.\s]/g, '') // eslint-disable-line
											});
										}
									} else if (fileExtention.indexOf(',') !== -1) {
										tempArray = fileExtention.split(',');
										for (j = 0; j < tempArray.length; j++) {
											service.fileExtensionArray.push({
												id: basDocumentTypeId,
												Extention: tempArray[j].replace(/[\*\.\s]/g, '') // eslint-disable-line
											});
										}
									} else {
										service.fileExtensionArray.push({
											id: basDocumentTypeId,
											Extention: fileExtention.replace(/[\*\.\s]/g, '') // eslint-disable-line
										});
									}
								}
							}
						}
					}

					function uploadFilesCallBack(currItem, data) {
						var args = {
							currItem: currItem,
							data: data
						};
						service.filesHaveBeenUploaded.fire(null, args);
					}

					return service;
				}

				return {
					createNewService: createNewService,
					getFileExtension: getFileExtension
				};
			}]);
})(angular);