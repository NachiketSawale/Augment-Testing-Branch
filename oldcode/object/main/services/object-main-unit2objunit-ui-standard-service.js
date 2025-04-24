(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnit2ObjUnitUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Unit2ObjUnit entities
	 */
	angular.module(moduleName).factory('objectMainUnit2ObjUnitUIStandardService',
			['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'objectMainUnitService', 'basicsLookupdataLookupFilterService',

				function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, objectMainUnitService, basicsLookupdataLookupFilterService) {

					var filters = [
						{
							key: 'object-main-parking-space-filter',
							fn: filterByObjectMainParkingSpace
						}];

					function filterByObjectMainParkingSpace(item) {
						return !item.IsAssignedParkingSpace;
					}

					basicsLookupdataLookupFilterService.registerFilter(filters);

					function createMainDetailLayout() {
						return {
							'fid': 'object.main.unit2objunitdetailform',
							'version': '1.0.0',
							'showGrouping': true,
							'addValidationAutomatically': true,
							'groups': [
								{
									'gid': 'baseGroup',
									'attributes': ['unitparkingspacefk', 'commenttext', 'userdefinedtext01', 'userdefinedtext02', 'userdefinedtext03', 'userdefinedtext04', 'userdefinedtext05']
								},
								{
									'gid': 'entityHistory',
									'isHistory': true
								}
							],
							'overloads': {
								unitparkingspacefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'objectMainLookupDataService',
									filter: function (item) {
										var unitFk;
										if (item && item.UnitFk) {
											unitFk = item.UnitFk;
										}
										
										return unitFk;
									},
									filterKey: 'object-main-parking-space-filter'
								})
							}
						};
					}

					var objectMainUnit2ObjUnitDetailLayout = createMainDetailLayout();

					var BaseService = platformUIStandardConfigService;

					var unit2ObjUnitAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'Unit2ObjUnitDto',
						moduleSubModule: 'Object.Main'
					});
					unit2ObjUnitAttributeDomains = unit2ObjUnitAttributeDomains.properties;
					return new BaseService(objectMainUnit2ObjUnitDetailLayout, unit2ObjUnitAttributeDomains, objectMainTranslationService);
				}
			]);
})();
