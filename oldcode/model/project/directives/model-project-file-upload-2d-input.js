/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('model.project').directive('modelProjectFileUpload2dInput', ['_', '$http', '$compile', '$timeout',
		'$translate', 'basicsCommonFileUploadServiceLocator', 'platformModalService',
		function (_, $http, $compile, $timeout, $translate, basicsCommonFileUploadServiceLocator, platformModalService) {
			return {

				restrict: 'A',
				scope: {
					entity: '=',
					ngModel: '=',
					options: '='
				},
				link: linker,
				templateUrl: globals.appBaseUrl + 'model.project/templates/model-project-file-upload-2d-input.html'
			};

			function linker(scope, elem) {

				scope.file = {src: null};
				scope.viewContentLoading = false;

				var uploadMessage = $translate.instant('cloud.common.uploading');

				//set cssClass for overlay-container
				scope.css = 'spinner-inline-md spinner-span-nowrap';

				var uploadServiceKey = getUploadServiceKey();
				var basicsCommonFileUploadService = basicsCommonFileUploadServiceLocator.getService(uploadServiceKey);
				basicsCommonFileUploadService.registerUploadDone(onUploadFileDone);

				if (scope.options && scope.options.fileFilter) {
					scope.filter = scope.options.fileFilter;
				}
				if (scope.options && scope.options.canUpload) {
					scope.canUpload = scope.options.canUpload;
				} else {
					scope.canUpload = function () {
						return true;
					};
				}

				elem.on('$destroy', function () {
				});

				function onUploadFileDone(e, item) {
					scope.file.src = item.documentName;
					scope.ngModel = item.OriginFileName;
					reset();
				}

				function setMessage(message, fileName) {
					var displayMessage = message;
					if (!_.isEmpty(fileName)) {
						displayMessage = displayMessage.replace('##fileName##', fileName);
					}

					scope.info2 = displayMessage;
					scope.viewContentLoading = true;
				}

				function reset() {
					scope.file.src = null;
					scope.info2 = null;
					scope.viewContentLoading = false;
					scope.ngModel = null;
				}

				function getUploadServiceKey() {
					var key = null;
					if (scope.options) {
						key = scope.options.uploadServiceKey;
					}

					if (!key) {
						var parent = scope.$parent;
						var count = 0;
						while (count < 10 && !key && parent) {
							key = parent.uploadServiceKey;
							parent = parent.$parent;
							count++;
						}
					}

					return key;
				}

				scope.uploadFiles = function (file, errFiles) {

					scope.errFile = errFiles && errFiles[0];
					if (file) {
						reset();
						setMessage(uploadMessage, file.name);
						var fileName = file.name,
							suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1).toLowerCase();

						if (scope.options.fileFilter && scope.options.fileFilter.indexOf(suffix) !== -1) {

							basicsCommonFileUploadService.uploadFiles(scope.entity, file, scope.options.formData);

						} else {
							platformModalService.showErrorBox('model.project.errorNoSelection', 'model.project.errorTitle');
						}
					} else if (scope.errFile) {
						platformModalService.showErrorBox('model.project.errorNoSelection', 'model.project.errorTitle');
					}
				};
			}
		}]);
})(angular);
