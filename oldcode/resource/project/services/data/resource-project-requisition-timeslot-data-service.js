
/**
 * Created by shen on 28.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectRequisitionTimeslotDataService
	 * @description provides methods to access, create and update resource project execution planner item entities
	 */
	myModule.service('resourceProjectRequisitionTimeslotDataService', ResourceProjectRequisitionTimeslotDataService);

	ResourceProjectRequisitionTimeslotDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'resourceProjectConstantValues', 'resourceProjectDataService'];

	function ResourceProjectRequisitionTimeslotDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceProjectConstantValues, resourceProjectDataService) {
		let self = this;
		let resourceProjectRequisitionTimeslotServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceProjectRequisitionTimeslotDataService',
				entityNameTranslationID: 'resource.project.requisitionTimeslot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/project/timeslot/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceProjectDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat' },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceProjectConstantValues.schemes.requisitionTimeslot)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = resourceProjectDataService.getSelected();
							const entities = self.getList();
							creationData.PKey1 = selected.Id;
							if(_.isArray(entities) && entities.length > 0) {
								creationData.PKey2 = _.maxBy(entities, function(sl) { return sl.TimeslotNumber}).TimeslotNumber + 10;
							} else {
								creationData.PKey2 = 10;
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Timeslots', parentService: resourceProjectDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceProjectRequisitionTimeslotServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: ''
		}, resourceProjectConstantValues.schemes.requisitionTimeslot));
	}
})(angular);
