/**
 * Created by jack.wu on 10.04.20235.
 */
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('project.common');

	/**
	 * @ngdoc service
	 * @name service  projectCommonListDataServiceFactory
	 * @function
	 *
	 * @description
	 */
	module.factory('projectCommonListDataServiceFactory',
		['_', '$translate', 'platformDataServiceFactory', 'cloudDesktopSidebarService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsAssetMasterLookupDataService',
			function (_, $translate, platformDataServiceFactory, cloudDesktopSidebarService, platformDataServiceProcessDatesBySchemeExtension, basicsAssetMasterLookupDataService) {

				let factory = {};

				factory.createService = function createService(option){
					let projectMainServiceOption = {
						module: option.module,
						serviceName: option.serviceName,
						entityNameTranslationID: 'cloud.common.entityProject',
						httpRead: {route: globals.webApiBaseUrl + 'project/main/', endRead: 'filtered', usePostForRead: true},
						httpUpdate: {route: globals.webApiBaseUrl + option.updateUrl, endUpdate: 'update'},
						presenter: {list: {}},
						entitySelection: {},
						entityRole: {
							root: {
								codeField: 'ProjectNo',
								descField: 'ProjectName',
								itemName: 'Project',
								moduleName: $translate.instant(option.displayModuleName),
								useIdentification: true,
								handleUpdateDone : handleUpdateDone
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
								enhancedSearchVersion: '2.0',
								pattern: '',
								pageSize: 100,
								useCurrentClient: true,
								includeNonActiveItems: false,
								showOptions: true,
								showProjectContext: false,
								pinningOptions: {
									isActive: true,
									showPinningContext: [{token: 'project.main', show: true}],
									setContextCallback: setContextCallback
								},
								withExecutionHints: false
							}
						},
						sidebarWatchList: {active: true}
					};

					let serviceContainer = platformDataServiceFactory.createNewComplete(projectMainServiceOption);

					let service = serviceContainer.service;

					service.getAssetMaster = function getAssetMaster() {
						let selectedProject = service.getSelected();
						return basicsAssetMasterLookupDataService.getItemById(selectedProject.AssetMasterFk, {lookuptype: 'basicsAssetMasterLookupDataService'});
					};

					function handleUpdateDone(updateData, response, data){
						if(_.isFunction(service.handleUpdateDone)){
							service.handleUpdateDone(response);
						}
						data.handleOnUpdateSucceeded(updateData, response, data, true);
					}

					function setContextCallback(prjService) {
						if(_.isFunction(service.setContextCallback)){
							service.setContextCallback(prjService);
						}
						cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'Id');
					}

					return service;
				};

				return factory;


			}]);
})();
