/**
 * Created by joshi on 24.10.2016.
 */
(function (angular) {
	'use strict';

	angular.module('project.structures').factory('projectStructuresCommonUIService', ['platformUIStandardConfigService', 'projectMainTranslationService', 'platformSchemaService',
		function (platformUIStandardConfigService, projectMainTranslationService, platformSchemaService) {

			function createUiService(info) {
				function getDetailLayout() {
					return {
						'fid': 'project.structures.sortcodes.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {

							'descriptioninfo': {
								'detail': {
									maxLength: 255
								},
								'grid': {
									maxLength: 255
								}
							}
						}
					};
				}

				var schema = platformSchemaService.getSchemaFromCache( /*{ typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'}*/
					{typeName: info.typeName, moduleSubModule: 'Project.Structures'});
				if (schema) {
					schema = schema.properties;
				}

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					platformUIStandardConfigService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;
				var detailLayout = getDetailLayout();
				return new StructureUIStandardService(detailLayout, schema, projectMainTranslationService);
			}

			return {
				createUiService: createUiService
			};
		}
	]);
})(angular);
