(function (angular) {
	'use strict';
	angular.module('qto.formula').factory('qtoFormulaValidationScriptTranslationReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'platformRuntimeDataService',
			function (commonReadOnlyProcessor, platformRuntimeDataService) {
				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'qtoFormulaValidationScriptTranslationUIStandardService'
				});

				service.processItem = function processItem(item) {
					// Hard Code translation is readonly which is insered by vanilla.data script
					if(item.Id <= 26){
						platformRuntimeDataService.readonly(item, [
							{field: 'Code', readonly: true},
							{field: 'ValidationText', readonly: true}
						]);
					}
				};

				return service;
			}]);
})(angular);