(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemMaterialPreviewService', PreviewService);
	PreviewService.$inject = ['productionplanningItemDataService', 'platformFileUtilServiceFactory'];
	function PreviewService(itemDataService, platformFileUtilServiceFactory) {
		var config = {
			getUrl: globals.webApiBaseUrl + 'basics/material/preview/getblob',
			fileFkName: 'MaterialBlobsFk',
			dtoName: 'PPSItemDto',
			hideToolbarButtons: true
		};
		return platformFileUtilServiceFactory.getFileService(config, itemDataService);
	}
})(angular);