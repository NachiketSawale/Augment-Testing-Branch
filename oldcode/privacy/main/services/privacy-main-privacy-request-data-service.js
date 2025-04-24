/*
 * $Id: privacy-main-privacy-request-data-service.js 629240 2021-03-23 13:52:05Z leo $
 * Copyright (c) RIB Software SE
 */

( (angular) => {
	'use strict';
	let privacyMainModule = angular.module('privacy.main');

	/**
	 * @ngdoc service
	 * @name privacyMainPrivacyRequestDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	privacyMainModule.factory('privacyMainPrivacyRequestDataService', [ 'platformDataServiceFactory', 'globals', '_',
		function (platformDataServiceFactory, globals, _) {

			let serviceOptions = {
				flatRootItem: {
					module: 'privacy.main',
					serviceName: 'privacyMainPrivacyRequestDataService',
					entityNameTranslationID: 'privacy.main.privacyRequestEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'privacy/main/request/', // adapt to web API controller
						endRead: 'filtered',
						usePostForRead: true
					},
					entityRole: {
						root: {
							itemName: 'PrivacyRequest',
							moduleName: 'cloud.desktop.moduleDisplayNamePrivacyMain',
							mainItemName: 'PrivacyRequest'
						}
					},
					actions: {
						create: 'false',
						delete: false
					},
					sidebarSearch: {
						options: {
							moduleName: 'privacy.main',
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: false,
							pinningOptions: {
								isActive: false
							},
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.service.load();

			serviceContainer.service.createSucceed = function createSucceed(item){
				serviceContainer.data.itemList.push(item);
				serviceContainer.data.markItemAsModified(item, serviceContainer.data);
				serviceContainer.service.gridRefresh();
			};
			serviceContainer.service.takeOver = function takeOver(item){
				var updateItem = _.find(serviceContainer.data.itemList, function(entity){
					return entity.Id === item.Id;
				});
				if (!_.isNil(updateItem)){
					updateItem.PrivacyGradeFk = item.PrivacyGradeFk;
					updateItem.ConfirmedByUserFk = item.ConfirmedByUserFk;
					updateItem.IsWithBackup = item.IsWithBackup;
					serviceContainer.service.gridRefresh();

				}
			};

			serviceContainer.service.isExisting = function isExisting(value){
				return !_.isNil(_.find(serviceContainer.data.itemList, {RenderedDataId: value}));
			};

			serviceContainer.service.doUpdate = function doUpdate(){
				if(serviceContainer.data.doUpdate) {
					return serviceContainer.data.doUpdate(serviceContainer.data);
				}
			};

			return serviceContainer.service;
		}]);
})(angular);
