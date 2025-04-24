/**
 * Created by leo on 08.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'timekeeping.employee';
	var pictureModule = angular.module(moduleName);
	pictureModule.factory('timekeepingEmployeePictureFileService', ['platformFileUtilServiceFactory', 'timekeepingEmployeePictureDataService', 'timekeepingEmployeeDataService',

		function (platformFileUtilServiceFactory, timekeepingEmployeePictureDataService, timekeepingEmployeeDataService) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'timekeeping/employee/picture/deletepicture',
				importUrl: globals.webApiBaseUrl + 'timekeeping/employee/picture/createpicture',
				getUrl: globals.webApiBaseUrl + 'timekeeping/employee/picture/exportpicture',
				fileFkName: 'BlobsFk',
				dtoName: 'DependingDto',
				standAlone: true,
				getSuperEntityId: function () {
					return timekeepingEmployeeDataService.getSelected().Id;
				},
				hideToolbarButtons: false,
				hasMultiple: true
			};
			return platformFileUtilServiceFactory.getFileService(config, timekeepingEmployeePictureDataService);
		}]);
})(angular);
