(function () {
	'use strict';

	function startDebugWfCtrl($scope, platformModuleStateService, basicsWorkflowInstanceService, basicsWorkflowModuleUtilService) {
		let state = platformModuleStateService.state('basics.workflow');
		let lsList = basicsWorkflowInstanceService.task.list['workflow-test-data-list'];

		$scope.entityId = state.debugInfo.entityId;

		if (!lsList) {
			lsList = [];
		}

		let entityList = [];
		if (state.debugInfo.template.EntityId) {
			let entityInfo = _.find(state.workflowEntities.concat(state.workflowDataEntities), function (entity) {
				return entity.Id.toLowerCase() === state.debugInfo.template.EntityId.toLowerCase();
			});

			entityInfo.IdPropertyNames = _.filter(entityInfo.IdPropertyNames, function (name) {
				return name !== 'Id';
			});

			entityInfo.IdPropertyNames.unshift('Id');

			$scope.entityInfo = entityInfo;
			entityList = lsList.filter(item => item.EntityId === entityInfo.Id);
		}


		$scope.entityOptions = {
			items: entityList,
			displayMember: 'Description',
			valueMember: 'EntityId'
		};

		$scope.identification = {};

		$scope.$watch(function () {
			return $scope.entityId;
		}, function (newVal) {

			let selectedItem = lsList.filter(item => item.EntityId === newVal)[0];
			state.debugInfo.identification = [];

			if (selectedItem !== undefined) {

				$scope.identification.Id = selectedItem.Id;
				let identificationObj = { Id: selectedItem.Id };

				if (selectedItem.SelectedObj !== null) {
					selectedItem.SelectedObj.Props.forEach(prop => {
						$scope.identification[prop.PropName] = prop.Value;
						identificationObj[prop.IdentName] = prop.Value;
					});
				}
				state.debugInfo.identification.push(identificationObj);
			}
		}, true);

		$scope.$watch(function () {
			return $scope.identification;
		}, function (newVal) {
			state.debugInfo.identification = basicsWorkflowModuleUtilService.createIdentObjects($scope.entityInfo.IdPropertyNames, [newVal]);
		}, true);
	}

	startDebugWfCtrl.$inject = ['$scope', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'basicsWorkflowModuleUtilService'];

	angular.module('basics.workflow').controller('basicsWorkflowStartDebugWorkflowController', startDebugWfCtrl);
})();
