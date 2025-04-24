/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'documents.project';
	angular.module(moduleName).factory('documentProjectDocumentTranslationService',
		['platformUIBaseTranslationService',
			'documentProjectLayout',
			'documentsProjectDocumentRevisionDetailLayout',
			'documentProjectHistoryLayout',
			'documentProjectModelObjectLayout',
			function (PlatformUIBaseTranslationService,
				documentProjectLayout,
				documentRevisionDetailLayout,
				documentProjectHistoryLayout,
				documentProjectModelObjectLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				return new MyTranslationService([documentProjectLayout, documentRevisionDetailLayout, documentProjectHistoryLayout, documentProjectModelObjectLayout]);
			}

		]);

})(angular);