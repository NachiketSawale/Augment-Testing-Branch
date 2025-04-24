/**
 * Created by wui on 12/20/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDrawingPreviewService', ['$http', '$window', 'platformModalService', 'platformContextService', 'globals', '$','basicsCommonPreviewTabService',
		function ($http, $window, platformModalService, platformContextService, globals, $, basicsCommonPreviewTabService) {
			const service = {};

			service.previewById = function previewById(docFileId, viewWindow3) {
				return showInWindowIframe(docFileId, viewWindow3, 'wdeviewer');
			};

			service.showImg = function showImg(docFileId, viewWindow3) {
				return showInWindowIframe(docFileId, viewWindow3, 'imgview');
			};

			service.showPdf = function showPdf(docFileId, viewWindow3) {
				return showInWindowIframe(docFileId, viewWindow3, 'pdfview');
			};

			function showInWindowIframe(docFileId, viewWindow3, viewModel) {
				/*
				var isShowThisTab = $injector.get('documentsProjectFileDefaultPreviewProgramService').isThisTab;
				var modelService = $injector.get('modelProjectModelDataService');
				var modelSelect = modelService.getSelected();
				if (isShowThisTab === true && !modelSelect) {
					var moduleContext = $injector.get('procurementContextService');
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'basics.common/templates/drawing/drawing-preview-dialog.html',
						controller: 'basicsCommonDrawingPreviewController',
						height: '60%',
						width: '600px',
						resolve: {
							'previewArgs': [
								function () {
									return {
										id: docFileId,
										fileArchiveDocFk: docFileId,
										moduleName: moduleContext.getModuleName()
									};
								}
							]
						},
						resizeable: true
					});
					return viewWindow3;
				}
				*/
				let companyCode = platformContextService.signedInClientCode;
				const roleId = platformContextService.getContext().permissionRoleId;
				const fragment = '#/' + viewModel + '?company=' + companyCode + '&roleid=' + roleId + '&docid=' + docFileId;
				const url = $window.location.origin + globals.appBaseUrl + fragment;
				if (!viewWindow3 || viewWindow3.closed) {
					viewWindow3 = basicsCommonPreviewTabService.openTab(url, 'mywindow3', 'noopener,noreferrer');
					if (viewWindow3) {
						viewWindow3.onbeforeunload = function onbeforeunload() {
							viewWindow3 = null;
						};
					}
				} else if (viewModel === 'wdeviewer') {
					try {
						viewWindow3.document.setAttribute('style', 'height: 100%');
						$(viewWindow3.document.body).css({
							width: '100%',
							height: '100%',
							overflow: 'hidden',
							padding: 0,
							margin: 0
						}).html('<iframe credentialless src="' + url + '" class="border-none fullheight fullwidth" width="100%" height="100%"></iframe>');
						if (viewWindow3.document.body) {
							viewWindow3.document.body.filearchivedocfk = docFileId;
						}
					} catch (e) {
						viewWindow3.location.href = url;
					}
				} else {
					try {
						viewWindow3.document.body.innerHTML = '<div id="loading" class="wait-overlay"><div class="box"><div class="spinner-lg"></div></div></div>';
						let iframeContent = viewWindow3.document.createElement('iframe');
						iframeContent.setAttribute('style', 'width:100%;height:100%;padding:0;margin:0;overflow:hidden;');
						iframeContent.setAttribute('src', url);
						iframeContent.setAttribute('scrolling', 'no');
						iframeContent.setAttribute('width', '100%');
						iframeContent.setAttribute('height', '100%');
						iframeContent.setAttribute('sandbox', 'allow-forms allow-scripts allow-presentation allow-modals allow-same-origin');
						iframeContent.setAttribute('onLoad', 'document.getElementById("loading").style.display=\'none\'');
						viewWindow3.document.body.filearchivedocfk = docFileId;
						viewWindow3.document.body.appendChild(iframeContent);
						if (viewWindow3.document.body.setAttribute){
							viewWindow3.document.body.setAttribute('style', 'width:100%;height:100%;padding:0;margin:0;overflow:hidden;');
						}
					} catch (e) {
						viewWindow3.location.href = url;
					}
				}
				return viewWindow3;
			}

			return service;
		}
	]);

})(angular);
