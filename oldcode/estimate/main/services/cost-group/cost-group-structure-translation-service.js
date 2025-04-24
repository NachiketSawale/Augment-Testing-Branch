/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName =  'estimate.main';

	/**
     * @ngdoc service
     * @name
     * @description provides translation for this module
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('costGroupStructureTranslationService',
		['platformUIBaseTranslationService', 'costGroupStructureLayoutServiceFactory',
			function (platformUIBaseTranslationService, costGroupStructureLayoutServiceFactory) {

				let layouts = [costGroupStructureLayoutServiceFactory.getLayoutForTranslation()];
				let localBuffer = {};
				platformUIBaseTranslationService.call(this, layouts, localBuffer);

			}
		]);

})(angular);
