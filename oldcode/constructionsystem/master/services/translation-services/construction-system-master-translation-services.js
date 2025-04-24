(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master',
		cloudCommonModule = 'cloud.common',
		procurementCommonModule = 'procurement.common',
		cloudDesktopModule = 'cloud.desktop',
		procurementPackage = 'procurement.package',
		boqMain = 'boq.main',
		estimateMain = 'estimate.main',
		schedulingMainModule = 'scheduling.main',
		ModelMainModule = 'Model.Main',
		CommonModuleName = 'constructionsystem.common',
		basicsCustomizeModule = 'basics.customize';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('constructionsystemMasterTranslationService',
		['platformUIBaseTranslationService',
			'constructionSystemMasterHeaderDetailLayout',
			'platformTranslateService',
			'constructionSystemMasterControllingGroupDetailLayout',
			'constructionSystemMasterActivityTemplateDetailLayout',
			'constructionSystemMasterParameterGroupDetailLayout',
			'constructionSystemMasterParameterValueDetailLayout',
			'constructionSystemMasterParameterDetailLayout',
			'constructionSystemMasterTestInputDetailLayout',
			'constructionSystemMasterAssemblyDetailLayout',
			'constructionSystemMasterWicDetailLayout',
			'constructionSystemMasterModelObjectDetailLayout',
			'constructionSystemMasterTestParameterInputDetailLayout',
			'constructionSystemMasterTemplateDetailLayout',
			'constructionSystemMasterParameter2TemplateDetailLayout',
			'constructionSystemMasterGroupDetailLayout',
			'constructionSystemMasterObjectTemplateDetailLayout',
			'constructionSystemMasterObjectTemplatePropertyDetailLayout',
			'constructionSystemMasterChgOptionDetailLayout',
			'constructionSystemMasterGlobalParameterDetailLayout',
			'$q',

			function (
				platformUIBaseTranslationService,
				constructionSystemMasterHeaderDetailLayout,
				platformTranslateService,
				constructionSystemMasterControllingGroupDetailLayout,
				constructionSystemMasterActivityTemplateDetailLayout,
				constructionSystemMasterParameterGroupDetailLayout,
				constructionSystemMasterParameterValueDetailLayout,
				constructionSystemMasterParameterDetailLayout,
				constructionSystemMasterTestInputDetailLayout,
				constructionSystemMasterAssemblyDetailLayout,
				constructionSystemMasterWicDetailLayout,
				constructionSystemMasterModelObjectDetailLayout,
				constructionSystemMasterTestParameterInputDetailLayout,
				constructionSystemMasterTemplateDetailLayout,
				constructionSystemMasterParameter2TemplateDetailLayout,
				constructionSystemMasterGroupDetailLayout,
				constructionSystemMasterObjectTemplateDetailLayout,
				constructionSystemMasterObjectTemplatePropertyDetailLayout,
				constructionSystemMasterChgOptionDetailLayout,
				constructionSystemMasterGlobalParameterDetailLayout,
				$q) {


				function TranslationService(layout) {
					platformUIBaseTranslationService.call(this, layout);
				}

				TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
				TranslationService.prototype.constructor = TranslationService;

				platformTranslateService.registerModule(
					[
						moduleName,
						cloudCommonModule,
						procurementCommonModule,
						cloudDesktopModule,
						schedulingMainModule,
						procurementPackage,
						boqMain,
						estimateMain,
						ModelMainModule,
						CommonModuleName,
						basicsCustomizeModule
					]);

				var service = new TranslationService(
					[
						constructionSystemMasterHeaderDetailLayout,
						constructionSystemMasterControllingGroupDetailLayout,
						constructionSystemMasterActivityTemplateDetailLayout,
						constructionSystemMasterParameterDetailLayout,
						constructionSystemMasterParameterGroupDetailLayout,
						constructionSystemMasterParameterValueDetailLayout,
						constructionSystemMasterTestInputDetailLayout,
						constructionSystemMasterAssemblyDetailLayout,
						constructionSystemMasterWicDetailLayout,
						constructionSystemMasterModelObjectDetailLayout,
						constructionSystemMasterTestParameterInputDetailLayout,
						constructionSystemMasterTemplateDetailLayout,
						constructionSystemMasterParameter2TemplateDetailLayout,
						constructionSystemMasterGroupDetailLayout,
						constructionSystemMasterObjectTemplateDetailLayout,
						constructionSystemMasterObjectTemplatePropertyDetailLayout,
						constructionSystemMasterChgOptionDetailLayout,
						constructionSystemMasterGlobalParameterDetailLayout
					]);
				// for container information service use   module container lookup
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};
				return service;
			}
		]);
})(angular);
