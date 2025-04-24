
(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListModelAnnoObjectLinkDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListModelAnnoObjectLinkDataService', ['_', 'hsqeCheckListDataService',
		'modelAnnotationObjectLinkDataServiceFactory',
		function (_, dataService, modelAnnotationObjectLinkDataServiceFactory) {
			return modelAnnotationObjectLinkDataServiceFactory.createService({
				moduleName: moduleName,
				serviceName: 'hsqeCheckListModelAnnoObjectLinkDataService',
				parentService: dataService,
				getParentIdComponents: item => [item.Id],
				typeId: 'hsqe.checklist',
				getProjectIdFromParent: item => item.PrjProjectFk
			});
		}]);

})(angular);
