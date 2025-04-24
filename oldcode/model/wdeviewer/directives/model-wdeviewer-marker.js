/**
 * Created by wui on 12/25/2018.
 */

/* globals WDE_CONSTANTS */
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).directive('modelWdeViewerMarker', ['basicsCommonDrawingUtilitiesService', 'modelWdeViewerMarkerService',
		function (basicsCommonDrawingUtilitiesService, modelWdeViewerMarkerService) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/marker.html',
				link: function (scope) {
					var wdeCtrl = scope.ctrl;

					scope.markers = [
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Lines',
							cls: 'tlb-icons ico-mark-line',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_LINES);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Arrow',
							cls: 'tlb-icons ico-mark-arrow',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_ARROW);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Rectangle',
							cls: 'tlb-icons ico-mark-rectangle',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_RECTANGLE);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Ellipse',
							cls: 'tlb-icons ico-mark-ellipse',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_ELLIPSE);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Freehand',
							cls: 'tlb-icons ico-mark-freehand-line',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_FREEHAND);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Text',
							cls: 'tlb-icons ico-mark-text',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_TEXT);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Cloud',
							cls: 'tlb-icons ico-mark-cloud',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_CLOUD);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							group: 'mode',
							type: 'checkbox',
							title: 'Pin',
							cls: 'tlb-icons ico-mark-pin',
							checked: false,
							fn: function (value) {
								var WDESingleInstance = wdeCtrl.getWDEInstance();

								if (WDESingleInstance) {
									if (value) {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_PIN);
									} else {
										WDESingleInstance.setMarkupMode(WDE_CONSTANTS.MARKUP_NONE);
									}
								}
							}
						},
						{
							type: 'button',
							title: 'Settings',
							cls: 'tlb-icons ico-settings',
							fn: function () {
								modelWdeViewerMarkerService.showSettingsConfigDialog().then(function (result) {
									if (result.ok) {
										var WDESingleInstance = wdeCtrl.getWDEInstance();

										if (WDESingleInstance) {
											var settings = modelWdeViewerMarkerService.settings;
											var rgb = basicsCommonDrawingUtilitiesService.intToRgbColor(settings.color);
											WDESingleInstance.setMarkupColour([rgb.r / 256, rgb.g / 256, rgb.b / 256]);
											WDESingleInstance.setMarkupLineWidth(settings.lineWidth);
										}
									}
								});
							}
						},
						{
							type: 'button',
							title: 'Test',
							cls: 'tlb-icons ico-settings',
							fn: function () {
								var viewpoint = wdeCtrl.getViewpoint();
								// pull apart the entire viewpoint for saving into a database etc..
								// how to get the guid
								var guid = viewpoint.getGUID();

								// how to get the camera data.
								var cameraData = viewpoint.getCameraData();
								var cameraDataRaw = cameraData.serialize();

								// how to get the scene statistics
								var sceneStates = viewpoint.getSceneStates();

								// how to save the markup's
								var markups = [];
								for (var i = 0; i < viewpoint.getMarkupCount(); i++) {
									var markup = viewpoint.getMarkup(i);
									markups.push(markup.serialize());
								}

							}
						}
					];

					scope.getMarkerCls = function (marker) {
						return marker.cls + ' btn-marker' + ((marker.type === 'checkbox' && marker.checked) ? ' checked' : '');
					};

					scope.clickMarker = function (marker) {
						if (marker.type === 'checkbox') {
							scope.checkMarker(marker);
						} else {
							marker.fn();
						}
					};

					scope.checkMarker = function (marker) {
						marker.checked = !marker.checked;

						if (marker.checked) {
							scope.markers.filter(function (item) {
								return item.group === marker.group;
							}).forEach(function (item) {
								if (item !== marker) {
									item.checked = false;
								}
							});
						}

						marker.fn(marker.checked);
					};
				}
			};
		}
	]);

})(angular);