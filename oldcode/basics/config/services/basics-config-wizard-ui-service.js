/**
 * Created by sandu on 27.01.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsConfigWizardGroupUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for wizard group of the module
	 */
	angModule.factory('basicsConfigWizardGroupUIService', basicsConfigWizardGroupUIService);
	basicsConfigWizardGroupUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigWizardGroupLayout', 'platformSchemaService'];
	function basicsConfigWizardGroupUIService(platformUIStandardConfigService,basicsConfigTranslationService,basicsConfigWizardGroupLayout,platformSchemaService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'WizardGroupDto',
			moduleSubModule: 'Basics.Config'
		});
		if(domainSchema){
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function BasicsConfigWizardGroupUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		BasicsConfigWizardGroupUIStandardService.prototype = Object.create(BaseService.prototype);
		BasicsConfigWizardGroupUIStandardService.prototype.constructor = BasicsConfigWizardGroupUIStandardService;

		return new BaseService(basicsConfigWizardGroupLayout, domainSchema, basicsConfigTranslationService);
	}

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for wizard to group of the module
	 */
	angModule.factory('basicsConfigWizardXGroupUIService', basicsConfigWizardXGroupUIService);
	basicsConfigWizardXGroupUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigWizardXGroupLayout', 'platformSchemaService'];
	function basicsConfigWizardXGroupUIService(platformUIStandardConfigService,basicsConfigTranslationService,basicsConfigWizardXGroupLayout,platformSchemaService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Wizard2GroupDto',
			moduleSubModule: 'Basics.Config'
		});
		if(domainSchema){
			domainSchema = domainSchema.properties;
			domainSchema.AccessRightDescriptor = {domain: 'description'};
		}

		function BasicsConfigWizardXGroupUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		BasicsConfigWizardXGroupUIStandardService.prototype = Object.create(BaseService.prototype);
		BasicsConfigWizardXGroupUIStandardService.prototype.constructor = BasicsConfigWizardXGroupUIStandardService;

		return new BaseService(basicsConfigWizardXGroupLayout, domainSchema, basicsConfigTranslationService);
	}

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupPValueUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for wizard to group parameter valueof the module
	 */
	angModule.factory('basicsConfigWizardXGroupPValueUIService', basicsConfigWizardXGroupPValueUIService);
	basicsConfigWizardXGroupPValueUIService.$inject = ['platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigWizardXGroupPValueLayout', 'platformSchemaService'];
	function basicsConfigWizardXGroupPValueUIService(platformUIStandardConfigService,basicsConfigTranslationService,basicsConfigWizardXGroupPValueLayout,platformSchemaService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Wizard2GroupPValueDto',
			moduleSubModule: 'Basics.Config'
		});
		if(domainSchema){
			domainSchema = domainSchema.properties;
			domainSchema.Domain = {domain: 'description'};
		}

		function BasicsConfigWizardXGroupPValueUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		BasicsConfigWizardXGroupPValueUIStandardService.prototype = Object.create(BaseService.prototype);
		BasicsConfigWizardXGroupPValueUIStandardService.prototype.constructor = BasicsConfigWizardXGroupPValueUIStandardService;

		return new BaseService(basicsConfigWizardXGroupPValueLayout, domainSchema, basicsConfigTranslationService);
	}
})(angular);