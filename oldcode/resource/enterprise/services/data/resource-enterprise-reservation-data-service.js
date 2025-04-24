/**
 * Created by cakiral on 09.06.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.enterprise');

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseReservationDataService
	 * @description pprovides methods to access, create and update resource enterprise reservation entities
	 */
	myModule.service('resourceEnterpriseReservationDataService', ResourceEnterpriseReservationDataService);

	ResourceEnterpriseReservationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',  'resourceEnterpriseDispatcherDataService','platformRuntimeDataService'];

	function ResourceEnterpriseReservationDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor,  resourceEnterpriseDispatcherDataService, platformRuntimeDataService) {
		var self = this;

		var resourceEnterpriseReservationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEnterpriseReservationDataService',
				entityNameTranslationID: 'DispatcherGroups2ReservationVEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/enterprise/reservation/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEnterpriseDispatcherDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},

				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'DispatcherGroups2ReservationVDto',
						moduleSubModule: 'Resource.Enterprise'
					}
				),  {processItem: setContainerToReadOnly}],

				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEnterpriseDispatcherDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Reservations',
						parentService: resourceEnterpriseDispatcherDataService
					}
				}
			}
		};

		function setContainerToReadOnly(item) {
			platformRuntimeDataService.readonly(item, true);
		}

		var serviceContainer = platformDataServiceFactory.createService(resourceEnterpriseReservationServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEnterpriseReservationValidationService'
		}, null));
	}
})(angular);
