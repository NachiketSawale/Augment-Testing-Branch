(function () {
	'use strict';

	angular.module('basics.common').directive('basicsCommonUploadProgressBar', ['$timeout', '$translate', '$templateCache', '$compile', 'basicsCommonFileUploadServiceLocator', 'platformTranslateService', 'platformGridAPI', '$',
		/* jshint -W072 */
		function ($timeout, $translate, $templateCache, $compile, basicsCommonFileUploadServiceLocator, platformTranslateService, platformGridAPI, $) {
			return {
				restrict: 'A',
				scope: {
					options: '='
				},
				link: function (scope, elem) {
					var uploadServiceKey = getUploadServiceKey();
					var uploadService = basicsCommonFileUploadServiceLocator.getService(uploadServiceKey);

					var defaultOptions = {
						uploadStatusVisible: true,
						restUploadTimeVisible: true,
						fileNameVisible: false,
						cancelButtonVisible: false,
						selectionStatusVisible: false,
						useFixedWidth: false,
						showSingleProgressBar: false
					};

					scope.itemsSource = [];
					scope.getItemsSourceLength = function getItemsSourceLength() {
						return scope.itemsSource.length;
					};

					var watchUnregister = scope.$watch(uploadService.getItemsSource, function (newValue) {
						scope.itemsSource = newValue;
					});

					var watchUnregister2 = scope.$watch(scope.getItemsSourceLength, function (newValue, oldValue) {
						if (oldValue !== newValue) {
							var gridId = getGridId();
							if (gridId) {
								$timeout(function () {
									platformGridAPI.grids.resize(gridId);
								});
							}
						}
					});

					scope.onCancel = function (item) {
						uploadService.deleteItem(item);
					};

					scope.showSelectionStatus = function showSelectionStatus() {
						return scope.options.selectionStatusVisible;
					};

					scope.showFileName = function showFileName() {
						return scope.options.fileNameVisible;
					};

					scope.showRestUploadTime = function showRestUploadTime() {
						return scope.options.restUploadTimeVisible;
					};

					scope.showUploadStatus = function showUploadStatus() {
						return scope.options.uploadStatusVisible;
					};

					scope.showCancelButton = function showCancelButton(item) {
						return item.status === 'uploading' && scope.options.cancelButtonVisible === true;
					};

					scope.showSelectImage = function showSelectImage(item) {
						return scope.options.selectionStatusVisible ? item.isSelected : false;
					};

					scope.showItem = function showItem(item) {
						if (scope.options.showSingleProgressBar) {
							return item.isSelected;
						}
						return true;
					};

					scope.showRemainingTime = function showRemainingTime(item) {
						return item.restUploadTime + ' ' + $translate.instant('basics.common.remain');
					};

					function getGridId() {
						var key = null;

						if (!key) {
							var parent = scope.$parent;
							var count = 0;
							while (count < 10 && !key && parent) {
								key = parent.gridId;
								parent = parent.$parent;
								count++;
							}
						}

						return key;
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

					function initialize() {
						scope.cancelButtonTooltip = $translate.instant('basics.common.upload.button.cancelUploadCaption');
						platformTranslateService.registerModule('basics.common');
						var tempOptions = {};
						$.extend(true, tempOptions, defaultOptions, scope.options);
						scope.options = tempOptions;

						if (scope.options.useFixedWidth) {
							scope.options.widthStyle = 'upd-progress-bar-fixed-width';
						} else {
							scope.options.widthStyle = 'upd-progress-bar-auto-width';
						}

						var template = $templateCache.get('upload-progress-bar.html');
						if (!template) {
							throw new Error('Template upload-progress-bar not found');
						}
						elem.append($compile(template)(scope));

						elem.on('$destroy', function () {
							if (watchUnregister) {
								watchUnregister();
							}

							if (watchUnregister2) {
								watchUnregister2();
							}
						});
					}

					initialize();
				}
			};
		}]
	);
})();
