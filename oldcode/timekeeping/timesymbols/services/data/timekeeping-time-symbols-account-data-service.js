/**
 * Created by leo on 15.02.2021
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
	myModule.service('timekeepingTimeSymbolsAccountDataService', TimekeepingTimeDataService);

	TimekeepingTimeDataService.$inject = ['platformDataServiceFactory', 'platformRuntimeDataService', 'timekeepingTimeSymbolsDataService', 'basicsCommonMandatoryProcessor','platformContextService'];

	function TimekeepingTimeDataService(platformDataServiceFactory, platformRuntimeDataService, timekeepingTimeSymbolsDataService, mandatoryProcessor,platformContextService) {
		let self = this;
		let timekeepingTimeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeSymbolsAccountDataService',
				entityNameTranslationID: 'timekeeping.timesymbols.timeSymbolsAccountEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/timesymbols/account/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingTimeSymbolsDataService.getSelected();
						readData.PKey1 = selected.Id;
						readData.PKey2 = platformContextService.getContext().clientId;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingTimeSymbolsDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = platformContextService.getContext().clientId;
						}
					}
				},
				dataProcessor: [{processItem: setReadonly}],

				entityRole: {
					leaf: {itemName: 'Accounts', parentService: timekeepingTimeSymbolsDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'TimeSymbolAccountDto',
			moduleSubModule: 'Timekeeping.TimeSymbols',
			validationService: 'timekeepingTimeSymbolsAccountValidationService'
		});

		function setReadonly(entity){

			let readonly = entity.CompanyChargedFk === entity.CompanyFk;
					platformRuntimeDataService.readonly(entity, [
						{
							field: 'AccountICCostFk',
							readonly: readonly
						},
						{
							field: 'AccountICRevFk',
							readonly: readonly
						},
						{
							field: 'CompanyChargedFk',
							readonly: entity.ControllingUnitFk!==null
						}
					]);
		}
	}
})(angular);
