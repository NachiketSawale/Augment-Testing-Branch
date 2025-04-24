/**
 * Created by shen on 6/11/2021
 */


(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDtlDataService
	 * @description pprovides methods to access, create and update timekeeping worktime model detail entities
	 */
	myModule.service('timekeepingWorkTimeModelDtlDataService', TimekeepingWorkTimeModelDtlDataService);

	TimekeepingWorkTimeModelDtlDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingWorkTimeModelDataService',
		'timekeepingWorkTimeModelConstantValues', 'basicsCommonMandatoryProcessor'];

	function TimekeepingWorkTimeModelDtlDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingWorkTimeModelDataService, timekeepingWorkTimeModelConstantValues, basicsCommonMandatoryProcessor) {
		let self = this;
		let timekeepingWorkTimeModelDetailServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingWorkTimeModelDtlDataService',
				entityNameTranslationID: 'timekeeping.worktimemodel.workTimeModelDtlEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/dtl/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingWorkTimeModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingWorkTimeModelConstantValues.schemes.dtl)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingWorkTimeModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'WorkTimeModelDtl', parentService: timekeepingWorkTimeModelDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingWorkTimeModelDetailServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingWorkTimeModelDtlValidationService'
		},
		timekeepingWorkTimeModelConstantValues.schemes.dtl));

	}
})(angular);
