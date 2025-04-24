/**
 * Created by sandu on 31.03.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('basicsConfigUIStandardService', basicsConfigUIStandardService);

	basicsConfigUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigModuleDetailLayout', 'platformSchemaService'];

	function basicsConfigUIStandardService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigModuleDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleDto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigModuleDetailLayout, domainSchema.properties, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigTabUIService', basicsConfigTabUIService);

	basicsConfigTabUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigTabDetailLayout', 'platformSchemaService'];

	function basicsConfigTabUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigTabDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleTabDto',
			moduleSubModule: 'Basics.Config'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigTabDetailLayout, domainSchema, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigMcTwoQnAUIService', basicsConfigMcTwoQnAUIService);

	basicsConfigMcTwoQnAUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigMcTwoQnADetailLayout', 'platformSchemaService'];

	function basicsConfigMcTwoQnAUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigMcTwoQnADetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'McTwoQnADto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigMcTwoQnADetailLayout, domainSchema.properties, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigReportGroupUIService', basicsConfigReportGroupUIService);

	basicsConfigReportGroupUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigReportGroupDetailLayout', 'platformSchemaService'];

	function basicsConfigReportGroupUIService(platformUIStandardConfigService, basicsConfigReportGroupTranslationService, basicsConfigReportGroupDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ReportGroupDto',
			moduleSubModule: 'Basics.Config'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigReportGroupDetailLayout, domainSchema, basicsConfigReportGroupTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigReportXGroupUIService', basicsConfigReportXGroupUIService);

	basicsConfigReportXGroupUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigReportXGroupDetailLayout', 'platformSchemaService'];

	function basicsConfigReportXGroupUIService(platformUIStandardConfigService, ReportXGroupTranslationService, ReportXGroupDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Report2GroupDto',
			moduleSubModule: 'Basics.Config'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(ReportXGroupDetailLayout, domainSchema, ReportXGroupTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigAuditContainerUIService', basicsConfigAuditContainerUIService);
	basicsConfigAuditContainerUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigAuditContainerLayout', 'platformSchemaService'];

	function basicsConfigAuditContainerUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigAuditContainerLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'AudContainerDto',
			moduleSubModule: 'Basics.Config'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigAuditContainerLayout, domainSchema, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigAuditColumnUIService', basicsConfigAuditColumnUIService);
	basicsConfigAuditColumnUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigAuditColumnLayout', 'platformSchemaService'];

	function basicsConfigAuditColumnUIService(platformUIStandardConfigService, translationService, layout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'AudColumnDto',
			moduleSubModule: 'Basics.Config'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(layout, domainSchema, translationService);
	}

	angular.module(moduleName).factory('basicsConfigModuleViewsUIService', basicsConfigModuleViewsUIService);
	basicsConfigModuleViewsUIService.$inject = ['platformUIConfigInitService', 'platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigModuleViewsLayout', 'platformSchemaService'];

	function basicsConfigModuleViewsUIService(platformUIConfigInitService, platformUIStandardConfigService, translationService, layout, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleViewsDto',
			moduleSubModule: 'Basics.Config'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(layout, domainSchema, translationService);
	}

	angular.module(moduleName).factory('basicsConfigDataConfigurationColumnUIService', BasicsConfigDataConfigurationColumnUIService);
	BasicsConfigDataConfigurationColumnUIService.$inject = ['_', '$injector', '$translate', 'platformUIStandardConfigService', 'basicsConfigTranslationService',
		'basicsConfigDataConfigurationColumnLayout', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsConfigMainService', 'basicsConfigDataConfigurationDialogDataService'];

	function BasicsConfigDataConfigurationColumnUIService(_, $injector, $translate, platformUIStandardConfigService, translationService,
		layout, platformSchemaService, basicsLookupdataConfigGenerator, basicsConfigMainService, basicsConfigDataConfigurationDialogDataService) {

		var BaseService = platformUIStandardConfigService;

		var tableInfoColumnInfoAttributeDomains;

		var domainTableInfoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleTableInfoDto',
			moduleSubModule: 'Basics.Config'
		});

		var domainColumnInfoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleColumnInfoDto',
			moduleSubModule: 'Basics.Config'
		});

		var prefix = 'ModuleColumnInfo.';
		var newColumnInfoAttributeDomainsProperties = {};
		for (var domains in domainColumnInfoSchema.properties) {
			if (domainColumnInfoSchema.properties.hasOwnProperty(domains)) {
				newColumnInfoAttributeDomainsProperties[prefix + domains] = domainColumnInfoSchema.properties[domains];
			}
		}

		if (domainTableInfoSchema && domainColumnInfoSchema) {
			tableInfoColumnInfoAttributeDomains = Object.assign(domainTableInfoSchema.properties, newColumnInfoAttributeDomainsProperties);
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		layout.overloads = {
			tablename: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsConfigModuleTableLookupDataService',
				cacheEnable: true,
				additionalColumns: false,
				filter: function () {
					var sel = basicsConfigMainService.getSelected();
					return sel.InternalName;
				}
			}),
			accessrolefk: {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'usermanagement-right-role-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'usermanagement-right-role-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'AccessRole',
						displayMember: 'Name'
					}
				}
			},
			'modulecolumninfo.columnname': {
				formatter: 'action',
				formatterOptions: {
					appendContent: true,
					displayMember: 'StringWizardModuleTableNames'
				},
				forceActionButtonRender: true,
				actionList: [{
					toolTip: function (entity) {
						var toolTipText = $translate.instant('basics.config.setConfiguration');
						if (entity && entity.TableName) {
							var translatedKey = $translate.instant('basics.config.setConfiguration');
							toolTipText = translatedKey + ' (' + entity.TableName + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'tlb-icons ico-settings',
					callbackFn: function (entity) {
						let options = {
							titel: 'basics.config.titelDataFields',
							selectedTitle: 'basics.config.newWizardColumns', // do not change value, is required for the service
							filter: function (fields) {
								return fields;
							}
						};
						if (!_.isNil(entity) && entity.Version > 0) {
							$injector.get('basicsConfigDataConfigurationDialogService').openlistSelectionDialog(entity, options).then(function (data) {
								basicsConfigDataConfigurationDialogDataService.updateItem(data, entity, options);
							});
						}
					}
				}]
			},
			'modulecolumninfo.mandatorycolumnname': {
				formatter: 'action',
				formatterOptions: {
					appendContent: true,
					displayMember: 'StringMandatoryModuleTableNames'
				},
				forceActionButtonRender: true,
				actionList: [{
					toolTip: function (entity) {
						var toolTipText = $translate.instant('basics.config.setConfiguration');
						if (entity && entity.TableName) {
							var translatedKey = $translate.instant('basics.config.setConfiguration');
							toolTipText = translatedKey + ' (' + entity.TableName + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'tlb-icons ico-settings',
					callbackFn: function (entity) {
						let options = {
							titel: 'basics.config.titelMandatoryDataFields',
							selectedTitle: 'basics.config.mandatoryColumns', // do not change value, is required for the service
							filter: function (fields) {
								return _.filter(fields, function (field) {
									return !field.MandatoryBySystem;
								});
							}
						};
						if (!_.isNil(entity) && entity.Version > 0) {
							$injector.get('basicsConfigDataConfigurationDialogService').openlistSelectionDialog(entity, options).then(function (data) {
								basicsConfigDataConfigurationDialogDataService.updateItem(data, entity, options);
							});
						}
					}
				}]
			},
			'modulecolumninfo.readonlycolumnname': {
				formatter: 'action',
				formatterOptions: {
					appendContent: true,
					displayMember: 'StringReadOnlyModuleTableNames'
				},
				forceActionButtonRender: true,
				actionList: [{
					toolTip: function (entity) {
						var toolTipText = $translate.instant('basics.config.setConfiguration');
						if (entity && entity.TableName) {
							var translatedKey = $translate.instant('basics.config.setConfiguration');
							toolTipText = translatedKey + ' (' + entity.TableName + ')'.substring(0, 205);
						}
						return toolTipText;
					},
					icon: 'tlb-icons ico-settings',
					callbackFn: function (entity) {
						let options = {
							titel: 'basics.config.titelReadOnlyDataFields',
							selectedTitle: 'basics.config.readonlyColumns',//do not change value, is required for the service
							filter: function (fields) {
								return fields;
							}
						};
						if (!_.isNil(entity) && entity.Version > 0) {
							$injector.get('basicsConfigDataConfigurationDialogService').openlistSelectionDialog(entity, options).then(function (data) {
								basicsConfigDataConfigurationDialogDataService.updateItem(data, entity, options);
							});
						}
					}
				}]
			}
		};

		return new BaseService(layout, tableInfoColumnInfoAttributeDomains, translationService);
	}

	angular.module(moduleName).factory('basicsConfigDataConfigurationDialogColumnUIService', BasicsConfigDataConfigurationDialogColumnUIService);
	BasicsConfigDataConfigurationDialogColumnUIService.$inject = ['platformUIConfigInitService', 'platformUIStandardConfigService', 'basicsConfigTranslationService',
		'basicsConfigDataConfigurationDialogColumnLayout', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsConfigMainService',
		'basicsConfigModuleTableInformationDataService'];

	function BasicsConfigDataConfigurationDialogColumnUIService(platformUIConfigInitService, platformUIStandardConfigService, translationService,
		basicsConfigDataConfigurationDialogColumnLayout, platformSchemaService, basicsLookupdataConfigGenerator, basicsConfigMainService,
		basicsConfigModuleTableInformationDataService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModuleColumnInfoDto',
			moduleSubModule: 'Basics.Config'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		basicsConfigDataConfigurationDialogColumnLayout.overloads = {
			columnname: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsConfigModuleTableColumnLookupDataService',
				cacheEnable: true,
				additionalColumns: false,
				filter: function () {
					var selMod = basicsConfigMainService.getSelected();
					var selTbl = basicsConfigModuleTableInformationDataService.getSelected();

					return selMod.InternalName + '&table=' + selTbl.TableName;
				}
			})
		};

		return new BaseService(basicsConfigDataConfigurationDialogColumnLayout, domainSchema, translationService);
	}

	//Commandbar

	angular.module(moduleName).factory('basicsConfigCommandbarPortalUIService', basicsConfigCommandbarPortalUIService);

	basicsConfigCommandbarPortalUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigCommandbarLayout', 'platformSchemaService'];

	function basicsConfigCommandbarPortalUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigCommandbarLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'CommandbarConfigDto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigCommandbarLayout, domainSchema.properties, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigCommandbarSystemUIService', basicsConfigCommandbarSystemUIService);

	basicsConfigCommandbarSystemUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigCommandbarLayout', 'platformSchemaService'];

	function basicsConfigCommandbarSystemUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigCommandbarLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'CommandbarConfigDto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigCommandbarLayout, domainSchema.properties, basicsConfigTranslationService);
	}

	//Navbar

	angular.module(moduleName).factory('basicsConfigNavbarPortalUIService', basicsConfigNavbarPortalUIService);

	basicsConfigNavbarPortalUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigNavbarLayout', 'platformSchemaService'];

	function basicsConfigNavbarPortalUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigNavbarLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'NavbarConfigDto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigNavbarLayout, domainSchema.properties, basicsConfigTranslationService);
	}

	angular.module(moduleName).factory('basicsConfigNavbarSystemUIService', basicsConfigNavbarSystemUIService);

	basicsConfigNavbarSystemUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigNavbarLayout', 'platformSchemaService'];

	function basicsConfigNavbarSystemUIService(platformUIStandardConfigService, basicsConfigTranslationService, basicsConfigNavbarLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'NavbarConfigDto',
			moduleSubModule: 'Basics.Config'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(basicsConfigNavbarLayout, domainSchema.properties, basicsConfigTranslationService);
	}
})();
