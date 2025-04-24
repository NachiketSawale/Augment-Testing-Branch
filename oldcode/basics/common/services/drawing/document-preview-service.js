/**
 * Created by yew on 03/30/2020.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDocumentPreviewService', [
		'$http', '$injector', '$q', '$window', 'cxService', 'documentProjectType', '$timeout', 'platformModalService', '$translate',
		'basicsCommonDrawingPreviewService', 'mainViewService', 'basicsDependentDataModuleLookupService', 'globals', '_', '$','basicsCommonPreviewTabService',
		function (
			$http, $injector, $q, $window, cxService, documentProjectType, $timeout, platformModalService, $translate,
			basicsCommonDrawingPreviewService, mainViewService, basicsDependentDataModuleLookupService, globals, _, $, basicsCommonPreviewTabService) {
			const service = {};
			service.viewOptions = {
				document: null,
				documentTitle: null,
				documentType: null,
				config: null
			};

			service.setOptionByDocSelect = function (doc, dataService) {
				service.viewOptions.document = doc;
				service.viewOptions.documentType = doc.DocumentTypeFk;
				service.viewOptions.documentTitle = doc.OriginFileName;
				if (!doc.DocumentTypeFk && dataService && dataService.parentService && dataService.parentService()) {
					const parentService = dataService.parentService();
					const parentItem = parentService.getSelected();
					if (parentItem) {
						service.viewOptions.documentType = parentItem.DocumentTypeFk;
					}
				}
			};

			service.show = function (fileArchiveDocId, viewWindow, funv) {
				const deffered = $q.defer();
				if (service.isWfPreview) {
					$injector.get('modelWdeViewerPreviewDataService').getPreviewDocument(fileArchiveDocId).then(function (res) {
						const resData = res.data ? res.data : res;
						service.previewModelFk = resData.PreviewModelFk;
					});
				}
				if (service.viewOptions.document === null || service.viewOptions.document.FileArchiveDocFk !== fileArchiveDocId) {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/getfilename?fileArchiveDocId=' + fileArchiveDocId)
						.then(function (result) {
							service.viewOptions.documentTitle = result.data;
							showByDocType(fileArchiveDocId, viewWindow, funv).then(function (res) {
								deffered.resolve({
									viewWindow: res.viewWindow
								});
							});
						});
				} else {
					showByDocType(fileArchiveDocId, viewWindow, funv).then(function (res) {
						deffered.resolve({
							viewWindow: res.viewWindow
						});
					});
				}
				return deffered.promise;
			};

			function showByDocType(fileArchiveDocId, viewWindow, funv) {
				const deffered = $q.defer();
				getPreviewConfig(fileArchiveDocId, viewWindow).then(function (config) {
					documentProjectType.getDocumentType().then(function (documentTypes) {
						if (config && config.typeName) config.typeName = config.typeName.toLocaleLowerCase();
						if (documentTypes && documentTypes.length) {
							if ((fileArchiveDocId === null || angular.isUndefined(fileArchiveDocId)) && service.viewOptions.document) {
								fileArchiveDocId = service.viewOptions.document.ArchiveElementId;
								if ((fileArchiveDocId === null || angular.isUndefined(fileArchiveDocId)))
									fileArchiveDocId = service.viewOptions.document.DatengutFileId;
							}
							const supportTypes = _.result(_.find(documentTypes, function (item) {
								if (config.documentType) {
									return item.Id === config.documentType;
								} else if (config.typeName) {
									return isIncludes(item.type, config.typeName);
								}
							}), 'type');
							checkViewWindowHeight(viewWindow);
							isExistViewWindow(viewWindow, function () {
								$(viewWindow.document).attr('title', config.title);
							}, function () {
								viewWindow.location.href = config.src;
							});
							let isOffice = false;
							if (isIncludes(supportTypes,['jpg', 'png', 'jpeg', 'bmp'])) {
								setDocumentPreviewImageData(fileArchiveDocId, config, {name: mainViewService.getCurrentModuleName()});
								viewWindow = basicsCommonDrawingPreviewService.showImg(fileArchiveDocId, viewWindow);
							} else if(_.includes(supportTypes, 'pdf')) {
								setDocumentPreviewImageData(fileArchiveDocId, config, {name: mainViewService.getCurrentModuleName()});
								viewWindow = basicsCommonDrawingPreviewService.showPdf(fileArchiveDocId, viewWindow);
							} else if (_.includes(supportTypes, 'dwg')) {
								viewWindow = previewInWde(fileArchiveDocId, viewWindow, config);
							} else if (_.includes(supportTypes, 'rtf')) {
								viewWindow = previewInEditor(fileArchiveDocId, viewWindow, config);
							} else if (isIncludes(supportTypes, ['eml', 'msg'])) {
								previewMsgInEditor(fileArchiveDocId, viewWindow, config);
							} else if (isIncludes(supportTypes, ['docx', 'doc', 'xls', 'xlsx', 'pptx', 'ppt'])) {
								let officeAppsDomain = 'https://view.officeapps.live.com/';
								const officeViewerServerUrl = globals.aad.officeViewerServerUrl;
								if (officeViewerServerUrl && officeViewerServerUrl.length) {
									officeAppsDomain = officeViewerServerUrl;
									if (officeAppsDomain[officeAppsDomain.length - 1] !== '/') {
										officeAppsDomain = officeAppsDomain + '/';
									}
								}
								isOffice = true;
								const goUrl = officeAppsDomain + 'op/view.aspx?src=' + encodeURIComponent(config.src);
								const pdfHtml = '<iframe credentialless name="rib_iframe" src="' + goUrl + '" width="100%" height="100%" frameborder="0"/>';
								if (!viewWindow || viewWindow.closed) {
									viewWindow = basicsCommonPreviewTabService.openTab('');
									viewWindowHtml(viewWindow, pdfHtml);
									$(viewWindow.document).attr('title', config.title);
								} else if (viewWindow) {
									// viewWindow.location.href = goUrl;
									viewWindowHtml(viewWindow, pdfHtml);
								}
							} else { // Closed
								if (!viewWindow || viewWindow.closed) {
									viewWindow = basicsCommonPreviewTabService.openTab('', 'mywindow3', 'noopener,noreferrer');
								}
								let oldFileArchiveDocFk = null;
								isExistViewWindow(viewWindow, function () {
									oldFileArchiveDocFk = viewWindow.document.body.filearchivedocfk;
									viewWindow.document.body.filearchivedocfk = fileArchiveDocId;
									if (oldFileArchiveDocFk !== fileArchiveDocId) {
										previewConfig(viewWindow, config, supportTypes);
									}
								});
							}
							if (!isOffice) {
								isExistViewWindow(viewWindow, function () {
									$(viewWindow.document).attr('title', title);
								});
							}
							if (funv && angular.isFunction(funv)) {
								funv();
							}
							deffered.resolve({
								viewWindow: viewWindow
							});
						}
					});
				});
				return deffered.promise;
			}

			// the document not found when preview the other document type file after preview office file.
			function isExistViewWindow(viewWindow, funTry, funCatch) {
				try {
					if (viewWindow && viewWindow.document && funTry && angular.isFunction(funTry)) {
						funTry();
					}
				} catch (e) {
					if (funCatch && angular.isFunction(funCatch)) {
						funCatch();
					}
				}
			}

			function getPreviewConfig(fileArchiveDocId, viewWindow) {
				const deffered = $q.defer();
				if (service.viewOptions.document && service.viewOptions.document.url) {
					if (service.viewOptions.document.url.indexOf('itwocx') > -1) {
						cxService.LoginCx().then(function (backdata) {
							const key = backdata.key;
							const url = service.viewOptions.document.url + '?k=' + key;
							deffered.resolve({
								Url: url,
								title: ''
							});
						});
					} else {
						deffered.resolve({
							Url: service.viewOptions.document.url,
							title: ''
						});
					}
				} else if (service.viewOptions.document && service.viewOptions.document.FullName) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/common/ppsdocument/preview?fullName=' + service.viewOptions.document.FullName)
						.then(function (result) {
							const typeName = _.last(result.data.split('.'));
							deffered.resolve({
								src: result.data,
								documentType: service.viewOptions.documentType,
								typeName: typeName,
								title: service.viewOptions.documentTitle
							});
						}, function () {
							if (viewWindow) {
								viewWindow.close();
							}
						});
				} else if (service.viewOptions.document && (service.viewOptions.document.ArchiveElementId || service.viewOptions.document.DatengutFileId)) {
					let archiveElementId = service.viewOptions.document.ArchiveElementId;
					if (archiveElementId === null || angular.isUndefined(archiveElementId)) archiveElementId = service.viewOptions.document.DatengutFileId;
					$http.get(globals.webApiBaseUrl + 'basics/common/document/previewdatengutfile?archiveElementId=' + archiveElementId)
						.then(function (result) {
							const typeName = _.last(result.data.split('.'));
							deffered.resolve({
								src: result.data,
								documentType: service.viewOptions.documentType,
								typeName: typeName,
								title: service.viewOptions.documentTitle
							});
						}, function () {
							if (viewWindow) {
								viewWindow.close();
							}
						});
				} else {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId)
						.then(function (result) {
							const typeName = _.last(result.data.split('.'));
							deffered.resolve({
								src: result.data,
								documentType: service.viewOptions.documentType,
								typeName: typeName,
								title: service.viewOptions.documentTitle
							});
						}, function () {
							if (viewWindow) {
								viewWindow.close();
							}
						});
				}
				return deffered.promise;
			}

			function isIncludes(typeList, types) {
				const item = _.find(typeList, function (e) {
					if (e.indexOf(',') > 0) {
						return _.find(e.split(','), function (k) {
							return _.includes(types, k);
						});
					} else if (e.length > 0) {
						return _.includes(types, e);
					}
				});
				return item !== null && !angular.isUndefined(item);
			}

			service.previewIframe = function previewIframe(viewWindow, url, title, isLoading) {
				if (!title) {
					title = 'Preview';
				}
				let allowSandbox = '', htmlStr = '';
				if (url === null) {
					htmlStr = '<iframe credentialless id="rib_iframe_view" class="border-none fullheight fullwidth" width="100%" height="100%" sandbox="allow-scripts"></iframe>';
				} else {
					const urlTemp = new URL(url);
					if (urlTemp.host !== window.location.host) {
						allowSandbox = 'allow-forms allow-scripts allow-same-origin';
					}
					htmlStr = isLoading
						? '<div id="loading" class="wait-overlay"><div class="box"><div class="spinner-lg"></div></div></div>' +
						'<iframe credentialless name="rib_iframe" src=\"' + url + '\" frameborder="0" sandbox="' + allowSandbox + '" class="border-none fullheight fullwidth" width="100%" height="100%" onLoad=document.getElementById("loading").style.display=\'none\'></iframe>'
						: '<iframe credentialless name="rib_iframe" id="rib_iframe_view" src="' + url + '" class="border-none fullheight fullwidth" width="100%" height="100%" sandbox=""></iframe>';
				}
				viewWindow.document.title = title;
				viewWindow.opener = null;
				viewWindowHtml(viewWindow, htmlStr);
			};
			function setContentToIframe(resData, viewWindow, type) {
				if (typeof resData === 'object') {
					resData = resData.data;
				}
				const frame = viewWindow.document.getElementById('rib_iframe_view');
				if (!frame) {
					service.previewIframe(viewWindow, null, null, false);
				}
				const blob = new Blob([resData], {type: type});
				frame.src = URL.createObjectURL(blob);
				$timeout(function () {
					window.URL.revokeObjectURL(frame.src);
				}, 3000);
				checkViewWindowHeight(viewWindow);
			}
			service.previewInIframe = function previewInIframe(viewWindow, url, title, type) {
				service.previewIframe(viewWindow, null, title, false);
				$http.get(url, {
					transformResponse: function (d) {
						return d;
					}
				}).then(function (resData) {
					setContentToIframe(resData, viewWindow, type);
				});
			};
			service.previewHtmlIframe = function previewHtmlIframe(viewWindow, url, title, data) {
				service.previewIframe(viewWindow, null, title, false);
				const frame = viewWindow.document.getElementById('rib_iframe_view');
				const blob = new Blob([data], {type: 'text/html'});
				frame.src = URL.createObjectURL(blob);
				$timeout(function () {
					window.URL.revokeObjectURL(frame.src);
				}, 3000);
				checkViewWindowHeight(viewWindow);
			};

			function viewWindowHtml(viewWindow, htmlStr) {
				$(viewWindow.document.body).css({
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					padding: 0,
					margin: 0
				}).html(htmlStr);
				checkViewWindowHeight(viewWindow);
			}

			function checkViewWindowHeight(viewWindow) {
				try {
					if (viewWindow.document.body.clientHeight < 200) {
						viewWindow.document.setAttribute('style', 'height: 100%');
						viewWindow.document.body.setAttribute('style', 'height: 100%');
					}
				} catch (e) {
				}
			}

			function previewConfig(viewWindow, config, supportTypes) {
				if (viewWindow) {
					if (_.includes(supportTypes, 'pdf')) {
						viewWindow.document.title = config.title;
						viewWindow.document.body.innerHTML = '<object width="99.5%" height="99.5%" name="plugin" data="' + config.src + '" type="application/pdf" />';
					} else if (isIncludes(supportTypes, ['xml', 'txt'])) {
						service.previewInIframe(viewWindow, config.src, config.title, 'text/plain');
					} else if (isIncludes(supportTypes, ['png', 'bmp', 'jpg', 'tif', 'gif'])) {
						const iframe_content = '<img src="' + config.src + '" style="width: 100%;height: 100%;">';
						service.previewHtmlIframe(viewWindow, null, config.title, iframe_content);
					} else if (isIncludes(supportTypes, ['html', 'htm'])) {
						service.previewInIframe(viewWindow, config.src, config.title, 'text/html');
					} else if (isIncludes(supportTypes, ['mp4', 'mp3', 'wav', 'ogg', 'webm', 'm4a'])) {
						const iframe_content = '<video width="100%" height="100%" controls="controls" autoplay="autoplay" src="' + config.src + '">You Brower Not Support Current File Type</video>';
						service.previewHtmlIframe(viewWindow, null, config.title, iframe_content);
					} else {
						viewWindow.document.title = config.title;
						viewWindow.document.body.innerHTML = 'Not Support Current File Type';
					}
				}
			}

			function previewInWde(fileArchiveDocId, viewWindow, config) {
				setDocumentPreviewImageData(fileArchiveDocId, config);
				viewWindow = basicsCommonDrawingPreviewService.previewById(fileArchiveDocId, viewWindow);
				isExistViewWindow(viewWindow, function () {
					viewWindow.document.title = config.title;
				});
				return viewWindow;
			}

			function previewInEditor(docFileId, viewWindow, config) {
				const deffered = $q.defer();
				service.previewIframe(viewWindow, null, config.title, false);
				$http.get(globals.webApiBaseUrl + 'basics/common/document/getfileineditor?docId=' + docFileId)
					.then(function (response) {
						setContentToIframe(response, viewWindow, 'text/html');
						deffered.resolve(viewWindow);
					});
				return deffered.promise;
			}

			function previewMsgInEditor(docFileId, viewWindow, config) {
				$http.get(globals.webApiBaseUrl + 'basics/common/document/getmsgineditor?docId=' + docFileId)
					.then(function (fileData) {
						service.previewHtmlIframe(viewWindow, null, config.title, fileData.data);
					});
			}

			function updateDocumentPreviewForModule() {
				const name = mainViewService.getCurrentModuleName();
				const moduleLoad = basicsDependentDataModuleLookupService.loadData();
				const moduleLists = basicsDependentDataModuleLookupService.getList();
				if (moduleLists && moduleLists.length > 0) {
					const module = basicsDependentDataModuleLookupService.getItemByInternalName(name);
					if (module && module.Id) {
						return setDocumentPreviewImageData(null, null, {Id: module.Id, name: module.InternalName});
					}
				} else {
					moduleLoad.then(function () {
						const module = basicsDependentDataModuleLookupService.getItemByInternalName(name);
						if (module && module.Id) {
							return setDocumentPreviewImageData(null, null, {Id: module.Id, name: module.InternalName});
						}
					});
				}
			}

			function getDocumentPreviewImageData() {
				const deffered = $q.defer();
				$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
					.then(function (result) {
						const documentPreviewImageData = _.filter(result.data, {FilterName: 'Document Preview Image'});
						if (documentPreviewImageData && documentPreviewImageData[0]) {
							service.viewOptions.config = JSON.parse(documentPreviewImageData[0].FilterDef);
						} else {
							service.viewOptions.config = {};
						}
						deffered.resolve(service.viewOptions.config);
					});
				return deffered.promise;
			}

			function setDocumentPreviewImageData(fileArchiveDocId, config, module) {
				const documentPreviewItem = {
					FilterName: 'Document Preview Image',
					AccessLevel: 'User'
				};
				if (service.viewOptions.config === null) {
					service.viewOptions.config = {};
					getDocumentPreviewImageData();
				}
				if (fileArchiveDocId !== null && !angular.isUndefined(fileArchiveDocId)) {
					service.viewOptions.config.fileArchiveDocId = fileArchiveDocId;
				}
				service.viewOptions.config.config = config;
				if (module !== null && !angular.isUndefined(module)) {
					service.viewOptions.config.module = module;
				}
				documentPreviewItem.FilterDef = JSON.stringify(service.viewOptions.config);
				globals.userDocumentDefinitions = JSON.stringify(documentPreviewItem.FilterDef);
				$http.post(globals.webApiBaseUrl + 'basics/common/document/savedocumentdefinition', documentPreviewItem)
					.then(function () {
						if (module === null || angular.isUndefined(module)) {
							updateDocumentPreviewForModule();
						}
					});
			}

			return service;
		}
	]);
})(angular);
