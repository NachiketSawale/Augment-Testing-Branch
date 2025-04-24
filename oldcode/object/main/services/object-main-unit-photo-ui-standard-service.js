(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitPhotoUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit photo entities
	 */
	angular.module(moduleName).factory('objectMainUnitPhotoUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.main.unitphotodetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [ 'description', 'commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
						}
					};
				}

				var objectMainUnitPhotoDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainUnitPhotoAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UnitPhotoDto',
					moduleSubModule: 'Object.Main'
				});
				objectMainUnitPhotoAttributeDomains = objectMainUnitPhotoAttributeDomains.properties;


				function UnitPhotoUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitPhotoUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitPhotoUIStandardService.prototype.constructor = UnitPhotoUIStandardService;

				return new BaseService(objectMainUnitPhotoDetailLayout, objectMainUnitPhotoAttributeDomains, objectMainTranslationService);
			}
		]);
})();
