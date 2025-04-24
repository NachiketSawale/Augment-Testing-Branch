/* global globals, _ */
/**
 * Created by baf on 17.01.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainObservationDataService
	 * @description pprovides methods to access, create and update scheduling main observation entities
	 */
	myModule.service('schedulingMainObservationDataService', SchedulingMainObservationDataService);

	SchedulingMainObservationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'schedulingMainConstantValues', 'schedulingMainService'];

	function SchedulingMainObservationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, schedulingMainConstantValues, schedulingMainService) {
		var self = this;
		var schedulingMainObservationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'schedulingMainObservationDataService',
				entityNameTranslationID: 'scheduling.main.observationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'scheduling/main/observation/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = schedulingMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					schedulingMainConstantValues.schemes.observation)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = schedulingMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Observations', parentService: schedulingMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(schedulingMainObservationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'schedulingMainObservationValidationService'
		}, schedulingMainConstantValues.schemes.observation));
	}
})(angular);
