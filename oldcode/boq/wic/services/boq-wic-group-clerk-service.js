/**
 * Created by Helmut Buck on 27.03.2018
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'boq.wic';
	var boqWicModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqWicGroupClerkService
	 * @function
	 *
	 * @description
	 * boqWicGroupClerkService is the data service for all clerk related functionality in wic.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	boqWicModule.factory('boqWicGroupClerkService', ['$http', '$q', '$log', 'boqWicGroupService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonReadDataInterceptor',

		function ($http, $q, $log, boqWicGroupService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonReadDataInterceptor) {

			var clerkServiceInfo = {
				flatLeafItem: {
					module: boqWicModule,
					serviceName: 'boqWicGroupClerkService',
					entityNameTranslationID: 'basics.clerk.entityClerk',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName: 'WicGroup2ClerkDto', moduleSubModule: 'Boq.Wic'})],
					httpCreate: {route: globals.webApiBaseUrl + 'boq/wic/wicgroup2clerk/'},
					httpRead: {route: globals.webApiBaseUrl + 'boq/wic/wicgroup2clerk/', endRead: 'listByWicGroup'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = boqWicGroupService.getSelected();
								creationData.Id = selectedItem.Id;
								delete creationData.MainItemId;
							}
						}
					},
					entityRole: {leaf: {itemName: 'Clerks', parentService: boqWicGroupService, parentFilter: 'wicGroupId'}}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(clerkServiceInfo);
			var instance = container.service;
			if (boqWicGroupService.completeItemCreated) {
				boqWicGroupService.completeItemCreated.register(function (e, args) {
					container.service.setCreatedItems(args.WicGroup2Clerks);

				});
			}
			basicsCommonReadDataInterceptor.init(instance, container.data);
			return container.service;

		}]);
})(angular);
