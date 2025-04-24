/**
 * Created by jhe on 8/8/2018.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractCallOffAgreementUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementContractAccountAssignmentUIStandardService',
		['platformUIStandardConfigService', 'procurementContractTranslationService', 'platformSchemaService',
			'$injector', 'basicsLookupdataConfigGenerator', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, procurementContractTranslationService, platformSchemaService,
				$injector, basicsLookupdataConfigGenerator, platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'procurement.contract.accountAssignment',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['itemno', 'breakdownpercent', 'breakdownamount', 'breakdownamountoc', 'bascompanyyearfk',
									'mdccontrollingunitfk', 'psdschedulefk', 'psdactivityfk', 'concrewfk', 'remark',
									'description', 'quantity', 'basuomfk', 'datedelivery', 'basaccassignitemtypefk',
									'basaccountfk', 'accountassignment01', 'accountassignment02', 'accountassignment03',
									'isdelete', 'isfinalinvoice', 'basaccassignmatgroupfk', 'basaccassignacctypefk', 'basaccassignfactoryfk', 'version']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							itemno: {
								grid: {
									regex: '^[-+]?(\\d{0,7})$'
								},
								detail: {
									regex: '^[-+]?(\\d{0,7})$'
								}
							},
							breakdownpercent: {
								grid: {
									regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
									'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
										var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
										if (error) {
											return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
										} else {
											return '<div>' + value.toFixed(2) + '</div>';
										}
									}
								},
								detail: {
									regex: '^(([-+]?(\\d{0,2})([.,]\\d{3}){0,2}([.,]\\d{0,2}))|([-+]?(\\d{0,8}))([.,]\\d{0,2})?)$',
									'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
										var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
										if (error) {
											return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + value.toFixed(2) + '</span>';
										} else {
											return '<div>' + value.toFixed(2) + '</div>';
										}
									}
								}
							},
							breakdownamount: {
								grid: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								},
								detail: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								}
							},
							breakdownamountoc: {
								grid: {
									regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?(\\d{0,12}))([.,]\\d{0,2})?)$'
								},
								detail: {
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
									directive: 'basics-company-year-lookup',
									options: {
										filterKey: 'basics-company-companyyear-filter',
										showClearButton: true
									},
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
											filterKey: 'procurement-contract-account-assignment-controlling-unit-filter',
											showClearButton: true,
											considerPlanningElement: true,
											selectableCallback: function (dataItem) {
												return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
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
											filterKey: 'procurement-contract-account-assignment-controlling-unit-filter',
											initValueField: 'ControllingunitCode',
											showClearButton: true,
											considerPlanningElement: true,
											selectableCallback: function (dataItem) {
												return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
											}
										}
									}
								}
							},
							psdschedulefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'packageSchedulingLookupService',
								showClearButton: true,
								isComposite: true,
								desMember: 'DescriptionInfo.Translated',
								dispMember: 'Code',
								filter: function () {
									var contractHeaderService = $injector.get('procurementContractHeaderDataService');
									var projectID;
									if (contractHeaderService) {
										var contract = contractHeaderService.getSelected();
										if (contract) {
											projectID = contract.ProjectFk;
										}
									}
									return projectID;
								},
								navigator: {
									moduleName: 'scheduling.main'
								}
							}),
							psdactivityfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'scheduling-main-activity-structure-lookup',
										lookupOptions: {
											filterKey: 'procurement-contract-account-assignment-scheduling-activity-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SchedulingActivity',
										displayMember: 'Code'
									},
									'width': 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'scheduling-main-activity-structure-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'procurement-contract-account-assignment-scheduling-activity-filter',
											showClearButton: true
										}
									}
								}
							},
							concrewfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-contract-crew-lookup',
										lookupOptions: {
											filterKey: 'procurement-contract-crew-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {lookupType: 'contractcrew', displayMember: 'DescriptionInfo.Translated'}
								},
								detail: {
									type: 'directive',
									directive: 'procurement-contract-crew-lookup',
									options: {
										filterKey: 'procurement-contract-crew-filter',
										showClearButton: true
									}
								}
							},
							basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							basaccassignitemtypefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-item-type-lookup', 'basaccassignitemtype', 'Code'),
							basaccountfk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('basics-procurementstructure-account-lookup', 'BasAccount', 'Code'),
							basaccassignmatgroupfk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-mat-group-lookup', 'basaccassignmatgroup', 'Code'),
							basaccassignacctypefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-acc-type-lookup', 'basaccassignacctype', 'Code'),
							basaccassignfactoryfk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-factory-lookup', 'basaccassignfactory', 'Code')
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
				}

				var accountAssignmentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var accountAssignmentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ConAccountAssignmentDto',
					moduleSubModule: 'Procurement.Contract'
				});
				accountAssignmentAttributeDomains = accountAssignmentAttributeDomains.properties;

				function AccountAssignmentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				AccountAssignmentUIStandardService.prototype = Object.create(BaseService.prototype);
				AccountAssignmentUIStandardService.prototype.constructor = AccountAssignmentUIStandardService;

				var service = new BaseService(accountAssignmentDetailLayout, accountAssignmentAttributeDomains, procurementContractTranslationService);
				platformUIStandardExtentService.extend(service, accountAssignmentDetailLayout.addition, accountAssignmentAttributeDomains);
				return service;
			}
		]);
})();

