
(function () {

	'use strict';
	var mainModule = angular.module('object.main');
	mainModule.factory('objectMainPhotoService', ['globals','objectMainUnitPhotoService', 'platformFileUtilServiceFactory',

		function (globals, objectMainUnitPhotoService, platformFileUtilServiceFactory) {
			var config = {
				deleteUrl: globals.webApiBaseUrl + 'object/main/logo/delete',
				importUrl: globals.webApiBaseUrl + 'object/main/photo/importblobsfoto',
				getUrl: globals.webApiBaseUrl + 'object/main/logo/exportlogo',
				fileFkName: 'BlobsFk',
				dtoName: 'UnitPhotoDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, objectMainUnitPhotoService);

		}]);
})(angular);