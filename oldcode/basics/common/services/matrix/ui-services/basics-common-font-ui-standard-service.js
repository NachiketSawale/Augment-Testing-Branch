(function () {
	'use strict';
	angular.module('basics.common').factory('basicsCommonFontStandardService', ['platformUIStandardConfigService', 'basicsCommonMatrixTranslationService', 'basicsClerkAbsenceConfigurationValue', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsCommonMatrixTranslationService, basicsClerkAbsenceConfigurationValue, platformSchemaService) {

			function createGridConfig() {
				return {
					'fid': 'basics.common.matrixFont',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['description', 'isbold', 'isitalic', 'isunderlined', 'isstriked', 'colour', 'isdisabled']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					]
				};
			}

			const BaseService = platformUIStandardConfigService;

			const basicsCommonFont = platformSchemaService.getSchemaFromCache({
				typeName: 'MatrixFontDto',
				moduleSubModule: 'Basics.Common'
			}).properties;
			return new BaseService(createGridConfig(), basicsCommonFont, basicsCommonMatrixTranslationService);
		}
	]);
})();
