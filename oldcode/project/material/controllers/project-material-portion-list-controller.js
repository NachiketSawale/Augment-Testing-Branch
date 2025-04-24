
(function (angular) {
	'use strict';

	let moduleName = 'project.material';

	angular.module(moduleName).controller('projectMaterialPortionListController', ProjectMaterialPortionListController);

	ProjectMaterialPortionListController.$inject = ['$scope','_', '$injector', 'projectMaterialPortionMainService', 'platformContainerControllerService'];
	function ProjectMaterialPortionListController($scope, _, $injector, projectMaterialPortionMainService, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'def9a05422154aeba42939052f280a1a');


		$scope.tools.items = _.filter($scope.tools.items,function (d) {
			return d.id !=='delete' && d.id !=='t14';
		});

		$scope.setTools = function (tools) {
			$scope.tools.items = _.filter(tools.items,function (d) {
				return d.id !=='delete' && d.id !=='t14';
			});

			tools.update = function () {
				tools.version += 1;
			};
			$scope.tools.update();
		};

		$scope.tools.update();

		// un-register on destroy
		$scope.$on('$destroy', function () {
		});
	}
})(angular);
