(function (angular) {
		/* global globals */
		'use strict';
		let myModule = angular.module('project.main');

		/**
		 * @ngdoc service
		 * @name projectMainManagedPlantLocService
		 * @description projectMainManagedPlantLocService is the data service for all location related functionality.
		 */
		myModule.service('projectMainManagedPlantLocService', ProjectMainManagedPlantLocService);

		ProjectMainManagedPlantLocService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
			'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService', 'platformRuntimeDataService','platformPermissionService','permissions'];

		function ProjectMainManagedPlantLocService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService, platformRuntimeDataService, platformPermissionService, permissions) {
			let self = this;

			let projectMainManagedPlantLocServiceOption = {

				flatLeafItem: {
					module: myModule,
					serviceName: 'projectMainManagedPlantLocService',
					entityNameTranslationID: 'project.main.mappedplant',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'project/main/allocation/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = projectMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: { delete: false, create: false },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						projectMainConstantValues.schemes.managedPlantLoc),

					],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selected = projectMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName: 'ManagedPlantLocV', parentService: projectMainService }
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createService(projectMainManagedPlantLocServiceOption, self);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'projectMainManagedPlantLocValidationService'
			}, projectMainConstantValues.schemes.managedPlantLoc));

			let service = serviceContainer.service;

			service.registerSelectionChanged(function (e, entity) {
				service.setReadOnly(entity);
			});
			service.setReadOnly = function setReadOnly(entity) {
				platformPermissionService.restrict(
					[
						projectMainConstantValues.uuid.container.managedPlantLocList,
						projectMainConstantValues.uuid.container.managedPlantLocDetails,
					],

					permissions.read);

				let fields = [];
				let readOnlyFlag = true;
				if (entity) {
					fields.push({ field: 'ProjectFk', readonly: readOnlyFlag });
					fields.push({ field: 'JobFk', readonly: readOnlyFlag });
					fields.push({ field: 'PlantComponentFk', readonly: readOnlyFlag });
					fields.push({ field: 'WorkOperationTypeFk', readonly: readOnlyFlag });
					fields.push({ field: 'JobPlantAllocationFk', readonly: readOnlyFlag });
					fields.push({ field: 'PlantFk', readonly: readOnlyFlag });
					fields.push({ field: 'DispatchHeaderInFk', readonly: readOnlyFlag });
					fields.push({ field: 'PlantDescription', readonly: readOnlyFlag });
					fields.push({ field: 'PlantCode', readonly: readOnlyFlag });
					fields.push({ field: 'PlantTypeFk', readonly: readOnlyFlag });
					fields.push({ field: 'PlantGroupFk', readonly: readOnlyFlag });
					fields.push({ field: 'PlantGroupCode', readonly: readOnlyFlag });
					fields.push({ field: 'PlantComponentTypeFk', readonly: readOnlyFlag });
					fields.push({ field: 'SerialNumber', readonly: readOnlyFlag });
					fields.push({ field: 'AllocatedTo', readonly: readOnlyFlag });
					fields.push({ field: 'AllocatedFrom', readOnly: readOnlyFlag });
					fields.push({ field: 'ProjectCode', readonly: readOnlyFlag });
					fields.push({ field: 'JobCode', readonly: readOnlyFlag });
					fields.push({ field: 'JobDescription', readonly: readOnlyFlag });
					fields.push({ field: 'TrafficLightFk', readonly: readOnlyFlag });
					fields.push({ field: 'TrafficLightIcon', readonly: readOnlyFlag });
					platformRuntimeDataService.readonly(entity, fields);
				}

			};

		}
	}
)(angular);