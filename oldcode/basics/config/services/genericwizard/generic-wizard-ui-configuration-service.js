/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsConfigGenericWizardUIConfigurationService provides layout configurations for all container.
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardUIConfigurationService', BasicsConfigGenericWizardUIConfigurationService);

	BasicsConfigGenericWizardUIConfigurationService.$inject = ['platformUIConfigInitService', 'platformSchemaService', 'basicsConfigTranslationService', 'basicsLookupdataConfigGenerator', 'platformGridDomainService', 'platformGridLookupDomainFormatterService'];

	function BasicsConfigGenericWizardUIConfigurationService(platformUIConfigInitService, platformSchemaService, basicsConfigTranslationService, configGenerator, gridDomainService, domainFormatterService) {
		var self = this;

		self.getBaseLayout = function getBaseLayout(fid, atts, overloadObject) {
			return {
				version: '1.0.0',
				fid: fid,
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: overloadObject || {}
			};
		};

		self.getInstanceLayout = function getInstanceLayout() {
			return self.getBaseLayout('basics.config.genericWizardInstanceLayout', ['commentinfo', 'remark', 'wizardconfiguuid'], {
				wizardconfiguuid: configGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomGenWizardInstanceConfigLookupDataService'
				})
			});
		};

		self.getStepLayout = function getStepLayout() {
			return self.getBaseLayout('basics.config.genericWizardStepLayout', ['titleinfo', 'commentinfo', 'textheader', 'textfooter', 'genericwizardsteptypefk', 'genericwizardstepfk', 'sorting', 'autosave', 'ishidden', 'remark'], {
				genericwizardsteptypefk: configGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomGenWizardStepTypeLookupDataService'
				})
			});
		};

		self.getContainerLayout = function getContainerLayout() {
			var overloadFile = configGenerator.provideElaboratedLookupConfig('basic-lookup-data-file-lookup', 'basicLookupDataFileLookup', 'OriginalName', true, 'basicsLookupFileService');
			overloadFile.grid.editor = null;
			return self.getBaseLayout('basics.config.genericWizardContainerLayout', ['containeruuid', 'caninsert', 'filearchivedocfk', 'commentinfo', 'sorting', 'remark', 'titleinfo'], {
				containeruuid: configGenerator.provideElaboratedLookupConfig('basic-lookup-data-container-lookup', 'basicLookupDataContainerLookup', 'title', true, 'basicsLookupDataContainerListService', {
					formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) {
						return domainFormatterService.formatLookupMainColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, gridDomainService.formatLookup, gridDomainService.applyAsyncFormatterMarkup);
					}
				}),
				filearchivedocfk: overloadFile
			});
		};

		self.getContainerPropertyLayout = function getContainerPropertyLayout() {
			return self.getBaseLayout('basics.config.genericWizardPropertyLayout', ['labelinfo', 'propertyid', 'isreadonly', 'width', 'sorting', 'ispinned', 'tooltipinfo'], {
				propertyid: configGenerator.provideElaboratedLookupConfig('basic-lookup-data-container-properties', 'basicsLookupDataContainerPropertyListService', 'name', true, 'basicsLookupDataContainerPropertyListService')
			});
		};

		self.getInstanceParameterLayout = function getInstanceParameterLayout() {
			return self.getBaseLayout('basics.config.genericWizardParameterLayout', ['name', 'description', 'displaydomainfk', 'value']);
		};

		self.getStepScriptLayout = function getStepScriptLayout() {
			return self.getBaseLayout('basics.config.genericWizardInstanceLayout', ['descriptioninfo', 'genericwizardscripttypefk', 'remark'], {
				genericwizardscripttypefk: configGenerator.provideGenericLookupConfig('basics.config.scripttype', null, null),
			});
		};

		self.getNamingParameterLayout = function getNamingParameterLayout() {
			return self.getBaseLayout('basics.config.genericWizardNamingParameterLayout', ['pattern', 'namingtype'], {
				namingtype: configGenerator.provideElaboratedLookupConfig('basic-lookup-data-generic-wizard-naming-parameter-lookup', 'basicsLookupDataGenericWizardNamingParameterListService', 'title', true, 'basicsLookupDataGenericWizardNamingParameterListService')
			});
		};

		self.provideContainerConfigurations = function provideContainerConfigurations(layout, dto) {
			var scheme = platformSchemaService.getSchemaFromCache({
				typeName: dto, moduleSubModule: 'Basics.Config'
			}).properties;
			var configs = {};

			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, basicsConfigTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, basicsConfigTranslationService);

			return configs;
		};

		self.getModuleOverload = function getModuleOverload(propertyName) {
			return self.getOverloadForProperty('description', propertyName);
		};

		self.getWiz2GroupOverload = function getWiz2GroupOverload(propertyName) {
			return self.getOverloadForProperty('description', propertyName);
		};

		self.getStepOverload = function getStepOverload(propertyName) {
			return self.getOverloadForProperty('description', propertyName);
		};

		self.getContainerOverload = function getContainerOverload(propertyName) {
			return self.getOverloadForProperty('description', propertyName);
		};

		self.getOverloadForProperty = function getOverloadForProperty(domain, propertyName) {
			return {
				detail: {
					readonly: true,
					type: domain,
					formatter: domain,
					model: propertyName
				},
				grid: {
					readonly: true,
					formatter: domain,
					field: propertyName
				}
			};
		};
	}
})(angular);

