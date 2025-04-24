/**
 * Created by shen on 6/11/2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeDerivationDataService
	 * @description pprovides methods to access, create and update timekeeping worktime derivation entities
	 */
	myModule.service('timekeepingWorkTimeDerivationDataService', TimekeepingWorkTimeDerivationDataService);

	TimekeepingWorkTimeDerivationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingWorkTimeModelDataService',
		'timekeepingWorkTimeModelConstantValues', 'basicsCommonMandatoryProcessor'];

	function TimekeepingWorkTimeDerivationDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingWorkTimeModelDataService, timekeepingWorkTimeModelConstantValues, basicsCommonMandatoryProcessor) {
		let self = this;
		let timekeepingWorkTimeDerivationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingWorkTimeDerivationDataService',
				entityNameTranslationID: 'timekeeping.worktimemodel.workTimeDerivationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/worktimemodel/derivation/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingWorkTimeModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingWorkTimeModelConstantValues.schemes.derivation)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingWorkTimeModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'WorkTimeDerivation', parentService: timekeepingWorkTimeModelDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingWorkTimeDerivationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingWorkTimeModelDerivationValidationService'
		}, timekeepingWorkTimeModelConstantValues.schemes.derivation));
	}
})(angular);
