(function () {
	'use strict';

	function startWfCtrl($scope, platformModuleStateService, basicsWorkflowInstanceService, basicsWorkflowModuleUtilService) {
		var state = platformModuleStateService.state('basics.workflow');
		if (state.selectedMainEntity.EntityId) {
			var entityInfo = _.find(state.workflowEntities.concat(state.workflowDataEntities), function (entity) {
				return entity.Id.toLowerCase() === state.selectedMainEntity.EntityId.toLowerCase();
			});

			entityInfo.IdPropertyNames = _.filter(entityInfo.IdPropertyNames, function (name) {
				return name !== 'Id';
			});

			entityInfo.IdPropertyNames.unshift('Id');
			$scope.entityInfo = entityInfo;
		}

		$scope.identification = {};

		$scope.$watch(function () {
			return $scope.identification;
		}, function (newVal) {
			state.startWorkflowInfo.identification = basicsWorkflowModuleUtilService.createIdentObjects($scope.entityInfo.IdPropertyNames, [newVal]);
		}, true);
	}

	startWfCtrl.$inject = ['$scope', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'basicsWorkflowModuleUtilService'];

	angular.module('basics.workflow').controller('basicsWorkflowStartWorkflowController', startWfCtrl);
})();
