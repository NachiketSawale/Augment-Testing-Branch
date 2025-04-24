/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterDefaultAdaptorService', [
		'basicsCostGroupFilterCatalogFilterTypes',
		function (catalogFilterTypes) {

			function createAdaptor() {
				return {
					getMainService: function () {
						return null;
					},
					getShowTagStatus: function () {
						return false;
					},
					getCatalogExpandStatus: function () {
						return true;
					},
					getConfigModuleType: function () {
						return catalogFilterTypes.moduleType.UNDEFINED;
					},
					getConfigModuleName: function () {
						return catalogFilterTypes.moduleName.UNDEFINED;
					},
					getDragDropService: function () {
						return undefined;
					},
					getProject: function () {
						return null;
					},
					onCostGroupFilterChanged: function (checkedItems) {
						return checkedItems;
					},
					onCheckedTagChanged: function (checkedTags) {
						return checkedTags;
					},
					onControllerCreated: function (/*scope, serviceContainer*/) {

					},
					onControllerDestroyed: function (/*scope, serviceContainer*/) {

					}
				};
			}

			return {
				createAdaptor: createAdaptor
			};

		}]);

})(angular);