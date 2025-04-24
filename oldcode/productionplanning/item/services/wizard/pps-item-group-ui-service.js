(function (angular) {
	'use strict';
	/*global angular, _, globals*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemGroupUIService', GroupUIService);

	GroupUIService.$inject = [
		'_',
		'$http',
		'productionplanningItemUIStandardService',
		'$injector'
	];

	function GroupUIService(
		_,
		$http,
		itemUIStandardService,
		$injector) {

		var service = {};
		service.initColumn = function initColumn(eventInfo, eventTypeNames) {
			var listConfig = _.cloneDeep(itemUIStandardService.getStandardConfigForListView());
			var columns = ['code', 'descriptioninfo', 'quantity',
				'materialgroupfk', 'mdcmaterialfk', 'uomfk', 'productdescriptionfk'];
			listConfig.columns = _.filter(listConfig.columns, function (column) {
				return columns.indexOf(column.id) > -1;
			});

			_.forEach(listConfig.columns, function (c) {
				c.editor = null;
			});

			var itemColumns = [{
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 80,
				pinned: true,
				headerChkbox: false,
				name$tr$: 'cloud.common.entitySelected'
			}];

			itemColumns = itemColumns.concat(listConfig.columns);

			var dynamicEventColumn = getDynamicColumns(eventInfo, eventTypeNames);
			itemColumns = itemColumns.concat(dynamicEventColumn);

			var eventColumns = [
				{
					id: 'eventType',
					field: 'EventTypeFk',
					name: '*EventType',
					name$tr$: 'productionplanning.configuration.event.eventTypeFk',
					width: 150,
					sortable: false,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'EventType',
						displayMember: 'DescriptionInfo.Translated',
						version: 3
					},
				},
				{
					id: 'plannedStart',
					field: 'PlannedStart',
					name: '*PlannedStart',
					name$tr$: 'productionplanning.item.plannedStart',
					width: 150,
					sortable: false,
					formatter: 'datetimeutc'
				},
				{
					id: 'total',
					field: 'Quantity',
					name: '*Quantity',
					editor: 'decimal',
					formatter: 'quantity',
					name$tr$: 'productionplanning.item.quantity',
					width: 150,
					sortable: false
				}
			];

			return {
				itemColumns: itemColumns,
				eventColumns: eventColumns
			};
		};

		function getDynamicColumns(eventInfo, eventTypeNames) {
			var dynamicColumns = [];
			if (angular.isDefined(eventInfo[0])) {
				for (var i = 0; i < eventTypeNames.length; i++) {
					var column =
						{
							id: eventTypeNames[i],
							formatter: 'datetimeutc',
							editor: 'datetimeutc',
							field: 'DateInfo.' + eventTypeNames[i],
							name: eventTypeNames[i],
							//name$tr$: 'transportplanning.transport.entityPlannedTime',
							width: 200
						};
					dynamicColumns.push(column);
				}
			}
			return dynamicColumns;
		}

		service.initForm = function initForm(selectionService) {
			return {
				fid: 'productionplanning.item.group.configForm',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'groupItemConfig',
						header: 'Creation Info',
						//header$tr$: 'productionplanning.item.wizard.itemGroup.formHeader',
						isOpen: true,
						attributes: ['GroupBefore', 'GroupAfter', 'MaterialGroupFk', 'MaterialFk', 'DrawingFk', 'SumQuantity']
					}
				],
				rows: [
					{
						gid: 'groupItemConfig',
						rid: 'groupBefore',
						label: '*GroupBefore',
						label$tr$: 'productionplanning.item.wizard.itemGroup.groupBefore',
						model: 'GroupBefore',
						sortOrder: 1,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							lookupDirective: 'productionplanning-common-event-type-lookup',
							lookupOptions: {
								filterKey: 'pps-itemgroup-eventtype-before-filter',
								showClearButton: true,
								useCustomData: true,
								dataSources: selectionService.eventTypePool
							}
						},
						required: true,
						change: function (entity, field) {
							selectionService.updateGroupBeforeAfter.fire(entity, field);
						}
					},
					{
						gid: 'groupItemConfig',
						rid: 'groupAfter',
						label: '*GroupAfter',
						label$tr$: 'productionplanning.item.wizard.itemGroup.groupAfter',
						model: 'GroupAfter',
						sortOrder: 2,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							lookupDirective: 'productionplanning-common-event-type-lookup',
							lookupOptions: {
								filterKey: 'pps-itemgroup-eventtype-after-filter',
								showClearButton: true,
								useCustomData: true,
								dataSources: selectionService.eventTypePool
							}
						},
						required: true,
						change: function (entity, field) {
							selectionService.updateGroupBeforeAfter.fire(entity, field);
						}
					},
					{
						gid: 'groupItemConfig',
						rid: 'Quantity',
						label: '*Sum Quantity',
						label$tr$: 'productionplanning.item.wizard.itemGroup.sumQuantity',
						model: 'Quantity',
						sortOrder: 6,
						type: 'decimal'
					}
				]
			};
		};

		service.initCreationForm = function initCreationForm(creationService) {
			return {
				fid: 'productionplanning.item.createItemModal',
				version: '1.0.0',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'creationGroup'
					}
				],
				rows: (function () {
					// add basic row
					var toShow = ['code', 'descriptioninfo', 'lgmjobfk', 'ppsheaderfk', 'materialgroupfk', 'mdcmaterialfk', 'sitefk', 'engdrawingdeffk', 'uomfk', 'quantity'];
					var uiSrv = $injector.get('productionplanningItemUIStandardService');
					var allRows = uiSrv.getStandardConfigForDetailView().rows;
					var result = [];
					toShow.forEach(function (rid) {
						var row = _.find(allRows, {rid: rid});
						if (row) {
							var r = _.cloneDeep(row);
							r.gid = 'creationGroup';
							r.sortOrder = result.length;

							delete r.onPropertyChanged;
							delete r.asyncValidator;
							delete r.validator;
							delete r.navigator;
							delete r.readonly;

							var lookupFields = ['lgmjobfk', 'ppsheaderfk', 'materialgroupfk', 'mdcmaterialfk', 'sitefk', 'engdrawingdeffk', 'uomfk'];
							if (_.find(lookupFields, r.rid)) {
								_.extend(r.options.lookupOptions, {
									showClearButton: true
								});
							}

							if (r.rid === 'quantity') {
								r.readonly = true;
							}

							if (r.rid === 'ppsheaderfk') {
								//r.readonly = false;
								r.change = function (entity, field) {
									creationService.getDefaultItemInfo(entity.PPSHeaderFk);
								};
							}

							if (r.rid === 'code') {
								r.change = function (entity, field) {
									if (entity[field] !== null || entity[field] !== '') {
										creationService.validateUniqueCode(entity);
									}
								};
							}

							if (r.rid === 'materialgroupfk' || r.rid === 'mdcmaterialfk' || r.rid === 'sitefk') {
								r.change = function (entity, field) {
									creationService.updateCode(entity);
								};
							}

							if (r.rid === 'materialgroupfk') {
								_.extend(r.options.lookupOptions, {
									filterKey: 'pps-material-group-filter'
								});
							}

							result.push(r);
						}
					});
					return result;
				})()
			};
		};
		return service;
	}
})(angular);