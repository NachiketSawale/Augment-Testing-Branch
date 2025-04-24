/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.period');

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodValidationDataService
	 * @description pprovides methods to access, create and update timekeeping period validation entities
	 */
	myModule.service('timekeepingPeriodValidationDataService', TimekeepingPeriodValidationDataService);

	TimekeepingPeriodValidationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingPeriodDataService'];

	function TimekeepingPeriodValidationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingPeriodDataService) {
		var self = this;
		var timekeepingPeriodValidationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingPeriodValidationDataService',
				entityNameTranslationID: 'timekeeping.period.timekeepingValidationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/period/validation/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingPeriodDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingPeriodDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Validations', parentService: timekeepingPeriodDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingPeriodValidationServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
