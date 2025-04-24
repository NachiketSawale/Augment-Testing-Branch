/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsCostGroupFilterStructureTranslationFactory', [
		'platformUIBaseTranslationService',
		'basicsCostGroupFilterCacheService',
		'basicsCostGroupFilterCacheTypes',
		function (platformUIBaseTranslationService,
		          filterCacheService,
		          cacheTypes) {

			function TranslationService(transOptions) {
				platformUIBaseTranslationService.call(this, transOptions);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;

			function createService(serviceDescriptor, createOptions) {

				if (!filterCacheService.hasService(cacheTypes.COSTGROUP_STRUCTURE_TRANSLATION, serviceDescriptor)) {

					var options = angular.merge({
							translation: null
						}, createOptions),
						baseTranslation = {
							translationInfos: {
								extraModules: [cloudCommonModule, moduleName],
								extraWords: {
									Code: {
										location: cloudCommonModule,
										identifier: 'entityCode',
										initial: 'Code'
									},
									Quantity: {
										location: cloudCommonModule,
										identifier: 'entityQuantity',
										initial: 'Quantity'
									},
									UomFk: {
										location: cloudCommonModule,
										identifier: 'entityUoM',
										initial: 'Uom'
									}
								}
							}
						};

					if (options.translation && options.translation.translationInfos) {
						var extraModules = options.translation.translationInfos.extraModules;

						if (extraModules && extraModules.length > 0) {
							angular.forEach(extraModules, function (item) {
								if (baseTranslation.translationInfos.extraModules.indexOf(item) === -1) {
									baseTranslation.translationInfos.extraModules.push(item);
								}
							});
						}

						var extraWords = options.translation.translationInfos.extraWords;
						if (extraWords) {
							for (var p in extraWords) {
								if (extraWords.hasOwnProperty(p)) {
									baseTranslation.translationInfos.extraWords[p] = extraWords[p];
								}
							}
						}
					}

					return new TranslationService(baseTranslation);

				}
				return filterCacheService.getService(cacheTypes.COSTGROUP_STRUCTURE_TRANSLATION, serviceDescriptor);
			}

			return {
				createService: createService
			};

		}]);

})(angular);