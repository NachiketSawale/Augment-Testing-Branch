/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc service
	 * @name logisticSundrygroupContainerInformationService
	 * @description provides information on container used in logistic sundrygroup module
	 */
	angular.module(moduleName).service('logisticSundrygroupContainerInformationService', LogisticSundrygroupContainerInformationService);

	LogisticSundrygroupContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'logisticSundryServiceGroupConstantValues', 'basicsLookupdataLookupFilterService', 'logisticSundryDynamicNominaldimensionService'];

	function LogisticSundrygroupContainerInformationService(_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, logisticSundryServiceGroupConstantValues, basicsLookupdataLookupFilterService, logisticSundryDynamicNominaldimensionService) {
		var self = this;
		var guids = logisticSundryServiceGroupConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case guids.groupList: // logisticSundryServiceGroupListController
					config = platformLayoutHelperService.getGridConfig(self.getGroupServiceInfos(),
						self.getGroupLayout,
						{
							initCalled: false,
							columns: [],
							parentProp: 'SundryServiceGroupFk',
							childProp: 'SundryServiceGroups'
						});
					break;
				case guids.groupDetails: // logisticSundrygroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getGroupServiceInfos(), self.getGroupLayout);

					break;
				case guids.accountList: // logisticSundryServiceGroupAccountListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getAccountServiceInfos(), self.getAccountLayout);
					break;
				case guids.accountDetails: // logisticSundryServiceGroupAccountDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getAccountServiceInfos(), self.getAccountLayout);
					// $injector.get('logisticSundryDynamicNominaldimensionService').setAccountLabels(_.get(config, 'layout.groups'));
					break;
				case logisticSundryServiceGroupConstantValues.uuid.container.taxCodeList://logisticSundryGroupTaxCodeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTaxCodeServiceInfos(),self.getTaxCodeLayout);
					break;
				case logisticSundryServiceGroupConstantValues.uuid.container.taxCodeDetails://logisticSundryGroupTaxCodeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTaxCodeServiceInfos(),self.getTaxCodeLayout);
					break;
			}
			return config;
		};

		var filters = [
			{
				key: 'sundry-group-account-filter',
				fn: filterSundryGroupAccountByLedgerContext
			},

		];

		function filterSundryGroupAccountByLedgerContext(data, context) {
			return data.LedgerContextFk === context.LedgerContextFk;
		}

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.getGroupServiceInfos = function getGroupServiceInfos() {
			return {
				standardConfigurationService: 'logisticSundryServiceGroupLayoutService',
				dataServiceName: 'logisticSundryServiceGroupDataService',
				validationServiceName: 'logisticSundryServiceGroupValidationService'
			};
		};

		this.getGroupLayout = function getGroupLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.sundrygroup.servicegroup',
				['code', 'descriptioninfo', 'specification', 'icon', 'isdefault', 'islive', 'sorting', 'procurementstructuretypefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['procurementstructuretypefk', 'islive'], self);
			res.overloads.icon = platformLayoutHelperService.provideImageSelectorOverload('logisticSundryServiceGroupIconService');

			return res;
		};

		this.getAccountServiceInfos = function getAccountServiceInfos() {
			return {
				standardConfigurationService: 'logisticSundryServiceGroupAccountLayoutService',
				dataServiceName: 'logisticSundryServiceGroupAccountDataService',
				validationServiceName: 'logisticSundryServiceGroupAccountValidationService'
			};
		};

		this.getAccountLayout = function getAccountLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.sundrygroup.account',
				['ledgercontextfk', 'validfrom', 'validto', 'accounttypefk', 'commenttext'],
				{
					gid: 'accounts',
					attributes: [
						'account01fk','nominaldimension0101','nominaldimension0102','nominaldimension0103',
						'account02fk','nominaldimension0201','nominaldimension0202','nominaldimension0203',
						'account03fk','nominaldimension0301','nominaldimension0302','nominaldimension0303',
						'account04fk','nominaldimension0401','nominaldimension0402','nominaldimension0403',
						'account05fk','nominaldimension0501','nominaldimension0502','nominaldimension0503',
						'account06fk','nominaldimension0601','nominaldimension0602','nominaldimension0603'
					]
				});

			res.overloads = platformLayoutHelperService.getOverloads(['ledgercontextfk', 'accounttypefk',
				'account01fk', 'account02fk', 'account03fk', 'account04fk', 'account05fk', 'account06fk'], self);

			var accountAttributes = _.get(_.find(res.groups, {'gid': 'accounts'}), 'attributes');
			logisticSundryDynamicNominaldimensionService.setAccountOverloads(accountAttributes, res.overloads);

			return res;
		};

		this.getTaxCodeLayout = function getTaxCodeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.sundrygroup.taxcode',
				['ledgercontextfk', 'taxcodefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['ledgercontextfk', 'taxcodefk'], self);
			return res;
		};

		this.getTaxCodeServiceInfos = function getTaxCodeServiceInfos() {
			return {
				standardConfigurationService: 'logisticSundryGroupTaxCodeLayoutService',
				dataServiceName: 'logisticSundryGroupTaxCodeDataService',
				validationServiceName: 'logisticSundryGroupTaxCodeValidationService'
			};
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'account01fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'account02fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'account03fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'account04fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'account05fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'account06fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'sundry-group-account-filter'
					});
					break;
				case 'accounttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.accountingtype');
					break;
				case 'islive':
					ovl = {readonly: true};
					break;
				case 'ledgercontextfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ledgercontext');
					break;
				case 'procurementstructuretypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.structuretype');
					break;
				case 'taxcodefk':
					ovl = {
					detail: {
						type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
							lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					grid: {
						editor: 'lookup',
							editorOptions: {
							lookupDirective: 'basics-master-data-context-tax-code-lookup'
						},
						formatter: 'lookup',
							formatterOptions: {
							lookupType: 'TaxCode',
								displayMember: 'Code'
						}
					}
				};
					break;

			}

			return ovl;
		};

	}

})(angular);