(function () {
	'use strict';
	var modName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(modName).factory('procurementCommonItemPriceLayout', [
		'moment',
		'platformGridDomainService',
		'procurementCommonUpdateItemPriceService',
		function (moment,
			platformGridDomainService,
			procurementCommonUpdateItemPriceService) {

			return {
				getUI: getUI
			};

			function getUI(dataService, options) {

				var opts = angular.extend({
					hasSelected: true
				}, options);

				var selectedColumn = {
					id: 'selected',
					field: 'Selected',
					name: 'Selected',
					name$tr$: 'cloud.common.entitySelected',
					editor: 'dynamic',
					domain: function (item) {
						var domain;
						if (!item.SourceType) {
							domain = 'description';
						} else {
							domain = 'boolean';
						}
						return domain;
					},
					formatter: function (row, cell, value, columnDef, dataContext) {
						var template;
						value = dataContext[columnDef.field];
						if (!dataContext.SourceType) {
							template = '';
						} else {
							template = '<input type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
						}
						return '<div class="text-center" >' + template + '</div>';
					},
					cssClass: 'cell-center',
					width: 30
				};

				var updateGridColumns = [{
					id: 'itemCodeDesc',
					field: 'ItemCodeAndDesc',
					name: 'Item Code / Description',
					width: 120,
					name$tr$: 'procurement.common.wizard.updateItemPrice.itemCodeAndDesc',
					formatter: 'description',
					sortable: true,
					readonly: true
				}, {
					id: 'type',
					field: 'SourceType',
					name: 'Type',
					width: 60,
					name$tr$: 'procurement.common.wizard.updateItemPrice.type',
					formatter: 'description',
					sortable: true,
					readonly: true
				}, {
					id: 'sourceCodeDesc',
					field: 'SourceCodeAndDesc',
					name: 'Source Code / Description',
					name$tr$: 'procurement.common.wizard.updateItemPrice.sourceCodeAndDesc',
					sortable: true,
					formatter: 'description',
					width: 120
				}, {
					id: 'unitRate',
					field: 'MaterialPriceListId',
					name: 'Unit Rate',
					sortable: true,
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'prc-common-update-price-list-lookup',
						valueMember: 'Id',
						displayMember: 'Code'
					},
					formatter: function (row, cell, value, columnDef, dataContext) {
						return procurementCommonUpdateItemPriceService.formatterMoneyType(dataContext, 'UnitRate');
					},
					validator: validateUnitRate,
					name$tr$: 'procurement.common.wizard.updateItemPrice.unitRate',
					width: 70
				}, {
					id: 'convertedUnitRate',
					field: 'ConvertedUnitRate',
					name: 'Converted Unit Rate',
					formatter: 'money',
					name$tr$: 'procurement.common.wizard.updateItemPrice.convertedUnitRate',
					sortable: true,
					width: 70
				}, {
					id: 'variance',
					field: 'VarianceFormatter',
					name: 'Variance',
					formatter: 'money',
					name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.variance',
					sortable: true,
					width: 70
				}, {
					id: 'uom',
					field: 'UomId',
					name: 'Uom',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.matchingMaterialUoM',
					sortable: true,
					width: 50
				}, {
					id: 'priceUnit',
					field: 'PriceUnit',
					name: 'Price Unit',
					formatter: 'money',
					name$tr$: 'procurement.common.wizard.updateItemPrice.priceUnit',
					sortable: true,
					width: 70
				}, {
					id: 'weighting',
					field: 'Weighting',
					name: 'Weighting',
					editor: 'integer',
					sortable: true,
					regex: '^[+]?\\d*$',
					formatter: function (row, cell, value, setting, entity) {
						if (!entity.SourceType) {
							return '';
						}
						if (!value || value <= 0) {
							entity.Weighting = 1;
							return 1;
						}
						return value;
					},
					name$tr$: 'project.main.weighting',
					width: 70
				}, {
					id: 'date',
					field: 'Date',
					name: 'Date',
					sortable: true,
					formatter: function (row, cell, value, columnDef, dataContext) {
						if (_.isString(value)) {
							value = moment.utc(value);
							dataContext[columnDef.field] = value;
						}
						return platformGridDomainService.formatter('dateutc')(row, cell, value, columnDef, dataContext);
					},
					name$tr$: 'procurement.common.entityDate',
					width: 70
				}, {
					id: 'projectId',
					field: 'ProjectId',
					name: 'Project',
					name$tr$: 'project.main.sourceProject',
					sortable: true,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					},
					width: 70
				}, {
					id: 'businessPartner',
					field: 'BusinessPartnerId',
					name: 'Business Partner',
					name$tr$: 'cloud.common.businessPartner',
					sortable: true,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
					{
						id: 'Co2Project',
						field: 'Co2Project',
						name: 'CO2/kg (Project)',
						name$tr$: 'procurement.common.entityCo2Project',
						width: 100,
						formatter: 'money',
						readonly: true
					},
					{
						id: 'Co2Source',
						field: 'Co2Source',
						name: 'CO2/kg (Source)',
						name$tr$: 'procurement.common.entityCo2Source',
						width: 100,
						formatter: 'money',
						readonly: true
					},{
						id: 'updatedate',
						field: 'UpdateDate',
						name: 'Update Date',
						sortable: true,
						formatter: function (row, cell, value, columnDef, dataContext) {
							if (_.isString(value)) {
								value = moment.utc(value);
								dataContext[columnDef.field] = value;
							}
							return platformGridDomainService.formatter('dateutc')(row, cell, value, columnDef, dataContext);
						},
						name$tr$: 'procurement.common.UpdateDate',
						width: 70
					}];

				if (opts.hasSelected) {
					updateGridColumns.unshift(selectedColumn);
				}

				function validateUnitRate(entity) {
					var parent = _.find(dataService.getTree(), {Id: entity.PId});
					entity.Variance = entity.ConvertedUnitRate - parent.UnitRate;
					entity.VarianceFormatter = _.round(entity.ConvertedUnitRate, 2) - _.round(parent.UnitRate, 2);
					return true;
				}

				return {
					getStandardConfigForListView: function () {
						return {
							columns: updateGridColumns
						};
					}
				};
			}
		}]);
})();