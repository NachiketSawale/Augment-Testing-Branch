/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.maintenance');

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceSchemaDataService
	 * @description provides methods to access, create and update resource maintenance schema entities
	 */
	myModule.service('resourceMaintenanceSchemaDataService', ResourceMaintenanceSchemaDataService);

	ResourceMaintenanceSchemaDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceMaintenanceConstantValues'];

	function ResourceMaintenanceSchemaDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceMaintenanceConstantValues) {
		var self = this;
		var resourceMaintenanceSchemaServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceMaintenanceSchemaDataService',
				entityNameTranslationID: 'resource.maintenance.entityMaintenanceScheme',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/maintenance/schema/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'MaintenanceSchemaDto',
					moduleSubModule: 'Resource.Maintenance'
				})],
				entityRole: {
					root: {
						itemName: 'MaintenanceSchemas',
						moduleName: 'cloud.desktop.moduleDisplayNameResourceMaintenance'
					}
				},
				translation: { uid: 'resourceMaintenanceSchemaDataService',
					title: 'resource.maintenance.translationDescMaintenanceScheme',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'MaintenanceSchemaDto',
						moduleSubModule: 'Resource.Maintenance'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'resource.maintenance',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: null,
						showOptions: false,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMaintenanceSchemaServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMaintenanceSchemaValidationService'
		}, resourceMaintenanceConstantValues.schemes.schema ));
	}

})(angular);
