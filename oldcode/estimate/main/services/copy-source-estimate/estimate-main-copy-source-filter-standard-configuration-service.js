/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';


	angular.module(moduleName).service('estimateMainCopySourceFilterUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService',
		'estimateMainCopySourceFilterConfigurationService', 'estimateMainTranslationService' ,

		function (platformUIStandardConfigService, platformSchemaService,
			estimateMainCopySourceFilterConfigurationService, estimateMainTranslationService) {

			let BaseService = platformUIStandardConfigService;
			let domainSchema = {};
			domainSchema.EstimateFilterType = {domain: 'integer'};
			domainSchema.ProjectId = {domain: 'integer'};
			domainSchema.AssemblyCategoryId = {domain: 'integer'};
			domainSchema.EstHeaderId = {domain: 'integer'};
			domainSchema.SearchText = {domain: 'description'};
			domainSchema.Records = {domain: 'integer'};

			return new BaseService(estimateMainCopySourceFilterConfigurationService.getEstimateMainCopySourceLineItemDetailLayout(), domainSchema, estimateMainTranslationService);
		}
	]);
})(angular);
