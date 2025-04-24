(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.equipmentgroup';
	const resourceEquipmentModule = angular.module(moduleName);

	resourceEquipmentModule.factory('resourceEquipmentGroupPictureFileService',
		['platformFileUtilServiceFactory', 'resourceEquipmentGroupPictureDataService', 'resourceEquipmentGroupDataService',
			function (platformFileUtilServiceFactory, resourceEquipmentGroupPictureDataService, resourceEquipmentGroupDataService) {

				const config = {
					deleteUrl: globals.webApiBaseUrl + 'resource/equipmentgroup/photo/deletephoto',
					importUrl: globals.webApiBaseUrl + 'resource/equipmentgroup/photo/createphoto',
					getUrl: globals.webApiBaseUrl + 'resource/equipmentgroup/photo/exportphoto',
					fileFkName: 'BlobFk',
					dtoName: 'DependingDto',
					standAlone: true,
					getSuperEntityId: function () {
						return resourceEquipmentGroupDataService.getSelected().Id;
					},
					hideToolbarButtons: false,
					hasMultiple: true
				};

				return platformFileUtilServiceFactory.getFileService(config, resourceEquipmentGroupPictureDataService);
			}
		]);
})(angular);
