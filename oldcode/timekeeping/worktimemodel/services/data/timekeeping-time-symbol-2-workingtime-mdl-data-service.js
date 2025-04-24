/**
 * Created by jpfriedel on 30/3/2022
 */


(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbol2WorkTimeModelDataService
	 * @description pprovides methods to access, create and update timekeeping tme symbol 2 worktime module model detail entities
	 */
	myModule.service('timekeepingTimeSymbol2WorkTimeModelDataService', TimekeepingTimeSymbol2WorkTimeModelDataService);

	TimekeepingTimeSymbol2WorkTimeModelDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingWorkTimeModelDataService',
		'timekeepingWorkTimeModelConstantValues', 'basicsCommonMandatoryProcessor'];

	function TimekeepingTimeSymbol2WorkTimeModelDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingWorkTimeModelDataService, timekeepingWorkTimeModelConstantValues, basicsCommonMandatoryProcessor) {
		let self = this;
		let timekeepingTimeSymbol2WorkTimeModelServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeSymbol2WorkTimeModuleDataService',
				entityNameTranslationID: 'timekeeping.worktimemodel.timeSymbol2WorkTimeModelEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/timesymbol2worktime/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingWorkTimeModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingWorkTimeModelConstantValues.schemes.ts2wtm)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingWorkTimeModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'TimeSymbol2WorkTimeModel', parentService: timekeepingWorkTimeModelDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeSymbol2WorkTimeModelServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingTimeSymbol2WorkTimeModelValidationService'
		}, timekeepingWorkTimeModelConstantValues.schemes.ts2wtm));
	}
})(angular);
