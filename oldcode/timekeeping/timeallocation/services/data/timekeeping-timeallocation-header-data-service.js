/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let myModule = angular.module('timekeeping.timeallocation');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationDataService
	 * @description provides methods to access, create and update timekeeping timeallocation timeallocation header entities
	 */
	myModule.service('timekeepingTimeallocationHeaderDataService', TimekeepingTimeallocationHeaderDataService);

	TimekeepingTimeallocationHeaderDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingTimeallocationConstantValues','platformRuntimeDataService','platformPermissionService','permissions', 'platformContextService', '$injector'];

	function TimekeepingTimeallocationHeaderDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingTimeallocationConstantValues,platformRuntimeDataService,platformPermissionService,permissions, platformContextService, $injector) {
		let self = this;

		function takeOverReports(response) {
			if (response.TimeAllocationToSave && response.TimeAllocationToSave.length > 0) {
				let reportServ = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService();
				reportServ.takeOverReports(response.TimeAllocationToSave);
			}
		}
		function takeOverBreaks(response){
			if (response.TimeAllocationToSave && response.TimeAllocationToSave.length > 0) {
				let breakServ = $injector.get('timekeepingTimeAllocationBreakDataServiceFactory').createDataService();
				breakServ.takeOverBreaks(response.TimeAllocationToSave);
			}
		}

		let timekeepingTimeallocationServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingTimeallocationDataService',
				entityNameTranslationID: 'timekeeping.timeallocation.timeallocationHeaderEntity',
				httpCRUD: { route: globals.webApiBaseUrl + 'timekeeping/timeallocation/header/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TimeAllocationHeaderDto',
					moduleSubModule: 'Timekeeping.TimeAllocation',

				})],
				entityRole: {root: {
					itemName: 'TimeAllocationHeaderDtos',
					moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingTimeallocation',
					useIdentification: true,
					handleUpdateDone: function (updateData, response, data){
						takeOverReports(response);
						takeOverBreaks(response);
						data.handleOnUpdateSucceeded(updateData, response, data, true);
					}}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.timeallocation',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						// useIdentification: true,
						includeDateSearch: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeallocationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingTimeallocationHeaderValidationService'
		}, timekeepingTimeallocationConstantValues.schemes.timeallocationheader));

		let service= serviceContainer.service;
		service.registerSelectionChanged(function (e, entity) {
			if(entity){
				service.setReadOnly(entity);
			}
		});

		service.setReadOnly = function setReadOnly(entity) {
			if (entity.IsReadOnly) {
				platformPermissionService.restrict(
					[
						timekeepingTimeallocationConstantValues.uuid.container.timeAllocationItemList,
					],
					permissions.read);
				let fields = [];
				let readOnlyFlag = !!entity.IsReadOnly;
				if (entity){

					fields.push({field: 'ProjectFk', readonly: readOnlyFlag});
					fields.push({field: 'JobFk', readonly: readOnlyFlag});
					fields.push({field: 'PeriodFk', readonly: readOnlyFlag});
					fields.push({field: 'RecordingFk', readonly: readOnlyFlag});
					fields.push({field: 'AllocationDate', readonly: readOnlyFlag});
					fields.push({field: 'Comment', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber01', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber02', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber03', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber04', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber05', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber06', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber07', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber08', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber09', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedNumber10', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate01', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate02', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate03', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate04', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate05', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate06', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate07', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate08', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate09', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedDate10', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText01', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText02', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText03', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText04', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText05', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText06', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText07', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText08', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText09', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText10', readonly: readOnlyFlag});

					platformRuntimeDataService.readonly(entity, fields);
				}
			} else {
				platformPermissionService.restrict(
					[
						timekeepingTimeallocationConstantValues.uuid.container.timeAllocationItemList,
					],
					false);
			}
		};
	}
})(angular);
