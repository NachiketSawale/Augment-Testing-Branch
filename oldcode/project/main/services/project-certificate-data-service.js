/**
 * Created by leo on 11.04.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainCertificateService
	 * @function
	 *
	 * @description
	 * projectMainCertificateService is the data service for all certificates related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainCertificateService', ['$http', '$q', '$log', 'projectMainService', 'platformDataServiceFactory',

		function ($http, $q, $log, projectMainService, platformDataServiceFactory) {

			var certificateServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainCertificateService',
					entityNameTranslationID: 'project.main.entityCertificate',
					httpCreate: { route: globals.webApiBaseUrl + 'project/main/project2certificate/' },
					httpRead: { route: globals.webApiBaseUrl + 'project/main/project2certificate/', endRead: 'listByProject' },
					presenter: { list: {
						initCreationData: function initCreationData(creationData) {
							var selectedItem = projectMainService.getSelected();
							creationData.Id = selectedItem.Id;
							delete creationData.MainItemId;
						}	}
					},
					entityRole: { leaf: { itemName: 'Certificates', parentService: projectMainService, parentFilter: 'projectId' } }
				} };

			var container = platformDataServiceFactory.createNewComplete(certificateServiceInfo);

			return container.service;

		}]);
})(angular);
