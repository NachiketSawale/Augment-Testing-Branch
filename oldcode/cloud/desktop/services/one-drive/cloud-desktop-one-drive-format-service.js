/**
 * Created by lst on 4/16/2018.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopOneDriveFormatService
 * @priority default value
 * @description
 *
 *
 *
 * @example
 ...
 }
 */

(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).constant('cloudDesktopMimeTypeIconStyle', [
		{ext: 'doc', iconStyle: 'ico-filetype-doc', mimeType: 'application/msword'},
		{
			ext: 'docx',
			iconStyle: 'ico-filetype-docx',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		},

		{ext: 'xls', iconStyle: 'ico-filetype-xls', mimeType: 'application/vnd.ms-excel'},
		{
			ext: 'xlsx',
			iconStyle: 'ico-filetype-xlsx',
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		},

		{ext: 'ppt', iconStyle: 'ico-filetype-ppt', mimeType: 'application/vnd.ms-powerpoint'},
		{
			ext: 'pptx',
			iconStyle: 'ico-filetype-pptx',
			mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
		},

		{ext: 'txt', iconStyle: 'ico-filetype-txt', mimeType: 'text/plain'},

		{ext: 'pdf', iconStyle: 'ico-filetype-pdf', mimeType: 'application/pdf'}

	]);

	angular.module(moduleName).factory('cloudDesktopOneDriveFormatService',
		['_', 'cloudDesktopMimeTypeIconStyle',
			function (_, cloudDesktopMimeTypeIconStyle) {
				var service = {};

				service.fileTypeImageFormatter = function fileTypeImageFormatter(row, cell, value, columnDef, dataContext) {
					if (dataContext && value) {
						var icon = '';
						if (dataContext.folder) {
							// icon = '<i class="block-image glyphicon glyphicon-folder-close"></i>';
							icon = '<i class="block-image control-icons ico-folder-empty slick"></i>';
						} else if (dataContext.file) {
							var foundFileStyle = _.find(cloudDesktopMimeTypeIconStyle, {mimeType: dataContext.file.mimeType});
							if (foundFileStyle) {
								icon = '<i class="block-image control-icons slick ' + foundFileStyle.iconStyle + '"></i>';
							} else {
								icon = '<i class="block-image glyphicon glyphicon-file slick"></i>';
							}
						} else if (dataContext.package) {
							icon = '<i class="block-image glyphicon glyphicon-book slick"></i>';
						}
						return icon + '<span class="pane-r slick">' + value + '</span>';
					}
					return value;
				};

				service.formatDate = function formatDate(row, cell, value, columnDef, dataContext) {
					if (dataContext && value) {
						if (value instanceof Date) {
							return value.toLocaleString();
						}
						try {
							if (isNaN(Date.parse(value))) {
								return value;
							}
							var d = new Date(value);
							return d.toLocaleString();
						} catch (e) {
							return (value.toLocaleString || value.toString).apply(value);
						}
					}
					return value;
				};

				service.formatFileSize = function formatFileSize(row, cell, value, columnDef, dataContext) {
					if (dataContext && value) {

						if (dataContext.folder) {
							return '';
						}

						var decimalByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
						var i = -1;
						var fileSizeInBytes = value;
						do {
							fileSizeInBytes = fileSizeInBytes / 1024;
							i++;
						} while (fileSizeInBytes > 1024);
						var result = decimalByteUnits[i];
						return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + result;
					}
					return '';
				};

				return service;
			}]);
})(angular);