/**
 * Created by janas on 12.12.2014.
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc service
	 * @name controllingStructureUnitgroupUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('controllingStructureUnitgroupUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService', 'basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, platformSchemaService, controllingStructureTranslationService, basicsLookupdataConfigGenerator) {

				function createUnitGroupDetailLayout() {
					return {
						fid: 'controlling.structure.groupdetailform',
						version: '1.0.1',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['controllinggroupfk', 'controllinggroupdetailfk']
							}
						],
						overloads: {
							controllinggroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupLookupDataService',
								enableCache: true
							}),
							controllinggroupdetailfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (item) {
									return item && item.ControllinggroupFk ? item.ControllinggroupFk : null;
								},
								enableCache: true,
								columns: [{
									id: 'Code',
									field: 'Code',
									name: 'Code',
									formatter: 'code',
									name$tr$: 'cloud.common.entityCode'
								},
								{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								},
								{
									id: 'CommentText',
									field: 'CommentText',
									name: 'Comment',
									formatter: 'description',
									name$tr$: 'cloud.common.entityCommentText'
								}]
							})
						}
					};
				}

				var BaseService = platformUIStandardConfigService,
					controllingUnitGroupAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'ControllingUnitGroupDto',
						moduleSubModule: 'Controlling.Structure'
					});

				if (controllingUnitGroupAttributeDomains) {
					controllingUnitGroupAttributeDomains = controllingUnitGroupAttributeDomains.properties;
				}

				function GroupUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				GroupUIStandardService.prototype = Object.create(BaseService.prototype);
				GroupUIStandardService.prototype.constructor = GroupUIStandardService;

				return new GroupUIStandardService(createUnitGroupDetailLayout(), controllingUnitGroupAttributeDomains, controllingStructureTranslationService);
			}]);
})();
