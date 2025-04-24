/**
 * Created by lvy on 10/24/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	angular.module(moduleName).service('documentDownloadPreviewButtonService', DocumentDownloadPreviewButtonService);

	DocumentDownloadPreviewButtonService.$inject = ['basicsCommonDocumentPreviewService', '$http'];

	function DocumentDownloadPreviewButtonService(basicsCommonDocumentPreviewService, $http) {
		this.viewWindow = {};
		var service = {};

		// fix for ALM# 104847.
		service.prepareDocPreviewById = function (FileArchiveDocFk) {
			$http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/common/document/preview',
				params: {fileArchiveDocId: FileArchiveDocFk}
			}).then(function (response) {
				var fileExtension = response.data.split('.').pop();
				var extensionTypes = ['dwg', 'rvt', 'CAD'];
				if (_.includes(extensionTypes, fileExtension)) {
					basicsCommonDocumentPreviewService.show(FileArchiveDocFk);    	//this function doesn't support png (or any image formats) as required for ALMM#101383.
				} else {
					window.open(response.data, '_blank');
				}
			});
		};

		return service;
	}
})(angular);
