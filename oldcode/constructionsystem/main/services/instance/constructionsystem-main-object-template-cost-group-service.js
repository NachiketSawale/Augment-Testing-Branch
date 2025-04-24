/* Created by wed on 2019.10.30 */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemMainObjectTemplateCostGroupService', [
		'basicsCostGroupDataServiceFactory',
		'constructionSystemMainObjectTemplateDataService',
		function (basicsCostGroupDataServiceFactory,
			dataService) {

			return basicsCostGroupDataServiceFactory.createService('', dataService, {
				dataLookupType: 'ObjectTemplate2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			});

		}]);
})(angular);