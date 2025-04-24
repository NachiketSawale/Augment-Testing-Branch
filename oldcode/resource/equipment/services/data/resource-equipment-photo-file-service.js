(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.equipment';
	const resourceEquipmentModule = angular.module(moduleName);
	resourceEquipmentModule.factory('resourceEquipmentPhotoFileService',
		['platformFileUtilServiceFactory', 'resourceEquipmentLeafPhotoService', 'resourceEquipmentPlantDataService',
			function (platformFileUtilServiceFactory, resourceEquipmentLeafPhotoService, resourceEquipmentPlantDataService) {

				const config = {
					deleteUrl: globals.webApiBaseUrl + 'resource/equipment/photo/deletephoto',
					importUrl: globals.webApiBaseUrl + 'resource/equipment/photo/createphoto',
					getUrl: globals.webApiBaseUrl + 'resource/equipment/photo/exportphoto',
					fileFkName: 'BlobsFk',
					dtoName: 'DependingDto',
					standAlone: true,
					getSuperEntityId: function () {
						return resourceEquipmentPlantDataService.getSelected().Id;
					},
					hideToolbarButtons: false,
					hasMultiple: true
				};

				return platformFileUtilServiceFactory.getFileService(config, resourceEquipmentLeafPhotoService);
			}
		]);
})(angular);
