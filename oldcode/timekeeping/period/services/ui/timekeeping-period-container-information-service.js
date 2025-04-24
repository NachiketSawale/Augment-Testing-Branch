/*
 * $Id: timekeeping-period-container-information-service.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const timekeepingPeriodModule = angular.module('timekeeping.period');

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingPeriodModule.service('timekeepingPeriodContainerInformationService', TimekeepingPeriodContainerInformationService);

	TimekeepingPeriodContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'timekeepingPeriodConstantValues'];

	function TimekeepingPeriodContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator, timekeepingPeriodConstantValues) {
		let self = this;
		let guids = timekeepingPeriodConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.periodList: // timekeepingPeriodListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPeriodServiceInfos(), self.getPeriodLayout);
					break;
				case guids.periodDetails: // timekeepingPeriodDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPeriodServiceInfos(), self.getPeriodLayout);
					break;
				case guids.transactionList: // timekeepingTransactionListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTransactionServiceInfos(), self.getTransactionLayout);
					break;
				case guids.transactionDetails: // timekeepingTransactionDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTransactionServiceInfos(), self.getTransactionLayout);
					break;
				case guids.validationList: // timekeepingValidationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getValidationServiceInfos());
					break;
				case guids.validationDetails: // timekeepingValidationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getValidationServiceInfos());
					break;
			}
			return config;
		};

		this.getPeriodServiceInfos = function getPeriodServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingPeriodLayoutService',
				dataServiceName: 'timekeepingPeriodDataService',
				validationServiceName: 'timekeepingPeriodValidationService',
			};
		};

		this.getPeriodLayout = function getPeriodLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout(
				'1.0.0',
				'timekeeping.period',
				['periodstatusfk', 'code', 'descriptioninfo', 'startdate', 'enddate', 'payrollyear', 'payrollperiod', 'payrolldate', 'postingdate', 'due1date', 'due2date', 'timekeepinggroupfk', 'vouchernumber'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userdefinedtext', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userdefinednumber', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userdefineddate', 'userdefineddate', '0')
			);
			res.overloads = platformLayoutHelperService.getOverloads(['periodstatusfk', 'timekeepinggroupfk'], self);
			return res;
		};

		this.getValidationServiceInfos = function getPeriodServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingPeriodValidationLayoutService',
				dataServiceName: 'timekeepingPeriodValidationDataService',
				validationServiceName: 'timekeepingPeriodValidationValidationService',
			};
		};

		this.getValidationLayout = function getPeriodLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.period.validation', ['messageseverityfk', 'message']);
			res.overloads = platformLayoutHelperService.getOverloads(['messageseverityfk', 'message', 'istransaction'], self);

			return res;
		};

		this.getTransactionServiceInfos = function getPeriodServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingPeroiodTransactionLayoutService',
				dataServiceName: 'timekeepingPeriodTransactionDataService',
				validationServiceName: 'timekeepingPeriodTransactionValidationService',
			};
		};

		this.getTransactionLayout = function getPeriodLayout() {
			let res = platformLayoutHelperService.getThreeGroupsBaseLayout(
				'1.0.0',
				'timekeeping.period.transaction',
				[
					'companyfk',
					'companychargedfk',
					'transactioncase',
					'vouchernumber',
					'voucherdate',
					'postingnarritive',
					'postingdate',
					'employeefk',
					'activityfk',
					'accountfk',
					'account',
					'amount',
					'quantity',
					'isdebit',
					'companycostheaderfk',
					'invheaderfk',
					'bilheaderfk',
					'uomfk',
					'settlementitemfk',
					'projectchangefk',
					'isbaserate'
				],
				{
					gid: 'controllingAssignments',
					attributes: [
						'controllingunitfk',
						'controllingunitassign01',
						'controllingunitassigndesc01',
						'controllingunitassign02',
						'controllingunitassigndesc02',
						'controllingunitassign03',
						'controllingunitassigndesc03',
						'controllingunitassign04',
						'controllingunitassigndesc04',
						'controllingunitassign05',
						'controllingunitassigndesc05',
						'controllingunitassign06',
						'controllingunitassigndesc06',
						'controllingunitassign07',
						'controllingunitassigndesc07',
						'controllingunitassign08',
						'controllingunitassigndesc08',
						'controllingunitassign09',
						'controllingunitassigndesc09',
						'controllingunitassign10',
						'controllingunitassigndesc10',
					],
				},
				{
					gid: 'financialInfo',
					attributes: ['issuccess', 'nominaldimension1', 'nominaldimension2', 'nominaldimension3'],
				}
			);
			res.overloads = platformLayoutHelperService.getOverloads(
				['companyfk', 'companychargedfk', 'controllingunitfk', 'employeefk', 'activityfk', 'accountfk', 'companycostheaderfk', 'invheaderfk', 'bilheaderfk', 'uomfk', 'projectchangefk'],
				self
			);
			return res;
		};

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'periodstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingperiodstatus', null, {showIcon: true});
					break;
				case 'timekeepinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsTimekeepingGroupLookupDataService',
						filter: function (item) {
							if (item && item.CompanyFk) {
								return item.CompanyFk;
							}
						},
					});
					break;
				case 'message':
					ovl = {readonly: true};
					break;
				case 'messageseverityfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.messageseverity');
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					ovl.grid.editorOptions.lookupOptions = {
						addGridColumns: [
							{
								afterId: 'companyfk',
								id: 'companyname',
								field: 'CompanyName',
								name$tr$: 'cloud.common.entityName',
								formatter: 'description',
								width: 150,
							},
						],
						additionalColumns: true,
					};
					break;
				case 'companychargedfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					ovl.grid.editorOptions.lookupOptions = {
						addGridColumns: [
							{
								afterId: 'companychargedfk',
								id: 'companyname',
								field: 'CompanyName',
								name$tr$: 'cloud.common.entityName',
								formatter: 'description',
								width: 150,
							},
						],
						additionalColumns: true,
					};
					break;
				case 'controllingunitfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: false,
								},
							},
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code',
							},
							width: 130,
						},
					};
					break;
				case 'employeefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeLookupDataService',
					});
					break;
				case 'activityfk':
					ovl = {
						grid: {
							editor: 'lookup',

							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SchedulingActivity',
								displayMember: 'Code',
							},
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'scheduling-main-activity-structure-lookup',
								descriptionMember: 'Description',
							},
						},
					};
					break;
				case 'accountfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
					});
					break;
				case 'companycostheaderfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingActualsLookupDataService',
						filter: function (item) {
							if (item.CompanyFk) {
								return item.CompanyFk;
							}
						},
					});
					break;
				case 'invheaderfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-invoice-header-dialog',
								descriptionMember: 'Reference',
								lookupOptions: {
									showClearButton: true,
								},
							},
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-header-dialog',
								lookupOptions: {
									showClearButton: true,
								},
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvHeaderChained',
								displayMember: 'Code',
							},
						},
					};
					break;
				case 'uomfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup',
							options: {
								showClearButton: true,
							},
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true,
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit',
							},
						},
					};
					break;

				case 'settlementitemfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingSettlementItemLookupDataService',
					});
					break;
				case 'bilheaderfk':
					ovl = {
						readonly: 'true',
						grid: {
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBilling',
								displayMember: 'BillNo',
							},
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-bill-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
							},
						},
					};
					break;
				case 'projectchangefk': {
					let lookupOptions = {
						additionalColumns: true,
						showClearButton: true,
						filterOptions: {
							serverKey: 'project-change-lookup-for-logistic-settlement-filter',
							serverSide: true,
							fn: function (item) {
								return {
									ProjectFk: item.ProjectFk
								};
							}
						},
						addGridColumns: [{
							id: 'description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description',
							readonly: true
						}]
					};
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: lookupOptions
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: lookupOptions
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					};
				}
			}

			return ovl;
		};
	}
})(angular);
