/**
 * Created by shen on 9/16/2021
 */

(function (angular) {
	/* global moment */
	'use strict';
	const myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeWorkingTimeModelDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeWorkingTimeModelDataService is the data service for all working time model related functionality.
	 */
	myModule.service('timekeepingEmployeeWorkingTimeModelDataService', TimekeepingEmployeeWorkingTimeModelDataService);

	TimekeepingEmployeeWorkingTimeModelDataService.$inject = ['_', 'globals', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingEmployeeDataService', 'timekeepingEmployeeConstantValues', 'basicsCommonMandatoryProcessor','platformRuntimeDataService'];

	function TimekeepingEmployeeWorkingTimeModelDataService(_, globals, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingEmployeeDataService, timekeepingEmployeeConstantValues, basicsCommonMandatoryProcessor,platformRuntimeDataService) {
		let self = this;
		let timekeepingEmployeeWorkingTimeModelServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'TimekeepingWorkTimeModelDayDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingEmployeeWorkingTimeModelEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/employeewtm/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingEmployeeConstantValues.schemes.employeeWTM),
					{processItem: setReadonly},
					{
						processItem: function (item) {
							if (item.ValidTo==null) {
								let myitem = timekeepingEmployeeDataService.getSelected();
								if (myitem) {
									item.ValidTo = myitem.TerminalDate;
								}
							}
						}
					}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							if (data.itemList.length > 0) {
								let record = _.find(data.itemList, function (item) {
									return item.ValidTo === null;
								});
								if (record) {
									if (moment(new Date(newItem.ValidFrom)).format('MM/DD/YYYY') === record.ValidFrom.format('MM/DD/YYYY')) {
										record.ValidTo = moment(new Date(newItem.ValidFrom)).subtract(1, 'd');
										data.markItemAsModified(record, data);
									} else {
										record.ValidTo = moment(new Date(newItem.ValidFrom)).subtract(1, 'd');
										data.markItemAsModified(record, data);
									}
								}
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'EmployeeWTM', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeWorkingTimeModelServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeWorkingTimeModelValidationService'
		}, timekeepingEmployeeConstantValues.schemes.employeeWTM));

		function setReadonly(entity) {
				let fields = [{
						field: 'ValidTo',
						readonly: true
					}];
				platformRuntimeDataService.readonly(entity, fields);
		}

		function deleteItems(entity){
			let wtmData = serviceContainer.data.getList();
			let myitem = timekeepingEmployeeDataService.getSelected();
			const matchIndex = wtmData.findIndex(wtmData => wtmData.Id === entity[0].Id);
			if (matchIndex !== -1) {
				wtmData.splice(matchIndex, 1);
				let lastElement = wtmData[wtmData.length - 1];
				if (lastElement && myitem) {
					lastElement.ValidTo = myitem.TerminalDate;
				}
				serviceContainer.service.markItemAsModified(lastElement);
			}
			serviceContainer.data.deleteEntities(entity, serviceContainer.data);
			return serviceContainer.service.gridRefresh();
		}

		serviceContainer.service.canDelete = function canDelete(){
			let result = false;
			let wtmData = serviceContainer.data.getList();
			if(wtmData.length>1){
				result = true;
			}
			return result;
		}

		serviceContainer.service.deleteEntities = function deleteEntities(entities){
			return deleteItems(entities);
		};

	}
})(angular);
