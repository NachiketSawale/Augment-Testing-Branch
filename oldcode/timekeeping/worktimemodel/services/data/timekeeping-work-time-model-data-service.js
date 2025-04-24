/**
 * Created by shen on 6/9/2021
 */


(function () {
	/* global globals */
	'use strict';
	let timekeepingWorkingTimeModelModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	timekeepingWorkingTimeModelModule.factory('timekeepingWorkTimeModelDataService', [ '_', 'platformDataServiceFactory','basicsCommonMandatoryProcessor','timekeepingWorkTimeModelConstantValues', 'platformDataServiceProcessDatesBySchemeExtension', 'SchedulingDataProcessTimesExtension','platformRuntimeDataService',
		function (_, platformDataServiceFactory,basicsCommonMandatoryProcessor,timekeepingWorkTimeModelConstantValues, platformDataServiceProcessDatesBySchemeExtension, SchedulingDataProcessTimesExtension,platformRuntimeDataService) {

			let self = this;
			let serviceOptions = {
				flatRootItem: {
					module: timekeepingWorkingTimeModelModule,
					serviceName: 'timekeepingWorkTimeModelDataService',
					entityNameTranslationID: 'timekeeping.worktimemodel.workTimeModelEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/', // adapt to web API controller
						endRead: 'filtered',
						usePostForRead: true,
						endDelete: 'multidelete'
					},
					entityRole: {
						root: {
							itemName: 'WorkTimeModels',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingWorkTimeModel',
							mainItemName: 'WorkTimeModel'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						create: 'flat',
						delete: true
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingWorkTimeModelConstantValues.schemes.workTimeModel),
						{

							processItem: function(item){
								platformRuntimeDataService.readonly(item, [
									{field: 'WorkingTimeModelFbFk', readonly: item.IsFallback}
								]);
							}


						},
						new SchedulingDataProcessTimesExtension(['VactionExpiryDate', 'VactionYearStart']),
					],


					translation: {
						uid: 'timekeepingWorkTimeModelDataService',
						title: 'timekeeping.worktimemodel.workTimeModelEntityName',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'WorkTimeModelDto',
							moduleSubModule: 'Timekeeping.WorkTimeModel'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'timekeeping.worktimemodel',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: true,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			function formatDateToDayAndMonth(dateObject) {
				let day = dateObject.getDate().toString().padStart(2, '0');
				let month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
				return `${month}/${day}`;
			}

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions,self);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'timekeepingWorkTimeModelValidationService'
			}, timekeepingWorkTimeModelConstantValues.schemes.workTimeModel));

			return serviceContainer.service;
		}]);


})();
