
(function (angular) {
	'use strict';
	/* global WDE_CONSTANTS,Module */

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeviewerToolMarkerController', ['$scope', 'wdeCtrl', '$injector', '$translate',
		function ($scope, wdeCtrl, $injector, $translate) {
			var modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
			let isNoMarkupDialog = false;
			let defaultMarkupColor = '#FF0000';// default hard code red

			$scope.istoolAnno = modelWdeViewerAnnotationService ? modelWdeViewerAnnotationService.isCreateMultipleMarkers : false;
			$scope.istoolCloud = false;
			$scope.istoggleAnnoVisibility = true;
			$scope.fontSize = 1;
			$scope.markerItems = [
				{
					id: 'Point',
					caption: $translate.instant('model.wdeviewer.markup.point'),
					disabled: false,
					iconClass: 'tlb-icons ico-mark-point',
					hasCloud: false,
					fn: markupModeType
				}, {
					id: 'Tick',
					caption: $translate.instant('model.wdeviewer.markup.tick'),
					disabled: false,
					iconClass: 'tlb-icons ico-mark-tick',
					hasCloud: false,
					fn: markupModeType
				}, {
					id: 'Cross',
					caption: $translate.instant('model.wdeviewer.markup.cross'),
					disabled: false,
					iconClass: 'tlb-icons ico-mark-cross',
					hasCloud: false,
					fn: markupModeType
				},
				{
					id: 'Line',
					caption: $translate.instant('model.wdeviewer.markup.line'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-line',
					fn: markupModeType
				},
				{
					id: 'Arrow',
					caption: $translate.instant('model.wdeviewer.markup.arrow'),
					disabled: false,
					hasCloud: false,
					iconClass: 'tlb-icons ico-mark-arrow',
					fn: markupModeType
				},
				{
					id: 'Rectangle',
					caption: $translate.instant('model.wdeviewer.markup.rectangle'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-rectangle',
					fn: markupModeType
				},
				{
					id: 'Ellipse',
					caption: $translate.instant('model.wdeviewer.markup.ellipse'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-ellipse',
					fn: markupModeType
				},
				{
					id: 'Freehand',
					caption: $translate.instant('model.wdeviewer.markup.freehand'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-freehand-line',
					fn: markupModeType
				},
				{
					id: 'FreehandArrow',
					caption: $translate.instant('model.wdeviewer.markup.freehandArrow'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-freehand-line',
					fn: markupModeType
				},
				{
					id: 'Text',
					caption: $translate.instant('model.wdeviewer.markup.text'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-text',
					fn: markupModeType
				},
				{
					id: 'RectangleHighlighter',
					caption: $translate.instant('model.wdeviewer.markup.rectangleHighlighter'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-rectangle',
					fn: markupModeType
				},
				{
					id: 'EllipseHighlighter',
					caption: $translate.instant('model.wdeviewer.markup.ellipseHighlighter'),
					disabled: false,
					hasCloud: true,
					iconClass: 'tlb-icons ico-mark-ellipse',
					fn: markupModeType
				},
			];

			init();

			function init() {
				var igeInstance = wdeCtrl.getIGEInstance();
				if (igeInstance) {
					$scope.istoolCloud = igeInstance.isCloudStyle;
					$scope.istoggleAnnoVisibility = igeInstance.optionAsBool('SHOW_MARKUPS');
					$scope.fontSize = getFontSize();
				}
				getViewSettingToDefaultMarkup();
				if (modelWdeViewerAnnotationService && modelWdeViewerAnnotationService.activeMarker && isNoMarkupDialog) {
					let markerItem = _.find($scope.markerItems, {id: modelWdeViewerAnnotationService.activeMarker.id});
					markerItem.isActive = true;
				}
			}

			function getViewSettingToDefaultMarkup() {
				const viewerId = wdeCtrl.settings.viewerId;
				if (!viewerId) {
					return;
				}
				const viewSettings = $injector.get('modelWdeViewerIgeService').getViewSetting(viewerId);
				isNoMarkupDialog = viewSettings.noMarkupDialog;

				if (viewSettings.defaultMarkupColor) {
					defaultMarkupColor = $injector.get('basicsCommonDrawingUtilitiesService').decToHexColor(viewSettings.defaultMarkupColor);
				}
			}

			$scope.toolAnnoClick = function () {
				$scope.istoolAnno = !$scope.istoolAnno;
				if (modelWdeViewerAnnotationService) {
					modelWdeViewerAnnotationService.isCreateMultipleMarkers = $scope.istoolAnno;
				}
			};
			$scope.toolAnnoShow = function () {
				if ($injector.get('modelWdeViewerSelectionService').isDocumentModeEnabled()) {
					return false;
				}
				return wdeCtrl.isHideAnnoTool !== true;
			};
			$scope.toolAnnoVisibilityClick = function () {
				$scope.istoggleAnnoVisibility = !$scope.istoggleAnnoVisibility;
				var igeInstance = wdeCtrl.getIGEInstance();
				if (igeInstance) {
					igeInstance.setOptionAsBool('SHOW_MARKUPS', !igeInstance.optionAsBool('SHOW_MARKUPS'));
				}
				closePopup();
			};
			$scope.toolCloudClick = function () {
				$scope.istoolCloud = !$scope.istoolCloud;
				var igeInstance = wdeCtrl.getIGEInstance();
				if (igeInstance) {
					igeInstance.isCloudStyle = $scope.istoolCloud;
				}
			};
			$scope.getValue = function (item) {
				var message = item.caption;
				if ($scope.istoolCloud && item.hasCloud) {
					message = message + $translate.instant('model.wdeviewer.markup.addCloud');
				}
				return message;
			};

			$scope.fontSizeIncrease = function () {
				$scope.fontSize = getFontSize() * 1.2;
				fontSizeChange();
				closePopup();
			};

			$scope.fontSizeDecrease = function () {
				$scope.fontSize = getFontSize() * 0.8;
				fontSizeChange();
				closePopup();
			};

			$scope.fontSizeSet = fontSizeChange;

			function fontSizeChange() {
				var igeInstance = wdeCtrl.getIGEInstance();
				if (igeInstance) {
					var fontSizeNum = Number ? Number($scope.fontSize) : $scope.fontSize;
					igeInstance.setOptionAsFloat('MARKUP_FONT_SCALE', fontSizeNum);
					setViewSettingWithScale(wdeCtrl, fontSizeNum);
				}
			}

			function getFontSize() {
				var igeInstance = wdeCtrl.getIGEInstance();
				if (igeInstance) {
					let num = igeInstance.optionAsFloat('MARKUP_FONT_SCALE');
					if (num.toFixed) {
						num = num.toFixed(2);
					}
					return Number ? Number(num) : num;
				}
				return 1;
			}

			function setViewSettingWithScale(igeCtrl, value) {
				var viewerId = igeCtrl.settings.viewerId;
				if (!viewerId) {
					return;
				}
				var modelWdeViewerIgeService = $injector.get('modelWdeViewerIgeService');
				var viewSettings = modelWdeViewerIgeService.getViewSetting(viewerId);
				viewSettings.markupScale = value;
				$injector.get('mainViewService').customData(viewerId, 'viewerSettings', viewSettings);
			}

			function markupModeType(item) {
				if (wdeCtrl.getIGEInstance) {
					var igeInstance = wdeCtrl.getIGEInstance();
					var defaultMarkupType = {
						colour: defaultMarkupColor,
						fillColour: '#00000000',
						flags: igeInstance.optionAsInteger('MARKUP_SCREEN_SPACE_DEFAULT'),
						shape: Module.MarkupRegionShape.Rectangle.value,
						startPointStyle: Module.MarkupPointStyle.Default,
						endPointStyle: Module.MarkupPointStyle.Default,
						lineOptions: Module.MarkupLineOptions.None.value,
						linePatternId: Module.MarkupPointStyle.Default.value,
						lineThickness: igeInstance.optionAsInteger('MARKUP_LINE_WIDTH_DEFAULT')
					};
					let markupService = $injector.get('modelWdeViewerMarkupService');
					let annoExtensionSrv = markupService.annoExtensionService;
					defaultMarkupType.lineOptions = igeInstance.isCloudStyle ? Module.MarkupLineOptions.Cloud.value : Module.MarkupLineOptions.None.value;
					let markupType = Module.MarkupType.Point;
					switch (item.id) {
						case 'Point':
							defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
							break;
						case 'Tick':
							defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
							if (!isNoMarkupDialog && !annoExtensionSrv) {
								defaultMarkupType.colour = '#00FF00FF';// green color
							}
							defaultMarkupType.startPointStyle = Module.MarkupPointStyle.Tick;
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Tick;
							break;
						case 'Cross':
							defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
							if (!isNoMarkupDialog && !annoExtensionSrv) {
								defaultMarkupType.colour = '#FF0000FF';// red color
							}
							defaultMarkupType.startPointStyle = Module.MarkupPointStyle.Cross;
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Cross;
							break;
						case 'Line':
							markupType = Module.MarkupType.Line;
							break;
						case 'Arrow':
							markupType = Module.MarkupType.Line;
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Arrow;
							defaultMarkupType.lineOptions = Module.MarkupLineOptions.None.value;
							break;
						case 'Rectangle':
							markupType = Module.MarkupType.Region;
							break;
						case 'Ellipse':
							markupType = Module.MarkupType.Region;
							defaultMarkupType.shape = Module.MarkupRegionShape.Ellipse.value;
							break;
						case 'Freehand':
							markupType = Module.MarkupType.Freehand;
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Default;
							break;
						case 'FreehandArrow':
							markupType = Module.MarkupType.Freehand;
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.Arrow;
							break;
						case 'Text':
							defaultMarkupType.endPointStyle = Module.MarkupPointStyle.NotVisible;
							break;
						case 'RectangleHighlighter':
							markupType = Module.MarkupType.Region;
							// The current color control does not support transparency selection, but ige can set transparency with a reference value of 80
							defaultMarkupType.colour = defaultMarkupType.colour + '80';
							defaultMarkupType.fillColour = defaultMarkupType.colour;
							break;
						case 'EllipseHighlighter':
							markupType = Module.MarkupType.Region;
							defaultMarkupType.shape = Module.MarkupRegionShape.Ellipse.value;
							defaultMarkupType.colour = defaultMarkupType.colour + '80';// 80 = Color transparency
							defaultMarkupType.fillColour = defaultMarkupType.colour;
							break;
					}
					if (annoExtensionSrv) {
						annoExtensionSrv.createMarkup(igeInstance, markupType, defaultMarkupType)
					} else {
						igeInstance.createMarkup(markupType, defaultMarkupType);
					}
					if (isNoMarkupDialog) {
						$scope.markerItems.forEach(function (item) {
							item.isActive = false;
						});
						item.isActive = true;
						modelWdeViewerAnnotationService.activeMarker = angular.copy(item);
						modelWdeViewerAnnotationService.activeMarker.markupType = markupType;
						modelWdeViewerAnnotationService.activeMarker.defaultMarkupStyle = defaultMarkupType;
					}
				} else if (wdeCtrl.getWDEInstance) {
					var WDESingleInstance = wdeCtrl.getWDEInstance();
					var type = WDE_CONSTANTS.MARKUP_NONE;
					switch (item.id) {
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
						case 'FreehandArrow':
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
				}
				closePopup();
			}
			function closePopup() {
				if ($scope.close) {
					$scope.close(true);
				} else if ($scope.$parent.$close) {
					$scope.$parent.$close(true);
				}
			}

			function isCreateMultipleMarkersChanged(args) {
				$scope.istoolAnno = args.value;
			}

			if (modelWdeViewerAnnotationService) {
				modelWdeViewerAnnotationService.isCreateMultipleMarkersChanged.register(isCreateMultipleMarkersChanged);
				$scope.$on('$destroy', function () {
					modelWdeViewerAnnotationService.isCreateMultipleMarkersChanged.unregister(isCreateMultipleMarkersChanged);
				});
			}
		}
	]);

})(angular);