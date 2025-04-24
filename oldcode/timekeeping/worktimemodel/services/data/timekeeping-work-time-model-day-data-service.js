/**
 * Created by shen on 6/11/2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDayDataService
	 * @description pprovides methods to access, create and update timekeeping worktime model day entities
	 */
	myModule.service('timekeepingWorkTimeModelDayDataService', TimekeepingWorkTimeModelDayDataService);

	TimekeepingWorkTimeModelDayDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingWorkTimeModelDataService',
		'timekeepingWorkTimeModelConstantValues', 'basicsCommonMandatoryProcessor'];

	function TimekeepingWorkTimeModelDayDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingWorkTimeModelDataService, timekeepingWorkTimeModelConstantValues, basicsCommonMandatoryProcessor) {
		let self = this;
		let timekeepingWorkTimeModelDayServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'TimekeepingWorkTimeModelDayDataService',
				entityNameTranslationID: 'timekeeping.worktimemodel.workTimeModelDayEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/day/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingWorkTimeModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingWorkTimeModelConstantValues.schemes.day)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingWorkTimeModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'WorkTimeModelDay', parentService: timekeepingWorkTimeModelDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingWorkTimeModelDayServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingWorkTimeModelDayValidationService'
		}, timekeepingWorkTimeModelConstantValues.schemes.day));
	}
})(angular);
