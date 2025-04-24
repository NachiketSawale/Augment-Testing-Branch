(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainPictureSettingService', ProjectMainPictureSettingService);

	ProjectMainPictureSettingService.$inject = ['platformFileUtilServiceFactory', 'projectMainPictureDataService'];

	function ProjectMainPictureSettingService(platformFileUtilServiceFactory, projectMainPictureDataService) {
				const config = {
					deleteUrl: globals.webApiBaseUrl + 'project/main/picture/deletephoto',
					importUrl: globals.webApiBaseUrl + 'project/main/picture/createphoto',
					getUrl: globals.webApiBaseUrl + 'project/main/picture/exportphoto',
					fileFkName: 'BlobsFk',
					dtoName: 'DependingDto',
					standAlone: true,
					getSuperEntityId: function () {
						return projectMainPictureDataService.getSelectedSuperEntity().Id;
					},
					hideToolbarButtons: false,
					hasMultiple: true
				};

				return platformFileUtilServiceFactory.getFileService(config, projectMainPictureDataService);
			}
})(angular);
