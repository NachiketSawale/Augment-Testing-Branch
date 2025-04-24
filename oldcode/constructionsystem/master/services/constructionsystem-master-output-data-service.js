/**
 * Created by wui on 12/24/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterOutputDataService', [
		'constructionSystemCommonOutputDataService',
		function (commonOutputDataService) {


			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'constructionsystemMasterScriptDataService',
				entitySelection: {}
			};

			return commonOutputDataService.getService(serviceOption);
		}
	]);

})(angular);