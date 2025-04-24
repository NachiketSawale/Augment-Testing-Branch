(() => {
	'use strict';

	angular.module('platform').service('platformFileDownloadService', platformFileDownloadService);

	function platformFileDownloadService() {
		let service = {
			downloadFile: downloadFile
		};

		function downloadFile(data, filename, type) {
			if(!data) {
				return;
			}

			if(!filename) {
				filename = 'download.json';
			}

			if(!type) {
				type = 'text/json';
			}

			if(typeof data === 'object'){
				data = JSON.stringify(data, undefined, 4);
			}

			let blob = new Blob([data], {type: type}),
				event = document.createEvent('MouseEvents'),
				aLink = document.createElement('a');

			aLink.download = filename;
			aLink.href = window.URL.createObjectURL(blob);
			aLink.dataset.downloadurl =  [type, aLink.download, aLink.href].join(':');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			aLink.dispatchEvent(event);
		}

		return service;
	}
})();