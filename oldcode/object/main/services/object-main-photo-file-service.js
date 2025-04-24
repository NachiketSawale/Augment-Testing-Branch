(function (angular) {

	'use strict';

	var moduleName= 'object.main';
	var objectMainDocumentModule = angular.module(moduleName);
	objectMainDocumentModule.factory('objectMainPhotoFileService', ['platformFileUtilServiceFactory','objectMainUnitPhotoService','objectMainUnitService',

		function (platformFileUtilServiceFactory,objectMainUnitPhotoService,objectMainUnitService) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'object/main/unitphoto/deleteblobsfoto',
				importUrl: globals.webApiBaseUrl + 'object/main/unitphoto/createphoto',
				getUrl: globals.webApiBaseUrl + 'object/main/unitphoto/exportblobsfoto',
				fileFkName: 'BlobsFk',
				dtoName: 'DependingDto',
				standAlone: true,
				getSuperEntityId: function () {
					return objectMainUnitService.getSelected().Id;
				},
				hideToolbarButtons: true,
				hasMultiple: true
			};
			var fileService = platformFileUtilServiceFactory.getFileService(config,objectMainUnitPhotoService);

			return fileService;

		}]);
})(angular);
