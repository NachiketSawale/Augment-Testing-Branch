/**
 * Created by gvj on 08.10.2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialNeutralMaterialAiTranslationService',
		['platformUIBaseTranslationService','$q','materialNeutralMaterialAiMappingLayout',

			function (PlatformUIBaseTranslationService,$q,materialNeutralMaterialAiMappingLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				var service = new MyTranslationService(
					[materialNeutralMaterialAiMappingLayout]
				);

				//for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);
