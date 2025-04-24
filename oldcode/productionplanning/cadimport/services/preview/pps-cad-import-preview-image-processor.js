(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).factory('ppsCadImportPreviewImageProcessor',
		ImageProcessor);

	function ImageProcessor() {
		var service = {};

		service.processItem = function processData(item) {
			var iconImage = '';
			switch (item.EntityType) {
				case 1:
					iconImage = 'control-icons ico-doc-position';
					break;
				case 2:
					iconImage = 'control-icons ico-leaf-pkg';
					break;
				case 3:
				case 4:
					iconImage = 'control-icons ico-criterion-3d-fo';
					break;
				case 5:
				case 6:
					iconImage = 'control-icons ico-filetype-doc';
					break;
				default:
					break;
			}
			item.image = iconImage;
		};

		return service;
	}
})(angular);