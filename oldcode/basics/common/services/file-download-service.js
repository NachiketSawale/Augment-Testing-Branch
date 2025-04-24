(function (angular) {
	'use strict';
	/**
	 * @ngdoc service

	 * @name basicsCommonFileDownloadService
	 * @function
	 * @requireds $document, globals
	 *
	 * @description a service for downloading file
	 */
	angular.module('basics.common').factory('basicsCommonFileDownloadService', basicsCommonFileDownloadService);
	basicsCommonFileDownloadService.$inject = ['$document', 'globals', '$http', 'documentProjectDownloadErrorDialogService'];

	function basicsCommonFileDownloadService($document, globals, $http, documentProjectDownloadErrorDialogService) {
		const service = {};
		/**
		 * @ngdoc function
		 * @name download
		 * @function
		 *
		 * @methodOf basicsCommonFileDownloadService
		 * @description download file according to document's Id.
		 * @param {number || string} docId - document's Id.
		 */
		service.download = download;

		/**
		 * @ngdoc function
		 * @name canDownload
		 * @function
		 *
		 * @methodOf basicsCommonFileDownloadService
		 * @description DEV-23828 check document hasFileArchiveDocFk || hasAccess || hasFile.
		 * @param selectItems - documents.
		 */
		service.canDownload = canDownload;
		return service;

		function canDownload(higherService, selectItems){
			documentProjectDownloadErrorDialogService.canDownload(selectItems).then(function (res) {
				const response = (res && res.data) ? res.data : res;
				if (!response) {
					goDownload(higherService, selectItems);
				}
			});
		}
		function goDownload(higherService, selectItems) {
			const obj = {
				DatengutFiles: selectItems.map(item => ({
					ArchiveElementId: item.ArchiveElementId || item.DatengutFileId || '',
					FileName: ''
				}))
			};
			const itemData = higherService.canDownloadFiles
				? selectItems.filter(item => higherService.canDownloadFiles(item))
				: selectItems;
			const docIdArray = itemData.filter(item => item.FileArchiveDocFk !== null).map(item => item.FileArchiveDocFk);
			download(docIdArray, obj);

			if (higherService.onDownloadDocCreateHistory) {
				itemData.forEach(item => {
					higherService.onDownloadDocCreateHistory.fire({data: {selectedProjectDocument: item}});
				});
			}
		}

		function download(docIds, obj) {
			const data = obj || {};

			if (docIds) {
				if (angular.isString(docIds)) {
					data.FileArchiveDocIds = docIds;
				} else if (angular.isArray(docIds)) {
					data.FileArchiveDocIds = docIds.join(',');
				} else {
					data.FileArchiveDocIds = docIds.toString();
				}
			}

			$http.post(globals.webApiBaseUrl + 'basics/common/document/preparedownload', data).then(function (result) {
				if (result.data) {
					post(globals.webApiBaseUrl + 'basics/common/document/download', {'security_token': result.data});
				}
			});
		}

		function post(path, params, method) {
			method = method || 'post';

			const form = $document[0].createElement('form');
			form.setAttribute('method', method);
			form.setAttribute('action', path);
			form.setAttribute('target', '_blank');

			for (let key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key)) {
					const hiddenField = $document[0].createElement('input');
					hiddenField.setAttribute('type', 'hidden');
					hiddenField.setAttribute('name', key);
					hiddenField.setAttribute('value', params[key]);

					form.appendChild(hiddenField);
				}
			}

			$document[0].body.appendChild(form);
			form.submit();
			form.remove();
		}
	}
})(angular);