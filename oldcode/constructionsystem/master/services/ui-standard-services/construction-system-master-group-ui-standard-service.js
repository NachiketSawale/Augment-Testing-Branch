/**
 * Created by wed on 6/19/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterGroupUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService', 'constructionsystemMasterTranslationService', 'constructionSystemMasterGroupDetailLayout',
		function (platformUIStandardConfigService, platformSchemaService, constructionsystemMasterTranslationService, constructionSystemMasterGroupDetailLayout) {

			var groupAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'CosGroupDto',
				moduleSubModule: 'ConstructionSystem.Master'
			});
			groupAttributeDomains = groupAttributeDomains.properties;
			groupAttributeDomains.Filter = {'domain': 'marker'};

			function GroupUIStandardServic(layout, schema, translateService) {
				platformUIStandardConfigService.call(this, layout, schema, translateService);
			}

			GroupUIStandardServic.prototype = Object.create(platformUIStandardConfigService.prototype);
			GroupUIStandardServic.prototype.constructor = GroupUIStandardServic;

			var service = new GroupUIStandardServic(constructionSystemMasterGroupDetailLayout, groupAttributeDomains, constructionsystemMasterTranslationService);

			// var originalDetailViewFn = service.getStandardConfigForDetailView;

			// service.getStandardConfigForDetailView = function () {
			// var detailConfig = originalDetailViewFn(),
			// cloneConfig = angular.copy(detailConfig),
			// rows = cloneConfig.rows;
			// for (var i = rows.length - 1; i >= 0; i--) {
			//      if (rows[i].rid === 'filter') {
			//          rows.splice(i, 1);
			//         }
			//    }
			//     return cloneConfig;
			// };

			return service;
		}
	]);
})(angular);