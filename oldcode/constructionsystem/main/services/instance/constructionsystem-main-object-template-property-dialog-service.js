/**
 * Created by lvy on 3/13/2020.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	var moduleName = 'constructionsystem.main';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMainObjectTemplatePropertyDialogService', [
		'constructionSystemMainObjectTemplateDialogService',
		'cosMainObjectTemplatePropertyDataServiceFactory',
		function (
			parentService,
			cosMainObjectTemplatePropertyDataServiceFactory
		) {
			var service = cosMainObjectTemplatePropertyDataServiceFactory.getService(parentService);

			service.unloadSubEntities = function () {};

			return service;
		}
	]);
})(angular);