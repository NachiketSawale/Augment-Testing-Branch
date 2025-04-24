/* globals angular, globals */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	angular.module(moduleName).directive('basicsWorkflowDocumentsFileUpload',
		['_',
			function (_) {
				return{
					restrict: 'EA',
					require: 'ngModel',
					scope: {
						options: '=',
						Model:'=',
						entity:'='
					},
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-upload.html',
					link: function (scope, elem, attr, ctrl) {
						scope.$setViewValue = ctrl.$setViewValue;
					}
				};
			}]);

	angular.module(moduleName).directive('basicsWorkflowDocumentsFileUploadLookup',
		['_', 'basicsWorkflowMultiDocumentsFileUploadService', 'basicsWorkflowEditModes',
			'basicsLookupdataLookupDescriptorService', 'documentsProjectDocumentFileUploadDataService',
			function (_, fileUploadDataService, basicsWorkflowEditModes, basicsLookupdataLookupDescriptorService,
				documentsProjectDocumentFileUploadDataService) {
				return {
					restrict: 'EA',
					scope: {
						options: '='
					},
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-upload-lookup.html',
					link: linker
				};

				function linker(scope, element) {
					function filesHaveBeenUploadedReaction(e, args) {
						if (fileUploadDataService.isDragOrSelect === 'select') {
							var data = args.data;
							scope.$emit('fileChosen', data);
						}
					}

					fileUploadDataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);

					// selected lookup items.
					scope.selectedItems = fileUploadDataService.getSelectedFile(scope.options.parentScope.$id);

					// get label for each selected item
					scope.getLabel = function (dataItem) {
						return dataItem.name;
					};

					// clear selected items, override function defined in lookup-input-base.js
					scope.clearValue = function () {
						scope.selectedItems.length = 0;
						fileUploadDataService.setSelectedFile(scope.options.parentScope.$id, scope.selectedItems);
					};

					// delete a selected item
					scope.deleteItem = function (dataItem) {
						scope.selectedItems = scope.selectedItems.filter(function (item) {
							return item !== dataItem;
						});
						fileUploadDataService.setSelectedFile(scope.options.parentScope.$id, scope.selectedItems);
					};

					function uploadMultiFiles(uploadService, editorMode) {
						var basDocumentTypeArray = documentsProjectDocumentFileUploadDataService.getBasDocumentTypeArray();
						var allSupportedFileTypeIds = _.map(basDocumentTypeArray, function (item) {
							return item.Id;
						});
						var allSupportedFileExtensions = _.map(allSupportedFileTypeIds, function (item) {
							return uploadService.getExtension(basDocumentTypeArray, item);
						});
						allSupportedFileExtensions = _.filter(allSupportedFileExtensions, function (item) {
							return !!item;
						});
						var fileExtensionArray = allSupportedFileExtensions;
						fileExtensionArray = _.map(fileExtensionArray, function (item) {
							return item.replace(/[*.\s]/g, '');
						});
						var finalFileExtensionArray = [];
						for (var i = 0; i < fileExtensionArray.length; i++) {
							if (fileExtensionArray[i].indexOf(';') !== -1) {
								finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(';'));
							} else if (fileExtensionArray[i].indexOf(',') !== -1) {
								finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(','));
							} else {
								finalFileExtensionArray.push(fileExtensionArray[i]);
							}
						}
						documentsProjectDocumentFileUploadDataService.getSupportedMimeTypeMapping().then(function (res) {
							var supportedMimeTypeMapping = res;
							var supportedMimeTypesForAcceptAttr = _.map(finalFileExtensionArray, function (fileExtension) {
								var attrValue = supportedMimeTypeMapping[fileExtension];

								return attrValue ? attrValue : null;
							});
							supportedMimeTypesForAcceptAttr = _.filter(supportedMimeTypesForAcceptAttr, function (item) {
								return item !== null;
							});
							if (!!supportedMimeTypesForAcceptAttr && !!supportedMimeTypesForAcceptAttr.length && supportedMimeTypesForAcceptAttr.length > 0) {
								var supportedMimeTypesForAcceptAttrString = supportedMimeTypesForAcceptAttr.join(',');
								var fileOption = {
									multiple: editorMode !== basicsWorkflowEditModes.default,
									autoUpload: false,
									accept: supportedMimeTypesForAcceptAttrString
								};
								uploadService.selectFiles(fileOption);
							}
						});
					}

					scope.chooseFile = function () {
						scope.options.parentScope.isClicked = true;
						var uploadService = fileUploadDataService.getUploadService();
						uploadMultiFiles(uploadService, scope.options.option.editorMode);
					};

					var input = element.find('input');

					element.bind('focus', function () {
						input.focus();
					});

					input.bind('focus', function () {
						element.css({
							outline: '-webkit-focus-ring-color auto 5px'
						});
					});

					input.bind('blur', function () {
						element.css({
							outline: 'none'
						});
					});

					adjustStyle(scope, element);

					scope.$on('$destroy', function () {
					});
				}

				function adjustStyle(scope, element) {
					var container = element.parent('.lookup-container');

					container.css({
						height: 'initial'
					});

					scope.$watch(function () {
						return container.find('.input-group-btn').length;
					}, function () {
						container.find('.input-group-btn').css({
							height: '100%'
						});
					});

					function adjust() {
						var searchBox = element.find('.search-box');

						if (searchBox.length) {
							var offsetTop = 0;
							var items = element.find('.multiple-item');
							var btn = element.find('.input-group-btn');
							var totalWidth = element.find('.multiple-container').width();
							var btnWidth = btn.width(), occupiedWidth = 0,
								remainedWidth = 0, minWidth = 40;

							if (items.length) {
								offsetTop = items[items.length - 1].offsetTop;

								items.each(function (i, item) {
									if (offsetTop === item.offsetTop) {
										occupiedWidth += item.offsetWidth;
									}
								});

								var extra = searchBox.outerWidth(true) - searchBox.width();
								remainedWidth = totalWidth - occupiedWidth - btnWidth - extra;

								if (remainedWidth > minWidth) {
									searchBox.css({
										width: remainedWidth + 'px'
									});
								}
							} else {
								searchBox.css({
									width: remainedWidth + 'px'
								});
							}
						}
					}

					scope.$watch(function () {
						return element.find('.multiple-item').length;
					}, function () {
						setTimeout(adjust);
					});
				}
			}]);
})(angular);
