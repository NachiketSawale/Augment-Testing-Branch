/* Created by wed on 2019.08.26 */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterObjectTemplate2TemplateCostGroupService', [
		'basicsCostGroupDataServiceFactory',
		'constructionSystemMasterObjectTemplate2TemplateDataService',
		function (basicsCostGroupDataServiceFactory,
			dataService) {

			return basicsCostGroupDataServiceFactory.createService('', dataService, {
				dataLookupType: 'ObjectTemplate2Template2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			});

		}]);
})(angular);