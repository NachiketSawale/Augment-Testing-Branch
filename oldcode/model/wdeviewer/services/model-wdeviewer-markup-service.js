/**
 * Created by yew on 1/8/2020.
 */

(function (angular) {
	/* global globals,_,Module */
	'use strict';
	let moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerMarkupService', ['$http', '$translate', 'PlatformMessenger', 'modelWdeViewerCommentMoudleName',
		'$injector', '$q', '$timeout',
		function ($http, $translate, PlatformMessenger, modelWdeViewerCommentMoudleName, $injector, $q, $timeout) {
			let defaultSetting = {
				deleteMarkupUrl: globals.webApiBaseUrl + 'model/docmarker/deletebydoc?id=',
				getMarkupUrl: globals.webApiBaseUrl + 'model/docmarker/getdoc?docRevisionId=',
			};
			let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
			let service = {
				wdeCtrl: null,
				igeCtrl: null,
				docId: null,
				setting: defaultSetting,
				Clerks: [],
				commentMarkups: [],
				currentModule: null,
				currentClerk: null,
				modelPart: null,
				isAllSelect: false,
				isDeleteDisabled: true,
				scopeOptions: null,
				isShowRfi: false,
				isShowDefect: false,
				isShowCheckList: false,
				isDocumentDefaultMode: false
			};
			service.document = defaultSetting;
			service.tempMarkups = [];
			service.getCommentMarkups = function () {
				return service.commentMarkups;
			};
			service.commentMarkupsChanged = new PlatformMessenger();
			service.showAnnotationChange = new PlatformMessenger();
			service.commentLoading = new PlatformMessenger();
			service.selectMarkupChange = new PlatformMessenger();
			service.model = {
				deleteMarkupUrl: globals.webApiBaseUrl + 'model/docmarker/deletebymodel?id=',
				getMarkupUrl: globals.webApiBaseUrl + 'model/docmarker/getmodel?modelId=',
			};

			if (service.currentClerk === null) {
				$http.get(globals.webApiBaseUrl + 'basics/clerk/clerkByClient').then(function callback(response) {
					service.currentClerk = response.data;
				});
			}
			service.CleanComments = function CleanComments() {
				if (service.commentMarkups.length > 0) {
					service.commentMarkups.splice(0);
				}
				service.commentMarkupsChanged.fire(service.commentMarkups);
			};

			function showClerkDialog() {
				let platformModalService = $injector.get('platformModalService');
				let modalOptions = {
					headerTextKey: $translate.instant(service.getViewerDisplayName()),
					bodyTextKey: $translate.instant('model.wdeviewer.faildClerk'),
					showOkButton: true,
					showCancelButton: false,
					defaultButton: 'ok',
					iconClass: 'ico-error'
				};
				platformModalService.showDialog(modalOptions);
			}

			service.getViewerDisplayName = function getViewerDisplayName() {
				let viewerDisplayName = 'model.wdeviewer.pdfTitle';
				let modelViewerViewerRegistryService = $injector.get('modelViewerViewerRegistryService');
				if (modelViewerViewerRegistryService) {
					let viewerConfig = modelViewerViewerRegistryService.getViewers();
					let viewer = _.find(viewerConfig, {numberedDisplayName: 'model.wdeviewer.numberedTitle'});
					if (viewer) {
						viewerDisplayName = viewer.displayName;
					} else {
						viewer = _.find(viewerConfig, function (item) {
							return item.displayName.indexOf('model.wdeviewer') > -1;
						});
						if (viewer) {
							viewerDisplayName = viewer.displayName;
						}
					}
				}
				return viewerDisplayName;
			};

			service.markupLoaded = function markupLoaded(scope, WDESingleInstance) {
				if (scope.modelId > 0) {
					service.docId = scope.modelId;
				}
				service.scopeOptions = scope.options;
				loadCurrentModule();
				service.igeCtrl = WDESingleInstance;
				if (service.wdeCtrl) {
					service.modelPart = $injector.get('modelWdeViewerWdeService').getModelPart(service.docId);
				} else {
					service.modelPart = $injector.get('modelWdeViewerIgeService').getModelPart(service.docId);
				}
				scope.$parent.viewerOptions.showCommentView = false;
				service.CleanComments();
				modelWdeViewerAnnotationService.loadAnnoMarker().then(function (annoMarkerItems){
					if (service.annoExtensionService && service.annoExtensionService.initMarkItemData) {
						service.annoExtensionService.initMarkItemData(annoMarkerItems);
					}
				});

				if (angular.isUndefined(scope.$parent.viewerOptions.documentData)) {
					reloadCurrentModule();
				}
			};

			function updateCommentClerk(basClerkFk, markupId) {
				getClerk(basClerkFk, function commentPush(user) {
					if (user && user.Id !== 0 && user.Id !== null && user.Id !== undefined) {
						let markup = _.find(service.commentMarkups, {MarkerId: markupId});
						if (markup) {
							markup.Clerk = user.Name;
						}
					}
				});
			}

			function getClerk(basClerkFk, commentPush) {
				let user = _.find(service.Clerks, {Id: basClerkFk});
				if (user && user.Id !== 0 && user.Id !== null && user.Id !== undefined) {
					commentPush(user);
				} else {
					$http.get(globals.webApiBaseUrl + 'basics/clerk/userNameByClerk?clerkId=' + basClerkFk).then(function callback(response) {
						user = {Id: basClerkFk, Name: response.data};
						service.Clerks.push(user);
						commentPush(user);
					});
				}
			}

			service.zoomToMarkup = function zoomToMarkup(igeInstance) {
				let selItem = _.find(service.commentMarkups, { isSelect: true });
				let zoomMarkupId = null;
				if (selItem && selItem.MarkerId) {
					zoomMarkupId = selItem.MarkerId;
				} else if (service.lastSelectMarkup) {
					zoomMarkupId = service.lastSelectMarkup;
				} else {
					const markupItem = service.commentMarkups[service.commentMarkups.length - 1];
					zoomMarkupId = markupItem.MarkerId;
				}
				if (zoomMarkupId) {
					igeInstance.zoomToMarkup(zoomMarkupId);
				}
			};

			service.selectMarkupById = function selectMarkupById(markupId) {
				angular.forEach(service.commentMarkups, function mapMarkups(item) {
					item.isSelect = item.MarkerId === markupId;
				});
				if (markupId) {
					modelWdeViewerAnnotationService.selectAnnotation();
				}
			};

			service.selectMarkup = function selectMarkup(WdeSingleInstance, commentItem) {
				let findItem = _.find(service.commentMarkups, {Id: commentItem.Id});
				if (!findItem) {
					return false;
				}
				let currentSelectState = commentItem.isSelect;
				service.selectMarkupById(commentItem.MarkerId);
				if (WdeSingleInstance.selectMarkup) {
					WdeSingleInstance.selectMarkup('');
				}
				if (currentSelectState === false) {
					commentItem.isSelect = true;
					if (commentItem.IsShow === false) {
						commentItem.IsShow = true;
					}
					service.showMarkup(WdeSingleInstance, commentItem);
					if (WdeSingleInstance.selectMarkup) {
						WdeSingleInstance.selectMarkup(commentItem.MarkerId);
					}
					service.isSelectByComment = true;
				}
				if (service.wdeCtrl && service.wdeCtrl.resize) {
					service.wdeCtrl.resize();
				}
				let viewSetting = $injector.get('modelWdeViewerIgeService').getViewSetting(service.scopeOptions.viewerId);
				if (viewSetting.zoomSelectMarkup) {
					$timeout(function() {
						service.zoomToMarkup(WdeSingleInstance);
					}, 100);
				}
			};

			service.deleteMarkupOnView = function deleteMarkupOnView(WdeSingleInstance, commentItem) {
				if (WdeSingleInstance.removeMarkup) {
					WdeSingleInstance.removeMarkup(commentItem.MarkerId);
					service.wdeCtrl.resize();
				} else if (WdeSingleInstance.unloadMarkups) {
					let markupIds = [];
					markupIds.push(commentItem.MarkerId);
					WdeSingleInstance.unloadMarkups(markupIds);
				}
			};

			service.deleteMarkup = function deleteMarkup(WdeSingleInstance, commentItem) {
				service.deleteMarkupOnView(WdeSingleInstance, commentItem);
				service.postDelete(commentItem);
			};

			service.postDelete = function postDelete(commentItem) {
				if (commentItem.AnnoMarkerFk) {
					modelWdeViewerAnnotationService.deleteItem(commentItem.AnnoMarkerFk, commentItem.AnnotationFk);
				}
				service.commentMarkups.splice(service.commentMarkups.indexOf(commentItem), 1);
				service.commentMarkupsChanged.fire(service.commentMarkups);
			};

			service.showMarkup = function showMarkup(WDESingleInstance, commentItem) {
				if (commentItem.IsShow === true) {
					if (WDESingleInstance.getMarkup && WDESingleInstance.loadMarkups) {
						loadIgeMarkup(WDESingleInstance, commentItem.MarkerId, commentItem.Marker);
					} else if (WDESingleInstance.getMarkupIds && WDESingleInstance.loadMarkupFromJSON) {
						let markerIds = WDESingleInstance.getMarkupIds();
						if (markerIds.indexOf(commentItem.MarkerId) === -1) {
							WDESingleInstance.loadMarkupFromJSON(jsonToString(commentItem.Marker));
						}
					}
				} else {
					service.deleteMarkupOnView(WDESingleInstance, commentItem);
				}
				if (service.wdeCtrl && service.wdeCtrl.resize) {
					service.wdeCtrl.resize();
				}
			};

			function jsonToString(jsonStr) {
				let jsonStringMarker = JSON.stringify(jsonStr);
				if (jsonStringMarker.indexOf('"') === 0) {
					let tempJson = JSON.parse(jsonStringMarker);
					tempJson = JSON.parse(tempJson);
					jsonStringMarker = JSON.stringify(tempJson);
				}
				return jsonStringMarker;
			}

			function loadCurrentModule() {
				if (globals.userDocumentDefinitions) {
					if (angular.isString(globals.userDocumentDefinitions)) {
						globals.userDocumentDefinitions = JSON.parse(globals.userDocumentDefinitions);
					}
					if (angular.isString(globals.userDocumentDefinitions)) {
						globals.userDocumentDefinitions = JSON.parse(globals.userDocumentDefinitions);
					}
					if (globals.userDocumentDefinitions.module) {
						service.currentModule = {
							id: globals.userDocumentDefinitions.module.Id,
							name: globals.userDocumentDefinitions.module.name,
							shortName: modelWdeViewerCommentMoudleName.getCommentModuleShortName(globals.userDocumentDefinitions.module.name)
						};
					}
				} else {
					reloadCurrentModule();
					if (!service.currentModule || (service.currentModule && !service.currentModule.name)) {
						service.getDocumentPreviewData();
					}
				}
			}

			function reloadCurrentModule() {
				let name = $injector.get('mainViewService').getCurrentModuleName();
				let basicsDependentDataModuleLookupService = $injector.get('basicsDependentDataModuleLookupService');
				let moduleLoad = basicsDependentDataModuleLookupService.loadData();
				let moduleLists = basicsDependentDataModuleLookupService.getList();
				if (moduleLists && moduleLists.length > 0) {
					let module = basicsDependentDataModuleLookupService.getItemByInternalName(name);
					if (module) {
						service.currentModule = {
							id: module.Id,
							name: module.InternalName,
							shortName: modelWdeViewerCommentMoudleName.getCommentModuleShortName(module.InternalName)
						};
					}
				} else {
					moduleLoad.then(function () {
						let module = basicsDependentDataModuleLookupService.getItemByInternalName(name);
						if (module) {
							service.currentModule = {
								id: module.Id,
								name: module.InternalName,
								shortName: modelWdeViewerCommentMoudleName.getCommentModuleShortName(module.InternalName)
							};
						}
					});
				}
			}

			function getModuleId() {
				let moduleId = service.currentModule ? service.currentModule.id : 45;
				return moduleId ? moduleId : 45;
			}

			service.saveMarkupInIge = function saveMarkupInIge(layoutId, markUp) {
				if (markUp.id === '{00000000-0000-0000-0000-000000000000}') {
					return;
				}
				let markup = _.find(service.tempMarkups, {MarkerId: markUp.id});
				if (markup) {
					return;
				}
				if (service.currentClerk.Id === 0 || service.currentClerk.Id === null || service.currentClerk === '') {
					showClerkDialog();
					return;
				}
				angular.forEach(service.commentMarkups, function mapMarkups(item) {
					item.isSelect = false;
					item.IsShow = false;
				});
				if (modelWdeViewerAnnotationService.modelId > 0) {
					modelWdeViewerAnnotationService.createViewerAnnotation(layoutId, markUp);
				}
			};

			service.updateColors = function (markerIds, colour) {
				let drawingUtil = $injector.get('basicsCommonDrawingUtilitiesService');
				const color = drawingUtil.decToHexColor(colour);
				_.forEach(markerIds, function (markerId) {
					service.updateColor(markerId, color);
				});
			};

			service.updateColor = function (markerId, colour, isDefault, isSyncFillColor) {
				let selectItem = _.find(service.commentMarkups, { MarkerId: markerId });
				if (selectItem && !isDefault) {
					selectItem.isSelect = true;
				}
				let markupData = service.igeCtrl.getMarkup(markerId);
				if (markupData) {
					let type = angular.copy(markupData.style);
					if (selectItem && isDefault) {
						selectItem.defaultColor = type.colour;
					}
					type.colour = colour;
					if(isSyncFillColor){
						type.fillColour = colour;
					}
					if (markupData.style.endPointStyle.value === 1) {
						type.endPointStyle = Module.MarkupPointStyle.Arrow;
					} else if(markupData.style.startPointStyle.value === 2){
						type.startPointStyle = Module.MarkupPointStyle.Tick;
						type.endPointStyle = Module.MarkupPointStyle.Tick;
					}
					else if(markupData.style.startPointStyle.value === 3){
						type.startPointStyle = Module.MarkupPointStyle.Cross;
						type.endPointStyle = Module.MarkupPointStyle.Cross;
					}
					service.lockMarkupUpdateId = 'notSaveMarkup';
					service.igeCtrl.updateMarkupStyle(markerId, type);
					service.lockMarkupUpdateId = null;
				}
			};

			service.setMarkupSelect = function (markerId, colour) {
				let drawingUtil = $injector.get('basicsCommonDrawingUtilitiesService');
				let highlightItem = _.find(service.commentMarkups, { isCurrentHighlight: true });
				if (highlightItem && highlightItem.defaultColor) {
					let defaultColor = drawingUtil.decToHexColor(highlightItem.defaultColor);
					service.updateColor(highlightItem.MarkerId, defaultColor);
					highlightItem.isSelect = false;
					highlightItem.isCurrentHighlight = false;
				}

				if (!colour) {
					let viewSetting = $injector.get('modelWdeViewerIgeService').getViewSetting(service.scopeOptions.viewerId);
					colour = drawingUtil.decToHexColor(viewSetting.highlightColor);
				}
				$timeout(function () {
					service.updateColor(markerId, colour, true);
					service.currentHighlightMarkerId = markerId;

					let selectItem = _.find(service.commentMarkups, { MarkerId: markerId });
					if (selectItem) {
						selectItem.isSelect = true;
						selectItem.isCurrentHighlight = true;
					}
				}, 100);
			};

			service.saveMarkupChange = function saveMarkupChange(layoutId, markUp) {
				let markupItem = _.find(service.commentMarkups, {MarkerId: markUp.id});
				if (!markupItem) {
					return;
				}
				let markerData = markUp.serialize();
				service.lastSelectMarkup = markUp.id;
				if (markerData === markupItem.Marker) {
					if (service.annoExtensionService && service.annoExtensionService.onMarkupSelect && service.lockMarkupUpdateId !== 'notSaveMarkup') {
						service.annoExtensionService.onMarkupSelect(markUp);
					}
					return;
				}
				markupItem.Marker = markerData;
				if (service.lockMarkupUpdateId === 'notSaveMarkup') {
					return;
				}
				if (service.annoExtensionService && service.annoExtensionService.onMarkupChange) {
					service.annoExtensionService.onMarkupChange(markUp);
				}
				if (markupItem.AnnoMarkerFk && (!service.lockMarkupUpdateId || service.lockMarkupUpdateId !== markUp.id)) {
					markupItem.originMarker = markupItem.Marker;
					modelWdeViewerAnnotationService.updateMarkerMarkupJson(markupItem.AnnoMarkerFk, markupItem.AnnotationFk, markUp);
					service.lockMarkupUpdateId = null;
					return;
				}

				let postData = {
					Id: markupItem.Id,
					Marker: markupItem.Marker,
					DocId: service.docId,
					BasClerkFk: service.currentClerk.Id,
					LayoutId: layoutId,
					ModuleId: getModuleId()
				};

				if ((!service.lockMarkupUpdateId || service.lockMarkupUpdateId !== markUp.id)) {
					markupItem.originMarker = markupItem.Marker;
					service.lockMarkupUpdateId = markUp.id;
					$http.post(globals.webApiBaseUrl + 'model/docmarker/updatemarkup', postData).then(function (res) {
						service.lockMarkupUpdateId = null;
						markupItem = _.find(service.commentMarkups, {MarkerId: markUp.id});
						markupItem.Marker = res.data ? res.data.Marker : res.Marker;
					});
				}
			};

			function addCommentInIge(comment, markerData, isShow, igeEngine) {
				if (service.currentModule === null) {
					$timeout(function () {
						addCommentInIge(comment, markerData, isShow, igeEngine);
					}, 200);
					return;
				}
				let markupData = JSON.parse(markerData);
				let markup = _.find(service.commentMarkups, {MarkerId: markupData.id});
				if (!markup) {
					markup = {
						Id: markupData.id,
						MarkerId: markupData.id,
						Marker: markerData,
						LayoutId: comment.LayoutId,
						Clerk: '...',
						ClerkFk: comment.BasClerkFk,
						UpdateTime: new Date().toDateString().substr(4),
						isSelect: false,
						isDisableGoto: false,
						IsShow: isShow,
						Color: markupData.colour,
						Content: '',
						ModuleName: '',
						originMarker: markerData
					};
					service.commentMarkups.push(markup);
					service.commentMarkupsChanged.fire(service.commentMarkups);
				}
				if (comment !== null) {
					markup = _.find(service.commentMarkups, {MarkerId: markupData.id});
					let updateTime = comment.UpdatedAt;
					if (updateTime === null) {
						updateTime = comment.InsertedAt;
					}
					markup.Id = comment.Id;
					markup.isDisableGoto = comment.BasModuleFk === getModuleId();
					markup.UpdateTime = new Date(updateTime).toDateString().substr(4);
					markup.Content = comment.Comment;
					markup.ModuleName = modelWdeViewerCommentMoudleName.getModuleShortNameById(comment.BasModuleFk);
					updateCommentClerk(comment.BasClerkFk, markupData.id);
					service.tempMarkups = angular.copy(service.commentMarkups);
				}
				if (service.modelPart && service.modelPart.settings && service.modelPart.settings.isShowMarkup) {
					service.isAllSelect = service.modelPart.settings.isShowMarkup;
					comment.IsShow = isShow;
					service.showMarkupInIge(igeEngine, markup);
				}
			}

			function loadIgeMarkup(igeEngine, id, markupItem) {
				if (igeEngine === null) {
					return;
				}
				let markups = [];
				markups.push(markupItem);
				let igeMarkupItem = igeEngine.getMarkup(id);
				if (!igeMarkupItem) {
					service.loadIgeMarkups(igeEngine, markups);
				}
			}

			service.loadIgeMarkups = function loadIgeMarkups(igeEngine, markups) {
				// it will be go to 'onMarkupChange' when use 'loadMarkups' function
				service.lockMarkupUpdateId = 'notSaveMarkup';
				igeEngine.loadMarkups(markups);
				service.lockMarkupUpdateId = null;
			};

			service.showMarkupInIge = function showMarkupInIge(igeEngine, commentItem) {
				if (commentItem.IsShow === true) {
					loadIgeMarkup(igeEngine, commentItem.MarkerId, commentItem.Marker);
				} else if (igeEngine) {
					let markupIds = [];
					markupIds.push(commentItem.MarkerId);
					igeEngine.unloadMarkups(markupIds);
				}
			};

			service.getDocumentPreviewData = function getDocumentPreviewData() {
				const deffered = $q.defer();
				$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
					.then(function (result) {
						const documentPreviewImageData = _.filter(result.data, {FilterName: 'Document Preview Image'});
						if (documentPreviewImageData && documentPreviewImageData[0]) {
							globals.userDocumentDefinitions = JSON.parse(documentPreviewImageData[0].FilterDef);
						} else {
							globals.userDocumentDefinitions = {};
						}
						deffered.resolve(globals.userDocumentDefinitions);
					});
				return deffered.promise;
			};
			service.checkAnnoMarkerShow = function checkAnnoMarkerShow() {
				if (service.isAllSelect) {
					service.showAnnoMarkerByAll(true);
				} else {
					if (service.isShowDefect) {
						service.showAnnoMarkerByDefect(true);
					}
					if (service.isShowRfi) {
						service.showAnnoMarkerByInfoRequest(true);
					}
					if (service.isShowCheckList) {
						service.showAnnoMarkerByCheckList(true);
					}
				}
			};
			service.showAnnoMarkerByAll = function showAnnoMarkerByAll(isShow) {
				return service.showAnnoMarker(null, isShow);
			};
			service.showAnnoMarkerByDefect = function showAnnoMarkerByDefect(isShow) {
				return service.showAnnoMarker('DefectFk', isShow);
			};
			service.showAnnoMarkerByInfoRequest = function showAnnoMarkerByInfoRequest(isShow) {
				return service.showAnnoMarker('InfoRequestFk', isShow);
			};
			service.showAnnoMarkerByCheckList = function showAnnoMarkerByCheckList(isShow) {
				return service.showAnnoMarker('HsqChecklistFk', isShow);
			};
			service.showAnnoMarker = function showAnnoMarker(fieldKey, isShow) {
				let showMarkups = [];
				let removeMarkups = [];
				let isIge = false;
				if (service.igeCtrl) {
					isIge = true;
				}
				angular.forEach(service.commentMarkups, function callback(item) {
					let hasShow = !fieldKey ? true : (item[fieldKey] > 0);
					if (hasShow) {
						if (isShow) {
							item.IsShow = true;
							if (isIge === false) {
								service.showMarkup(service.wdeCtrl.getWDEInstance(), item);
							} else if (isIge && service.igeCtrl.getMarkup) {
								let igeMarkupItem = service.igeCtrl.getMarkup(item.MarkerId);
								if (!igeMarkupItem) {
									showMarkups.push(item.originMarker ? item.originMarker : item.Marker);
								}
							}
						} else {
							item.isSelect = false;
							item.IsShow = false;
							if (isIge === false) {
								service.deleteMarkupOnView(service.wdeCtrl.getWDEInstance(), item);
							}
							removeMarkups.push(item.MarkerId);
						}
					}
				});
				if (isIge) {
					if (showMarkups.length > 0) {
						service.loadIgeMarkups(service.igeCtrl, showMarkups);
					}
					if (removeMarkups.length > 0) {
						service.igeCtrl.unloadMarkups(removeMarkups);
					}
				}

				if(service.annoExtensionService && service.annoExtensionService.showAnnoMarker){
					service.annoExtensionService.showAnnoMarker(fieldKey, isShow);
				}
			};

			service.copyDataToAnnotation = function (fileArchiveDocFk, dataService) {
				service.currentPreviewDataService = dataService;
				if (!service.isCheckDocRevision && fileArchiveDocFk) {
					service.isCheckDocRevision = true;
					$injector.get('modelWdeViewerPreviewDataService').getDocumentRevisionId(fileArchiveDocFk).then(function (res) {
						let docRevisionId = res.data;
						if (docRevisionId) {
							$http.get(service.document.getMarkupUrl + docRevisionId).then(function callback(result) {
								let markups = result.data;
								service.isCheckDocRevision = false;
								if (markups !== null && markups.length > 0) {
									modelWdeViewerAnnotationService.copyMarkupDataToAnnotation(markups);
									angular.forEach(markups, function mapMarkups(item) {
										$http.get(service.document.deleteMarkupUrl + item.Id);
									});
								}
							});
						}
					});
				}
			};
			return service;
		}
	]);

})(angular);