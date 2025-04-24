/**
 * Created by jhe on 8/29/2018.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.invoice';
	var cloudCommonModule = 'cloud.common';
	var commonModule = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).factory('procurementInvoiceAccountAssignmentLayout', ['basicsLookupdataConfigGenerator','$injector','procurementInvoiceAccountAssignmentDataService',
		function (basicsLookupdataConfigGenerator,$injector,dataService) {
			return {
				fid: 'procurement.invoice.accountAssignment',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['itemno', 'invbreakdownpercent', 'invbreakdownamount', 'invbreakdownamountoc',
							'breakdownpercent', 'breakdownamount', 'breakdownamountoc',
							'bascompanyyearfk', 'mdccontrollingunitfk',
							'previousinvoiceamount', 'previousinvoiceamountoc', 'remark',
							'description', 'quantity', 'basuomfk', 'datedelivery', 'basaccassignitemtypefk',
							'basaccountfk', 'accountassignment01', 'accountassignment02', 'accountassignment03',
							'isdelete', 'isfinalinvoice', 'basaccassignmatgroupfk','basaccassignacctypefk','basaccassignfactoryfk','version']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				translationInfos: {
					extraModules: [moduleName, cloudCommonModule],
					extraWords: {
						ItemNO: {location: moduleName, identifier: 'invoice.EntityItemNO', initial: 'Item No.'},
						InvBreakdownPercent: {
							location: moduleName,
							identifier: 'invoice.EntityInvoiceBreakdownPercent',
							initial: 'Invoice Breakdown in %'
						},
						InvBreakdownAmount: {
							location: moduleName,
							identifier: 'invoice.EntityInvoiceBreakdownAmount',
							initial: 'Invoice Breakdown Amount'
						},
						InvBreakdownAmountOc: {
							location: moduleName,
							identifier: 'invoice.EntityInvoiceBreakdownAmountOc',
							initial: 'Invoice Breakdown Amount(OC)'
						},
						BreakdownPercent: {
							location: moduleName,
							identifier: 'invoice.EntityBreakdownPercent',
							initial: 'Breakdown in %'
						},
						BreakdownAmount: {
							location: moduleName,
							identifier: 'invoice.EntityBreakdownAmount',
							initial: 'Breakdown Amount'
						},
						BreakdownAmountOc: {
							location: moduleName,
							identifier: 'invoice.EntityBreakdownAmountOc',
							initial: 'Breakdown Amount(OC)'
						},
						BasCompanyYearFk: {
							location: moduleName,
							identifier: 'invoice.EntityBasCompanyYearFk',
							initial: 'Budget Year'
						},
						MdcControllingUnitFk: {
							location: moduleName,
							identifier: 'invoice.EntityMdcControllingUnitFk',
							initial: 'Controlling Unit'
						},
						PreviousInvoiceAmount: {
							location: moduleName,
							identifier: 'invoice.EntityPreviousInvoicesAmount',
							initial: 'Previous Invoices'
						},
						PreviousInvoiceAmountOc: {
							location: moduleName,
							identifier: 'invoice.EntityPreviousInvoicesAmountOc',
							initial: 'Previous Invoices(OC)'
						},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						Description: {
							location: commonModule,
							identifier: 'accassign.AccountDescription',
							initial: 'Item Description'
						},
						Quantity: {
							location: commonModule,
							identifier: 'accassign.ContractedQuantity',
							initial: 'Contracted Quantity'
						},
						BasUomFk: {
							location: commonModule,
							identifier: 'accassign.BasUom',
							initial: 'UoM'
						},
						DateDelivery: {
							location: commonModule,
							identifier: 'accassign.DateDelivery',
							initial: 'Delivery Date'
						},
						BasAccAssignItemTypeFk: {
							location: commonModule,
							identifier: 'accassign.ConAccountItemType',
							initial: 'Item Type'
						},
						BasAccountFk: {
							location: commonModule,
							identifier: 'accassign.BasAccount',
							initial: 'Account'
						},
						AccountAssignment01: {
							location: commonModule,
							identifier: 'accassign.AccountAssignment01',
							initial: 'Banf'
						},
						AccountAssignment02: {
							location: commonModule,
							identifier: 'accassign.AccountAssignment02',
							initial: 'Netzplan'
						},
						AccountAssignment03: {
							location: commonModule,
							identifier: 'accassign.AccountAssignment03',
							initial: 'Vorgangsnr'
						},
						IsDelete: {
							location: commonModule,
							identifier: 'accassign.AccIsDelete',
							initial: 'Is Delete'
						},
						IsFinalInvoice: {
							location: commonModule,
							identifier: 'accassign.AccIsFinalInvoice',
							initial: 'Is Final Invoice'
						},
						BasAccAssignMatGroupFk: {
							location: commonModule,
							identifier: 'accassign.ConAccountMaterialGroup',
							initial: 'Material Group'
						},
						BasAccAssignAccTypeFk: {
							location: commonModule,
							identifier: 'accassign.AccountAssignAccType',
							initial: 'Material Group'
						},
						BasAccAssignFactoryFk: {
							location: commonModule,
							identifier: 'accassign.AccountAssignFactory',
							initial: 'Material Group'
						},
						Version: {
							location: commonModule,
							identifier: 'accassign.Version',
							initial: 'Version'
						}
					}
				},
				overloads: {
					itemno: {
						grid: {
							regex: '^[-+]?(\\d{0,7})$'
						},
						detail: {
							regex: '^[-+]?(\\d{0,7})$'
						}
					},
					invbreakdownpercent: {
						grid: {
							regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
							'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
								var error = dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
								if (error) {
									return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
								}
								else {
									return '<div>' + value.toFixed(2) + '</div>';
								}
							}
						},
						detail: {
							regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
							'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
								var error = dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
								if (error) {
									return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
								}
								else {
									return '<div>' + value.toFixed(2) + '</div>';
								}
							}
						}
					},
					invbreakdownamount: {
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					invbreakdownamountoc: {
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					breakdownpercent: {
						grid: {
							regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
							'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
								var error = dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
								if (error) {
									return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
								}
								else {
									return '<div>' + value.toFixed(2) + '</div>';
								}
							}
						},
						detail: {
							regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
							'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
								var error = dataContext.__rt$data && dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
								if (error) {
									return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
								}
								else {
									return '<div>' + value.toFixed(2) + '</div>';
								}
							}
						}

					},
					breakdownamount: {
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					breakdownamountoc: {
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					bascompanyyearfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-year-lookup',
								lookupOptions: {
									filterKey: 'basics-company-companyyear-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {lookupType: 'companyyear', displayMember: 'TradingYear'}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-year-lookup',
								descriptionMember: 'TradingYear',
								lookupOptions: {
									filterKey: 'basics-company-companyyear-filter',
									showClearButton: true
								}
							}
						}
					},
					mdccontrollingunitfk: {
						navigator: {
							moduleName: 'controlling.structure'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									filterKey: 'procurement-invoice-account-assignment-controlling-unit-filter',
									showClearButton: true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
									}
								}
							},
							formatter: 'lookup',
							formatterOptions: {lookupType: 'Controllingunit', displayMember: 'Code'},
							width: 140
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionField: 'ControllingunitDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'procurement-invoice-account-assignment-controlling-unit-filter',
									initValueField: 'ControllingunitCode',
									showClearButton: true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
									}
								}
							}
						}
					},
					previousinvoiceamount: {
						readonly: true,
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,7}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,7}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					previousinvoiceamountoc: {
						readonly: true,
						grid: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,7}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						},
						detial: {
							regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,7}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
						}
					},
					basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}),
					basaccassignitemtypefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-item-type-lookup','basaccassignitemtype', 'Code'),
					basaccountfk:  basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('basics-procurementstructure-account-lookup','BasAccount', 'Code'),
					basaccassignmatgroupfk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-mat-group-lookup','basaccassignmatgroup', 'Code'),
					basaccassignacctypefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-acc-type-lookup','basaccassignacctype', 'Code'),
					basaccassignfactoryfk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-factory-lookup','basaccassignfactory', 'Code')
				},
				addition: {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'MdcControllingUnitFk',
							displayMember: 'DescriptionInfo.Translated',
							name$tr$: 'cloud.common.entityControllingUnitDesc',
							width: 100
						}
					]
				}
			};
		}]);

	angular.module(moduleName).factory('procurementInvoiceAccountAssignmentUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceAccountAssignmentLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvAccountAssignmentDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();

