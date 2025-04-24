/**
 * Created by chi on 7/3/2019s.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerEvaluationClerkEmptyController', businessPartnerEvaluationClerkGridController);

	businessPartnerEvaluationClerkGridController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'businessPartnerMainEvaluationClerkType'
	];

	function businessPartnerEvaluationClerkGridController(
		$scope,
		_,
		platformGridControllerService,
		businessPartnerMainEvaluationClerkType
	) {
		$scope.setTools = function (tools) {
			tools.update = function () {
				tools.version += 1;
			};
			tools.refreshVersion = Math.random();
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			$scope.tools = tools;
		};

		var isEvalGrpOrSubGrpClerkOn = $scope.options.isEvalGrpOrSubGrpClerkOn;
		var updateClerkGrid = tryGetUpdateGridFunc();
		var dataService = tryGetService($scope.options.serviceName);
		var additionalTools = [
			{
				id: 'isEvaluation',
				caption: 'Is Evaluation Group/Sub Group Clerk On',
				caption$tr$: 'businesspartner.main.screenEvaluationClerkDataOnOffButtonText',
				type: 'check',
				value: isEvalGrpOrSubGrpClerkOn,
				iconClass: 'control-icons ico-active',
				fn: function () {
					isEvalGrpOrSubGrpClerkOn = !isEvalGrpOrSubGrpClerkOn;
					updateClerkGrid(isEvalGrpOrSubGrpClerkOn, null, true);
				}
			}];

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: additionalTools
		});

		dataService.permissionUpdated.register(onPermissionUpdated);
		dataService.evaluationSchemaChanged.register(onEvaluationSchemaChanged);

		if (angular.isFunction(dataService.setNewEmptyScope)) {
			dataService.setNewEmptyScope($scope);
		}
		$scope.$on('$destroy', function () {
			dataService.permissionUpdated.unregister(onPermissionUpdated);
			dataService.evaluationSchemaChanged.unregister(onEvaluationSchemaChanged);
		});

		$scope.unregisterMessengers = unregisterMessengers;

		// ////////////////////////
		function tryGetService(targetServiceName) {
			var dataService = null, parentScope = $scope.$parent;
			while (parentScope && dataService === null) {
				if (parentScope[targetServiceName]) {
					dataService = parentScope[targetServiceName];
				}
				parentScope = parentScope.$parent;
			}
			return dataService;
		}

		function tryGetUpdateGridFunc() {
			var func = null;
			var parentScope = $scope.$parent;
			while (parentScope && !angular.isFunction(parentScope.updateClerkGrid)) {
				parentScope = parentScope.$parent;
			}

			func = parentScope.updateClerkGrid;

			if (!func) {
				throw new Error('Function updateClerkGrid is not defined.');
			}

			return func;
		}

		function onPermissionUpdated(e, args) {
			var clerkTypeArg = args.clerkType;
			if ((isEvalGrpOrSubGrpClerkOn &&
					(clerkTypeArg === businessPartnerMainEvaluationClerkType.GROUP ||
						clerkTypeArg === businessPartnerMainEvaluationClerkType.SUBGROUP)) ||
				(!isEvalGrpOrSubGrpClerkOn &&
					clerkTypeArg === businessPartnerMainEvaluationClerkType.EVAL)) {
				updateClerkGrid(isEvalGrpOrSubGrpClerkOn, clerkTypeArg);
			}
		}

		function onEvaluationSchemaChanged(e, args) {
			isEvalGrpOrSubGrpClerkOn = false;
			onPermissionUpdated(e, args);
		}

		function unregisterMessengers() {
			dataService.permissionUpdated.unregister(onPermissionUpdated);
			dataService.evaluationSchemaChanged.unregister(onEvaluationSchemaChanged);
		}
	}
})(angular);