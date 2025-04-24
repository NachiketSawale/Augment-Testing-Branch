/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainReplaceResourceFieldsUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Replaced Value Configuration Grid UI Config for modify estimate dialog.
	 */
	angular.module(moduleName).factory('estimateMainReplaceResourceFieldsUIConfigService',
		['$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function ($injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'f1',
						field: 'Description',
						name$tr$: 'estimate.main.replaceResourceWizard.fields.description',
						formatter: 'description',
						editor: null,
						readonly: true,
						width: 200
					},
					{
						id: 'f2',
						field: 'IsChange',
						name$tr$: 'estimate.main.replaceResourceWizard.fields.isChange',
						formatter: 'boolean',
						editor: 'boolean',
						isTransient: true,
						headerChkbox: true,
						width: 75,
						validator: function (entity, value) {
							let estResourceCommonService = $injector.get('estimateMainReplaceResourceCommonService');
							entity.IsChange = value;
							if(value) {
								// get replace element value
								let replaceElement = estResourceCommonService.getReplaceElement();
								if (replaceElement && entity.ColumnId === 42 && replaceElement.EstCostTypeFk) {
									entity.ChangeFieldValue = replaceElement.EstCostTypeFk;
								}
								else if (replaceElement && entity.ColumnId === 23 && (replaceElement.Rate || (replaceElement.EstimatePrice && replaceElement.PriceUnit > 0))) {
									// ALM 101673
									let factorPriceUnit = replaceElement.FactorPriceUnit ? replaceElement.FactorPriceUnit : 1;
									let priceUnit = replaceElement.PriceUnit ? replaceElement.PriceUnit : 1;
									let costUnit = replaceElement.EstimatePrice * factorPriceUnit / priceUnit;

									entity.ChangeFieldValue = replaceElement.Rate || costUnit;
								}
							}
							else{
								entity.ChangeFieldValue = null;
							}
							estResourceCommonService.setReplacedGridReadOnly([entity], false);
						}
					},
					{
						id: 'f3',
						field: 'ChangeFieldValue',
						name$tr$: 'estimate.main.replaceResourceWizard.fields.changeFieldValue',
						formatter: 'dynamic',
						editor: 'dynamic',
						readonly: true,
						visible: false,// temp set to false(->2.2)
						domain: function (item, column) {
							let domain;

							if (item && item.Id) {
								switch (item.Id) {
									case 23:// cost unit
									case 46:// Budget
									case 10:// QuantityFactor3
									case 11:// QuantityFactor4
										domain = 'decimal';
										column.formatterOptions = null;
										break;
									case 39:// lump sum
									case 40:// disabled
										domain = 'boolean';
										column.formatterOptions = null;
										break;
									case 45:// ProcurementPackage
										domain = 'lookup';
										column.editorOptions = {
											lookupDirective: 'basics-lookup-data-by-custom-data-service',
											showClearButton: true,
											lookupType: 'estLineItemPrcPackageLookupDataService',
											lookupOptions: {
												idProperty: 'Id',
												moduleQualifier: 'estLineItemPrcPackageLookupDataService',
												dataServiceName: 'estLineItemPrcPackageLookupDataService',
												lookupType: 'estLineItemPrcPackageLookupDataService',
												valueMember: 'Id',
												displayMember: 'Code',
												filter: function () {
													return $injector.get('estimateMainService').getProjectId();
												},
												columns: [
													{
														id: 'Code',
														field: 'Code',
														name: 'Code',
														formatter: 'code',
														name$tr$: 'cloud.common.entityCode'
													},
													{
														id: 'Description',
														field: 'Description',
														name: 'Description',
														formatter: 'description',
														name$tr$: 'cloud.common.entityDescription'
													}
												],
												events: [
													{
														name: 'onSelectedItemChanged', // register event and event handler here.
														handler: function (e, args) {
															let item = args.entity;
															if(!item){return;}

															let selectedPackageItem =  args.selectedItem;
															item.ChangeFieldValue = selectedPackageItem ? selectedPackageItem.Id : null;

															// let defer = $q.defer();
															// defer.resolve(true);
															// return defer.promise;
														}
													}
												]
											}
										};
										column.formatterOptions = {
											dataServiceName: 'estLineItemPrcPackageLookupDataService',
											lookupType: 'estLineItemPrcPackageLookupDataService',
											displayMember: 'Code',
											navigator: {
												moduleName: 'procurement.package'
											}
										};
										break;
									case 42:// Cost Type
										domain = 'lookup';
										item.Value = item.ChangeFieldValue;
										column.editorOptions = {
											directive: 'basics-lookupdata-simple',
											showClearButton: true,
											lookupOptions: {
												lookupType: 'estimate.lookup.costtype',
												lookupModuleQualifier: 'estimate.lookup.costtype',
												displayMember: 'Description',
												valueMember: 'Id'
											}
										};
										column.formatterOptions = {
											lookupType: 'estimate.lookup.costtype',
											displayMember: 'Description',
											valueMember: 'Id'
										};
										break;
									case 43:// Resource Flag
										domain = 'lookup';
										item.Value = item.ChangeFieldValue;
										column.editorOptions = {
											directive: 'basics-lookupdata-simple',
											showClearButton: true,
											lookupOptions: {
												lookupType: 'estimate.lookup.resourceflag',
												lookupModuleQualifier: 'estimate.lookup.resourceflag',
												displayMember: 'Description',
												valueMember: 'Id'
											}
										};
										column.formatterOptions = {
											displayMember: 'Description',
											lookupModuleQualifier: 'estimate.lookup.resourceflag',
											lookupSimpleLookup: true,
											valueMember: 'Id'
										};
										break;
									default:
										item.Value = null;
										column.formatterOptions = null;
								}
							}

							return domain || 'description';
						},
						isTransient: true,
						width: 125
					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: false,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
