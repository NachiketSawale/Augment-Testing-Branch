/**
 * Created by lnt on 3/19/2018.
 */
(function () {
	'use strict';
	var modName = 'qto.main',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.factory('qtoMainStructureLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'qto.main.structure',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description', 'isreadonly', 'remark', 'date', 'qtosheetstatusfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						Description: {location: modName, identifier: 'qtoDetailPageNumber', initial: 'Page Number'},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						From: {location: modName, identifier: 'from', initial: 'From'},
						To: {location: modName, identifier: 'to', initial: 'To'},
						Date: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'}
					}
				},
				'overloads': {
					'description': {
						regex:'^[0-9]{0,5}$',
						mandatory: true,
						bulkSupport: false
					},
					'remark': {
						'mandatory': true,
						maxLength: 252
					},
					'Date': {
						'mandatory': true
					},
					'qtosheetstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.qtosheetstatus', null, {
						showIcon: true
					})
				}
			};
		}]);

	mod.factory('qtoMainStructureUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainStructureLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoSheetDto',
					moduleSubModule: 'Qto.Main'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
