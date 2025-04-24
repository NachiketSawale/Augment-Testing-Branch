/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var hsqeCheckListModule = 'hsqe.checklist';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var modelWdeViewerModule = 'model.wdeviewer';
	var prcStructureModule = 'basics.procurementstructure';
	var prcCommonModule = 'procurement.common';
	var basicsUserFormModule = 'basics.userform';
	var modelAnnotationModule = 'model.annotation';
	var basicsMeetingModule = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(hsqeCheckListModule).factory('hsqeCheckListTranslationService', ['platformUIBaseTranslationService', '$q', 'hsqeCheckListLayout',
		'hsqeCheckList2LocationLayout','hsqeCheckList2ActivityLayout','hsqeCheckListFormLayout','hsqeCheckListModelObjectLayout','hsqeCheckListGroupTemplateLayout','hsqeCheckListDocumentLayout',
		'modelViewerTranslationModules',

		function hsqeCheckListTranslationService(PlatformUIBaseTranslationService, $q, hsqeCheckListLayout,hsqeCheckList2LocationLayout,
			hsqeCheckList2ActivityLayout, hsqeCheckListFormLayout, hsqeCheckListModelObjectLayout, hsqeCheckListGroupTemplateLayout, hsqeCheckListDocumentLayout,
			modelViewerTranslationModules) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					{translationInfos:{extraModules:[hsqeCheckListModule, basicsCommonModule, cloudCommonModule, prcStructureModule,
						modelWdeViewerModule, prcCommonModule, basicsUserFormModule, modelAnnotationModule, basicsMeetingModule].concat(modelViewerTranslationModules)}},
					hsqeCheckListLayout,
					hsqeCheckList2LocationLayout,
					hsqeCheckList2ActivityLayout,
					hsqeCheckListFormLayout,
					hsqeCheckListModelObjectLayout,
					hsqeCheckListGroupTemplateLayout,
					hsqeCheckListDocumentLayout
				]
			);

			// for container information service use
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}]);
})(angular);
