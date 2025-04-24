/**
 * Created by lvy on 6/13/2018.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	var moduleName = 'constructionsystem.main';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMainObjectTemplatePropertyDataService', [
		'constructionSystemMainObjectTemplateDataService',
		'cosMainObjectTemplatePropertyDataServiceFactory',
		function (
			parentService,
			cosMainObjectTemplatePropertyDataServiceFactory
		) {
			var service = cosMainObjectTemplatePropertyDataServiceFactory.getService(parentService);

			return service;
		}
	]);
})(angular);