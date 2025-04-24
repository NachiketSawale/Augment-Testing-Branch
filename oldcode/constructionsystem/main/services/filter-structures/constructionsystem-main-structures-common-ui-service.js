/**
 * Created by xsi on 2016-10-08.
 */
(function () {

	'use strict';
	var moduleName = 'constructionsystem.main';
	/* jslint nomen:true */
	// eslint-disable-next-line no-redeclare
	/* global angular, _ */

	angular.module(moduleName).factory('constructionSystemMainStructuresCommonUIService', ['platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'estimateMainTranslationService',
		function (platformUIStandardConfigService, basicsLookupdataConfigGenerator, estimateMainTranslationService) {

			function createUiService(attributes, filterInfos) {

				var schemaMap = {
						'Id': {'domain': 'integer', 'mandatory': true},
						'Code': {'domain': 'code', 'mandatory': true, 'maxlen': 16},
						'Description': {'type': 'string'},
						'DescriptionInfo': {'domain': 'translation'},
						'BriefInfo': {'domain': 'translation'},
						'BasUomFk': {'type': 'integer'},
						'UomFk': {'type': 'integer'},
						'UoMFk': {'type': 'integer'},
						'QuantityUoMFk': {'type': 'integer'},
						'Quantity': {'domain': 'quantity'},
						'Reference': {'type': 'string'},
						'TotalOf': {'type': 'string'},
						'Total': {'domain': 'money'},
						'CurUoM': {'type': 'string'},
						'Param': {'domain': 'imageselect'},
						'Estimate': {'type': 'string'},
						'UoM': {'type': 'string'},
						'Currency': {'type': 'string'}
					},
					basLayout = {
						'fid': 'estimate.main.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
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

						if(lItem === 'param') {
							detailLayout.overloads[lItem] = {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										'directive': 'construction-system-main-param-complex-lookup',
										lookupOptions: {
											'showClearButton': true,
											'showEditButton': false
										}
									},
									formatter: 'imageselect',
									formatterOptions: {
										dataServiceName: 'constructionSystemMainParameterFormatterService',
										dataServiceMethod: 'getItemByParamAsync',
										itemServiceName:filterInfos.serviceName,
										itemName: filterInfos.itemName,
										serviceName: 'constructionSystemMainParameterFormatterService',
										RootServices : filterInfos.RootServices
									}
								}
							};
						}
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

				return new StructureUIStandardService(detailLayout, schema, estimateMainTranslationService);
			}

			return {
				createUiService: createUiService
			};
		}
	]);
})();