(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'documents.import';
	angular.module(moduleName).factory('documentsImportTranslationService',
		['$q', 'platformUIBaseTranslationService',
			'documentImportLayout',
			function ($q, PlatformUIBaseTranslationService,
				documentImportLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
					// for container information service use
					this.loadTranslations = function () {
						return $q.when(false);
					};
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				return new MyTranslationService([documentImportLayout]);
			}

		]);

})(angular);