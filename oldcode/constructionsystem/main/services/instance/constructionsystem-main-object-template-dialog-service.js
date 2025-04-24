/**
 * Created by lvy on 3/13/2020.
 */
(function (angular) {
	'use strict';

	/* global _ */
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
	angular.module(moduleName).factory('constructionSystemMainObjectTemplateDialogService', [
		'constructionSystemMainInstanceService',
		'cosMainObjectTemplateDataServiceFactory',
		function (parentService,
			cosMainObjectTemplateDataServiceFactory) {

			var service = cosMainObjectTemplateDataServiceFactory.getService(parentService, false);
			var data = service.getServiceContainerData();
			service.addUsingContainer = function(guid) {
				var needLoad = false;

				if (needLoad || !_.find(data.usingContainer, function (id) {
					return id !== guid;
				})) {
					data.usingContainer.push(guid);
				}

				if (needLoad && !data.selectedItem && !data.isRoot && data.loadSubItemList) {
					data.loadSubItemList();
				}

				if (data.translateEntity) {
					data.translateEntity(data);
				}
			};

			service.clearSelection = function() {
				data.selectedItem = null;
			};

			service.unloadSubEntities = function () {};

			return service;
		}]);
})(angular);