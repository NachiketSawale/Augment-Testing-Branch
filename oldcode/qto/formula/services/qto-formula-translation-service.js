(function (angular) {
	'use strict';
	angular.module('qto.formula').factory('qtoFormulaTranslationService', ['platformUIBaseTranslationService',
		'qtoFormulaDataLayout', 'qtoFormulaUomLayout', 'qtoFormulaCommentDataLayout', 'qtoFormulaValidationScriptTranslationLayout',
		function (PlatformUIBaseTranslationService, qtoFormulaDataLayout, qtoFormulaUomLayout, commentDataLayout, qtoFormulaValidationScriptTranslationLayout) {
			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			return new MyTranslationService([qtoFormulaDataLayout, qtoFormulaUomLayout, commentDataLayout, qtoFormulaValidationScriptTranslationLayout]);
		}
	]);
})(angular);