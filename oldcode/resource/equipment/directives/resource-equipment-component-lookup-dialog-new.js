/**
 * Created by shen on 6/28/2022
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceEquipmentComponentLookupDialogNew
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.equipment').directive('resourceEquipmentComponentLookupDialogNew', ['_','$injector','moment','LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceEquipmentComponentFilterLookupDataService',
		function (_, $injector, moment, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, resourceEquipmentComponentFilterLookupDataService) {
			let formSettings = {
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
				rows: [
					{
						gid: 'selectionfilter',
						rid: 'plantfk',
						label: 'Plant',
						label$tr$: 'resource.equipment.entityPlant',
						model: 'plantFk',
						sortOrder: 1,
						type: 'directive',
						directive: 'resource-equipment-plant-lookup-dialog-new',
						options: {
							showClearButton: true
						}
					},
				]
			};

			let gridSettings = {
				layoutOptions: {
					translationServiceName: 'resourceEquipmentTranslationService',
					uiStandardServiceName: 'resourceEquipmentPlantComponentUIStandardService',
					schemas: [{
						typeName: 'PlantComponentDto',
						moduleSubModule: 'Resource.Equipment'
					}]
				}
			};

			setColumnsForGridSettings(gridSettings);

			let lookupOptions = {
				lookupType: 'equipmentPlantComponent',
				valueMember: 'Id',
				displayMember: 'SerialNumber',
				title: 'resource.equipment.entityResourceEquipmentPlantComponent',
				uuid: 'bff1f71b310d4eddb2c12405aac35bb4',
				filterOptions: {
					serverSide: true,
					serverKey: 'plantComponentFilter',
					fn: function (item) {
						return resourceEquipmentComponentFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceEquipmentComponentFilterLookupDataService', formSettings, gridSettings);


			function setColumnsForGridSettings (gridSettings) {
				gridSettings.layoutOptions = {
					translationServiceName: 'resourceEquipmentTranslationService',
					uiStandardServiceName: 'resourceEquipmentPlantComponentUIStandardService',
					schemas: [{typeName: 'PlantComponentDto', moduleSubModule: 'Resource.Equipment'}]
				};
			}
		}

	]);




})(angular);
