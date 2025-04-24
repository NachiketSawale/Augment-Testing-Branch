(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).factory('basicsCompanyNumberUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService) {

				function createGridLayout() {
					return {
						fid: 'basics.company.numberRangesTree',
						version: '1.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['descriptioninfo']
							},
							{
								gid: 'entityHistory',
								isHistory: false
							}
						],
						overloads: {
							descriptioninfo: {readonly: true}
						}
					};
				}

				var companyNumberDetailLayout = createGridLayout();

				var BaseService = platformUIStandardConfigService;

				var companyNumberAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'RubricTreeItemDto',
					moduleSubModule: 'Basics.Company'
				});

				companyNumberAttributeDomains = companyNumberAttributeDomains.properties;

				return new BaseService(companyNumberDetailLayout, companyNumberAttributeDomains, basicsCompanyTranslationService);
			}
		]);

	angular.module(moduleName).factory('basicsCompanyNumberUIStandardServiceForForm',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createFormLayout() {
					return {
						fid: 'basics.company.numberRangeFormConfig',
						addValidationAutomatically: true,
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['codegenerationsequencetypefk', 'generatenumber', 'numbermask', 'checknumber', 'checkmask', 'minlength', 'maxlength']
							},
							{
								gid: 'NumberSequenceFk',
								attributes: ['numbersequencefk', 'startvalue', 'lastvalue', 'incrementvalue', 'endvalue', 'perioddate']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							codegenerationsequencetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.company.number.codegeneration.sequenceType', 'DESCRIPTION'),
							numbersequencefk: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.company.numberSequence', 'SEQUENCE_NAME', {validator: 'reloadNumberSequenceData'}),
							startvalue: {readonly: true},
							lastvalue: {readonly: true},
							incrementvalue: {readonly: true},
							endvalue: {readonly: true},
							perioddate:{readonly: true}
						}
					};
				}

				var companyNumberDetailLayout = createFormLayout();

				var BaseService = platformUIStandardConfigService;

				var companyNumberAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyNumberSequenceDto',
					moduleSubModule: 'Basics.Company'
				});

				var properties = companyNumberAttributeDomains.properties;
				return new BaseService(companyNumberDetailLayout, properties, basicsCompanyTranslationService);
			}
		]);
})(angular);







