/**
 * Created by lst on 6/7/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveDataService', [
		'platformDataServiceFactory', 'globals', '$http', 'cloudDesktopOneDriveMainService', 'platformDataServiceSelectionExtension',
		function (platformDataServiceFactory, globals, $http, cloudDesktopOneDriveMainService, platformDataServiceSelectionExtension) {

			var container = null;

			var serviceOption = {
				module: moduleName,
				serviceName: 'cloudDesktopOneDriveDataService',
				entityNameTranslationID: 'onedrive',
				actions: {delete: false, create: false},
				presenter: {
					list: {}
				},
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {

					}
				},
				dataProcessor: [],
				modification: {multi: {}},
				entitySelection: {supportsMultiSelection: true}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service, data = container.data;

			data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			service.setSelectedItem = function setSelectedItem(item) {
				if (data.itemList.length > 0) {
					platformDataServiceSelectionExtension.doSelect(item, data);
				}
			};

			service.copyFileFromOneDrive = function (sectionType, driveItems) {
				var url = globals.webApiBaseUrl + 'onedrive/copy';
				driveItems.forEach(function(item){
					item.DriveItem.thumbnails = null;
				});
				var data = {
					SectionType: sectionType,
					DriveItems: driveItems
				};
				return cloudDesktopOneDriveMainService.postByApi(url, data);
			};

			service.uploadFileToOneDrive = function (driveFolder, driveItems) {
				var url = globals.webApiBaseUrl + 'onedrive/upload';
				driveItems.forEach(function(item){
					item.DriveItem = {};
				});
				var data = {
					DriveFolder: driveFolder,
					DriveItems: driveItems
				};
				return cloudDesktopOneDriveMainService.postByApi(url, data);
			};

			return service;
		}
	]);
})(angular);