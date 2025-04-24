
((angular) => {
	'use strict';

	const moduleName = 'basics.reporting';

	/**
	 * @ngdoc service
	 * @name basicsReportingDownloadService
	 * @description provides the download service
	 */
	angular.module(moduleName).factory('basicsReportingDownloadService', basicsReportingDownloadService);

	basicsReportingDownloadService.$inject = ['$http', '$log'];

	function basicsReportingDownloadService($http, $log) {
		const service = {};

		function buildZipFile(data, headers) {
			const filename = headers['x-filename'] || 'report.zip';
			const contentType = headers['content-type'] || 'application/zip';
			const urlCreator = window.URL;

			if (urlCreator) {
				// create link
				var link = document.createElement('a');

				try {
					// prepare blob url
					const blob = new Blob([data], {type: contentType});
					const url = urlCreator.createObjectURL(blob);

					// set href and download attribute
					link.setAttribute('href', url);
					link.setAttribute('download', filename);

					// simulate click event
					const event = document.createEvent('MouseEvents');

					event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
					link.dispatchEvent(event);
				} catch (ex) {
					$log.error('Download with simulated click failed with exception:' + ex);
				}
			}
		}

		service.downloadReport = function (fileInfo) {
			const config = {
				responseType: 'arraybuffer',
				transformResponse: function (data) {
					return data;
				},
				headers: {
					errorDialog: false
				}
			};

			return $http.post(globals.webApiBaseUrl + 'basics/reporting/report/download', fileInfo, config)
				.then((response) => {
					return buildZipFile(response.data, response.headers());
				})
				.catch(_.noop);
		};

		return service;
	}
})(angular);




