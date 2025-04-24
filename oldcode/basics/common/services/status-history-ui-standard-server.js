(function (angular) {
	'use strict';
	var modName = 'basics.common';
	angular.module(modName).factory('basicsCommonStatusHistoryLayout', [
		function () {
			return {
				'fid': 'status.history',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['statusoldfk', 'statusnewfk', 'remark']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					'statusoldfk': {
						'readonly': true,
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': '',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'platformStatusIconService'
							}
						}
					}, 'statusnewfk': {
						'readonly': true,
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': '',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'platformStatusIconService'
							}
						}
					}, 'remark': {
						'readonly': true,
					}
				},
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						StatusOldFk: {
							location: modName, identifier: 'entityStatusOldFk', initial: 'From'
						}, StatusNewFk: {
							location: modName, identifier: 'entityStatusNewFk', initial: 'To'
						}, Remark: {
							location: modName, identifier: 'entityRemark', initial: 'Remark'
						}
					}
				},
			};

		}]);

	angular.module(modName).factory('basicsCommonStatusHistoryUIStandardService',
		['platformUIStandardConfigService', 'basicsCommonStatusHistoryLayout', 'platformSchemaService', 'basicsCommonStatusHistoryTranslationService',
			function (platformUIStandardConfigService, layout, platformSchemaService, translationService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'StatusHistoryDto',
					moduleSubModule: 'Basics.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})(angular);
