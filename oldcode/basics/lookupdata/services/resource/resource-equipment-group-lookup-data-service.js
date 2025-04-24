/**
 * Created by leo on 19.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceEquipmentGroupLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceEquipmentGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'plantkind',
						field: 'DefaultPlantKindFk',
						name: 'Plant Kind',
						name$tr$: 'basics.customize.plantkind',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.plantkind',
							att2BDisplayed: 'Description',
							readOnly: true,
							options: null
						}).formatterOptions
					},
					{
						id: 'planttype',
						field: 'DefaultPlantTypeFk',
						name: 'Plant Type',
						name$tr$: 'basics.customize.planttype',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.planttype',
							att2BDisplayed: 'Description',
							readOnly: true,
							options: null
						}).formatterOptions
					},
					{
						id: 'PrcStructure',
						field: 'DefaultProcurementStructureFk',
						name: 'Procurement Structure',
						name$tr$: 'resource.equipment.entityProcurementStructure',
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						},
					},
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						formatter: 'comment',
						width: 300,
						name$tr$: 'cloud.common.entityComment'
					},
					{
						id: 'Specification',
						field: 'Specification',
						name: 'Specification',
						formatter: 'remark',
						width: 300,
						name$tr$: 'cloud.common.EntitySpec'
					}

				],
				uuid: '5ca9a82dfe714ea7a0105bcf4e58e570'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/',
					endPointRead: 'lookuplist'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubResources'])],
				tree: {
					parentProp: 'EquipmentGroupFk',
					childProp: 'SubGroups'
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
