/**
 * Created by bh on 05.05.2015.
 */
(function () {
	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in boq wic module
	 */
	angular.module(moduleName).factory('boqWicGroupStandardConfigurationService', ['platformUIStandardConfigService', 'boqWicTranslationService', 'platformSchemaService',
		function (platformUIStandardConfigService, boqWicTranslationService, platformSchemaService) {

			function createMainDetailLayout() {
				return {
					fid: 'boq.wic.groupdetailform',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'basicData',
							attributes: ['code', 'descriptioninfo']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					]
				};
			}

			var boqWicDetailLayout = createMainDetailLayout();

			var BaseService = platformUIStandardConfigService;

			var boqWicAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'WicGroupDto',
				moduleSubModule: 'Boq.Wic'
			});
			if (boqWicAttributeDomains) {
				boqWicAttributeDomains = boqWicAttributeDomains.properties;
				boqWicAttributeDomains.AccessRightDescriptorName = {domain: 'description'};
			}

			function BoqWicUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BoqWicUIStandardService.prototype = Object.create(BaseService.prototype);
			BoqWicUIStandardService.prototype.constructor = BoqWicUIStandardService;

			return new BoqWicUIStandardService(boqWicDetailLayout, boqWicAttributeDomains, boqWicTranslationService);
		}
	]);
})();
