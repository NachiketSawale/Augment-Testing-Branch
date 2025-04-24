/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//noinspection JSAnnotator
	angular.module('model.main').factory('modelMainCommonUIService', ['_', 'platformUIStandardConfigService',
		'basicsLookupdataConfigGenerator', 'modelMainTranslationService',
		function (_, platformUIStandardConfigService, basicsLookupdataConfigGenerator, modelMainTranslationService) {

			function createUiService(attributes) {

				var schemaMap = {
						'Id': {'domain': 'integer', 'mandatory': true},
						'Code': {'domain': 'code', 'mandatory': true, 'maxlen': 16},
						'Description': {'domain': 'translation'},
						'DescriptionInfo': {'domain': 'translation'},
						'UomFk': {'type': 'integer'},
						'UoMFk': {'type': 'integer'},
						'Quantity': {'domain': 'quantity'}
					},
					basLayout = {
						'fid': 'model.main.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': []
							}
						],
						'overloads': {}
					},

					detailLayout = angular.copy(basLayout),
					schema = {};

				if (angular.isDefined(attributes) && angular.isArray(attributes)) {
					_.forEach(attributes, function (item) {
						var lItem = item.toLowerCase();
						detailLayout.groups[0].attributes.push(lItem);
						detailLayout.overloads[lItem] = {'readonly': true};

						if (lItem.indexOf('uomfk') >= 0) {
							// angular.extend(detailLayout.overloads[lItem], basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.uom', 'Uom'));
							angular.extend(detailLayout.overloads[lItem], basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true }));
						}
						schema[item] = schemaMap[item];
					});
				}

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					platformUIStandardConfigService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				return new StructureUIStandardService(detailLayout, schema, modelMainTranslationService);
			}

			return {
				createUiService: createUiService
			};
		}
	]);
})(angular);
