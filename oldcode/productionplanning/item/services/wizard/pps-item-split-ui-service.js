/**
 * Created by anl on 7/1/2019.
 */

(function (angular) {
	'use strict';
	/*global angular, _*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemSplitUIService', UIService);

	UIService.$inject = ['$injector'];

	function UIService($injector) {
		var service = {};

		service.getConfigurationFormUI = function () {
			return {
				fid: 'productionplanning.item.split.configForm',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'splitItemConfig',
						header: 'productionplanning.common.product',
						isOpen: true,
						attributes: ['SplitFactor', 'SplitFrom', 'SplitTo', 'IntervalDay', 'ChildItem']
					}
				],
				rows: [
					{
						gid: 'splitItemConfig',
						rid: 'splitFactor',
						label: '*SplitFactor',
						label$tr$: 'productionplanning.item.wizard.itemSplit.splitFactor',
						model: 'SplitFactor',
						sortOrder: 1,
						type: 'integer'
					},
					{
						gid: 'splitItemConfig',
						rid: 'splitFrom',
						label: '*SplitFrom',
						label$tr$: 'productionplanning.item.wizard.itemSplit.splitFrom',
						model: 'SplitFrom',
						sortOrder: 2,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							//lookupDirective: 'productionplanning-common-event-type-lookup',
							lookupDirective: 'productionplanning-common-client-event-type-lookup',
							lookupOptions: {
								filterKey: 'pps-itemsplit-eventtype-from-filter',
								showClearButton: true
							}
						},
						required: true,
						change: function (entity, field) {
							var configService = $injector.get('productionplanningItemSplitConfigurationService');
							configService.updateSplitFromTo.fire(entity, field);
						}
					},
					{
						gid: 'splitItemConfig',
						rid: 'splitTo',
						label: '*SplitTo',
						label$tr$: 'productionplanning.item.wizard.itemSplit.splitTo',
						model: 'SplitTo',
						sortOrder: 3,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							//lookupDirective: 'productionplanning-common-event-type-lookup',
							lookupDirective: 'productionplanning-common-client-event-type-lookup',
							lookupOptions: {
								filterKey: 'pps-itemsplit-eventtype-to-filter',
								showClearButton: true
							}
						},
						required: true,
						change: function (entity, field) {
							var configService = $injector.get('productionplanningItemSplitConfigurationService');
							configService.updateSplitFromTo.fire(entity, field);
						}
					},
					{
						gid: 'splitItemConfig',
						rid: 'intervalDay',
						label: '*IntervalDay',
						label$tr$: 'productionplanning.item.wizard.itemSplit.intervalDay',
						model: 'IntervalDay',
						sortOrder: 4,
						type: 'integer'
					},
					{
						gid: 'splitItemConfig',
						rid: 'childItem',
						label: '*ChildItem',
						label$tr$: 'productionplanning.item.wizard.itemSplit.asChild',
						model: 'ChildItem',
						sortOrder: 5,
						type: 'boolean',
						visible: false
					}
				]
			};
		};

		service.getMainItemListConfig = function () {
			return {
				state: 'd509562f7b9a4adf9d5429d91e2b29bd',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 100,
						sortable: true
					},
					{
						id: 'materialGroup',
						field: 'MaterialGroupFk',
						name: 'MaterialGroup',
						name$tr$: 'productionplanning.item.wizard.itemSplit.materialGroup',
						width: 120,
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialGroup',
							displayMember: 'Code'
						}
					},
					{
						id: 'quantity',
						formatter: 'decimal',
						field: 'Quantity',
						name: 'Quantity',
						name$tr$: 'productionplanning.item.wizard.itemSplit.quantity',
						width: 100,
						sortable: true
					},
					{
						id: 'remainQuantity',
						formatter: 'decimal',
						field: 'RemainQuantity',
						name: 'Remain Quantity',
						name$tr$: 'productionplanning.item.wizard.itemSplit.remainQuantity',
						width: 100
					}
					/*,
					{
						id: 'productionDate',
						formatter: 'datetimeutc',
						editor: 'datetimeutc',
						field: 'ProductionDate',
						name: 'Planned Time',
						name$tr$: 'transportplanning.transport.entityPlannedTime',
						width: 200
					}*/
				],
				lazyInit: true,
				options: {
					indicator: true
				}
			};
		};

		service.getLocationConfig = function () {
			return {
				state: '107e74842ae849d896d1f5a81d613407',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100,
						sortable: true,
						type: 'code',
						editor: 'code'
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'productionplanning.item.wizard.itemSplit.description',
						width: 120,
						sortable: true,
						editor: 'description'
					},
					{
						id: 'quantity',
						formatter: 'decimal',
						field: 'PpsItem.Quantity',
						name: 'Quantity',
						name$tr$: 'productionplanning.item.wizard.itemSplit.quantity',
						editor: 'decimal',
						width: 100,
						sortable: true
					},
					{
						id: 'site',
						type: 'lookup',
						field: 'PpsItem.SiteFk',
						name: 'Site',
						name$tr$: 'productionplanning.item.wizard.itemSplit.site',
						width: 120,
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-site-site-lookup',
							lookupOptions: {showClearButton: false},
							showClearButton: false
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						}
					},
					{
						id: 'sorting',
						formatter: 'integer',
						field: 'Sorting',
						name: 'Sorting',
						name$tr$: 'productionplanning.item.sorting',
						editor: 'integer',
						width: 70,
						sortable: true
					}
				],
				lazyInit: true,
				options: {
					indicator: true
				}
			};
		};

		service.getDynamicColumns = function (eventInfos) {
			var dynamicColumns = [];
			_.forEach(eventInfos, function (eventInfo) {
				var name = _.keys(eventInfo);
				var column =
				{
					id: name + 'Date',
					formatter: 'datetimeutc',
					editor: 'datetimeutc',
					field: 'DateInfo.' + name,
					name: name + ' Start',
					//name$tr$: 'transportplanning.transport.entityPlannedTime',
					width: 200
				};
				dynamicColumns.push(column);
			});

			return dynamicColumns;
		};

		return service;
	}

})(angular);