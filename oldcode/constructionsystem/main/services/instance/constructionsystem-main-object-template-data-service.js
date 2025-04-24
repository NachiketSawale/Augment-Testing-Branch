/**
 * Created by lvy on 6/12/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectTemplateDataService
	 * @function
	 * @requires Data service for Object template
	 *
	 * @description
	 * #
	 *  data service for constuctionsystem main object template grid/form controller.
	 * */
	angular.module(moduleName).factory('constructionSystemMainObjectTemplateDataService', [
		'constructionSystemMainInstanceService',
		'cosMainObjectTemplateDataServiceFactory',
		function (parentService,
			cosMainObjectTemplateDataServiceFactory) {

			var service = cosMainObjectTemplateDataServiceFactory.getService(parentService);

			return service;
		}]);
})(angular);