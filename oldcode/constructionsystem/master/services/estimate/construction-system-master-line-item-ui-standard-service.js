/**
 * Created by wui on 2/24/2016.
 */

(function () {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/**
	 * @ngdoc service
	 * @name estimateMainStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of estimate entities
	 */
	angular.module(moduleName).factory('constructionSystemMasterLineItemUIStandardService', [
		'platformUIStandardConfigService',
		'estimateMainTranslationService',
		'platformSchemaService',
		'constructionSystemMasterLineItemLayoutService',

		function (
			platformUIStandardConfigService,
			estimateMainTranslationService,
			platformSchemaService,
			constructionSystemMasterLineItemLayoutService) {

			var BaseService = platformUIStandardConfigService;
			var estLineItemDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'} );
			if(estLineItemDomainSchema) {
				estLineItemDomainSchema = estLineItemDomainSchema.properties;
				estLineItemDomainSchema.Info ={ domain : 'image'};
				estLineItemDomainSchema.Rule ={ domain : 'imageselect'};
				estLineItemDomainSchema.Param ={ domain : 'imageselect'};
				estLineItemDomainSchema.BoqRootRef ={ domain : 'integer'};
				estLineItemDomainSchema.PsdActivitySchedule ={ domain : 'code'};
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
			var estimateMainLineItemDetailLayout = constructionSystemMasterLineItemLayoutService.getEstimateMainLineItemDetailLayout();
			return new BaseService( estimateMainLineItemDetailLayout, estLineItemDomainSchema, estimateMainTranslationService);
		}
	]);
})();