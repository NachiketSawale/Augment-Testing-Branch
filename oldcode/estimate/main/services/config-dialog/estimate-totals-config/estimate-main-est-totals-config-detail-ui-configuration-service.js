/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigDetailUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainEstTotalsConfigDetailUIConfigurationService', [
		'platformTranslateService', 'platformGridDomainService', 'basicsLookupdataSimpleLookupService','$injector',
		function ( platformTranslateService, platformGridDomainService, basicsLookupdataSimpleLookupService,$injector) {

			let service = {};

			let gridColumns = [
				{
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					toolTip: 'Description',
					editor: 'directive',
					editorOptions: {
						directive: 'basics-common-translate-cell',
						dataService: 'estimateMainEstTotalsConfigDetailDataService',
						containerDataFunction: 'getContainerData'
					},
					required: true,
					formatter: 'translation',
					width: 160
				},
				{
					id: 'LineType',
					field:'LineType',
					name: 'LineType',
					name$tr$: 'estimate.main.lineTypeStr',
					toolTip: 'Line Type',
					editor: 'lookup',
					editorOptions: {
						directive: 'estimate-main-line-type-combobox-lookup',
						lookupOptions: {
							showClearButton: false,
							selectableCallback: function(dataItem,entity){
								entity.LineType = dataItem.Id;
								$injector.get('estimateMainCostCodeAssignmentDetailDataService').readOnlyCostCodeAssignment.fire();
								$injector.get('estimateMainEstTotalsConfigDetailDataService').onLineTypeChange.fire(dataItem.Id);
								return true;
							}
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'EstimateLineType',
						displayMember: 'Code',
						dataServiceName:'estimateMainLineTypeLookupDataService'
					},
					width: 80,
				},
				{
					id: 'estBasUoMFk',
					field: 'BasUomFk',
					name: 'UoM',
					name$tr$: 'estimate.main.totalsConfigDetails.BasUoMFk',
					toolTip: 'UoM',
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-uom-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					width: 80
				},
				{
					id: 'isLabour',
					field: 'IsLabour',
					name: 'Labour',
					name$tr$: 'estimate.main.totalsConfigDetails.IsLabour',
					formatter: 'boolean',
					editor: 'boolean',
					headerChkbox: true,
					width: 60
				},
				{
					id: 'isBold',
					field: 'IsBold',
					name: 'Bold',
					name$tr$: 'estimate.main.totalsConfigDetails.IsBold',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'isItalic',
					field: 'IsItalic',
					name: 'Italic',
					name$tr$: 'estimate.main.totalsConfigDetails.IsItalic',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'isUnderLine',
					field: 'IsUnderline',
					name: 'UnderLine',
					name$tr$: 'estimate.main.totalsConfigDetails.IsUnderLine',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'costTypes',
					field: 'EstTotalDetail2CostTypes',
					name: 'Cost Types',
					name$tr$: 'basics.customize.costTypes',
					width: 60,
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'estimate.lookup.costtype2',
						displayMember: 'Description',
						valueMember: 'Id',
						filter: {
							customIntegerProperty: 'MDC_CONTEXT_FK',
						}
					},
					formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig) {
						let data = displayValue || [];
						value = _.map(data, function(item){
							return (item.Id === 0 ? {Description: platformTranslateService.instant('basics.customize.noAssignment', null, true)} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, lookupConfig.formatterOptions) || {}).Description;
						}).join(', ');
						return value;
					},
					editor: 'directive',
					editorOptions: {
						directive: 'estimate-main-totals-config-detail-filter-lookup'
					}
				},
				{
					id: 'resourceFlags',
					field: 'EstTotalDetail2ResourceFlags',
					name: 'Resource Flags',
					name$tr$: 'basics.customize.resourceFlags',
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'estimate.lookup.resourceflag2',
						displayMember: 'Description',
						valueMember: 'Id',
						filter: {
							customIntegerProperty: 'MDC_CONTEXT_FK',
						}
					},

					formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig) {
						let data = displayValue || [];
						value = _.map(data, function(item){
							return (item.Id === 0 ? {Description: platformTranslateService.instant('basics.customize.noAssignment', null, true)} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, lookupConfig.formatterOptions) || {}).Description;
						}).join(', ');
						return value;
					},
					width: 100,
					editor: 'directive',
					editorOptions: {
						directive: 'estimate-main-totals-config-detail-filter-lookup'
					}
				}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			service.getStandardConfigForListView = function(){
				return{
					addValidationAutomatically: true,
					columns : gridColumns
				};
			};

			return service;
		}]);

	angular.module(moduleName).factory('estimateMainAssemblyTotalsConfigDetailUIConfigurationService', [
		'platformTranslateService', 'platformGridDomainService', 'basicsLookupdataSimpleLookupService','$injector',
		function ( platformTranslateService, platformGridDomainService, basicsLookupdataSimpleLookupService) {

			let service = {};

			let gridColumns = [
				{
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					toolTip: 'Description',
					editor: 'directive',
					editorOptions: {
						directive: 'basics-common-translate-cell',
						dataService: 'estimateMainEstTotalsConfigDetailDataService',
						containerDataFunction: 'getContainerData'
					},
					formatter: 'translation',
					width: 160
				},
				{
					id: 'estBasUoMFk',
					field: 'BasUomFk',
					name: 'UoM',
					name$tr$: 'estimate.main.totalsConfigDetails.BasUoMFk',
					toolTip: 'UoM',
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-uom-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					width: 80
				},
				{
					id: 'isLabour',
					field: 'IsLabour',
					name: 'Labour',
					name$tr$: 'estimate.main.totalsConfigDetails.IsLabour',
					formatter: 'boolean',
					editor: 'boolean',
					headerChkbox: true,
					width: 60
				},
				{
					id: 'isBold',
					field: 'IsBold',
					name: 'Bold',
					name$tr$: 'estimate.main.totalsConfigDetails.IsBold',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'isItalic',
					field: 'IsItalic',
					name: 'Italic',
					name$tr$: 'estimate.main.totalsConfigDetails.IsItalic',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'isUnderLine',
					field: 'IsUnderline',
					name: 'UnderLine',
					name$tr$: 'estimate.main.totalsConfigDetails.IsUnderLine',
					formatter: 'boolean',
					editor: 'boolean',
					width: 60
				},
				{
					id: 'costTypes',
					field: 'EstTotalDetail2CostTypes',
					name: 'Cost Types',
					name$tr$: 'basics.customize.costTypes',
					width: 60,
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'estimate.lookup.costtype',
						displayMember: 'Description',
						valueMember: 'Id'
					},
					formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig) {
						let data = displayValue || [];
						value = _.map(data, function(item){
							return (item.Id === 0 ? {Description: platformTranslateService.instant('basics.customize.noAssignment', null, true)} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, lookupConfig.formatterOptions) || {}).Description;
						}).join(', ');
						return value;
					},
					editor: 'directive',
					editorOptions: {
						directive: 'estimate-main-totals-config-detail-filter-lookup'
					}
				},
				{
					id: 'resourceFlags',
					field: 'EstTotalDetail2ResourceFlags',
					name: 'Resource Flags',
					name$tr$: 'basics.customize.resourceFlags',
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'estimate.lookup.resourceflag',
						displayMember: 'Description',
						valueMember: 'Id'
					},
					formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig) {
						let data = displayValue || [];
						value = _.map(data, function(item){
							return (item.Id === 0 ? {Description: platformTranslateService.instant('basics.customize.noAssignment', null, true)} : basicsLookupdataSimpleLookupService.getItemByIdSync(item.Id, lookupConfig.formatterOptions) || {}).Description;
						}).join(', ');
						return value;
					},
					width: 100,
					editor: 'directive',
					editorOptions: {
						directive: 'estimate-main-totals-config-detail-filter-lookup'
					}
				}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			service.getStandardConfigForListView = function(){
				return{
					addValidationAutomatically: true,
					columns : gridColumns
				};
			};

			return service;
		}]);
})();
