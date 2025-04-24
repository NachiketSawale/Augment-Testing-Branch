(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).factory('ppsFabricationunitStructureUIService', [
		'platformLayoutHelperService', 'platformSchemaService',
		'platformUIStandardConfigService', 'ppsFabricationunitTranslationService',
		function (platformLayoutHelperService, platformSchemaService,
		          PlatformUIStandardConfigService, ppsFabricationunitTranslationService) {
			var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.fabricationunit.structuredetailform',
				['projectid', 'ppsheaderid', 'ppsitemid', 'ppsproductionsetmainfk', 'bassitefk', 'eventtypefk', 'ppsprodplacetypefk', 'ppsproductionplacefk']);
			layout.groups.length -= 1; // remove 'entityHistory' group
			var schemaOption = { typeName: 'PpsFabricationUnitDto', moduleSubModule: 'Productionplanning.Fabricationunit' };
			var dtoAttrs = platformSchemaService.getSchemaFromCache(schemaOption).properties;
			return new PlatformUIStandardConfigService(layout, dtoAttrs, ppsFabricationunitTranslationService);
		}
	]);
})();