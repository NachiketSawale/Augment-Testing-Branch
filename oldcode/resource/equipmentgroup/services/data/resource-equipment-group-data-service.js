/**
 * Created by baf on 2017/08/29
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipmentgroup';
	var resourceEquipmentGroupModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name resourceTypeDataService
	 * @function
	 *
	 * @description
	 * resourceTypeDataService is a data service for managing stocks of a project.
	 */
	resourceEquipmentGroupModule.factory('resourceEquipmentGroupDataService', ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'ServiceDataProcessArraysExtension', 'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupConstantValues',

		function (_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessArraysExtension,
         basicsCommonMandatoryProcessor, resourceEquipmentGroupConstantValues) {

			var resourceEquipmentGroupDataServiceOption = {
				hierarchicalRootItem: {
					module: resourceEquipmentGroupModule,
					serviceName: 'resourceEquipmentGroupDataService',
					entityNameTranslationID: 'resource.equipmentgroup.entityResourceEquipmentGroup',
					httpCRUD: {route: globals.webApiBaseUrl + 'resource/equipmentgroup/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete' },
					dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups']),
						platformDataServiceProcessDatesBySchemeExtension.createProcessor(
							resourceEquipmentGroupConstantValues.schemes.group
						)],
					translation: {
						uid: 'resourceEquipmentGroupDataService',
						title: 'resource.equipmentgroup.entityResourceEquipmentGroup',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: resourceEquipmentGroupConstantValues.schemes.group
					},
					entityRole: {root: {itemName: 'EquipmentGroups', moduleName: 'cloud.desktop.moduleDisplayNameEquipmentGroup'}},
					entitySelection: { supportsMultiSelection: true },
					presenter: {
						tree: {
							parentProp: 'EquipmentGroupFk',
							childProp: 'SubGroups',
							initCreationData: function initCreationData(creationData) {
								var parentId = creationData.parentId;
								delete creationData.parentId;
								if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,

							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(resourceEquipmentGroupDataServiceOption);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'resourceEquipmentGroupValidationService'
			}, resourceEquipmentGroupConstantValues.schemes.group ));

			return serviceContainer.service;
		}
	]);
})();
