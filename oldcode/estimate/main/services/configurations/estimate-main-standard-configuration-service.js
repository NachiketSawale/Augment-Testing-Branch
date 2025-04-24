/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of estimate entities
	 */
	angular.module(moduleName).factory('estimateMainStandardConfigurationService', ['platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'estimateMainUIConfigurationService',

		function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, estimateMainUIConfigurationService) {

			function getLineItemLayout(){
				let estimateMainLineItemDetailLayout = estimateMainUIConfigurationService.getEstimateMainLineItemDetailLayout();
				let assemblyFkEditorOptionsPath = 'estassemblyfk.grid.editorOptions';
				let assemblyFkDetailOptionsPath = 'estassemblyfk.detail.options';

				if (_.has(estimateMainLineItemDetailLayout.overloads, assemblyFkEditorOptionsPath)) {
					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkEditorOptionsPath + '.lookupOptions.usageContext', 'estimateMainService');
					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkEditorOptionsPath + '.lookupOptions.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');

					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkDetailOptionsPath + '.lookupOptions.usageContext', 'estimateMainService');
					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkDetailOptionsPath + '.lookupOptions.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
				}

				// remove the quantityTotal column readonly here, this column's readonly is depend on customize systemoption enableLineItemQuantityTotal
				// estimateMainLineItemDetailLayout.overloads.quantitytotal = {};

				// not allowed to group in generic grouping container
				_.set(estimateMainLineItemDetailLayout.overloads.advancedallowance, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.estimationcode, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.cosmasterheadercode, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.cosmasterheaderdescription, 'grouping.generic', false);

				// allow cosinstancecode and cosinstancedescription in generic grouping container ssrinath@15.3.2022
				_.set(estimateMainLineItemDetailLayout.overloads.cosinstancecode, 'grouping.generic', true);
				_.set(estimateMainLineItemDetailLayout.overloads.cosinstancedescription, 'grouping.generic', true);

				return estimateMainLineItemDetailLayout;
			}

			let BaseService = platformUIStandardConfigService;
			let estLineItemDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstLineItemDto',
				moduleSubModule: 'Estimate.Main'
			});
			if(estLineItemDomainSchema) {
				estLineItemDomainSchema = estLineItemDomainSchema.properties;
				estLineItemDomainSchema.Info ={ domain : 'image'};
				estLineItemDomainSchema.ItemInfo = { domain : 'string'};
				estLineItemDomainSchema.Rule ={ domain : 'imageselect'};
				estLineItemDomainSchema.Param ={ domain : 'imageselect'};
				estLineItemDomainSchema.BoqRootRef ={ domain : 'integer'};
				estLineItemDomainSchema.PsdActivitySchedule ={ domain : 'code'};
				estLineItemDomainSchema.PrcPackageStatusFk ={ domain : 'integer'};
				estLineItemDomainSchema.CostExchangeRate1 = {domain: 'money'};
				estLineItemDomainSchema.CostExchangeRate2 = {domain: 'money'};
				estLineItemDomainSchema.Currency1Fk = {domain: 'integer'};
				estLineItemDomainSchema.Currency2Fk = {domain: 'integer'};
				estLineItemDomainSchema.ExchangeRate1 = {domain: 'integer'};
				estLineItemDomainSchema.ExchangeRate2 = {domain: 'integer'};
				estLineItemDomainSchema.EscalationCostTotal = {domain: 'money'};
				estLineItemDomainSchema.EscalationCostUnit = {domain: 'money'};
				estLineItemDomainSchema.RiskCostUnit = {domain: 'money'};
				estLineItemDomainSchema.RiskCostTotal = {domain: 'money'};

				// add transient field and map this with grouping definition...
				estLineItemDomainSchema.PrjChangeStatusFk = {
					domain: 'integer',
					groupings: [{groupcolid: 'Change.Main.ChangeStatus', mappinghint: 'prjchangestatusfk'}]
				};

				// enable ProjectNo and ProjectName to use synthetic grouping from estheaderfk rei@30.9.2018
				if (estLineItemDomainSchema.ProjectNo) {
					estLineItemDomainSchema.ProjectNo.grouping = 'Estimate.Main.ProjectNo';
				}
				if (estLineItemDomainSchema.ProjectName) {
					estLineItemDomainSchema.ProjectName.grouping = 'Estimate.Main.ProjectName';
				}

				// enable CosInstanceCode and CosInstanceDescription to use synthetic grouping from cosinstancefk ssrinath@15.3.2022
				if (estLineItemDomainSchema.CosInstanceCode) {
					estLineItemDomainSchema.CosInstanceCode.grouping = 'Estimate.Main.CosInstance';
				}
				if (estLineItemDomainSchema.CosInstanceDescription) {
					estLineItemDomainSchema.CosInstanceDescription.grouping = 'Estimate.Main.CosInstance';
				}

				if (estLineItemDomainSchema.PackageAssignments) {
					estLineItemDomainSchema.PackageAssignments.grouping = 'Procurement.Package.PackageAssignments';
				}

				// DynamicConfigSetUp: 2. Extend Standard Configuration
				// Add dynamic column config static fields here
				// estLineItemDomainSchema.NotAssignedCostTotal = {
				// domain: 'money',
				// readonly: true
				// };
			}

			function EstimateUIStandardService(layout, scheme, translateService, entityInformation) {
				BaseService.call(this, layout, scheme, translateService,entityInformation);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			let entityInformation = {module: angular.module(moduleName), moduleName: 'Estimate.Main', entity: 'EstLineItem' };
			return new EstimateUIStandardService( getLineItemLayout(), estLineItemDomainSchema, estimateMainTranslationService, entityInformation);

			// DynamicConfigSetUp: 2. Extend Standard Configuration
			// let service = new BaseService(getLineItemLayout(), estLineItemDomainSchema, estimateMainTranslationService);
			//
			// //Add extension to handle dynamic configuration
			// basicsCommonDynamicStandardConfigServiceExtension.extend(
			// service,
			// estimateMainUIConfigurationService.getEstimateMainLineItemDynamicColumnConfig(),
			// estLineItemDomainSchema,
			// estimateMainTranslationService);
			//
			// return service;
		}
	]);
})();
