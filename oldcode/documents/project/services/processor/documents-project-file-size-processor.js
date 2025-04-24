/**
 * Created by wwa on 1/4/2023.
 */
(function (angular) {
	'use strict';
	angular.module('documents.project').service('documentsProjectFileSizeProcessor',
		[
			function () {
				var decimalByteUnits = [' bytes', ' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
				this.processItem = function processItem(item) {
					if (item && item.FileSizeInByte) {
						if (item.FileSizeInByte <= 1024) {
							item.FileSize = item.FileSizeInByte + ' ' + decimalByteUnits[0];
						} else {
							var fileSizeInBytes = item.FileSizeInByte, i = 0;
							do {
								fileSizeInBytes = fileSizeInBytes / 1024;
								i++;
							} while (fileSizeInBytes > 1024);

							item.FileSize = Math.max(fileSizeInBytes, 0.01).toFixed(2) + ' ' + decimalByteUnits[i];
						}
					}
				};
			}]);
})(angular);