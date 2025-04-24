/**
 * Created by wui on 2/24/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerLabelService', ['$translate',
		function ($translate) {
			var service = {};

			service.getLabels = function () {
				return {
					noModelListSelected: $translate.instant('model.viewer.noModelListSelected'),
					noModelPinned: $translate.instant('model.viewer.noModelPinned'),
					selectedDimensions: $translate.instant('model.wdeviewer.status.selectedDimensions'),
					editDimension: $translate.instant('model.wdeviewer.contextOptions.editDimension'),
					copyDimension: $translate.instant('model.wdeviewer.contextOptions.copyDimension'),
					pasteDimension: $translate.instant('model.wdeviewer.contextOptions.pasteDimension'),
					deleteAllDimensions: $translate.instant('model.wdeviewer.contextOptions.deleteAllDimensions'),
					moveCurrentLine: $translate.instant('model.wdeviewer.contextOptions.moveCurrentLine'),
					pasteDimensionToOrigin: $translate.instant('model.wdeviewer.contextOptions.pasteDimensionToOrigin')
				};
			};

			service.getDimensionTypeLabels = function () {
				return {
					none: $translate.instant('model.wdeviewer.dimensionLabel.none'),
					type: $translate.instant('model.wdeviewer.dimensionLabel.type'),
					name: $translate.instant('model.wdeviewer.dimensionLabel.name'),
					nameQuantityUnit: $translate.instant('model.wdeviewer.dimensionLabel.nameQuantityUnit'),
					quantityUnit: $translate.instant('model.wdeviewer.dimensionLabel.quantityUnit'),
					nameQuantity: $translate.instant('model.wdeviewer.dimensionLabel.nameQuantity')
				};
			};

			service.getPropertyFormLabels = function (selectedCount) {
				var titleSuffix = '', propertySuffix = '';

				if (angular.isNumber(selectedCount) && selectedCount > 1) {
					titleSuffix = '(' + selectedCount + ' ' + $translate.instant('model.wdeviewer.dimension.selected') + ')';
					propertySuffix = '(' + $translate.instant('model.wdeviewer.dimension.sum') + ')';
				}

				return {
					title: $translate.instant('model.wdeviewer.dimension.title') + titleSuffix,
					editDimensionText: $translate.instant('model.wdeviewer.contextMenu.editDimensionText'),

					name: $translate.instant('model.wdeviewer.dimension.name'),
					count: $translate.instant('model.wdeviewer.dimension.count') + propertySuffix,
					length: $translate.instant('model.wdeviewer.dimension.length') + propertySuffix,
					area: $translate.instant('model.wdeviewer.dimension.area') + propertySuffix,
					volume: $translate.instant('model.wdeviewer.dimension.volume') + propertySuffix,
					width: $translate.instant('model.wdeviewer.dimension.width'),
					height: $translate.instant('model.wdeviewer.dimension.height'),
					wallArea: $translate.instant('model.wdeviewer.dimension.wallArea'),
					offset: $translate.instant('model.wdeviewer.dimension.offset'),
					multiplier: $translate.instant('model.wdeviewer.dimension.multiplier'),

					segmentCount: $translate.instant('model.wdeviewer.dimension.segmentCount'),
					vertexCount: $translate.instant('model.wdeviewer.dimension.vertexCount'),
					cutoutArea: $translate.instant('model.wdeviewer.dimension.cutoutArea'),
					cutoutLength: $translate.instant('model.wdeviewer.dimension.cutoutLength'),
					areaExcludingCutouts: $translate.instant('model.wdeviewer.dimension.areaExcludingCutouts'),
					lengthExcludingCutouts: $translate.instant('model.wdeviewer.dimension.lengthExcludingCutouts'),
					segmentCountExcludingCutouts: $translate.instant('model.wdeviewer.dimension.segmentCountExcludingCutouts'),
					vertexCountExcludingCutouts: $translate.instant('model.wdeviewer.dimension.vertexCountExcludingCutouts'),
				};
			};

			return service;
		}
	]);

})(angular);