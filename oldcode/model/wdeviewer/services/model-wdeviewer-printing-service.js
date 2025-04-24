/**
 * Created by wui on 11/4/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	/* global WDE */
	angular.module(moduleName).factory('modelWdeViewerPrintingService', ['platformModalService', 'basicsCommonDrawingUtilitiesService',
		function (platformModalService, basicsCommonDrawingUtilitiesService) {
			var service = {
				publishUrl: globals.webApiBaseUrl + 'model/wdeviewer/',
				isShowLegend: true,
				orientation: {
					portrait: 0,
					landscape: 1
				},
				pageSize: {
					Default: 0,
					A0: 1,
					A1: 2,
					A2: 3,
					A3: 4,
					A4: 5,
				}
			};

			service.showConfigDialog = function (data) {
				return platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/printing-view.html',
					controller: 'modelWdeViewerPrintingController',
					width: 800,
					height: 600,
					resizeable: true,
					resolve: {
						'modelData': [function () {
							return data;
						}]
					}
				});
			};

			service.publish = function (wdeInstance, data) {
				service.showConfigDialog(data).then(function (res) {
					if (!res.success) {
						return;
					}

					// var publishDetail = new WDE.PublishDetail(res.data.header.left, res.data.header.center, res.data.header.right, res.data.footer.left, res.data.footer.center, res.data.footer.right);
					var publishDetail = new WDE.PublishDetail(
						sectionValue(res.data.headerSection.left),
						sectionValue(res.data.headerSection.center),
						sectionValue(res.data.headerSection.right),
						sectionValue(res.data.footerSection.left),
						sectionValue(res.data.footerSection.center),
						sectionValue(res.data.footerSection.right),
						res.data.pageOrientation, res.data.pageSize);
					var dgArray = [];

					if (res.data.showLegend && res.data.legends && res.data.legends.length) {
						res.data.legends.forEach(function (legend) {
							var rgb = basicsCommonDrawingUtilitiesService.intToRgbColor(legend.color);
							var dg = new WDE.DimensionGroup(legend.name, legend.value, new WDE.Colour([rgb.r / 256, rgb.g / 256, rgb.b / 256]));
							dgArray.push(dg);
						});
					}

					var dg1 = new WDE.DimensionGroup('Dimension Group Name', 'Value = 1000 sq feet', new WDE.Colour());
					var dg2 = new WDE.DimensionGroup('Dimension Group Name', 'Value = 1000 sq feet', new WDE.Colour());
					dgArray.push(dg1);
					dgArray.push(dg2);
					wdeInstance.publish(service.publishUrl, publishDetail, dgArray);
				});
			};

			service.publishIge = function (engine, data) {
				service.showConfigDialog(data).then(function (res) {
					if (!res.success) {
						return;
					}

					var detail = {
						title: 'Title1',
						project: 'Project1',
						drawing: 'Drawing1',
						building: 'Building1',
						filename: 'Filename1',
						details: 'Details1',
						product: 'Product1',
						creator: 'Creator1',
						author: 'Author1',
						headerLeft: sectionValue(res.data.headerSection.left),
						headerCentre: sectionValue(res.data.headerSection.center),
						headerRight: sectionValue(res.data.headerSection.right),
						footerLeft: sectionValue(res.data.footerSection.left),
						footerCentre: sectionValue(res.data.footerSection.center),
						footerRight: sectionValue(res.data.footerSection.right),
						useExpandedHeaderFooter: true,
						orientation: service.orientation[res.data.pageOrientation],
						pageSize: service.pageSize[res.data.pageSize]
						// orientation: res.data.pageOrientation,
						// pageSize: res.data.pageSize
					};
					var groups = [];

					if (res.data.showLegend && res.data.legends && res.data.legends.length) {
						res.data.legends.forEach(function (legend) {
							var rgb = basicsCommonDrawingUtilitiesService.intToRgbColor(legend.colorInt);
							groups.push({
								name: legend.name,
								value: legend.value.toFixed(2) + ' ' + legend.uom,
								colour: [rgb.r / 256, rgb.g / 256, rgb.b / 256]
							});
						});
					}

					if(res.data.useVectorPublisher) {
						engine.publishDrawing(JSON.stringify(detail), JSON.stringify(groups));
					}
					else {
						engine.publishRasterDrawing(JSON.stringify(detail), JSON.stringify(groups));
					}
				});
			};

			function sectionValue(sectionItems) {
				var result = '';
				angular.forEach(sectionItems, function mapSectionItems(item) {
					if (result === '') {
						result = item.value;
					} else {
						result += ' | ' + item.value;
					}
				});
				return result;
			}

			return service;
		}
	]);

})(angular);