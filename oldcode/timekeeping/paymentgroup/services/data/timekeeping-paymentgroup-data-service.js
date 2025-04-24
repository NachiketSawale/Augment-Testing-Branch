/*
 * $Id: timekeeping-paymentgroup-data-service.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var timekeepingPaymentgroupModule = angular.module('timekeeping.paymentgroup');

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentgroupPaymentGroupDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	timekeepingPaymentgroupModule.factory('timekeepingPaymentGroupDataService', [ 'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			var serviceOptions = {
				flatRootItem: {
					module: timekeepingPaymentgroupModule,
					serviceName: 'timekeepingPaymentGroupDataService',
					entityNameTranslationID: 'timekeeping.paymentgroup.paymentGroupEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/paymentgroup/', // adapt to web API controller
						endRead: 'filtered',
						usePostForRead: true,
						endDelete: 'multidelete'
					},
					entityRole: {
						root: {
							itemName: 'PaymentGroups',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingPaymentGroup',
							mainItemName: 'PaymentGroup'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						create: 'flat',
						delete: true
					},
					translation: {
						uid: 'timekeepingPaymentGroupDataService',
						title: 'timekeeping.paymentgroup.paymentGroupEntityName',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'PaymentGroupDto',
							moduleSubModule: 'Timekeeping.PaymentGroup'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'timekeeping.paymentgroup',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
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

			return serviceContainer.service;
		}]);
})();
