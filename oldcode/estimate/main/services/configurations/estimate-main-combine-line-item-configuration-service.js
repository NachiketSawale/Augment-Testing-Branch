/**
 * Created by salopek on 09.18.2018.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'estimate.main';

	/*
	 * @ngdoc service
	 * @name estimateMainCombineLineItemConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of estimate entities
	  */
	angular.module(moduleName).factory('estimateMainCombineLineItemConfigurationService', ['platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'estimateMainUIConfigurationService',

		function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, estimateMainUIConfigurationService) {

			function getCombineLineItemLayout(){
				// var estimateMainLineItemDetailLayout = angular.copy(estimateMainUIConfigurationService.getEstimateMainLineItemDetailLayout());
				var estimateMainLineItemDetailLayout = angular.copy(estimateMainUIConfigurationService.getEstimateMainCombinedLineItemDetailLayout());
				var assemblyFkEditorOptionsPath = 'estassemblyfk.grid.editorOptions';
				var assemblyFkDetailOptionsPath = 'estassemblyfk.detail.options';

				if (_.has(estimateMainLineItemDetailLayout.overloads, assemblyFkEditorOptionsPath)) {
					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkEditorOptionsPath + '.lookupOptions.usageContext', 'estimateMainService');

					_.set(estimateMainLineItemDetailLayout.overloads, assemblyFkDetailOptionsPath + '.lookupOptions.usageContext', 'estimateMainService');
				}

				// remove the quantityTotal column readonly here, this column's readonly is depend on customize systemoption enableLineItemQuantityTotal
				estimateMainLineItemDetailLayout.overloads.quantitytotal = {};

				// not allowed to group in generic grouping container
				_.set(estimateMainLineItemDetailLayout.overloads.advancedallowance, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.cosinstancecode, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.estimationcode, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.cosmasterheadercode, 'grouping.generic', false);
				_.set(estimateMainLineItemDetailLayout.overloads.cosmasterheaderdescription, 'grouping.generic', false);

				return estimateMainLineItemDetailLayout;
			}

			var BaseService = platformUIStandardConfigService;
			var estLineItemDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstLineItemDto',
				moduleSubModule: 'Estimate.Main'
			});

			if(estLineItemDomainSchema) {
				estLineItemDomainSchema = estLineItemDomainSchema.properties;
				estLineItemDomainSchema.Info ={ domain : 'image'};
				estLineItemDomainSchema.Rule ={ domain : 'imageselect'};
				estLineItemDomainSchema.Param ={ domain : 'imageselect'};
				estLineItemDomainSchema.BoqRootRef ={ domain : 'integer'};
				estLineItemDomainSchema.PsdActivitySchedule ={ domain : 'code'};
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
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			return new BaseService( getCombineLineItemLayout(), estLineItemDomainSchema, estimateMainTranslationService);
		}
	]);
})();