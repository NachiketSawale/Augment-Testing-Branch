(function () {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainResourceUIStandardService
	 * @function
	 * @description
	 *
	 * ui config service for constructionsystem main resources container.
	 */
	angular.module(moduleName).factory('constructionsystemMainResourceUIStandardService', [
		'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'constructionsystemMainResourceConfigurationService',
		function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, constructionsystemMainResourceConfigurationService) {

			var BaseService = platformUIStandardConfigService;
			var domainSchemaDto = platformSchemaService.getSchemaFromCache( { typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'} );
			if(domainSchemaDto) {
				domainSchemaDto = domainSchemaDto.properties;
				domainSchemaDto.CompareFlag = {domain: 'image'}; // add a compare flag here
				domainSchemaDto.EstResourceTypeFkExtend = {domain: 'integer'};
				domainSchemaDto.PrcPackageStatusFk = {domain: 'integer'};
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			var layout = constructionsystemMainResourceConfigurationService.getEstimateMainResourceDetailLayout();
			// only add a field 'CompareFlag' to show image
			layout.groups[0].attributes.unshift('compareflag');
			angular.extend(layout.overloads, {
				'compareflag': {
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

			return new BaseService(layout, domainSchemaDto, estimateMainTranslationService);
		}
	]);
})();