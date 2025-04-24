/**
 * Created by nit on 07.05.2018.
 */
(function (angular) {
	'use strict';
	const mainModule = angular.module('timekeeping.timesymbols');
	/**
	 * @ngdoc service
	 * @name timekeepingTimesymbolsContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('timekeepingTimesymbolsContainerInformationService', TimekeepingTimeSymbolsContainerInformationService);

	TimekeepingTimeSymbolsContainerInformationService.$inject = ['platformLayoutHelperService', 'timekeepingTimeSymbolsConstantValues', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService'];

	function TimekeepingTimeSymbolsContainerInformationService(platformLayoutHelperService, timekeepingTimeSymbolsConstantValues, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
		let self = this;
		let guids = timekeepingTimeSymbolsConstantValues.uuid.container;

		let filters = [{
			key: 'tks-timesymbol-controlling-by-prj-filter',
			serverKey: 'prc.con.controllingunit.by.prj.filterkey',
			serverSide: true,
			fn: function (/* entity */) {
				return {
					ByStructure: true,
					ExtraFilter: false,
					PrjProjectFk: null,
					CompanyFk: null
				};
			}
		},
		{
			key: 'tks-timesymbol-account-companycharged-filter',
			fn: function (item, entity) {
				let result = false;
				if (entity.CompanyChargedLedgerContextFk) {
					result = item.LedgerContextFk === entity.CompanyChargedLedgerContextFk;
				}
				return result;
			}
		},
		{
			key: 'tks-timesymbol-account-company-filter',
			fn: function (item, entity) {
				let result = false;
				if (entity.CompanyLedgerContextFk) {
					result = item.LedgerContextFk === entity.CompanyLedgerContextFk;
				}
				return result;
			}
		}

		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.timeSymbolList: // timekeepingShiftModelListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimeSymbolsServiceInfos(), self.getTimeSymbolsLayout);
					break;
				case guids.timeSymbolDetails: // timekeepingShiftModelDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimeSymbolsServiceInfos(), self.getTimeSymbolsLayout);
					break;
				case guids.timeSymbolAccountList: // timekeepingtimeSymbolAccountListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimeSymbolAccountServiceInfos(), self.getTimeSymbolAccountLayout);
					break;
				case guids.timeSymbolAccountDetails: // timekeepingTimeSymbolAccountDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimeSymbolAccountServiceInfos(), self.getTimeSymbolAccountLayout);
					break;
				case guids.timeSymbol2GroupList: // timekeepingTimesymbols2GroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.gettimeSymbol2GroupServiceInfos(), self.getTimeSymbol2GroupLayout);
					break;
				case guids.timeSymbol2GroupDetail: // timekeepingTimesymbols2GroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.gettimeSymbol2GroupServiceInfos(), self.getTimeSymbol2GroupLayout);
					break;
			}
			return config;
		};

		this.getTimeSymbolsServiceInfos = function getTimeSymbolsServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeSymbolsLayoutService',
				dataServiceName: 'timekeepingTimeSymbolsDataService',
				validationServiceName: 'timekeepingTimeSymbolsValidationService'
			};
		};

		this.getTimeSymbolsLayout = function getTimeSymbolsLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.timesymbols',
				['externalid', 'code', 'descriptioninfo', 'isdefault', 'sorting', 'icon', 'isproductive', 'ispresence', 'isoffday', 'isovertime', 'istimeaccount', 'iscumandatory', 'isuplift', 'isexpense', 'valuationpercent', 'valuationrate', 'timesymboltypefk', 'timesymbolgroupfk', 'codefinance', 'additionalcodefinance', 'timesymbolfk', 'iswtmrelevant', 'timesymboltocompany', 'isvacation', 'uomfk', 'companyfk', 'mdctaxcodefk','isreporting','istraveltime','istravelallowance','issurcharges','istraveldistance','isaction','istimeallocation','isovernighttravel','isabsence','isdriver','iscreatetksresult']);
			res.overloads = platformLayoutHelperService.getOverloads(['externalid', 'timesymboltypefk', 'timesymbolgroupfk', 'timesymbolfk', 'uomfk', 'companyfk','mdctaxcodefk'], self);
			return res;
		};


		this.gettimeSymbol2GroupServiceInfos = function gettimeSymbol2GroupServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeSymbols2GroupLayoutService',
				dataServiceName: 'timekeepingTimeSymbols2GroupDataService',
				validationServiceName: 'timekeepingTimeSymbols2GroupValidationService'
			};
		};

		this.gettimeSymbol2GroupLayout = function getTimeSymbol2GroupLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.timesymbols',
				['timekeepinggroupfk', 'comment']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['timekeepinggroupfk'], self);
			return res;
		};



		this.getTimeSymbolAccountServiceInfos = function getTimeSymbolAccountServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeSymbolsAccountLayoutService',
				dataServiceName: 'timekeepingTimeSymbolsAccountDataService',
				validationServiceName: 'timekeepingTimeSymbolsAccountValidationService'
			};
		};



		this.getTimeSymbolAccountLayout = function getTimeSymbolAccountLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'timekeeping.timesymbolsaccount',
				['companychargedfk', 'surchargetypefk', 'costgroupfk', 'controllingunitfk', 'commenttext', 'controllinggroup1fk', 'controllinggroup2fk', 'controllinggroup3fk'],
				{
					gid: 'accounts',
					attributes: [
						'accountcostfk', 'controllinggrpdetail1costfk', 'nominaldimension1cost', 'controllinggrpdetail2costfk', 'nominaldimension2cost', 'controllinggrpdetail3costfk', 'nominaldimension3cost',
						'accountrevfk', 'controllinggrpdetail1revfk', 'nominaldimension1rev', 'controllinggrpdetail2revfk', 'nominaldimension2rev', 'controllinggrpdetail3revfk', 'nominaldimension3rev',
						'accounticcostfk', 'controllinggrpdetail1iccostfk', 'nominaldimension1iccost', 'controllinggrpdetail2iccostfk', 'nominaldimension2iccost', 'controllinggrpdetail3iccostfk', 'nominaldimension3iccost',
						'accounticrevfk', 'controllinggrpdetail1icrevfk', 'nominaldimension1icrev', 'controllinggrpdetail2icrevfk', 'nominaldimension2icrev', 'controllinggrpdetail3icrevfk', 'nominaldimension3icrev'
					]
				});
			res.overloads = platformLayoutHelperService.getOverloads(['companychargedfk', 'surchargetypefk', 'costgroupfk', 'controllingunitfk'], self);
			res.overloads.controllinggroup1fk = getOverloadControllingGroup();
			res.overloads.controllinggroup2fk = getOverloadControllingGroup();
			res.overloads.controllinggroup3fk = getOverloadControllingGroup();
			res.overloads.controllinggrpdetail1costfk = getOverloadControllingGroupDetail(1);
			res.overloads.controllinggrpdetail2costfk = getOverloadControllingGroupDetail(2);
			res.overloads.controllinggrpdetail3costfk = getOverloadControllingGroupDetail(3);
			res.overloads.controllinggrpdetail1revfk = getOverloadControllingGroupDetail(1);
			res.overloads.controllinggrpdetail2revfk = getOverloadControllingGroupDetail(2);
			res.overloads.controllinggrpdetail3revfk = getOverloadControllingGroupDetail(3);
			res.overloads.controllinggrpdetail1iccostfk = getOverloadControllingGroupDetail(1);
			res.overloads.controllinggrpdetail2iccostfk = getOverloadControllingGroupDetail(2);
			res.overloads.controllinggrpdetail3iccostfk = getOverloadControllingGroupDetail(3);
			res.overloads.controllinggrpdetail1icrevfk = getOverloadControllingGroupDetail(1);
			res.overloads.controllinggrpdetail2icrevfk = getOverloadControllingGroupDetail(2);
			res.overloads.controllinggrpdetail3icrevfk = getOverloadControllingGroupDetail(3);
			res.overloads.accountcostfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCustomAccountLookupDataService',
				filterKey: 'tks-timesymbol-account-company-filter'
			});
			res.overloads.accountrevfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCustomAccountLookupDataService',
				filterKey: 'tks-timesymbol-account-company-filter'
			});
			res.overloads.accounticcostfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCustomAccountLookupDataService',
				filterKey: 'tks-timesymbol-account-companycharged-filter'
			});
			res.overloads.accounticrevfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCustomAccountLookupDataService',
				filterKey: 'tks-timesymbol-account-companycharged-filter'
			});
			return res;
		};

		function getOverloadControllingGroup() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'controllingGroupLookupDataService',
				enableCache: true
			});
		}

		function getOverloadControllingGroupDetail(number) {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'controllingGroupDetailLookupDataService',
				filter: function (item) {
					let groupId = null;

					let prop = 'ControllingGroup' + number + 'Fk';
					if (item && item[prop]) {
						groupId = item[prop];
					}
					return groupId;
				},
				enableCache: true
			});
		}

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'externalid':
					ovl = {readonly: true};
					break;
				case 'timesymboltypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timesymboltype');
					break;
				case 'timesymbolfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingTimeSymbolLookupDataService'
					});
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'uomfk':
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;

				case 'companychargedfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					//ovl.readonly = true;
					var lookupOptions = {
						addGridColumns: [{
							afterId: 'companychargedfk',
							id: 'companyname',
							field: 'CompanyName',
							name$tr$: 'cloud.common.entityName',
							formatter: 'description',
							width: 150
						}], additionalColumns: true
					};
					ovl.grid.editorOptions.lookupOptions = lookupOptions;
					break;
				case 'surchargetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingsurchargetype', null, {
						customBoolProperty: 'IsStandardRate'
					});
					break;
				case 'costgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingcostgroup');
					break;
				case 'timesymbolgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timesymbolgroup');
					break;
				case 'timekeepinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsTimekeepingGroupLookupDataService',
						filter: function (item) {
							if (item && item.CompanyFk) {
								return item.CompanyFk;
							}
						}
					});
					break;

				case 'mdctaxcodefk':
					ovl = {

						'detail': {

							'type': 'directive',

							'directive': 'basics-lookupdata-lookup-composite',

							'options': {

								lookupDirective: 'basics-master-data-context-tax-code-lookup',

								descriptionMember: 'DescriptionInfo.Translated',

								lookupOptions: {

									showClearButton: true

								}

							}

						},

						'grid': {

							formatter: 'lookup',

							formatterOptions: {

								lookupType: 'TaxCode',

								displayMember: 'Code'

							},

							editor: 'lookup',

							editorOptions: {

								lookupField: 'MdcTaxCodeFk',

								lookupOptions: {

									showClearButton: true

								},

								directive: 'basics-master-data-context-tax-code-lookup'

							},

							width: 100

						}

					};

					break;
				case 'controllingunitfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									filterKey: 'tks-timesymbol-controlling-by-prj-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ControllingUnit', 'displayMember': 'Code'
							},
							width: 80
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'tks-timesymbol-controlling-by-prj-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
			}
			return ovl;
		};
	}
})(angular);
