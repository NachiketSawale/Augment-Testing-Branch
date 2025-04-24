/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectDataService
	 * @description provides methods to access, create and update resource project  entities
	 */
	myModule.service('resourceProjectDataService', ResourceProjectDataService);

	ResourceProjectDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'cloudDesktopSidebarService'];

	function ResourceProjectDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, cloudDesktopSidebarService) {
		var self = this;
		var resourceProjectServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceProjectDataService',
				entityNameTranslationID: 'resource.project.resourceProjectEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/project/',
					usePostForRead: true,
					endRead: 'filtered'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ProjectDto',
					moduleSubModule: 'Project.Main'
				})],
				actions: {delete: false, create: false},
				entityRole: {root: {itemName: 'Project', moduleName: 'cloud.desktop.moduleDisplayNameResourceProject'}},
				entitySelection: {supportsMultiSelection: false},
				presenter: {list: {}},
				modification: 'none',
				sidebarSearch: {
					options: {
						moduleName: 'resource.project',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: true,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true, showPinningContext: [{token: 'project.main', show: true}],
							setContextCallback: function (prjService) {
								cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'Id');
							}
						}
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceProjectServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
