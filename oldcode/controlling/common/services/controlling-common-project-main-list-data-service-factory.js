/**
 * Created by myh on 24.04.2023.
 */
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.common';
	let module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name service  controllingCommonProjectMainListDataServiceFactory
	 * @function
	 *
	 * @description
	 */
	module.factory('controllingCommonProjectMainListDataServiceFactory',
		['$translate', 'platformDataServiceFactory', 'cloudDesktopSidebarService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsAssetMasterLookupDataService',
			function ($translate, platformDataServiceFactory, cloudDesktopSidebarService, platformDataServiceProcessDatesBySchemeExtension, basicsAssetMasterLookupDataService) {

				let factory = {};

				factory.createService = function createService(option){
					// The instance of the main service - to be filled with functionality below
					let projectMainServiceOption = {
						module: option.module, // controllingStructureModule,
						serviceName: option.serviceName, // 'projectMainForCOStructureService',
						entityNameTranslationID: 'cloud.common.entityProject',
						httpRead: {route: globals.webApiBaseUrl + 'project/main/', endRead: 'filtered', usePostForRead: true},
						httpUpdate: {route: globals.webApiBaseUrl + option.updateUrl, endUpdate: 'update'},
						// httpUpdate: {route: globals.webApiBaseUrl + 'controlling/structure/', endUpdate: 'update'},
						presenter: {list: {}},
						entitySelection: {},
						entityRole: {
							root: {
								codeField: 'ProjectNo',
								descField: 'ProjectName',
								itemName: 'Project',
								moduleName: $translate.instant(option.displayModuleName), // 'cloud.desktop.moduleDisplayNameControllingUnits',
								useIdentification: true,
								handleUpdateDone : function(updateData, response, data){
									if(_.isFunction(service.handleUpdateDone)){
										service.handleUpdateDone(response);
									}
									data.handleOnUpdateSucceeded(updateData, response, data, true);
								}
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ProjectDto',
							moduleSubModule: 'Project.Main'
						})],
						sidebarSearch: {
							options: {
								moduleName: option.moduleName,
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

					var serviceContainer = platformDataServiceFactory.createNewComplete(projectMainServiceOption);

					var service = serviceContainer.service;

					service.getAssetMaster = function getAssetMaster() {
						var selectedProject = service.getSelected();
						return basicsAssetMasterLookupDataService.getItemById(selectedProject.AssetMasterFk, {lookuptype: 'basicsAssetMasterLookupDataService'});
					};

					return service;
				};

				return factory;


			}]);
})();
