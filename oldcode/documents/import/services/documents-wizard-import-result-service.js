(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('documents.import').factory('documentsWizardImportResultService',
		['globals','$q', '$translate', '$http', '$timeout', 'platformTranslateService', 'platformModalService', 'documentImportDataService',
			function (globals,$q, $translate, $http, $timeout, platformTranslateService, platformModalService, documentImportDataService) {

				var service = {};
				var fileNames = [];
				service.modalOptions = {
					templateUrl: globals.appBaseUrl + 'documents.import/partials/documents-import-result-dialog.html',
					bodyText: 'Import Result:',
					cancelBtnText: 'OK',
					dialogLoading: true,
					loadingInfo: 'loading...',
					columns: [
						{
							id: 'DocumentImportStatus',
							field: 'ImportStatus',
							name: 'Status',
							name$tr$: 'Status',
							width: 100
						},
						{
							id: 'DocumentImportBarcode',
							field: 'DocumentBarcode',
							name: 'Bar Code',
							name$tr$: 'DocumentBarcode',
							width: 100
						},
						{
							id: 'DocumentFileName',
							field: 'DocumentOriginFileName',
							name: 'File Name',
							name$tr$: 'DocumentFileName',
							width: 100
						},
						{
							id: 'DocumentXmlName',
							field: 'DocumentXmlName',
							name: 'XMl File',
							name$tr$: 'DocumentXmlName',
							width: 100
						},
						{
							id: 'DocumentWarningMessage',
							field: 'WarningMessage',
							name: 'Warning',
							name$tr$: 'DocumentWarnMsg',
							width: 200
						},
						{
							id: 'DocumentErrorMsg',
							field: 'ErrMsg',
							name: 'Error',
							name$tr$: 'DocumentErrorMsg',
							width: 200
						}
					],
					width: '800px'
				};
				service.getDataList = function () {
					var defer = $q.defer();
					// fileNames[0] = '1.xml';
					$http.post(globals.webApiBaseUrl + 'documents/documentsimport/import', fileNames).then(function (importRes) {
						if (importRes && importRes.data) {
							var res = [];
							angular.forEach(importRes.data, function (item) {
								res.push({
									Id: item.Id,
									ImportStatus: item.ImportStatus,
									DocumentBarcode: item.BarCode,
									DocumentXmlName: item.XmlName,
									DocumentOriginFileName: item.File,
									ErrMsg: item.ErrMsg,
									WarningMessage: item.WarningMessage
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

				service.handleResult = function handleResult() {
					/* fileNames = [];
					 if (result) {
						  angular.forEach(result, function (item) {
								fileNames.push(item.Description);
						  });
					 }
					 platformModalService.showDialog(service.modalOptions); */
				};

				return service;
			}]);

})(angular);