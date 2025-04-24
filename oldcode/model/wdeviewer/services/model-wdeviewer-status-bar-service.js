/**
 * Created by wui on 2/20/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerStatusBarService', [
		'basicsLookupdataPopupService',
		'$http',
		'$injector',
		'modelWdeViewerWdeService',
		'modelWdeViewerIgeService',
		'modelWdeViewerIgeLayoutService',
		'modelWdeViewerSelectionService',
		'$translate',
		function (
			basicsLookupdataPopupService,
			$http,
			$injector,
			wdeService,
			igeService,
			modelWdeViewerIgeLayoutService,
			modelWdeViewerSelectionService,
			$translate) {
			var service = {}, popup = basicsLookupdataPopupService.getToggleHelper();
			var modelService = null;

			function setModelService(wdeCtrl) {
				if (wdeCtrl.ige) {
					modelService = igeService;
				} else {
					modelService = wdeService;
				}
			}

			service.initializeStatusBar = function (scope) {
				var sb = scope.getUiAddOns().getStatusBar();
				var layoutControl = {
					id: 'layout',
					align: 'last',
					type: 'button',
					value: $translate.instant('model.wdeviewer.statusBar.page'),
					cssClass: 'control-icons ico-up'
				};
				var firstControl = {
					align: 'last',
					disabled: true,
					id: 'goToFirst',
					type: 'button',
					visible: true,
					delete: false,
					iconClass: 'tlb-icons ico-rec-first',
					cssClass: 'block-image',
					func: function () {
						if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
							var engine = scope.getEngine();

							if (engine) {
								var currentPage = modelWdeViewerIgeLayoutService.first();
								modelWdeViewerIgeLayoutService.setCurrentPageId(currentPage.id);
								modelWdeViewerIgeLayoutService.goToFirst();
								engine.toFirstPage('');
							}
						}
						else {
							modelWdeViewerIgeLayoutService.goToFirst();
						}
					}
				};
				var prevControl = {
					align: 'last',
					disabled: true,
					id: 'goToPrev',
					type: 'button',
					visible: true,
					delete: false,
					iconClass: 'control-icons ico-previous',
					cssClass: 'block-image',
					func: function () {
						if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
							var engine = scope.getEngine();

							if (engine) {
								var currentPage = modelWdeViewerIgeLayoutService.prev();
								modelWdeViewerIgeLayoutService.setCurrentPageId(currentPage.id);
								modelWdeViewerIgeLayoutService.goToPrevious();
								engine.toPreviousPage('');
							}
						}
						else{
							modelWdeViewerIgeLayoutService.goToPrevious();
						}
					}
				};
				var toPageControl = {
					id: 'toPage',
					align: 'last',
					type: 'input',
					inputType: 'text',
					ellipsis: true,
					delete: false,
					value: '0',
					cssStyle: {
						width: '40px',
						textAlign: 'center'
					},
					func: function (e) {
						if (e.keyCode === 13) { // enter key
							let value = e.target.value;
							let pageNumber = Number.parseInt(value);

							if (!_.isNumber(pageNumber)) {
								return;
							}

							if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
								let engine = scope.getEngine();

								if (engine) {
									let currentPage = modelWdeViewerIgeLayoutService.toPage(pageNumber);

									if (currentPage) {
										modelWdeViewerIgeLayoutService.setCurrentPageId(currentPage.id);
										modelWdeViewerIgeLayoutService.selectLayout(currentPage);
										engine.toPage(currentPage.id, '');
									}
								}
							} else {
								modelWdeViewerIgeLayoutService.goToPage(pageNumber);
							}
						}
					}
				};
				var infoControl = {
					id: 'info',
					align: 'last',
					type: 'text',
					ellipsis: true,
					delete: false,
					value: '/ 0'
				};
				var nextControl = {
					align: 'last',
					disabled: true,
					id: 'goToNext',
					type: 'button',
					visible: true,
					delete: false,
					iconClass: 'control-icons ico-next',
					cssClass: 'block-image',
					func: function () {
						if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
							var engine = scope.getEngine();

							if (engine) {
								var currentPage = modelWdeViewerIgeLayoutService.next();
								modelWdeViewerIgeLayoutService.setCurrentPageId(currentPage.id);
								modelWdeViewerIgeLayoutService.goToNext();
								engine.toNextPage('');
							}
						}
						else {
							modelWdeViewerIgeLayoutService.goToNext();
						}
					}
				};
				var lastControl = {
					align: 'last',
					disabled: true,
					id: 'goToLast',
					type: 'button',
					visible: true,
					delete: false,
					iconClass: 'tlb-icons ico-rec-last',
					cssClass: 'block-image',
					func: function () {
						if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
							var engine = scope.getEngine();

							if (engine) {
								var currentPage = modelWdeViewerIgeLayoutService.last();
								modelWdeViewerIgeLayoutService.setCurrentPageId(currentPage.id);
								modelWdeViewerIgeLayoutService.goToLast();
								engine.toLastPage('');
							}
						}
						else {
							modelWdeViewerIgeLayoutService.goToLast();
						}
					}
				};
				var layoutControls = [
					layoutControl,
					firstControl,
					prevControl,
					toPageControl,
					infoControl,
					nextControl,
					lastControl
				];

				sb.showFields([
					{
						id: 'status',
						type: 'text',
						align: 'left'
					},
					{
						id: 'dimension',
						type: 'text',
						align: 'left'
					},
					{
						id: 'model',
						align: 'right',
						type: 'dropdown-btn',
					},
					{
						id: 'version',
						align: 'right',
						type: 'dropdown-btn',
						value: $translate.instant('model.wdeviewer.statusBar.version'),
						iconClass: 'control-icons ico-up'
					},
					{ id: 'markup', align: 'right', type: 'button', value: $translate.instant('model.wdeviewer.statusBar.annotation'), cssClass: 'control-icons ico-up', func: scope.viewerOptions.onOffCommentView},
					{
						id: 'layer',
						align: 'right',
						type: 'button',
						value: $translate.instant('model.wdeviewer.statusBar.layer'),
						cssClass: 'control-icons ico-filter-off'
					}
				].concat(layoutControls));

				var link = sb.getLink();

				function updateLayoutControls() {
					firstControl.disabled = !modelWdeViewerIgeLayoutService.canFirst();
					prevControl.disabled = !modelWdeViewerIgeLayoutService.canPrevious();
					nextControl.disabled = !modelWdeViewerIgeLayoutService.canNext();
					lastControl.disabled = !modelWdeViewerIgeLayoutService.canLast();
					infoControl.value = modelWdeViewerIgeLayoutService.getTotalInfo();
					toPageControl.value = modelWdeViewerIgeLayoutService.getCurrentPageNumber();
					link.updateFields(layoutControls);
				}

				modelWdeViewerIgeLayoutService.currentLayoutChanged.register(updateLayoutControls);

				scope.$on('$destroy', function () {
					modelWdeViewerIgeLayoutService.currentLayoutChanged.unregister(updateLayoutControls);
				});

				return link;
			};

			service.updateModel = function updateModel(statusBarLink, wdeCtrl, settings) {
				let project = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
				let currentName = $injector.get('mainViewService').getCurrentModuleName();
				if (!settings.modelId || modelWdeViewerSelectionService.isDocumentModeEnabled() || !project || currentName === 'project.main') {
					return;
				}
				$http.get(globals.webApiBaseUrl + 'model/project/model/list?mainItemId=' + project.id)
					.then(function (res) {
						let response = (res && res.data) ? res.data : res;
						if (response && response.length > 0) {
							let currentModel = null;
							let models = [];
							response.forEach(function (modelItem) {
								if (!modelItem.Is3D) {
									const item = {
										value: modelItem.Uuid,
										text: modelItem.Code + (modelItem.Description && modelItem.Description.length > 0 ? ` (${modelItem.Description})` : ''),
										modelId: modelItem.Id
									};
									models.push(item);
									if (!currentModel && wdeCtrl.getDrawingId() === modelItem.Uuid) {
										currentModel = item;
									}
								}
							});
							if (models.length === 0) {
								return;
							}
							statusBarLink.updateFields([{
								id: 'model',
								value: currentModel.text,
								type: 'dropdown-btn',
								iconClass: 'control-icons ico-up',
								list: {
									showImages: false,
									cssClass: 'dropdown-menu-right',
									items: [
										{
											id: 'filterGroup',
											type: 'sublist',
											list: {
												cssClass: 'radio-group',
												showTitles: true,
												activeValue: currentModel.value,
												items: models.map(function (modelItem) {
													return {
														id: modelItem.value,
														type: 'radio',
														value: modelItem.value,
														caption: modelItem.text,
														fn: function () {
															statusBarLink.updateFields([{
																id: 'model',
																value: modelItem.text
															}]);
															wdeCtrl.setModelAndRefresh(modelItem.modelId);
														}
													};
												})
											}
										}
									]
								}
							}]);
						}
					});
			};
			service.resetModel = function resetModel(statusBarLink) {
				statusBarLink.updateFields([{
					id: 'model',
					list: {}
				}]);
			};
			service.updateLayout = function updateLayout(statusBarLink, wdeCtrl, settings) {
				if (settings && settings.modelId) {
					return updateLayoutByModel(statusBarLink, wdeCtrl, settings);
				} else {
					return updateLayoutInPreview(statusBarLink, wdeCtrl);
				}
			};

			function updateLayoutInPreview(statusBarLink, wdeCtrl) {
				var layouts = wdeCtrl.getLayouts();
				var currentLayout = wdeCtrl.getCurrentLayout();

				statusBarLink.updateFields([{
					id: 'layout',
					value: currentLayout.name,
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 'filterGroup',
								type: 'sublist',
								list: {
									cssClass: 'radio-group',
									showTitles: true,
									activeValue: currentLayout.id,
									items: layouts.map(function (layout) {
										return {
											id: layout.id,
											type: 'radio',
											value: layout.id,
											caption: layout.name,
											fn: function () {
												statusBarLink.updateFields([{
													id: 'layout',
													value: layout.name
												}]);
												wdeCtrl.setCurrentLayout(layout.id);
											}
										};
									})
								}
							}
						]
					}
				}]);
			}

			function getCurrentLayoutName(modelId, wdeCtrl) {
				setModelService(wdeCtrl);
				var currentLayout = wdeCtrl.getCurrentLayout();
				var modelPart = modelService.getModelPart(modelId);
				if (modelPart.settings) {
					var settingLayoutName = _.find(modelPart.settings.layoutNames, {id: currentLayout.id});
					if (settingLayoutName) {
						currentLayout.editName = settingLayoutName.editName;
					}
				}
				if (!wdeCtrl || !wdeCtrl.views || !wdeCtrl.views.layoutDetails || !modelId) {
					if (!wdeCtrl || !wdeCtrl.views || !wdeCtrl.views.drawingDetails || !modelId) {
						return !currentLayout.editName ? currentLayout.name : currentLayout.editName;
					}
				}
				var layoutDetails = wdeCtrl.views.layoutDetails;
				if (angular.isUndefined(layoutDetails) || layoutDetails === null) {
					layoutDetails = wdeCtrl.views.drawingDetails;
				}
				currentLayout.editName = wdeService.removeStartWithPage(currentLayout.name);
				var filename = layoutDetails.filename;
				if (!filename || (filename && (filename.toLocaleLowerCase().endsWith('pdf') || filename.toLocaleLowerCase().endsWith('dwg')))) {
					if (modelPart && modelPart.settings && modelPart.settings.layoutSort && modelPart.settings.layoutSort.length > 0) {
						var num = modelPart.settings.layoutSort.indexOf(currentLayout.id) + 1;
						return num + ': ' + currentLayout.editName;
					}
				}
				var number = layoutDetails.layouts.indexOf(_.find(layoutDetails.layouts, {id: currentLayout.id})) + 1;
				return number + ': ' + currentLayout.editName;
			}

			function updateLayoutByModel(statusBarLink, wdeCtrl, settings) {
				setModelService(wdeCtrl);
				var currentLayoutName = getCurrentLayoutName(settings.modelId, wdeCtrl);

				function updateLayoutStatus() {
					statusBarLink.updateFields([{
						id: 'layout',
						value: currentLayoutName,
						func: function () {
							var layoutPopup = popup.toggle({
								plainMode: true,
								maxHeight: 400,
								hasDefaultWidth: false,
								focusedElement: $(event.currentTarget),
								controller: 'modelWdeViewLayoutController',
								templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/layout-view.html',
								resolve: {
									wdeCtrl: [
										function () {
											return wdeCtrl;
										}
									],
									statusBarLink: [
										function () {
											return statusBarLink;
										}
									],
									layoutModelId: [
										function () {
											if (settings) {
												return settings.modelId;
											} else {
												return null;
											}
										}
									]
								}
							});
							if (layoutPopup) {
								layoutPopup.closed.then(function () {
									var modelPart = modelService.getModelPart(settings.modelId);
									if (modelPart && modelService.isLayoutNameChange) {
										modelService.isLayoutNameChange = false;
										var object2DWebApiBaseUrl = globals.webApiBaseUrl + 'model/main/object2d/';
										$http.post(object2DWebApiBaseUrl + 'savemodelconfig', modelPart.config).then(function (res) {
											modelPart.config = res.data;
										});
									}
								});
							}
						}
					}]);
				}

				updateLayoutStatus();
			}

			service.updateLayer = function (statusBarLink, wdeCtrl) {
				var layers = wdeCtrl.getLayers();

				function hasLayerFiler() {
					return layers.some(function (layer) {
						return !layer.checked;
					});
				}

				function updateLayerStatus() {
					statusBarLink.updateFields([{
						id: 'layer',
						cssClass: hasLayerFiler() ? 'control-icons ico-filter-on' : 'control-icons ico-filter-off',
						func: function () {
							popup.toggle({
								plainMode: true,
								maxHeight: 500,
								hasDefaultWidth: false,
								focusedElement: $(event.currentTarget),
								controller: 'modelWdeViewLayerController',
								templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/layer-view.html',
								resolve: {
									wdeCtrl: [
										function () {
											return wdeCtrl;
										}
									],
									statusBarLink: [
										function () {
											return statusBarLink;
										}
									]
								}
							});
						}
					}]);
				}

				updateLayerStatus();
			};

			service.updateMarkupComment = function updateMarkupComment(statusBarLink, wdeCtrl){
				statusBarLink.updateFields([{
					id: 'markup',
					value: $translate.instant('model.wdeviewer.statusBar.annotation'),
					func: function () {
						var markupPopup = popup.toggle({
							plainMode: true,
							maxHeight: 400,
							hasDefaultWidth: false,
							focusedElement: $(event.currentTarget),
							controller: 'modelWdeViewerMarkupCommentController',
							templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/markup-comment.html',
							resolve: {
								wdeCtrl: [
									function () {
										return wdeCtrl;
									}
								],
								statusBarLink: [
									function () {
										return statusBarLink;
									}
								]
							}
						});
					}
				}]);
			};

			service.resetLayout = function (statusBarLink) {
				statusBarLink.updateFields([{
					id: 'layout',
					value: $translate.instant('model.wdeviewer.statusBar.page'),
					list: {},
					func: function () {}
				}]);
				modelWdeViewerIgeLayoutService.resetLayout();
			};

			service.resetLayer = function (statusBarLink) {
				statusBarLink.updateFields([{
					id: 'layer',
					value: $translate.instant('model.wdeviewer.statusBar.layer'),
					cssClass: 'control-icons ico-filter-off'
				}]);
			};

			service.versionSelect = {};
			service.updateVersion = function updateVersion(statusBarLink, wdeCtrl, settings) {
				if (!settings.modelId) {
					return;
				}
				let modelUrl = 'model/project/model/version/list?modelId=';
				if (modelWdeViewerSelectionService.isDocumentModeEnabled() || $injector.get('modelWdeViewerMarkupService').isDocumentDefaultMode) {
					modelUrl = 'model/wdeviewer/info/modelversion?modelId=';
				}
				$http.get(globals.webApiBaseUrl + modelUrl + settings.modelId)
					.then(function (res) {
						let response = (res && res.data) ? res.data : res;
						if (response && response.length > 0) {
							var currentVersion = null, versions = [];

							if (wdeCtrl.ige) {
								versions = _.map(response, function (versionItem) {
									var item = {
										value: versionItem.Uuid,
										text: versionItem.Code,
										modelId: versionItem.Id
									};
									if (wdeCtrl.getDrawingId() === versionItem.Uuid) {
										currentVersion = item;
									}
									return item;
								});
							} else {
								var wdeInstance = wdeCtrl.getWDEInstance();
								versions = _.map(response, function (versionItem) {
									var item = {
										value: versionItem.Uuid,
										text: versionItem.Code,
										modelId: versionItem.Id
									};
									if (wdeInstance && wdeInstance.wdeClient.drawingId === versionItem.Uuid) {
										currentVersion = item;
									}
									return item;
								});
							}

							if (!currentVersion) {
								if (service.versionSelect.value && _.find(versions, {value: service.versionSelect.value})) {
									currentVersion = _.find(versions, {value: service.versionSelect.value});
								} else {
									currentVersion = versions[0];
								}
							}
							statusBarLink.updateFields([{
								id: 'version',
								value: currentVersion.text,
								list: {
									showImages: false,
									cssClass: 'dropdown-menu-right',
									items: [
										{
											id: 'filterGroup',
											type: 'sublist',
											list: {
												cssClass: 'radio-group',
												showTitles: true,
												activeValue: currentVersion.value,
												items: versions.map(function (versionItem) {
													return {
														id: versionItem.value,
														type: 'radio',
														value: versionItem.value,
														caption: versionItem.text,
														fn: function () {
															statusBarLink.updateFields([{
																id: 'version',
																value: versionItem.text
															}]);
															service.versionSelect = versionItem;
															var modelVersionService = $injector.get('modelProjectModelVersionDataService');
															var isLoad = false;
															if (modelVersionService) {
																var modelVersion = _.find(modelVersionService.getList(), {Id: versionItem.modelId});
																if (modelVersion) {
																	isLoad = true;
																	modelVersionService.setSelected(modelVersion);
																}
															}
															if (!isLoad) {
																wdeCtrl.setModelAndRefresh(versionItem.modelId);
															}
														}
													};
												})
											}
										}
									]
								}
							}]);
						}
						// else{
						//    statusBarLink.updateFields([{id: 'version', delete: true}]);
						// }
					});
			};

			service.resetVersion = function resetVersion(statusBarLink) {
				statusBarLink.updateFields([{
					id: 'version',
					value: $translate.instant('model.wdeviewer.statusBar.version'),
					list: {}
				}]);
				statusBarLink.updateFields([{
					id: 'status',
					value: ''
				}]);
			};

			return service;
		}
	]);

})(angular);


