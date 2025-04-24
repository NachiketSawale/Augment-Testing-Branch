/**
 * Created by lst on 6/7/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveUIStandardService',
		['cloudDesktopOneDriveFormatService',
			function (cloudDesktopOneDriveFormatService) {

				var service = {};

				service.getStandardConfigForListView = function () {
					var columns = [
						{
							id: 'name',
							field: 'name',
							name$tr$: 'cloud.desktop.oneDrive.grid.name',
							// name: 'Name',
							sortable: true,
							formatter: cloudDesktopOneDriveFormatService.fileTypeImageFormatter,
							width: 160
						},
						{
							id: 'lastModifiedDateTime',
							field: 'lastModifiedDateTime',
							// name: 'Date modified',
							name$tr$: 'cloud.desktop.oneDrive.grid.lastModifiedDateTime',
							sortable: true,
							formatter: cloudDesktopOneDriveFormatService.formatDate,
							width: 120
						},
						{
							id: 'size',
							field: 'size',
							// name: 'Size',
							name$tr$: 'cloud.desktop.oneDrive.grid.size',
							sortable: true,
							formatter: cloudDesktopOneDriveFormatService.formatFileSize,
							width: 80
						}];

					return {
						columns: columns
					};
				};
				return service;
			}
		]);
})(angular);