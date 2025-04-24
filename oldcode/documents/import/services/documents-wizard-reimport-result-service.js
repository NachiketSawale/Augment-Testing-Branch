(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('documents.import').factory('documentsWizardReimportResultService',
		['globals','$q', '$translate', '$http', '$timeout', 'platformTranslateService', 'platformModalService', 'documentImportDataService',
			function (globals,$q, $translate, $http, $timeout, platformTranslateService, platformModalService, documentImportDataService) {

				var service = {};
				var fileNames = [];
				service.modalOptions = {
					templateUrl: globals.appBaseUrl + 'documents.import/partials/documents-reimport-result-dialog.html',
					bodyText: 'Import result',
					cancelBtnText: 'OK',
					dialogLoading: true,
					loadingInfo: 'loading...',
					width: '800px',
					columns: [
						{
							id: 'DocumentReImportStatus',
							field: 'ImportStatus',
							name: 'Import Status',
							name$tr$: 'Import Status',
							width: 100
						},
						{
							id: 'DocumentReImportBarcode',
							field: 'DocumentBarcode',
							name: 'BarCode',
							name$tr$: 'DocumentBarcode',
							width: 100
						},
						{
							id: 'DocumentCommentText',
							field: 'DocumentCommentText',
							name: 'Comment Text',
							name$tr$: 'DocumentCommentText',
							width: 100
						},
						{
							id: 'DocumentOriginFileName',
							field: 'DocumentOriginFileName',
							name: 'FileName',
							name$tr$: 'FileName',
							width: 100
						},
						{
							id: 'ImportResult',
							field: 'ErrorMessage',
							name: 'Error Message',
							name$tr$: 'Error Message',
							width: 180
						}

					]
				};
				service.getDataList = function () {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'documents/documentsimport/reimport').then(function (importRes) {
						if (importRes && importRes.data) {
							var res = [];
							angular.forEach(importRes.data, function (item) {
								res.push({
									Id: item.Id,
									ImportStatus: item.ImportStatus,
									DocumentBarcode: item.BarCode,
									DocumentCommentText: item.Comment,
									DocumentOriginFileName: item.File,
									ErrorMessage: item.ErrMsg
								});
							});
							defer.resolve(res);
							documentImportDataService.refresh();
						} else {
							defer.reject({apply: false, error: 'import failed'});
						}

					}, function (errorInfo) {
						defer.reject(errorInfo);
					});
					return defer.promise;
				};

				service.handleResult = function handleResult(result) {
					fileNames = [];
					if (result) {
						angular.forEach(result, function (item) {
							fileNames.push(item.Description);
						});
					}
					platformModalService.showDialog(service.modalOptions);
				};

				return service;
			}]);

})(angular);