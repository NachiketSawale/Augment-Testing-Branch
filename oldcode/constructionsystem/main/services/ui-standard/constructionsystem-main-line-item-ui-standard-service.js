(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineItemUIStandardService
	 * @function
	 *
	 * @description
	 * constructionsystem main line item comparison container ui standard service.
	 */
	angular.module(moduleName).factory('constructionsystemMainLineItemUIStandardService', [
		'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService',
		'constructionSystemMainLineItemLayoutService', 'constructionSystemMainInstanceService',
		function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService,
			constructionSystemMainLineItemLayoutService, constructionSystemMainInstanceService) {

			var BaseService = platformUIStandardConfigService;

			var estLineItemDomainSchema = platformSchemaService.getSchemaFromCache(
				{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'}
			);

			if (estLineItemDomainSchema) {
				estLineItemDomainSchema = estLineItemDomainSchema.properties;
				estLineItemDomainSchema.Info = {domain: 'image'};
				estLineItemDomainSchema.Rule = {domain: 'imageselect'};
				estLineItemDomainSchema.Param = {domain: 'imageselect'};
				estLineItemDomainSchema.BoqRootRef = {domain: 'integer'};
				estLineItemDomainSchema.PsdActivitySchedule = {domain: 'code'};
				estLineItemDomainSchema.CompareFlag = {domain: 'image'}; // add a compare flag here
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			var getProjectId = function () {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId() || -1;
			};

			// use InstanceHeader's ProjectFk to filter Project loaction/ Cost Group 1-5;
			var estimateMainLineItemDetailLayout = constructionSystemMainLineItemLayoutService.getEstimateMainLineItemDetailLayout(getProjectId);


			// only add a field 'CompareFlag' to show image
			estimateMainLineItemDetailLayout.groups[0].attributes.unshift('compareflag');
			angular.extend(estimateMainLineItemDetailLayout.overloads, {
				compareflag: {
					readonly: true,
					grid: {
						field: 'image',
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'constructionsystemMainCompareflagImageProcessor'
						}
					}
				}
			});

			return new BaseService(estimateMainLineItemDetailLayout, estLineItemDomainSchema, estimateMainTranslationService);
		}
	]);
})(angular);