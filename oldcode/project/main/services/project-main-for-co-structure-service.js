/**
 * Created by frank baedeker on 21.08.2014.
 */
(function () {
	/* global globals, angular */
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainForCOStructureService
	 * @function
	 *
	 * @description
	 * projectMainForCOStructureService is the data service for projects being readonly main entity of the controlling structure
	 */
	controllingStructureModule.factory('projectMainForCOStructureService',
		['platformDataServiceFactory', 'cloudDesktopSidebarService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsAssetMasterLookupDataService',
			function (platformDataServiceFactory, cloudDesktopSidebarService, platformDataServiceProcessDatesBySchemeExtension, basicsAssetMasterLookupDataService) {

				let serviceContainer = null;

				// The instance of the main service - to be filled with functionality below
				var projectMainForCOStructureServiceOption = {
					module: controllingStructureModule,
					serviceName: 'projectMainForCOStructureService',
					entityNameTranslationID: 'cloud.common.entityProject',
					httpRead: {route: globals.webApiBaseUrl + 'project/main/', endRead: 'filtered', usePostForRead: true},
					httpUpdate: {route: globals.webApiBaseUrl + 'controlling/structure/', endUpdate: 'update'},
					presenter: {list: {}},
					entitySelection: {},
					entityRole: {
						root: {
							codeField: 'ProjectNo',
							descField: 'ProjectName',
							itemName: 'Project',
							moduleName: 'cloud.desktop.moduleDisplayNameControllingUnits',
							useIdentification: true,
							collaborationContextProvider: function () {
								return {
									area: 'controlling.structure',
									context: 'controlling.structure'
								};
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ProjectDto',
						moduleSubModule: 'Project.Main'
					})],
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true, showPinningContext: [{token: 'project.main', show: true}],
								setContextCallback: function (prjService) {
									cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'Id');
								}
							},
							withExecutionHints: false
						}
					},
					sidebarWatchList: {active: true}  // @7.12.2015 enable watchlist support for this module
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(projectMainForCOStructureServiceOption);

				var service = serviceContainer.service;

				service.getAssetMaster = function getAssetMaster() {
					var selectedProject = service.getSelected();
					return basicsAssetMasterLookupDataService.getItemById(selectedProject.AssetMasterFk, {lookuptype: 'basicsAssetMasterLookupDataService'});
				};

				return service;
			}]);
})();
