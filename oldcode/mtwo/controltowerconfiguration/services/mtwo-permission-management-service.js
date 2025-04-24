/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';
	/* globals globals */
	/**
	 * @ngdoc service
	 * @name mtwoControlTowerconfigurationMainService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowersMainService is the data service for all dashboards related functionality
	 *
	 */

	var moduleName = 'mtwo.controltowerconfiguration';


	angular.module(moduleName).factory('mtwoPermissionManagementService', MtwoPermissionManagementService);
	MtwoPermissionManagementService.$inject = ['$translate', '$injector', '$http',
		'platformDataServiceFactory', 'PlatformMessenger', 'basicsCommonMandatoryProcessor',
		'platformModalService', '_', 'cloudDesktopModuleService', 'ServiceDataProcessArraysExtension',
		'mtwoControlTowerConfigurationImageProcessor', 'platformGridDialogService', 'mtwoControlTowerConfigurationMainService'];

	/**
	 * @return {string}
	 */
	function MtwoPermissionManagementService($translate, $injector, $http,
		platformDataServiceFactory, PlatformMessenger, basicsCommonMandatoryProcessor,
		platformModalService, _, cloudDesktopModuleService, ServiceDataProcessArraysExtension,
		mtwoControlTowerConfigurationImageProcessor, platformGridDialogService, mtwoControlTowerConfigurationMainService) {

		var options = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'mtwoPermissionManagementService',
				entityNameTranslationID: 'mtwo.controltowerconfiguration.moduleAssignment',
				httpRead: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbimodules/permissions/',
					endRead: 'listfiltered',
					usePostForRead: true,
					initReadData: function (readData) {
						angular.extend(readData, getSearchFilter());
					}
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbimodules/permissions/',
					endRead: 'update',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'MtoPowerbiitem',
						handleUpdateDone: function (updateData, response, data) {
							mtwoControlTowerConfigurationMainService.refreshGrid();
							data.handleOnUpdateSucceeded(updateData, response, data, true);
						},
						moduleName: 'mtwo.controltowerconfiguration.moduleAssignment'
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Modules']), mtwoControlTowerConfigurationImageProcessor],
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Modules',
						incorporateDataRead: function incorporateDataRead(readData, data) {
							if (Object.prototype.hasOwnProperty.call(readData, 'Reports') && readData.Reports.length > 0) {
								_.forEach(readData.Reports, function (item) {
									let parentId=item.Id;
									_.forEach(item.Modules,function(module){
										module.ParentId=parentId;
									});
								});
								data.handleReadSucceeded(readData.Reports, data);
							}
						}
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(options);

		function getSearchFilter() {
			var selected = mtwoControlTowerConfigurationMainService.getSelected();
			if (selected) {
				return {
					Id: selected.Id
				};
			}
			return {
				Id: null
			};
		}

		serviceContainer.service.removeSelected = function (deleteEntitys) {
			let data = serviceContainer.data;
			data.itemList = _.filter(data.itemList, function (item) {
				return !_.find(deleteEntitys, function (delEntity) {
					return item.Id === delEntity.Id;
				});
			});
			serviceContainer.data.listLoaded.fire(data.itemList);
		};
		return serviceContainer.service;
	}
})(angular);
