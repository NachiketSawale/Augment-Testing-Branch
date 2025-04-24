/**
 * Created by wui on 7/7/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerPreviewDataService', ['$http',
		function ($http) {
			var service = {};

			service.previewById = function (id) {
				if (('' + id).match(/^[0-9]+$/))
					return $http.get(globals.webApiBaseUrl + 'basics/common/document/previewdrawing?fileArchiveDocId=' + id);
				else
					return $http.get(globals.webApiBaseUrl + 'basics/common/document/previewdatengutdrawing?archiveElementId=' + id);
			};

			service.getFileName = function (id) {
				return $http.get(globals.webApiBaseUrl + 'basics/common/document/docname?fileArchiveDocId=' + id).then(function (res) {
					return res.data;
				});
			};

			service.getPreviewDocument = function (id) {
				return $http.get(globals.webApiBaseUrl + 'documentsproject/revision/getdocument?fileArchiveDocId=' + id);
			};

			service.getDocumentRevisionId = function (id) {
				return $http.get(globals.webApiBaseUrl + 'documentsproject/revision/getrevisionid?fileArchiveDocId=' + id);
			};

			return service;
		}
	]);

})(angular);