/*
 * $Id: file-select-handler.js 606933 2020-10-14 09:17:37Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformFileSelectHandler
	 * @element div
	 * @requires $http, $compile, $timeout, $translate, platformModalService
	 * @restrict A
	 * @priority default value
	 * @description
	 * Inserts a control to select a file whose content is returned as a data stream. It is possible to delete the current selection.
	 */
	angular.module('platform').directive('platformFileSelectHandler', ['$http', '$compile', '$timeout', '$translate', 'platformModalService',
		function ($http, $compile, $timeout, $translate, platformModalService) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: true,
				link: linker
			};

			function linker(scope, elem, attrs, ngModelCtrl) {

				const inGrid = !_.isUndefined(attrs.grid);
				const config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				if (_.isUndefined(config.options)) {
					config.options = attrs.options ? scope.$eval(attrs.options) : {};
				}
				var tempMultiselectView = [];
				var resetMultiselectView = function resetView() {
					tempMultiselectView = [];
				};
				var updateMultiselectView = function updateMultiselectView(view) {
					tempMultiselectView.push(view);
					ngModelCtrl.$setViewValue(tempMultiselectView);
					// scope.name = selectedFile.name;
					scope.name = tempMultiselectView.map(function (view) {
						return view.name;
					}); // tempTextContent;
					scope.data = tempMultiselectView.map(function (view) {
						return view.data;
					});
					elem[0].querySelector('[name=fileName]').textContent = scope.name;
				};

				var updateNoneMultiselectView = function updateNoneMultiselectView(view) {
					ngModelCtrl.$setViewValue(view);
					scope.name = view.name;
					elem[0].querySelector('[name=fileName]').textContent = view.name;
				};

				ngModelCtrl.$render = function () {
					if (config.options.multiSelect) {
						if (ngModelCtrl.$viewValue) {

							if (_.isArray(ngModelCtrl.$viewValue)) {
								scope.data = ngModelCtrl.$viewValue.map(function (view) {
									return view.data;
								});
								scope.name = ngModelCtrl.$viewValue.map(function (view) {
									return view.name;
								});
							} else {
								scope.data = ngModelCtrl.$viewValue.data;
								scope.name = ngModelCtrl.$viewValue.name;
							}
						} else {
							scope.name = null;
							scope.data = null;
						}
					} else {
						if (ngModelCtrl.$viewValue) {
							scope.name = ngModelCtrl.$viewValue.name;
							scope.data = ngModelCtrl.$viewValue.data;
						} else {
							scope.name = null;
							scope.data = null;
						}
					}
				};

				if (config.options && config.options.multiSelect) {
					scope.multiSelect = config.options.multiSelect;
				} else {
					scope.multiSelect = false;
				}

				scope.btnDeleteTitle = $translate.instant('cloud.desktop.design.deleteBtnTitle');

				scope.deleteData = function () {
					ngModelCtrl.$setViewValue(null);
					scope.name = null;
				};

				scope.hasData = function () {
					return !!ngModelCtrl.$viewValue;
				};

				if (!attrs.change) {
					// change tracking on entity
					if (attrs.dirty || config.change) {
						attrs.change = attrs.config + '.rt$change()';
					}
				}

				function updateView(selectedFile, updateViewFunc) {
					var retrieveDataUrl = Boolean(config && config.options && config.options.retrieveDataUrl);

					function doUpdateView(readerInfo) {
						let newView = {
							name: selectedFile.name
						};
						if (config && config.options) {
							if (retrieveDataUrl) {
								newView.data = readerInfo.target.result;
							}
							if (config.options.retrieveFile) {
								newView.file = selectedFile;
							}
						}
						updateViewFunc(newView);
					}

					if (retrieveDataUrl) {
						var reader = new FileReader();
						reader.onload = doUpdateView;

						// Read in the file as a data URL.
						reader.readAsDataURL(selectedFile);
					} else {
						doUpdateView(null);
					}
				}

				scope.uploadFiles = function (files, errFiles) {
					scope.errFile = errFiles && errFiles[0];
					if (!scope.multiSelect && files.length === 1) {
						var file = files[0];
						// Only process the expected files
						if (!file.type.match(config.options.fileFilter)) {
							platformModalService.showMsgBox($translate.instant('cloud.desktop.design.errors.notAllowedMessage', {'type': file.type}), 'cloud.desktop.design.errors.invalidTitle', 'info');
							return;
						}

						updateView(file, updateNoneMultiselectView);
					} else if (scope.multiSelect) {
						resetMultiselectView();
						_.forEach(files, function (file) {
							// Only process the expected files
							if (!file.type.match(config.options.fileFilter)) {
								platformModalService.showMsgBox($translate.instant('cloud.desktop.design.errors.notAllowedMessage', {'type': file.type}), 'cloud.desktop.design.errors.invalidTitle', 'info');
								return;
							}

							updateView(file, updateMultiselectView);
						});
					} else if (scope.errFile) {
						var ex = scope.errFile;
						if (ex.$error === 'maxSize') {
							platformModalService.showMsgBox($translate.instant('cloud.desktop.design.errors.maxSizeMessage', {'name': ex.name, 'size': ex.$errorParam}), 'cloud.desktop.design.errors.invalidTitle', 'info');
						} else {
							// default error message
							platformModalService.showErrorBox($translate.instant('cloud.desktop.design.errors.defaultMessage', {'name': ex.name}), 'cloud.desktop.design.errors.defaultTitle');
						}
					}
				};
			}
		}]);
})();
