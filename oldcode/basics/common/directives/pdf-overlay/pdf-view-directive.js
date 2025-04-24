(function (angular) {
	'use strict';

	angular.module('basics.common').directive('pdfView', ['$timeout', '$window', '$document', '$rootScope', '$stateParams', '$http', 'modelWdeViewerPreviewDataService', '_', 'globals', '$',
		function ($timeout, $window, $document, $rootScope, $stateParams, $http, modelWdeViewerPreviewDataService, _, globals, $) {

			function link($scope, $element) {
				var frameContent;
				$scope.height = 0;
				$scope.width = 0;
				$scope.annotationList = [];
				var loadedDoc = null;
				var documentDefinition = {config: {}};

				function getDocumentDefinition() {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
						.then(function (result) {
							const documentPreviewImageData = _.filter(result.data, {FilterName: 'Document Preview Image'});
							if (documentPreviewImageData && documentPreviewImageData[0]) {
								documentDefinition = JSON.parse(documentPreviewImageData[0].FilterDef);
								if (documentDefinition) {
									const config = documentDefinition.config;
									loadPdf(config.src);
								} else {
									$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + $stateParams.docid).then(function (result) {
										loadPdf(result.data);
										documentDefinition.config.src = result.data;
									});
									modelWdeViewerPreviewDataService.getFileName($stateParams.docid).then(function (res) {
										documentDefinition.config.title = (res && res.data) ? res.data : res;
									});
								}
							}
						});
				}

				getDocumentDefinition();

				function loadPdf(url) {
					if (frameContent && frameContent.pdfjsLib && frameContent.pdfjsLib.getDocument && url) {
						frameContent.pdfjsLib.getDocument(url).promise.then(function (pdf) {
							frameContent.PDFViewerApplication.load(pdf, 1.0);
							frameContent.PDFViewerApplication.setTitleUsingUrl(documentDefinition.config.src);
							loadedDoc = pdf;
						});
					} else {
						releasePdf();
					}
				}

				function releasePdf() {
					let promise = null;
					if (loadedDoc) {
						loadedDoc.destroy();
					}
					if (frameContent && frameContent.PDFViewerApplication) {

						promise = frameContent.PDFViewerApplication.close();

					} else {
						let defer = $.Deferred();
						defer.resolve();
						promise = defer.promise();
					}
					return promise;
				}

				function init(frameContent, that, pinCount, storedAnnotations, showReadonly, openCallBack) {
					frameContent.init(
						that,
						10,
						null,
						showReadonly,
						openCallBack
					);
					loadPdf(documentDefinition.config.src);
					$($element).find('iframe').height('100%');
					$('#docViewer').css('height', '100%');
				}

				function pdfLoadedCallback() {
					window.console.log(pdfLoadedCallback);
				}

				$(document).ready(function () {
					let docViewer = window.document.getElementById('docViewer');
					if (docViewer && docViewer.setAttribute){
						docViewer.setAttribute('sandbox', 'allow-scripts allow-modals allow-same-origin allow-downloads');
					}
					$('#docViewer').on('load', function () {
						var that = $(this);
						frameContent = document.getElementById('docViewer').contentWindow;
						frameContent.document.pdfLoadedFn = pdfLoadedCallback;
						init(frameContent, that, 10, null, false, null);

						$('#refreshIframe').on('click', function () {
							frameContent.location.reload();

							that.off('load').on('load', function () {
								init(that, 10, null, false, null);
							});
						});
					});
				});
				$scope.$on('$destroy', function link() {
					if (frameContent && frameContent.PDFViewerApplication) {
						frameContent.PDFViewerApplication.close();
					}
				});

			}

			return {
				restrict: 'E',
				replace: true,
				link: link,
				templateUrl: window.location.pathname + 'PdfOverlay/index.html'
			};
		}]);
})(angular);