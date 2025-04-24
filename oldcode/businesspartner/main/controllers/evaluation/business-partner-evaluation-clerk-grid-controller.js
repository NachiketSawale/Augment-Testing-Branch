/**
 * Created by chi on 9/21/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerEvaluationClerkGridController', businessPartnerEvaluationClerkGridController);

	businessPartnerEvaluationClerkGridController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'businessPartnerMainEvaluationClerkType',
		'businessPartnerMainEvaluationPermissionDescriptor',
		'basicsPermissionServiceFactory',
		'platformGridAPI'
	];

	function businessPartnerEvaluationClerkGridController(
		$scope,
		_,
		platformGridControllerService,
		businessPartnerMainEvaluationClerkType,
		businessPartnerMainEvaluationPermissionDescriptor,
		basicsPermissionServiceFactory,
		platformGridAPI
	) {
		let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');

		$scope.getContainerUUID = function () {
			return $scope.options.containerUUID;
		};

		$scope.setTools = function (tools) {
			tools.update = function () {
				tools.version += 1;
			};
			tools.refreshVersion = Math.random();
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			// remove btn 'grid setting'.
			var gridSetBtnIndex = tools.items.indexOf(_.find(tools.items, {id: 't200'}));
			if (gridSetBtnIndex !== -1) {
				tools.items.splice(gridSetBtnIndex, 1);
			}
			$scope.tools = tools;
		};

		var isEvalGrpOrSubGrpClerkOn = $scope.options.isEvalGrpOrSubGrpClerkOn;
		var updateClerkGrid = tryGetUpdateGridFunc();
		var dataService = tryGetService($scope.options.serviceName);
		var validationService = tryGetService($scope.options.validationName);
		var configService = tryGetService($scope.options.uiStandardName);
		var permission = businessPartnerMainEvaluationPermissionDescriptor.getPermission($scope.options.permissionName);
		var hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
		var hasDelete = businessPartnerMainEvaluationPermissionService.hasDelete(permission);
		var hasCreate = businessPartnerMainEvaluationPermissionService.hasCreate(permission);
		dataService.hasWrite = hasWrite;

		if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
			platformGridAPI.grids.unregister($scope.getContainerUUID());
		}

		if (!angular.isFunction($scope.removeToolByClass)) {
			$scope.removeToolByClass = removeToolByClass;
		}

		platformGridControllerService.initListController($scope, configService, dataService, validationService, {
			initCalled: false,
			columns: [],
			skipPermissionCheck: true
		});

		// var parentService = dataService.parentService();
		// var hasWriteFromHierarchy = parentService.getHasWriteFromHierarchy();

		var additionalTools = [
			{
				id: 'paste',
				caption: 'Paste',
				caption$tr$: 'cloud.common.toolbarPaste',
				type: 'item',
				iconClass: 'tlb-icons ico-copy-paste',
				disabled: function () {
					return !dataService.canPaste();
				},
				fn: function () {
					dataService.paste();
				}
			},
			{
				id: 'copy',
				caption: 'Copy',
				caption$tr$: 'cloud.common.toolbarCopy',
				type: 'item',
				iconClass: 'tlb-icons ico-copy',
				disabled: function () {
					return !dataService.canCopy();
				},
				fn: function () {
					dataService.copy(dataService.getSelectedEntities());
				}
			},
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

		_.forEach(additionalTools, function (tool) {
			$scope.tools.items.unshift(tool);
		});

		var createBtnIdx = null;
		var pasteBtnIdx = null;
		if (!hasCreate) {
			createBtnIdx = _.findIndex($scope.tools.items, function (item) {
				return item.id === 'create';
			});
			$scope.tools.items.splice(createBtnIdx, 1);

			pasteBtnIdx = _.findIndex($scope.tools.items, function (item) {
				return item.id === 'paste';
			});
			$scope.tools.items.splice(pasteBtnIdx, 1);
		} // else if (!hasWriteFromHierarchy) {

		// }

		if (!hasDelete) {

			var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
				return item.id === 'delete';
			});
			$scope.tools.items.splice(deleteBtnIdx, 1);
		}

		dataService.permissionUpdated.register(onPermissionUpdated);
		dataService.evaluationSchemaChanged.register(onEvaluationSchemaChanged);

		if (angular.isFunction(dataService.setNewClerkScope)) {
			dataService.setNewClerkScope($scope);
		}
		$scope.$on('$destroy', function () {
			if ((angular.isDefined($scope.isUpdateGrid) && !$scope.isUpdateGrid) || angular.isUndefined($scope.isUpdateGrid)) {
				dataService.clearAllData();
			} else {
				dataService.deselect();
			}
			dataService.permissionUpdated.unregister(onPermissionUpdated);
			dataService.evaluationSchemaChanged.unregister(onEvaluationSchemaChanged);
			if (angular.isFunction(dataService.setNewClerkScope)) {
				dataService.setNewClerkScope(null);
			}
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

		function removeToolByClass(cssClassArray) {
			if (!$scope.tools) {
				return;
			}

			$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
				return findByClass(toolItem, cssClassArray);
			});
			$scope.tools.update();
		}

		function findByClass(toolItem, cssClassArray) {
			var notFound = true;
			_.each(cssClassArray, function (CssClass) {
				if (CssClass === toolItem.iconClass) {
					notFound = false;
				}
			});
			return notFound;
		}

		function unregisterMessengers() {
			dataService.permissionUpdated.unregister(onPermissionUpdated);
			dataService.evaluationSchemaChanged.unregister(onEvaluationSchemaChanged);
		}
	}
})(angular);