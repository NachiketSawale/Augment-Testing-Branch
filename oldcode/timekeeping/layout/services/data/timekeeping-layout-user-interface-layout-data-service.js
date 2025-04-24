/*
 * $Id: timekeeping-layout-user-interface-layout-data-service.js 603091 2020-09-14 15:05:52Z cakiral $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var timekeepingLayoutModule = angular.module('timekeeping.layout');

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutUserInterfaceLayoutDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	timekeepingLayoutModule.factory('timekeepingLayoutUserInterfaceLayoutDataService', [ '_', 'platformDataServiceFactory',
		'$http', 'basicsCommonMandatoryProcessor', 'timekeepingLayoutConstantValues',
		function (_, platformDataServiceFactory, $http, basicsCommonMandatoryProcessor, timekeepingLayoutConstantValues) {

			var serviceOptions = {
				flatRootItem: {
					module: timekeepingLayoutModule,
					serviceName: 'timekeepingLayoutUserInterfaceLayoutDataService',
					entityNameTranslationID: 'timekeeping.layout.userInterfaceLayoutEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/layout/', // adapt to web API controller
						endRead: 'filtered',
						usePostForRead: true
					},
					entityRole: {
						root: {
							itemName: 'UserInterfaceLayout',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingLayout',
							mainItemName: 'UserInterfaceLayout'
						}
					},
					actions: {
						create: 'flat',
						delete: true
					},
					sidebarSearch: {
						options: {
							moduleName: 'timekeeping.layout',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							pinningOptions: {
								isActive: false
							},
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'timekeepingLayoutUserInterfaceLayoutValidationService'
			}, timekeepingLayoutConstantValues.schemes.userInterfaceLayout));


			serviceContainer.service.loadAll = function loadAll() {
				return serviceContainer.service.load();
			};

			serviceContainer.service.loadComplete = function loadComplete(id) {
				return $http.get(globals.webApiBaseUrl + 'timekeeping/layout/complete', {
					params: {
						id: id
					}
				}).then(function (response) {
					return response.data;
				});
			};

			serviceContainer.service.getSelectedLayout = function getSelectedLayout() {
				return serviceContainer.data.itemList[0];
			};

			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 4,
					UserInterfaceLayout:   [serviceContainer.service.getSelected()]
				};

				$http.post(globals.webApiBaseUrl + 'timekeeping/layout/execute', command)
					.then(function (response) {
						serviceContainer.data.handleOnCreateSucceeded(response.data.UserInterfaceLayout, serviceContainer.data);
					},
					function (/* error */) {
					});
			};

			return serviceContainer.service;
		}]);
})();
