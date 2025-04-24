/**
 * Created by wui on 7/7/2019.
 */

(function (angular) {
	/* global globals,jQuery,$,_,WDE_CONSTANTS,Module */
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerIgePreviewController', [
		'$scope',
		'$timeout',
		'$stateParams', '$injector', '$http',
		'modelWdeViewerDataMode', 'modelWdeViewerMarkupService', 'modelWdeViewerMarkerService', 'basicsCommonDrawingUtilitiesService',
		'modelWdeViewerPreviewDataService', 'modelWdeViewerStatusBarService', '$translate', 'modelWdeViewerIgeService',
		function ($scope,
			$timeout,
			$stateParams, $injector, $http,
			modelWdeViewerDataMode, modelWdeViewerMarkupService, modelWdeViewerMarkerService, basicsCommonDrawingUtilitiesService,
			modelWdeViewerPreviewDataService, modelWdeViewerStatusBarService, $translate, modelWdeViewerIgeService) {
			var _igeCtrl, docId = $stateParams.docid;

			$injector.get('modelWdeViewerSelectionService').enableDocumentMode();
			$scope.viewerOptions = {
				// viewerId: '41bb6e657fda70ce4fc913da78e28131',
				dataMode: modelWdeViewerDataMode.doc,
				fileDocId: $stateParams.docid,
				drawMarkupTitle: $translate.instant('model.wdeviewer.marker.drawMarkup'),
				settingTitle: $translate.instant('model.wdeviewer.marker.setting'),
				configTitle: $translate.instant('model.wdeviewer.configTitle'),
				showMarkerTitle: $translate.instant('model.wdeviewer.marker.showMarker'),
				downloadPdfTitle: $translate.instant('basics.common.upload.button.downloadPdfCaption'),
				disabledDownloadPdf: false,
				printTitle: $translate.instant('cloud.common.print'),
				docRevisionId: null,
				documentData: null,
				viewLayouts: [],
				currentViewLayout: {},
				lastViewLayout: {},
				showMarker: false,
				hidePosition: true,
				hideSidebar: true,
				showCommentSidebar: false,
				showCommentView: false,
				showMarkups: false,
				showLayers: false,
				onOffCommentView: function () {
					$scope.viewerOptions.showCommentView = !$scope.viewerOptions.showCommentView;
				},
				onIgeCreated: function (igeInstance, igeCtrl) {
					_igeCtrl = igeCtrl;
					modelWdeViewerIgeService.isCurrentLayoutCalibrated($scope.viewerOptions.documentData.PreviewModelFk);
				}
			};
			$scope.fileInfo = {
				name: null
			};

			$scope.onMouseEnter = function (e) {
				e.currentTarget.focus({preventScroll: true});
			};

			$scope.onMouseLeave = function (e) {
				e.currentTarget.blur();
			};

			$scope.configDialog = function configDialog() {
				modelWdeViewerIgeService.isPreviewDocument = true;
				applyToWde(function func(wdeCtrl) {
					wdeCtrl.showViewConfigDialog();
				});
			};
			$scope.refreshView = function refreshView(){
				applyToWde(function (wdeCtrl) {
					wdeCtrl.refreshView();
				});
			};

			$scope.printView = function printView() {
				let igeInstance = _igeCtrl.getIGEInstance();
				let layouts = _igeCtrl.getLayouts();
				let currentLayout = _igeCtrl.getCurrentLayout();
				if (!igeInstance) {
					return;
				}
				$http.post(globals.webApiBaseUrl + 'model/wdeviewer/info/print', {
					ModelId: $scope.viewerOptions.documentData.PreviewModelFk,
					ModelObjectIds: [],
					UomFk: null
				}).then(function (res) {
					let legends = res.data.Legends;
					if (legends && legends.length) {
						legends.forEach(function (legend) {
							legend.PositiveValue = 0;
							legend.NegativeValue = 0;
							legend.PositiveValue = legend.PositiveValue.toFixed(2);
							legend.NegativeValue = legend.NegativeValue.toFixed(2);
						});
					}

					res.data.pageInfo = (layouts.indexOf(currentLayout) + 1) + '/' + layouts.length;
					$injector.get('modelWdeViewerPrintingService').publishIge(igeInstance, res.data);
				});
			};

			$scope.downloadPdf = function downloadPdf(){
				let igeInstance = _igeCtrl.getIGEInstance();
				if (!igeInstance || _.isNil($scope.viewerOptions.documentData.PreviewModelFk)) {
					return;
				}
				let annoService = $injector.get('modelWdeViewerAnnotationService');
				annoService.saveDrawingFileName = $scope.fileInfo.name;
				annoService.savePdfWithAnnMarker($scope.viewerOptions.documentData.PreviewModelFk);
			};
			$scope.isAllSelect = modelWdeViewerMarkupService.isAllSelect;

			$scope.showMarker = function showMarker(){
				$scope.isAllSelect = !$scope.isAllSelect;
				modelWdeViewerMarkupService.showAnnoMarkerByAll($scope.isAllSelect);
				modelWdeViewerMarkupService.showAnnotationChange.fire({value: $scope.isAllSelect, isAll: true});
			};

			$scope.rotateLeft = function rotateLeft() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					igeInstance.rotateDrawing(-90);
				}
			};

			$scope.rotateRight = function rotateRight() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					igeInstance.rotateDrawing(90);
				}
			};

			$scope.resetView = function resetView() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					igeInstance.resetView();

					_.forEach(modelWdeViewerMarkupService.commentMarkups, function mapMarkups(item) {
						item.isSelect = false;
						item.IsShow = false;
						modelWdeViewerMarkupService.deleteMarkupOnView(modelWdeViewerMarkupService.wdeCtrl.getIGEInstance(), item);
					});
					$scope.isAllSelect = false;
				}
			};

			$scope.zoomIn = function zoomIn() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					igeInstance.zoomIn();
				}
			};

			$scope.zoomOut = function zoomOut() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					igeInstance.zoomOut();
				}
			};

			$scope.zoomLastMarkup = function zoomOut() {
				var igeInstance = _igeCtrl.getIGEInstance();

				if (igeInstance) {
					let selItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect:true});
					igeInstance.zoomToMarkup(selItem.originMarker);
				}
			};

			$scope.toggleSidebar = function toggleSidebar(index, istoggle) {
				_igeCtrl.toggleSidebar(index, istoggle);
			};

			$scope.markerDropdown = {
				cssClass: 'tlb-icons ico-marker-icon',
				showSVGTag: false,
				list: {
					cssClass: 'dropdown-menu dropdown-menu-right',
					items: $injector.get('modelWdeMarkerItems').Items($scope)
				}
			};

			let popup = $injector.get('basicsLookupdataPopupService').getToggleHelper();
			$scope.markerAction = function () {
				applyToWde(function (wdeCtrl) {
					popup.toggle({
						plainMode: true,
						maxHeight: 500,
						hasDefaultWidth: false,
						focusedElement: $(event.currentTarget),
						controller: 'modelWdeviewerToolMarkerController',
						templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/tools-marker.html',
						resolve: {
							wdeCtrl: [
								function () {
									wdeCtrl.isHideAnnoTool = true;
									return wdeCtrl;
								}
							]
						}
					});
				});
			};
			jQuery(window).on('resize', resizeCommentView);

			function resizeCommentView() {
				var winHeight = $(window).height() - 100;
				$('#markupCommentList').css('height', winHeight);
				$('#canvas').css('height', winHeight + 60);
			}

			function defaultSetting() {
				var WDESingleInstance = _igeCtrl.getIGEInstance();
				if(WDESingleInstance.setMarkupLineWidth) {
					WDESingleInstance.setMarkupLineWidth(1);
				}
			}

			$scope.changeViewLayout = function changeViewLayout(value) {
				_igeCtrl.setCurrentLayoutId(value.id);
				$scope.viewerOptions.lastViewLayout = $scope.viewerOptions.currentViewLayout;
			};

			var actionItemsLink = null;
			var isLoaded = false;
			var statusBarList = {
				cssClass: 'row-2-groups',
				items: [
					{align: 'left', id: 'status', toolTip: '', type: 'text', visible: true, value: 'loading'},
					{align: 'left', id: 'markups', toolTip: '', type: 'text', visible: true},
					{align: 'right', id: 'markup', toolTip: '', type: 'button', value: 'Markup', cssClass: 'control-icons ico-up', func: $scope.viewerOptions.onOffCommentView},
					{align: 'right', id: 'layout', type: 'button', value: 'Page', cssClass: 'control-icons ico-up'},
					{align: 'right', id: 'layer', toolTip: '', type: 'button', value: 'Layer Filter', cssClass: 'control-icons ico-filter-off'}
				]
			};

			$scope.previewStatusBarLink = function previewStatusBarLink(link) {
				actionItemsLink = link;
				link.setFields(statusBarList);
			};
			function applyToWde(func) {
				$scope.$broadcast('wde.apply', func);
			}

			function showLayoutStatus() {
				applyToWde(function func(wdeCtrl) {
					let layouts = wdeCtrl.getLayouts();
					if (layouts.length < 2) {
						let layoutBar = _.find(statusBarList.items, {id: 'layout'});
						if (layoutBar) {
							layoutBar.visible = false;
						}
					}
					actionItemsLink.updateFields(statusBarList.items);
					modelWdeViewerStatusBarService.updateLayout(actionItemsLink, wdeCtrl, {
						modelId: $scope.viewerOptions.documentData.PreviewModelFk
					});
				});
			}

			function showLayerStatus() {
				applyToWde(function func(wdeCtrl) {
					var layers = wdeCtrl.getLayers();
					if (layers.length < 2) {
						var layoutBar = _.find(statusBarList.items, {id: 'layer'});
						if (layoutBar) {
							layoutBar.visible = false;
						}
					}
					actionItemsLink.updateFields(statusBarList.items);
					modelWdeViewerStatusBarService.updateLayer(actionItemsLink, wdeCtrl);
				});
			}

			$scope.$on('model.wdeviewer.status', function func(e, msg) {
				actionItemsLink.updateFields([{
					id: 'status',
					value: msg
				}]);
			});
			$scope.$on('model.wdeviewer.loading', function func() {
				$('#canvas').css('height', $(window).height() - 40);
				isLoaded = false;
				modelWdeViewerMarkupService.getDocumentPreviewData().then(function (res){
					if (res && res.config && res.config.title !== ' ' && res.fileArchiveDocId === docId) {
						$scope.fileInfo.name = res.config.title;
						isPdfName();
					}
				});
				if ($scope.viewerOptions.documentData && $scope.viewerOptions.documentData.PreviewModelFk) {
					$injector.get('modelWdeViewerSelectionService').previewDocument($scope.viewerOptions.documentData.PreviewModelFk);
				}
			});
			$scope.$on('model.wdeviewer.loaded', function func() {
				isLoaded = true;
				showLayoutStatus();
				showLayerStatus();
				defaultSetting();
				resizeCommentView();
				applyToWde(function func(ctrl) {
					modelWdeViewerMarkupService.igeCtrl = ctrl;
				});
				$scope.isAllSelect = false;
			});

			if ($scope.docId === null || $scope.docId === '' || angular.isUndefined($scope.docId)) {
				modelWdeViewerPreviewDataService.previewById(docId).then(function callback(res) {
					$scope.docId = res.data;
				});
			}
			if (docId && docId > 0) {
				getDocumentData();
			}

			if ($scope.fileInfo.name === null) {
				modelWdeViewerPreviewDataService.getFileName(docId).then(function callback(res) {
					$scope.fileInfo.name = res;
					isPdfName();
				});
			}

			function isPdfName() {
				if ($scope.fileInfo.name.lastIndexOf('.') < 0) return;
				const extension = $scope.fileInfo.name.substr($scope.fileInfo.name.lastIndexOf('.') + 1);
				$scope.viewerOptions.disabledDownloadPdf = extension.toLowerCase() !== 'pdf';
			}
			if ($scope.viewerOptions.docRevisionId === null) {
				modelWdeViewerPreviewDataService.getDocumentRevisionId(docId).then(function callback(res) {
					$scope.viewerOptions.docRevisionId = res.data;
					modelWdeViewerMarkupService.docId = res.data;
				});
			}

			function getDocumentData(){
				modelWdeViewerPreviewDataService.getPreviewDocument(docId).then(function callback(res) {
					$scope.viewerOptions.documentData = res.data;
					modelWdeViewerIgeService.loadModelConfig($scope.viewerOptions.documentData.PreviewModelFk);
				});
			}
		}
	]);

	angular.module(moduleName).controller('modelWdePreviewGotoController', [
		'$scope', '$stateParams', '$state', 'cloudDesktopSidebarService',
		function modelWdePreviewGotoController($scope, $stateParams, $state, cloudDesktopSidebarService) {
			var goViewUrl = globals.defaultState + '.' + $stateParams.modulename;
			$state.go(goViewUrl).then(function callback() {
				if ($stateParams.key !== null) {
					cloudDesktopSidebarService.filterSearchFromPKeys([$stateParams.key]);
				}
			});
		}]);

	angular.module(moduleName).factory('modelWdeMarkerItems', ['modelWdeViewerMarkerService', 'basicsCommonDrawingUtilitiesService','modelWdeViewerAnnotationService',
		function modelWdeMarkerItems(modelWdeViewerMarkerService, basicsCommonDrawingUtilitiesService, modelWdeViewerAnnotationService) {
			var service = {};
			service.Items = function markerItem($scope) {
				var markerItems = [
					{
						id: 'annotationMultiple',
						sort: 120,
						caption: 'model.wdeviewer.markup.annotationMultiple',
						disabled: false,
						type: 'check',
						fn: function (id, item) {
							modelWdeViewerAnnotationService.isCreateMultipleMarkers = item.value;
						}
					},
					{
						id: 'd1',
						type: 'divider'
					},
					{
						id: 'toggleAnnotationVisibility',
						sort: 120,
						caption: 'model.wdeviewer.markup.toggleAnnotationVisibility',
						disabled: false,
						type: 'item',
						fn: function () {
							applyToWde(function func(wdeCtrl) {
								var igeInstance = wdeCtrl.getIGEInstance();
								igeInstance.setOptionAsBool('SHOW_MARKUPS',!igeInstance.optionAsBool('SHOW_MARKUPS'));
							});
						}
					},
					{
						id: 'd1',
						type: 'divider'
					},
					makeItem('Point', 'tlb-icons ico-mark-point', false),
					makeItem('Tick', 'tlb-icons ico-mark-tick', false),
					makeItem('Cross', 'tlb-icons ico-mark-cross', false),
					makeItem('Line', 'tlb-icons ico-mark-line', false),
					makeItem('Arrow', 'tlb-icons ico-mark-arrow', false),
					makeItem('Rectangle', 'tlb-icons ico-mark-rectangle', false),
					makeItem('Ellipse', 'tlb-icons ico-mark-ellipse', false),
					makeItem('Freehand', 'tlb-icons ico-mark-freehand-line', false),
					// makeItem('Cloud', 'tlb-icons ico-mark-cloud', false)
					/* {
						id: 'setting',
						sort: 120,
						caption: 'model.wdeviewer.marker.setting',
						disabled: false,
						type: 'item',
						iconClass: 'tlb-icons ico-settings',
						fn: function (id, item) {
							applyToWde(function func(wdeCtrl) {
								showSetting(wdeCtrl);
								item.value = false;
							});
						}
					} */
				];

				function showSetting(wdeCtrl) {
					modelWdeViewerMarkerService.showSettingsConfigDialog().then(function callback(result) {
						if (result.ok) {
							var WDESingleInstance = wdeCtrl.getIGEInstance();

							if (WDESingleInstance) {
								var settings = modelWdeViewerMarkerService.settings;
								var rgb = basicsCommonDrawingUtilitiesService.intToRgbColor(settings.color);
								WDESingleInstance.setMarkupColour([rgb.r / 256, rgb.g / 256, rgb.b / 256]);
								WDESingleInstance.setMarkupLineWidth(settings.lineWidth);
							}
						}
					});
				}

				function markupModeType(value, markupType, igeCtrl) {
					if (igeCtrl.getIGEInstance) {
						var igeInstance = igeCtrl.getIGEInstance();
						let defaultMarkupType = {
							colour: '#FF0000',
							fillColour: '#FFFFFF',
							shape: Module.MarkupRegionShape.Rectangle.value,
							startPointStyle: Module.MarkupPointStyle.Default,
							endPointStyle: Module.MarkupPointStyle.Default,
							lineOptions: Module.MarkupLineOptions.None.value,
							linePatternId: Module.MarkupPointStyle.Default.value,
							lineThickness: igeInstance.optionAsInteger('MARKUP_LINE_WIDTH_DEFAULT')
						};
						defaultMarkupType.lineOptions = igeInstance.isCloudStyle ? Module.MarkupLineOptions.Cloud.value : Module.MarkupLineOptions.None.value;
						switch (markupType) {
							case 'Point':
								defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
								igeInstance.createMarkup(Module.MarkupType.Point, defaultMarkupType);
								break;
							case 'Tick':
								defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
								defaultMarkupType.colour = '#00FF00FF';
								defaultMarkupType.startPointStyle = Module.MarkupPointStyle.Tick;
								defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Tick;
								igeInstance.createMarkup(Module.MarkupType.Point, defaultMarkupType);
								break;
							case 'Cross':
								defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
								defaultMarkupType.colour = '#FF0000FF';
								defaultMarkupType.startPointStyle = Module.MarkupPointStyle.Cross;
								defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Cross;
								igeInstance.createMarkup(Module.MarkupType.Point, defaultMarkupType);
								break;
							case 'Line':
								igeInstance.createMarkup(Module.MarkupType.Line, defaultMarkupType);
								break;
							case 'Arrow':
								defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Arrow;
								defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
								igeInstance.createMarkup(Module.MarkupType.Line, defaultMarkupType);
								break;
							case 'Rectangle':
								igeInstance.createMarkup(Module.MarkupType.Region, defaultMarkupType);
								break;
							case 'Ellipse':
								defaultMarkupType.shape = Module.MarkupRegionShape.Ellipse.value;
								igeInstance.createMarkup(Module.MarkupType.Region, defaultMarkupType);
								break;
							case 'Freehand':
								igeInstance.createMarkup(Module.MarkupType.Freehand, defaultMarkupType);
								break;
							// case 'Cloud':
							//	defaultMarkupType.lineOptions = Module.MarkupLineOptions.Cloud.value;
							//	igeInstance.createMarkup(Module.MarkupType.Freehand, defaultMarkupType);
							//	break;
						}
					} else if (igeCtrl.getWDEInstance) {
						var WDESingleInstance = igeCtrl.getWDEInstance();
						if (value) {
							var type = WDE_CONSTANTS.MARKUP_NONE;
							switch (markupType) {
								case 'Lines':
									type = WDE_CONSTANTS.MARKUP_LINES;
									break;
								case 'Arrow':
									type = WDE_CONSTANTS.MARKUP_ARROW;
									break;
								case 'Rectangle':
									type = WDE_CONSTANTS.MARKUP_RECTANGLE;
									break;
								case 'Ellipse':
									type = WDE_CONSTANTS.MARKUP_ELLIPSE;
									break;
								case 'Freehand':
									type = WDE_CONSTANTS.MARKUP_FREEHAND;
									break;
								case 'Text':
									type = WDE_CONSTANTS.MARKUP_TEXT;
									break;
								case 'Cloud':
									type = WDE_CONSTANTS.MARKUP_CLOUD;
									break;
								case 'Pin':
									type = WDE_CONSTANTS.MARKUP_PIN;
									break;
							}
							WDESingleInstance.setMarkupMode(type);
						} else {
							WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
						}
					}
				}

				function makeItem(captionTr, cssclass, disabled) {
					return {
						id: captionTr,
						sort: 120,
						caption: captionTr,
						disabled: disabled,
						type: 'item',
						iconClass: cssclass,
						fn: function (id, item) {
							applyToWde(function func(wdeCtrl) {
								markupModeType(item.value, captionTr, wdeCtrl);
							});
						}
					};
				}

				function applyToWde(func) {
					$scope.$broadcast('wde.apply', func);
				}

				return markerItems;
			};
			return service;

		}]);
})(angular);