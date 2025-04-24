/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceEquipmentPlantLookupDialogNew
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.equipment').directive('resourceEquipmentPlantLookupDialogNew', ['_','$injector','moment','LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceEquipmentFilterLookupDataService', 'platformDataServiceProcessDatesBySchemeExtension',
		function (_, $injector, moment, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, resourceEquipmentFilterLookupDataService, platformDataServiceProcessDatesBySchemeExtension) {
			var formSettings = {
				fid: 'resource.equipment.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.plantkind', '',
					{
						gid: 'selectionfilter',
						rid: 'kind',
						label: 'Plant Kind',
						label$tr$: 'basics.customize.plantkind',
						type: 'integer',
						model: 'kindFk',
						sortOrder: 1
					}, false, {required: false}),
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', '',
					{
						gid: 'selectionfilter',
						rid: 'type',
						label: 'Type',
						label$tr$: 'basics.customize.planttype',
						type: 'integer',
						model: 'typeFk',
						sortOrder: 2
					}, false, {required: false}),
				{
					gid: 'selectionfilter',
					rid: 'group',
					label: 'Equipment Group',
					label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
					type: 'directive',
					model: 'groupFk',
					sortOrder: 3,
					directive: 'resource-equipment-group-lookup-dialog',
					options: {
						displayMember: 'Code',
						descriptionMember: 'Description',
						showClearButton: true,
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.plantstatus', '',
					{
						gid: 'selectionfilter',
						rid: 'status',
						label: 'Plant Status',
						label$tr$: 'basics.customize.plantstatus',
						type: 'integer',
						model: 'statusFk',
						sortOrder: 4
					}, false,
					{
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
						showClearButton: true
					}),
				{
					gid: 'selectionfilter',
					rid: 'company',
					label: 'Company',
					label$tr$: 'cloud.common.entityCompany',
					type: 'directive',
					directive: 'basics-company-company-lookup',
					options: {
						descriptionMember: 'CompanyName',
						showClearButton: true
					},
					model: 'companyFk',
					sortOrder: 5
				},
				{
					gid: 'selectionfilter',
					rid: 'validFrom',
					label: 'Valid From',
					label$tr$: 'cloud.common.entityValidFrom',
					type: 'dateutc',
					model: 'validFrom',
					sortOrder: 6
				},
				{
					gid: 'selectionfilter',
					rid: 'validTo',
					label: 'Valid To',
					label$tr$: 'cloud.common.entityValidTo',
					type: 'dateutc',
					model: 'validTo',
					sortOrder: 7
				},
				{
					gid: 'selectionfilter',
					rid: 'tool',
					label: 'Filter by Tool',
					label$tr$: 'resource.equipment.filterByTool',
					type: 'boolean',
					model: 'hasCacheTool',
					readonly: true,
					visible: false,
					sortOrder: 8
				}]
			};

			var gridSettings = {
				inputSearchMembers: ['Code', 'DescriptionInfo'],
			};

			setColumnsForGridSettings(gridSettings);

			var lookupOptions = {
				lookupType: 'equipmentPlant',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'resource.equipment.entityPlant',
				uuid: 'aa75db0e842b4679a1d50608c04ab495',
				filterOptions: {
					serverSide: true,
					serverKey: 'equipment-plant-filter',
					fn: function (item) {
						return resourceEquipmentFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceEquipmentFilterLookupDataService', formSettings, gridSettings);

			function setColumnsForGridSettings (gridSettings) {
				gridSettings.layoutOptions = {
					translationServiceName: 'resourceEquipmentTranslationService',
					uiStandardServiceName: 'resourceEquipmentPlantLayoutService',
					schemas: [{typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'}]
				};
			}
		}

	]);




})(angular);
