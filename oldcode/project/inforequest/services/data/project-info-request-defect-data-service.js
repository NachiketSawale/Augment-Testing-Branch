(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('project.inforequest');
	/**
	 * @ngdoc service
	 * @name projectInfoRequestDefectDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestDefectDataService is a data service for contribution to information requests
	 */

	myModule.service('projectInfoRequestDefectDataService', ProjectInfoRequestDefectDataService);

	ProjectInfoRequestDefectDataService.$inject = ['platformDataServiceFactory',
		'projectInfoRequestDataService', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function ProjectInfoRequestDefectDataService(platformDataServiceFactory, projectInfoRequestDataService, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension ){

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectInfoRequestDefectDataService',
				entityNameTranslationID: 'basics.config.entityTranslation',
				httpRead: {
					route: globals.webApiBaseUrl + 'defect/main/header/',
					endRead: 'listbyrfi',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = projectInfoRequestDataService.getSelected();
						readData.filter = '?rfiId=' + (selected ? selected.Id : 0);
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'DfmDefectDto',
					moduleSubModule: 'Defect.Main',
				})],
				entityRole: {
					leaf: {
						itemName: 'DfmDefect',
						parentService: projectInfoRequestDataService
					}
				}
			}
		};

		platformDataServiceFactory.createService(serviceOptions, self);
	}
})(angular);







