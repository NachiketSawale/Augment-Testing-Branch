
(function (angular) {

	'use strict';

	let moduleName = 'project.material';
	angular.module(moduleName).controller('projectMaterialPortionDetailController', ProjectMaterialPortionDetailController);

	ProjectMaterialPortionDetailController.$inject = ['$scope','platformContainerControllerService','projectMaterialPortionMainService'];
	function ProjectMaterialPortionDetailController($scope, platformContainerControllerService,dataService) {
		platformContainerControllerService.initController($scope, moduleName, '4a1245ec24f94aa9a8005db8618bfe2d','projectMaterialTranslationService');

		let oldDirty = $scope.formOptions.configure.dirty;
		$scope.formOptions.configure.dirty = function dirty(entity, field,options) {
			if (field === 'IsEstimatePrice' || field ==='IsDayWorkRate' || field ==='CostPerUnit' || field ==='CostCode'  || field ==='Quantity') {
				dataService.fieldChanged(field,entity);
				if (oldDirty) {
					oldDirty(entity, field, options);
				}
			}
		};
	}
})(angular);