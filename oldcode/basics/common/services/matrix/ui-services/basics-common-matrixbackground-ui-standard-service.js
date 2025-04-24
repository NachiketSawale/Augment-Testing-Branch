(function () {
	'use strict';
	angular.module('basics.common').factory('basicsCommonMatrixBackgroundStandardService', ['platformUIStandardConfigService', 'basicsCommonMatrixTranslationService', 'basicsClerkAbsenceConfigurationValue', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsCommonMatrixTranslationService, basicsClerkAbsenceConfigurationValue, platformSchemaService) {

			function createGridConfig() {
				return {

					'fid': 'basics.common.matrixBackground',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['description', 'colour', 'isdisabled']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					]
				};
			}

			const BaseService = platformUIStandardConfigService;

			const basicsCommonMatrixBackground = platformSchemaService.getSchemaFromCache({
				typeName: 'MatrixBackgroundDto',
				moduleSubModule: 'Basics.Common'
			}).properties;
			return new BaseService(createGridConfig(), basicsCommonMatrixBackground, basicsCommonMatrixTranslationService);
		}
	]);
})();
