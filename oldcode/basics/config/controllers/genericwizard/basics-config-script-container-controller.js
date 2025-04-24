(function (angular) {

	'use strict';

	var moduleName = 'basics.config';
	angular.module(moduleName).controller('basicsConfigScriptContainerController', BasicsConfigScriptContainerController);

	BasicsConfigScriptContainerController.$inject = ['$scope', 'basicsConfigGenWizardScriptDataService', '_', 'basicsLookupDataContainerListService', '$injector', 'basicsLookupDataPropertyListService', '$rootScope', 'basicsConfigMainService', 'basicsConfigGenWizardStepDataService'];

	function BasicsConfigScriptContainerController($scope, scriptDataService, _, lookupDataContainerListService, $injector, propertyListService, $rootScope, basicsConfigMainService, stepDataService) {
		$scope.script = '';

		var unwatch = _.noop;

		scriptDataService.registerSelectionChanged(setUp);

		function setUp() {
			unwatch();
			var selected = scriptDataService.getSelected();
			if (selected) {
				$scope.options = {readOnly: false, hintOptions: {globalScope: {}}};
				$scope.script = selected.ScriptAction ? selected.ScriptAction : '';
				unwatch = $scope.$watch('script', function watchChange(newVal, oldVal) {
					if (newVal !== oldVal && newVal) {
						selected.ScriptAction = newVal;
						scriptDataService.markCurrentItemAsModified();
					}
				});
				prepareScript();
			}
			else {
				$scope.script = '';
				$scope.options = {readOnly: true, hintOptions: {globalScope: null}};
			}
		}

		function prepareGlobalScope(dataServiceName, ctnUuid) {
			var globalScope = $scope.options.hintOptions.globalScope;
			var serviceInstance = $injector.get(dataServiceName);
			globalScope[dataServiceName] = serviceInstance;
			globalScope.startWorkflow = function (workflowId, entityId) {
				var workFlowService = $injector.get('basicsWorkflowInstanceService');
				workFlowService.startWorkflow(workflowId, entityId);
			};
			if (!globalScope[serviceInstance.getItemName()]) {
				var entity = globalScope[serviceInstance.getItemName()] = {};
				propertyListService.getList(ctnUuid).then(function (propList) {
					// build a mock entity
					_.each(propList, function (prop) {
						entity[prop.model || prop.field] = null;
					});
				});
			}
		}

		function prepareScript() {
			var stepId = stepDataService.getSelected().Id;
			propertyListService.getAllContainerFromStep(stepId).then(function (containerList) {
				_.each(containerList, function (ctn) {
					var dataServiceName = lookupDataContainerListService.getDataServiceNameFromContainer(ctn);
					if(dataServiceName){
						prepareGlobalScope(dataServiceName, ctn.ContainerUuid);
					}
				});
			});
		}

		// close the grid-editors to avoid a bug when calling markItemAsModified
		$scope.closeEditors = function () {
			$rootScope.$emit('updateRequested', true);
		};

		$scope.$on('$destroy', function () {
			if (angular.isFunction(unwatch)) {
				unwatch();
			}
			scriptDataService.unregisterSelectionChanged(setUp);
		});

		setUp();
	}
})(angular);