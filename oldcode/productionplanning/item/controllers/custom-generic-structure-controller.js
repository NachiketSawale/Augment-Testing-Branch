/**
 * Created by zwz on 7/4/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	/**
	 * @ngdoc controller
	 * @name customGenericStructureController
	 * @function
	 *
	 * @description
	 * customGenericStructureController for structure-filter feature of PPS Item module
	 **/
	angular.module(moduleName).controller('customGenericStructureController', StructureController);

	StructureController.$inject = ['$controller', '$scope', 'platformGenericStructureService'];
	function StructureController ($controller, $scope, platformGenericStructureService) {
		var controller = $controller('platformGenericStructureController', {'$scope': $scope});
		_.each($scope.tools.items,function (item) {
			if (item.id === 't11'){
				// "override" button refresh's fn, for providing extra parameter furtherFilters, this parameter will be use in function ThisFilterExtensionCallback() of server side
				item.fn = function () {
					var furtherFilters = [];
					_.each($scope.state,function (item) {
						var filter = {Token:item.id,Value: item.grouping};
						if(item.metadata){
							filter.Value = item.metadata.groupFieldMapping.description;
							// remark: For dynamic columns like 'event_type_slot_%' or 'clerk_role_slot_%', we need to use groupFieldMapping.description for grouping filter in server side.
							// And if we need to support dynamic columns like 'clerk_role_slot_%' in the future, here we need to update the code.Maybe for dynamic columns like 'clerk_role_slot_%', them don't use metadata.groupFieldMapping.description as filter. (by zwz 2019/07/09)
						}
						furtherFilters.push(filter);
					});
					var dataServ = platformGenericStructureService.dataService;
					dataServ.setFurtherFilters(furtherFilters);

					platformGenericStructureService.executeRequest($scope.state, $scope.getContainerUUID())
						.then(function (data) {
							$scope.containerItems = data;
						});
				};
			}
		});

		return controller;
	}
})(angular);