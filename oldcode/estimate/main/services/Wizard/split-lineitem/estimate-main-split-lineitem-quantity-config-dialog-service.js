/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainSplitLineItemQuantityConfigDialogService
	 * @function
	 *
	 * @description
	 * This is the configuration service to split LineItem by Percentage and Quantity.
	 */
	angular.module(moduleName).factory('estimateMainSplitLineItemQuantityConfigDialogService', [
		function () {

			let service = {};
			let getColumns = function getColumns(){
				let cols = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					grouping: true,
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];
				return [
					{
						id: 'info',
						field: 'image',
						name: 'Info',
						name$tr$: 'estimate.main.info',
						toolTip: 'Info',
						toolTip$tr$: 'estimate.main.info',
						formatter: 'image',
						formatterOptions: {imageSelector: 'estimateMainLineItemImageProcessor'},
						readonly: true,
						grouping: {'generic': false},
						width: 40
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						toolTip: 'Code',
						toolTip$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						grouping: {'generic': false},
						width: 70
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						toolTip: 'Description',
						toolTip$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						grouping: {'generic': false},
						width: 200
					},

					{
						id: 'QuantityPercent',
						field: 'QuantityPercent',
						name: 'quantity Percent',
						name$tr$: 'estimate.main.splitLineItemWizard.quantityPercent',
						toolTip: 'quantity Percent',
						toolTip$tr$: 'estimate.main.splitLineItemWizard.quantityPercent',
						editor: 'percent',
						formatter: 'percent',
						isTransient: true,
						validator: 'validateQuantityPercent',
						grouping: {'generic': false},
						width: 70
					},
					{
						id: 'QuantityTotal',
						field: 'QuantityTotal',
						name: 'quantity Total',
						name$tr$: 'estimate.main.quantityTotal',
						toolTip: 'Quantity Total',
						toolTip$tr$: 'estimate.main.quantityTotal',
						editor: 'quantity',
						formatter: 'quantity',
						validator: 'validateQuantityTotal',
						grouping: {'generic': false},
						width: 70
					},
					{
						id: 'SplitDifference',
						field: 'SplitDifference',
						name: 'Split Difference',
						name$tr$: 'estimate.main.splitDifference',
						toolTip: 'Split Difference',
						toolTip$tr$: 'estimate.main.splitDifference',
						grouping: {'generic': false},
						width: 70
					},
					{
						id: 'estLineItemFk',
						field: 'EstLineItemFk',
						name: 'LineItem Reference',
						name$tr$: 'estimate.main.estLineItemFk',
						toolTip: 'LineItem Reference',
						toolTip$tr$: 'estimate.main.estLineItemFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estlineitems',
							displayMember: 'Code',
							dataServiceName: 'estimateMainLineItemDialogService'
						},
						grouping: {'generic': false},
						width: 70
					},
					{
						id: 'mdccontrollingunitfk',
						field: 'MdcControllingUnitFk',
						name: 'Controlling Unit',
						name$tr$: 'estimate.main.mdcControllingUnitFk',
						toolTip: 'Controlling Unit',
						toolTip$tr$: 'estimate.main.mdcControllingUnitFk',
						type: 'directive',
						directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
						editor: 'lookup',
						editorOptions: {
							directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
							lookupOptions: {
								'showClearButton': true,
								'additionalColumns': true,
								filterKey: 'est-prj-controlling-unit-filter',
								'displayMember': 'Code',
								considerPlanningElement: true,
								selectableCallback: function(dataItem){
									return dataItem.IsPlanningElement;
								},
								'addGridColumns': cols
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'controllingunit',
							displayMember: 'Code'
						},
						grouping: {'generic': false},
						asyncValidator: 'asyncValidateMdcControllingUnitFk'
					},
					{
						id: 'boqrootref',
						field: 'BoqItemFk',
						name: 'BoQ Root Item Ref. No',
						name$tr$: 'estimate.main.boqRootRef',
						toolTip: 'BoQ Root Item Ref. No',
						toolTip$tr$: 'estimate.main.boqRootRef',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estboqitems',
							displayMember: 'Reference',
							dataServiceName: 'estimateMainBoqRootLookupService'
						}
					},
					{
						id: 'estboqfk',
						field: 'BoqItemFk',
						name: 'Boq ',
						name$tr$: 'estimate.main.boqItemFk',
						toolTip: 'BoQ-Item Ref.No',
						toolTip$tr$: 'estimate.main.boqItemFk',
						type: 'directive',
						directive: 'estimate-main-boq-dialog',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-boq-dialog',
							lookupOptions: {
								'showClearButton': true,
								'additionalColumns': true,
								'displayMember': 'Reference',
								'addGridColumns': [
									{
										id: 'brief',
										field: 'BriefInfo',
										name: 'Brief',
										width: 120,
										toolTip: 'Brief',
										formatter: 'translation',
										name$tr$: 'estimate.main.briefInfo'
									}
								],
								'usageContext': 'estMainSplitLineItemQuantityService'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estboqitems',
							displayMember: 'Reference',
							dataServiceName: 'estimateMainBoqLookupService'
						},
						grouping: {'generic': false},
						asyncValidator: 'asyncValidateBoqItemFk'
					},
					{
						id: 'psdactivityschedule',
						field: 'PsdActivityFk',
						name: 'Activity Schedule',
						name$tr$: 'estimate.main.activitySchedule',
						toolTip: 'Activity Schedule',
						toolTip$tr$: 'estimate.main.activitySchedule',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estlineitemactivity',
							displayMember: 'Code',
							dataServiceName: 'estimateMainActivityScheduleLookupService'
						}
					},
					{
						id: 'psdactivityfk',
						field: 'PsdActivityFk',
						name: 'Activity ',
						name$tr$: 'estimate.main.psdActivityFk',
						toolTip: 'Activity',
						toolTip$tr$: 'estimate.main.psdActivityFk',
						type: 'directive',
						directive: 'estimate-main-activity-dialog',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-activity-dialog',
							lookupOptions: {
								'showClearButton': true,
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': [{
									id: 'dec',
									field: 'Description',
									name: 'Description',
									width: 120,
									toolTip: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estlineitemactivity',
							displayMember: 'Code',
							dataServiceName: 'estimateMainActivityLookupService'
						},
						grouping: {'generic': false},
						asyncValidator: 'asyncValidatePsdActivityFk'
					},
					{
						id: 'prjlocationfk',
						field: 'PrjLocationFk',
						name: 'Location',
						name$tr$: 'estimate.main.prjLocationFk',
						toolTip: 'PrjLocation',
						toolTip$tr$: 'estimate.main.prjLocationFk',
						type: 'directive',
						directive: 'estimate-main-location-dialog',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-location-dialog',
							lookupOptions: {
								'showClearButton': true,
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': cols
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estLineItemLocation',
							displayMember: 'Code',
							dataServiceName: 'estimateMainLocationLookupService'
						},
						asyncValidator: 'asyncValidatePrjLocationFk'
					}
				];
			};

			service.getStandardConfigForListView = function () {

				return {
					fid: 'est.main.split.lineItem.quantity.layout',
					version: '1.0.0',
					showGrouping: false,
					columns: getColumns()
				};
			};

			return service;
		}]);
})();



