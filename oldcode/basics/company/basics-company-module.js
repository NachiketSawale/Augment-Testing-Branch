/**
 * Created by henkel on 15.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName, ['ui.router', 'platform', 'ngFileUpload']);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name Basics.Company
	 * @description
	 * Module definition of the Basics module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'b95c503d388a4b25b19b7835fe42ecc9',
				methodName: 'disableCalendar',
				canActivate: true
			}, {
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '1aa50bce7dab4a5e9b7cec047314b9fd',
				methodName: 'enableCalendar',
				canActivate: true
			}, {
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '12f9d13b74d54c438dc7cc660743141e',
				methodName: 'setCharacteristics',
				canActivate: true
			}, {
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'D034FDEBC2CC4D43B0D94E10B30B6C5B',
				methodName: 'syncCompanyToYtwo',
				canActivate: true
			}, {
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '72ee2ea1faf740ff9d8b50554547970d',
				methodName: 'importContent',
				canActivate: true
			},
			{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '488e90e76fc14d429521a1e54ab248b6',
				methodName: 'companyTransheaderStatus',
				canActivate: true
			},{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '773173ae96eb42bf8ae4d28bd06a7085',
				methodName: 'prepareTransaction',
				canActivate: true
			},{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'c1091930580347849716d57be221877b',
				methodName: 'prepareTransactionForAll',
				canActivate: true
			},{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'f1c3538dfdeb4fd4944b0aac68faa62a',
				methodName: 'copyCompany',
				canActivate: true
			},{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: '900d9472004c4bcaa57a6924a485eb78',
				methodName: 'createBusinessYearsPeriods',
				canActivate: true
			},
			{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'd653f970c85d4def8a82364f639e7eff',
				methodName: 'iTWOFinanceURLs',
				canActivate: true
			},
			{
				serviceName: 'basicsCompanySidebarWizardService',
				wizardGuid: 'ad3563594e6e4b6b850896881b1f9c07',
				methodName: 'createCompany',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'basicsCompanyConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, basicsCompanyConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								basicsCompanyConstantValues.schemes.company,
								{typeName: 'RubricCategory2CompanyDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'Company2TextModuleDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'Company2ClerkDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'Company2CostCodeDto', moduleSubModule: 'Basics.Company'},// Surcharge
								{typeName: 'CompanyYearDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyPeriodDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyNumberSequenceDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'RubricTreeItemDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyUrlDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'Company2BasClerkDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'Company2PrjGroupDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyTransheaderDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyTransactionDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyDeferaltypeDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyRoleBas2FrmDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyControllingGroupDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'TrsConfigDto', moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyICPartnerDto',moduleSubModule: 'Basics.Company'},
								{typeName: 'CompanyICPartnerAccDto',moduleSubModule: 'Basics.Company'},
								{typeName: 'StockEvaluationRule4CompDto',moduleSubModule: 'Basics.Company'},
								{typeName: 'ProjectGroupDto', moduleSubModule: 'Project.Group'},
								basicsCompanyConstantValues.schemes.companyCreditor,
								basicsCompanyConstantValues.schemes.companyDebtor,
								basicsCompanyConstantValues.schemes.timekeepingGroup,
								basicsCompanyConstantValues.schemes.companyICCu
							]);
						}],
					loadLookup: ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData('prcconfiguration');
						}],
					loadDirective: ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'businessPartnerMainSupplierLookup'
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'cloud.common', 'basics.common', 'basics.site', 'logistic.job'], true);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}]
	).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'basics.company',
					navFunc: function (item, triggerField) {
						$injector.get('basicsCompanyMainService').selectCompanyByCertificate(item, triggerField);
					}
				}
			);
		}]);
})(angular);
