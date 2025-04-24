/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationIconOverlayService';

	myModule.factory(svcName, modelAnnotationIconOverlayService);

	modelAnnotationIconOverlayService.$inject = ['_', 'd3', 'modelAnnotationOverlayService',
		'basicsCommonSmartCanvasService', 'cloudDesktopSvgIconService',
		'modelAnnotationTypeIconService', 'basicsCommonDrawingUtilitiesService', '$injector'];

	function modelAnnotationIconOverlayService(_, d3, modelAnnotationOverlayService,
		basicsCommonSmartCanvasService, cloudDesktopSvgIconService,
		modelAnnotationTypeIconService, basicsCommonDrawingUtilitiesService, $injector) {

		const iconInfo = (function generateIconInfo() {
			const result = {
				byTypeId: {},
				allIconNames: [],
				width: 30,
				height: 30
			};

			modelAnnotationTypeIconService.getItems().forEach(function (icon) {
				const iconName = icon.res.split(' ')[1] + '-mo';
				result.byTypeId[icon.id] = iconName;
				result.allIconNames.push(iconName);
			});

			return result;
		})();

		class IconOverlay extends modelAnnotationOverlayService.AnnotationOverlay {
			constructor(scApp) {
				super(scApp);

				this._initializeIconLayer('Icons');
			}

			_initializeIconLayer(layerName) {
				this._scApp.addLayer(layerName, 10000);

				const layerEl = this._scApp.getLayerParent(layerName);
				layerEl.classed('annotation-icons', true);
			}

			getIconUrlFromCssClass(cssClass) {
				return cloudDesktopSvgIconService.getIconUrl('control-icons', cssClass);
			}

			draw(info, data) {
				const that = this;

				const displayedAnnotations = _.filter(data.annotations, a => info.annotationVisibility.isVisible(a.RawType));
				let annoIcons = info.layers.Icons.selectAll('g.annotation').data(displayedAnnotations, a => a.AnnotationFk);

				const newAnnoIcons = annoIcons.enter().append('g').classed('annotation', true).each(function (d) {
					const thisEl = d3.select(this).on('click', function (d) {
						let modelAnnotationDataService = null;
						if (!modelAnnotationDataService) {
							modelAnnotationDataService = $injector.get('modelAnnotationDataService');
							modelAnnotationDataService.selectAnnotationEntity(d.AnnotationFk);
						}
					});

					thisEl.append('rect').attrs({
						x: 0,
						y: 0,
						width: iconInfo.width,
						height: iconInfo.height
					}).classed('interactive-icon', true).append('title').text(d.DisplayName);

					thisEl.append('use').attrs({
						href: that.getIconUrlFromCssClass(iconInfo.byTypeId[d.RawType]),
						x: 0,
						y: 0,
						width: iconInfo.width,
						height: iconInfo.height
					}).style('--icon-color-1', basicsCommonDrawingUtilitiesService.intToRgbColor(d.Color).toString());
				});

				annoIcons.exit().remove();

				annoIcons = newAnnoIcons.merge(annoIcons);

				annoIcons.attr('transform', function (d) {
					const visibleMeshPointIds = _.filter(d.MeshPointIds, pId => data.usedPoints[pId]);
					const meshPoints = _.filter(_.map(visibleMeshPointIds, pId => info.getProjectedPoint(pId)), p => _.isObject(p));
					switch (meshPoints.length) {
						case 0:
							return 'translate(0,0)';
						case 1:
							return `translate(${meshPoints[0].x},${meshPoints[0].y})`;
						default:
							return (function () {
								const avgPosition = basicsCommonSmartCanvasService.ProjectedPoint.average(...meshPoints);
								return `translate(${avgPosition.x},${avgPosition.y})`;
							})();
					}
				});
			}
		}

		return {
			IconOverlay: IconOverlay
		};
	}
})(angular);
