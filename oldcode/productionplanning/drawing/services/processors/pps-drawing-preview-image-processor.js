(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('ppsDrawingPreviewImageProcessor',
		ImageProcessor);

	ImageProcessor.$inject = ['previewResultType'];

	function ImageProcessor(previewResultType) {
		var service = {};

		service.processData = function processData(dataList) {
			angular.forEach(dataList, function (item) {
				var iconImage = '';
				switch (item.Type) {
					case previewResultType.drawing:
						iconImage = 'control-icons ico-measure2';
						break;
					case previewResultType.element:
						iconImage = 'control-icons ico-criterion-3d-fo';
						break;
					case previewResultType.article:
						iconImage = 'control-icons ico-domain-color';
						break;
				}
				item.image = iconImage;

				if (item.ChildItems && item.ChildItems.length > 0) {
					service.processData(item.ChildItems);
				}
			});

			return dataList;
		};

		return service;
	}
})(angular);