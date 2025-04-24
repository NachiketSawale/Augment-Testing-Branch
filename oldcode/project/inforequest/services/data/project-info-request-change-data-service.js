(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('project.inforequest');
	/**
	 * @ngdoc service
	 * @name projectInfoRequestChangeDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestChangeDataService is a data service for contribution to information requests
	 */

	myModule.service('projectInfoRequestChangeDataService', ProjectInfoRequestChangeDataService);

	ProjectInfoRequestChangeDataService.$inject = ['platformDataServiceFactory',
		'projectInfoRequestDataService', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function ProjectInfoRequestChangeDataService(platformDataServiceFactory, projectInfoRequestDataService, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension ){

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectInfoRequestChangeDataService',
				entityNameTranslationID: 'basics.config.entityTranslation',
				httpRead: {
					route: globals.webApiBaseUrl + 'change/main/',
					endRead: 'list',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						const selectedInfoRequest = projectInfoRequestDataService.getSelected();
						readData.Id = selectedInfoRequest.ChangeFk ?? 0;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ChangeDto',
					moduleSubModule: 'Change.Main',
				})],
				entityRole: {
					leaf: {
						itemName: 'Change',
						parentService: projectInfoRequestDataService
					}
				}
			}
		};


		platformDataServiceFactory.createService(serviceOptions, self);
	}
})(angular);







