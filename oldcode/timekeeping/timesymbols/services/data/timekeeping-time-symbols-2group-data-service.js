/**
 * Created by Mohit on 20.06.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.timesymbols');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsAccountDataService
	 * @description pprovides methods to access, create and update timekeeping time symbol account entities
	 */
	myModule.service('timekeepingTimeSymbols2GroupDataService', TimekeepingTimeDataService);

	TimekeepingTimeDataService.$inject = ['platformDataServiceFactory', 'platformRuntimeDataService', 'timekeepingTimeSymbolsDataService', 'basicsCommonMandatoryProcessor'];

	function TimekeepingTimeDataService(platformDataServiceFactory, platformRuntimeDataService, timekeepingTimeSymbolsDataService, mandatoryProcessor) {
		var self = this;
		var timekeepingTimeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeSymbols2GroupDataService',
				entityNameTranslationID: 'timekeeping.timesymbols.timeSymbol2GroupListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/timesymbols/timesymbol2group/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingTimeSymbolsDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingTimeSymbolsDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
			
				entityRole: {
					leaf: {itemName: 'TimeSymbol2Group', parentService: timekeepingTimeSymbolsDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingTimeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'TimeSymbol2GroupDto',
			moduleSubModule: 'Timekeeping.TimeSymbols',
			validationService: 'timekeepingTimeSymbols2GroupValidationService'
		});
		
	}
})(angular);
