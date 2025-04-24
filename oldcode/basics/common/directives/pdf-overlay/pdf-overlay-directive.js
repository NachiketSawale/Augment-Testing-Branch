(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonPdfOverlay', main);

	main.$inject = ['_', 'documentsProjectDocumentDataService', '$http', '$timeout', '$', 'globals'];

	function main(_, documentsProjectDocumentDataService, $http, $timeout, $, globals) {

		function link($scope, $element) {
			var frameContent;
			$scope.height = 0;
			$scope.width = 0;
			$scope.annotationList = [];
			var loadedDoc = null;

			var containerScope = getContainerScope();
			var moduleName = containerScope.getContentValue('currentModule');
			var documentDataService = documentsProjectDocumentDataService.getService({moduleName: moduleName});
			containerScope.onContentResized(setDimension);
			if (!documentDataService) {
				throw 'No Documentservice available for this module';
			}

			function setDimension() {
				var dims = $scope.dimensionFn();
				$scope.height = dims.height;
				$scope.width = dims.width;
				$($element).find('iframe').height($scope.height).width($scope.width);
				initPdf();
			}

			var dimensionFn = $scope.dimensionFn;
			if (!_.isFunction(dimensionFn)) {
				throw 'Can not determine dimensions, please provide a dimensionFn returning a height and a width';
			}

			var entityData = {};

			var selectionChangeHandler = function (nothing, documentEntity) {
				entityData = documentEntity;
				if (documentEntity && (documentEntity.FileArchiveDocFk || documentEntity.ArchiveElementId)) {
					documentDataService.getPreviewConfig(documentEntity).then(function (config) {
						releasePdf().then(function () {
							// documentType 1 & 8 is pdf
							if (frameContent && config && config.src && (config.documentType === 8 || config.documentType === 1)) {
								frameContent.pdfjsLib.getDocument(config.src).promise.then(function (pdf) {
									frameContent.PDFViewerApplication.load(pdf, 1.0);
									loadedDoc = pdf;
								});
							} else {
								releasePdf();
							}
						});
					});
				} else {
					if(frameContent !== undefined){
						frameContent.location.reload();
						releasePdf();
					}

				}
			};

			setDimension();

			function getContainerScope() {
				var tempScope = $scope;
				var counter = 0;
				while (!_.isFunction(tempScope.getContentValue) && counter < 10) {
					tempScope = $scope.$parent;
					counter++;
				}
				return tempScope;
			}

			function releasePdf() {
				var promise = null;
				if (loadedDoc) {
					loadedDoc.destroy();
				}
				if (frameContent.PDFViewerApplication) {

					promise = frameContent.PDFViewerApplication.close();

				} else {
					var defer = $.Deferred();
					defer.resolve();
					promise = defer.promise();
				}
				return promise;
			}

			documentDataService.registerSelectionChanged(selectionChangeHandler);
			documentDataService.updatePdfMarkerContainer.register(selectionChangeHandler);

			// in readOnly mode annotation can not be modified
			var showReadonly = false;

			function mergeAnnotation(annotation2Merge) {
				var annotation2Update = _.find($scope.annotationList, function findAnnotation(annotation) {
					return annotation.id === annotation2Merge.id;
				});
				_.assign(annotation2Update, annotation2Merge);
				annotation2Update.text = annotation2Merge.editText;
				annotation2Update.bgColor = annotation2Merge.backgroundColor;
				annotation2Update.left = Math.round(annotation2Update.left);
				annotation2Update.top = Math.round(annotation2Update.top);
				annotation2Update.height = Math.round(annotation2Update.height);
				annotation2Update.width = Math.round(annotation2Update.width);
				annotation2Update.borderColor = parseInt(annotation2Update.borderColor, 16);
				delete annotation2Update.source;
				return annotation2Update;
			}

			var updateCallback = function (updatedAnnotation) {

				var defer = $.Deferred();
				var annotation2Update = mergeAnnotation(updatedAnnotation);
				$http({
					url: globals.webApiBaseUrl + 'basics/common/document/annotation/updateAnnotation',
					method: 'POST',
					data: annotation2Update
				}).then(function (result) {
					var annotation = result.data;
					mergeAnnotation(annotation);
					defer.resolve();
				});
				return defer.promise();
			};

			var deleteCallback = function (marker) {
				var defer = $.Deferred();
				$http({
					url: globals.webApiBaseUrl + 'basics/common/document/annotation/deleteAnnotation',
					method: 'POST',
					data: {EntityId: marker.id}
				}).then(function () {
					_.remove($scope.annotationList, function (annotation) {
						return marker.id === annotation.id;
					});
					defer.resolve();
				});
				return defer.promise();
			};

			var openCallback = function (/** marker */) {
				var defer = $.Deferred();
				setTimeout(function () {
					// Falls das Editieren erlaubt ist,
					// wird diese Funktion aufgerufen,
					// wenn man die Annotation bearbeiten möchten
					defer.resolve();
				}, 500);

				return defer.promise();
			};

			var createFunction = function (marker) {
				var annotationStub = {
					elementId: marker.id,
					top: Math.round(marker.top),
					left: Math.round(marker.left),
					width: Math.round(marker.width),
					height: Math.round(marker.height),
					page: marker.page,
					sourceId: marker.source.sourceId,
					maskId: marker.source.maskId,
					isPin: marker.source.isPin,
					zIndex: marker.index,
					text: marker.source.text,
					title: marker.source.title,
					icon: marker.source.icon,
					iconSize: marker.source.iconSize,
					iconColor: marker.source.iconColor,
					iconPos: marker.source.iconPos,
					fontSize: marker.fontSize,
					borderStyle: marker.source.borderStyle,
					borderWidth: marker.source.borderWidth,
					borderColor: marker.source.borderColor,
					borderRadius: marker.source.borderRadius,
					bgColor: marker.source.bgColor,
					isHTMLStamp: marker.source.isHtml,
					allowUserColor: true,
					allowFontResize: true,
					allowResize: true,
					allowEdit: true,
					allowTextEdit: true,
					allowDelete: true,
					allowOpen: true,
					inactive: false,
					keepRatio: true,
					callbacks: {
						update: updateCallback,
						delete: deleteCallback,
						open: openCallback
					},
					fileArchiveDocFk: documentDataService.getSelected().FileArchiveDocFk
				};
				var defer = $.Deferred();
				$http({
					url: globals.webApiBaseUrl + 'basics/common/document/annotation/createAnnotation',
					method: 'POST',
					data: annotationStub
				}).then(function (result) {
					var annotation = result.data;
					prepareAnnotation(annotation);
					$scope.annotationList.push(annotation);
					focusAnnotation(frameContent.addAnnotation(annotation));
					defer.resolve(annotation);
				});

				return defer.promise();
			};

			var textFunction = function (text) {
				// Kann genutzt werden um eventuell Platzhalter zu ersetzten oder Texte zu übersetzen
				return text;
			};

			// bsp: Annotationsquellen

			var markerSource = [{
				sourceId: 1,
				maskId: 1,
				title: 'Area',
				text: '',
				icon: 'fa-adjust',
				iconSize: 12,
				iconColor: '#3f3151',
				iconPos: 'LEFT',
				fontSize: 12,
				width: null,
				height: null,
				borderStyle: 'solid',
				borderWidth: 1,
				borderColor: parseInt('#333', 16),
				borderRadius: 2,
				bgColor: '#e5e0ec',
				isPin: false,
				isHtml: false,
				allowUserColor: true,
				allowFontResize: true,
				inlineEdit: false,
				allowResize: true,
				allowTextEdit: true,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 2,
				maskId: 2,
				title: 'Pin 1',
				text: 'Pin 1',
				icon: 'fa-map-marker',
				iconSize: 12,
				iconColor: '#1094bd',
				iconPos: 'LEFT',
				fontSize: 12,
				width: 12,
				height: 12,
				borderStyle: 'none',
				borderWidth: 1,
				borderColor: parseInt('#333', 16),
				borderRadius: 2,
				bgColor: '#e5e0ec',
				isPin: true,
				isHtml: false,
				allowUserColor: true,
				allowFontResize: true,
				inlineEdit: false,
				allowResize: true,
				allowEdit: true,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 3,
				maskId: 2,
				title: 'Pin 2',
				text: 'Icon 2 --> typ fa-pencil',
				icon: 'fa-pencil',
				iconSize: 12,
				iconColor: '#0ce675',
				iconPos: 'LEFT',
				fontSize: 12,
				width: 12,
				height: null,
				borderStyle: 'none',
				borderWidth: 1,
				borderColor: parseInt('#333', 16),
				borderRadius: 2,
				bgColor: '#e5e0ec',
				isPin: true,
				isHtml: false,
				allowUserColor: true,
				inlineEdit: false,
				allowFontResize: true,
				allowResize: true,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 4,
				maskId: 2,
				title: 'Pin 3',
				text: 'Icon 3 --> typ fa-long-arrow-left',
				icon: 'fa-long-arrow-left',
				iconSize: 12,
				iconColor: '#cc6806',
				iconPos: 'LEFT',
				fontSize: 12,
				width: null,
				height: null,
				borderStyle: 'dotted',
				borderWidth: 1,
				borderColor: parseInt('#ffcd9d', 16),
				borderRadius: 2,
				bgColor: '#e5e0ec',
				isPin: true,
				isHtml: false,
				allowUserColor: true,
				inlineEdit: false,
				allowFontResize: true,
				allowResize: true,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 5,
				maskId: 1,
				title: 'Area Fix',
				text: '',
				icon: null,
				iconSize: 12,
				iconColor: '#3f3151',
				iconPos: 'LEFT',
				fontSize: 12,
				width: 230,
				height: 120,
				borderStyle: 'DOUBLE',
				borderWidth: 3,
				borderColor: parseInt('#999', 16),
				borderRadius: 2,
				bgColor: 'rgba(255, 250, 143, 0.75)',
				isPin: false,
				isHtml: false,
				allowUserColor: true,
				allowFontResize: true,
				allowResize: true,
				inlineEdit: false,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 6,
				maskId: 1,
				title: 'Correct',
				text: '<i class="fa fa-check" style="color: #0ce675;"></i>',
				icon: 'fa fa-check',
				iconSize: 12,
				iconColor: '#0ce675',
				iconPos: 'LEFT',
				fontSize: 12,
				width: 20,
				height: 20,
				borderStyle: 'none',
				borderWidth: 1,
				borderColor: parseInt('#333', 16),
				borderRadius: 2,
				bgColor: 'transparent',
				isPin: false,
				isHtml: false,
				allowUserColor: true,
				allowFontResize: false,
				allowResize: false,
				inlineEdit: false,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}, {
				sourceId: 7,
				maskId: 1,
				title: 'Wrong',
				text: '',
				icon: 'fa fa-times',
				iconSize: 12,
				iconColor: 'transparent',
				iconPos: 'LEFT',
				fontSize: 12,
				width: null,
				height: null,
				borderStyle: 'none',
				borderWidth: 0,
				borderColor: parseInt('#333', 16),
				borderRadius: 2,
				bgColor: '#e5e0ec',
				isPin: false,
				isHtml: false,
				allowUserColor: true,
				allowFontResize: true,
				allowResize: true,
				allowTextEdit: true,
				inlineEdit: true,
				callbacks: {
					create: createFunction,
					text: textFunction
				}
			}];

			function focusAnnotation(uid) {
				frameContent.focusAnnotation(uid);
			}

			function init(frameContent, that, pinCount, storedAnnotations, showReadonly, openCallBack) {
				frameContent.init(
					that,
					10,
					null,
					showReadonly,
					openCallBack
				);
			}

			function loadAndAddAnnotations() {
				var selectedDoc = documentDataService.getSelected();
				if (selectedDoc !== null && selectedDoc !== undefined) {
					var docId = selectedDoc.FileArchiveDocFk;
					$http({
						url: globals.webApiBaseUrl + 'basics/common/document/annotation/listAnnotationByDocId',
						method: 'POST',
						data: {EntityId: docId}
					}).then(function (result) {
						$scope.annotationList = [];
						$.each(result.data, function (i, annotation) {
							var marker = getMarkerSourceById(annotation.sourceId);
							if (marker !== undefined) {
								prepareAnnotation(annotation);
								$scope.annotationList.push(annotation);
								frameContent.addAnnotation(annotation);
							}
						});
					});
				}

			}

			function prepareAnnotation(annotation) {
				annotation.callbacks = {
					update: updateCallback,
					delete: deleteCallback,
					open: openCallback
				};

				annotation.elementId = annotation.id;
				var marker = getMarkerSourceById(annotation.sourceId);
				annotation.iconColor = annotation.iconColor ? annotation.iconColor : marker.iconColor;
				annotation.icon = marker.icon;
				annotation.iconPos = marker.iconPos;
				annotation.inlineEdit = marker.inlineEdit;
				annotation.allowResize = true;
				annotation.borderColor = annotation.borderColor ? annotation.borderColor.toString(16) : '#000';
			}

			function getMarkerSourceById(id) {
				return _.find(markerSource, {sourceId: id});
			}

			function pdfLoadedCallback() {
				loadAndAddAnnotations();
			}

			// to load pdf onclick of full screen button
			function initPdf() {
				var documentEntity = documentDataService.getSelected() !== null ? documentDataService.getSelected(): entityData;
				if(documentEntity !== undefined) {
					selectionChangeHandler(null, documentEntity);
				}
				else{
					selectionChangeHandler(null, entityData);
				}
			}

			$(document).ready(function () {
				$('#docViewer').on('load', function () {
					var that = $(this);
					frameContent = document.getElementById('docViewer').contentWindow;
					frameContent.document.pdfLoadedFn = pdfLoadedCallback;
					init(frameContent, that, 10, null, false, null);

					var addSource = function () {
						var selectedDoc = documentDataService.getSelected();
						if (selectedDoc && (selectedDoc.FileArchiveDocFk !== null || selectedDoc.ArchiveElementId)) {
							$.each(markerSource, function (i, m) {
								frameContent.addAnnotationSource(m);
							});
						}
					};
					addSource();

					$('#refreshIframe').on('click', function () {
						var storedAnnotations = frameContent.getAnnotationList();
						frameContent.location.reload();

						that.off('load').on('load', function () {
							init(that, 10, storedAnnotations, showReadonly, null);
							addSource();
						});
					});
				});
			});

			$timeout(initPdf, 3000);

			$scope.$on('$destroy', function link() {
				documentDataService.unregisterSelectionChanged(selectionChangeHandler);
				documentDataService.updatePdfMarkerContainer.unregister(selectionChangeHandler);
				frameContent.PDFViewerApplication.close();
			});
		}

		return {
			restrict: 'A',
			scope: {
				dimensionFn: '='
			},
			link: link,
			templateUrl: window.location.pathname + 'PdfOverlay/index.html'
		};
	}

})(angular);