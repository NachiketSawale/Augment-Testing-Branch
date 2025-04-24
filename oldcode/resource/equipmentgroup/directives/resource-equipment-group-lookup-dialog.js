/**
 * Created by leo on 15.06.2021.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceEquipmentGroupLookupDialog
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.equipmentgroup').directive('resourceEquipmentGroupLookupDialog', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceEquipmentGroupFilterLookupDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupFilterService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, resourceEquipmentGroupFilterLookupDataService, platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupFilterService) {

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'resource-equipment-category-by-rubric-filter',
					fn: function (rubricCategory /*, entity*/) {
						return rubricCategory.RubricFk === 30;  // Rubric for equipment
					}
				},
				{
					key: 'resource-equipment-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function (entity) {
						return { Rubric: 30 };//30 is rubric for equipment.
					}
				}
				]);
			let formSettings = {
				fid: 'resource.equipmentgroup.selectionfilter',
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
				rows: [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.equipmentpricinggroup', '',
					{
						gid: 'selectionfilter',
						rid: 'pricingGroup',
						label: 'Pricing Group',
						label$tr$: 'basics.customize.equipmentpricinggroup',
						type: 'lookup',
						model: 'pricingGroupFk',
						sortOrder: 1
					}, false, {required: false}),
					{
						gid: 'selectionfilter',
						rid: 'rubricCat',
						model: 'rubricCatFk',
						sortOrder: 2,
						label$tr$: 'cloud.common.entityBasRubricCategoryFk',
						label: 'Rubric Category',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'resource-equipment-rubric-category-lookup-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RubricCategoryByRubricAndCompany',
							displayMember: 'Description'
						}
					}
					]
			};

			let gridSettings = {
				columns: [
					{
						id:'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						formatter: 'code'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 270
					},
					{
						id: 'pricingGroup',
						field: 'PricingGroupFk',
						name: 'Pricing Group',
						name$tr$: 'basics.customize.equipmentpricinggroup',
						readonly: false,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.equipmentpricinggroup'
						}).formatterOptions
					},
					{
						id: 'rubricCategory',
						field: 'RubricCategoryFk',
						name: 'Rubric Category',
						name$tr$: 'basics.lookup.rubriccategory',
						readonly: false,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.lookup.rubriccategory'
						}).formatterOptions
					},
					{
						id:'isLive',
						field: 'IsLive',
						name: 'Active',
						name$tr$: 'cloud.common.entityIsLive',
						readonly: true,
						formatter: 'islive'
					},
					{
						id: 'specification',
						field: 'Specification',
						name: 'Specification',
						readonly: false,
						name$tr$: 'cloud.common.EntitySpec',
						formatter: 'remark',
						width: 300
					},
					{
						id: 'comment',
						field: 'CommentText',
						name: 'Comment',
						name$tr$: 'cloud.common.entityComment',
						formatter: 'comment',
						readonly: true,
						width: 270
					}],
				treeOptions: {
					parentProp: 'EquipmentGroupFk',
					childProp: 'SubGroups'
				}
			};

			let lookupOptions = {
				lookupType: 'equipmentGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'resource.equipmentgroup.entityResourceEquipmentGroup',
				uuid: '9934f60297474d90a973b7c1c5eb0e7b',
				filterOptions: {
					serverSide: true,
					serverKey: 'equipment-group-filter',
					fn: function (item) {
						return resourceEquipmentGroupFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceEquipmentGroupFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
