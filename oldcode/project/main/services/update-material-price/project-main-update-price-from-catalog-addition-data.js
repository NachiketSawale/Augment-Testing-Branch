/**
 * Created by chi on 2/22/2019.
 */
(function(angular){
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogAdditionalData', projectMainUpdatePriceFromCatalogAdditionalData);

	projectMainUpdatePriceFromCatalogAdditionalData.$inject = ['$translate'];

	function projectMainUpdatePriceFromCatalogAdditionalData($translate) {
		var service = {};
		var priceVersions={
			base: -1,
			mixed: -2
		};
		var basePriceVersionId = priceVersions.base;
		var weightedPriceVersionId = priceVersions.mixed;
		service.additionalPriceVersions = [
			{
				Id: weightedPriceVersionId,
				MaterialCatalogFk: weightedPriceVersionId,
				MaterialPriceVersionDescriptionInfo: {
					Translated: $translate.instant('project.main.prjMaterialSource.mixed')
				},
				PriceListDescriptionInfo: {
					Translated: ''
				}
			},
			{
				Id: basePriceVersionId,
				MaterialCatalogFk: basePriceVersionId,
				MaterialPriceVersionDescriptionInfo: {
					Translated: $translate.instant('project.main.prjMaterialSource.onlyBase')
				},
				PriceListDescriptionInfo: {
					Translated: ''
				}
			}
		];

		service.basePriceVersionId = basePriceVersionId;
		service.weightedPriceVersionId = weightedPriceVersionId;

		return service;
	}
})(angular);