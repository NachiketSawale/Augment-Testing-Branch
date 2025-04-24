/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'hsqe.checklisttemplate';
	var prcCommonModule = 'procurement.common';
	var hsqeCheckListModule = 'hsqe.checklist';

	angular.module(moduleName).factory('hsqeCheckListTemplateTranslationService', ['platformUIBaseTranslationService', 'hsqeCheckListTemplateLayout','hsqeCheckListGroupLayout','hsqeCheckListTemplate2FormLayout',

		function (PlatformUIBaseTranslationService, hsqeCheckListTemplateLayout,hsqeCheckListGroupLayout,hsqeCheckListTemplate2FormLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			return new MyTranslationService(
				[
					{translationInfos:{extraModules:[moduleName, prcCommonModule, hsqeCheckListModule]}},
					hsqeCheckListGroupLayout,
					hsqeCheckListTemplateLayout,
					hsqeCheckListTemplate2FormLayout
				]
			);
		}
	]);
})(angular);
