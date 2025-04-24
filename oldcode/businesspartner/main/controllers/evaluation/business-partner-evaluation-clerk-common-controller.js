/**
 * Created by chi on 5/13/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainEvaluationClerkCommonController', businessPartnerMainEvaluationClerkCommonController);

	businessPartnerMainEvaluationClerkCommonController.$inject = [
		'$scope',
		'$rootScope',
		'businessPartnerMainEvaluationClerkType',
		'basicsPermissionServiceFactory',
		'busiessPartnerMainEvaluationDynamicGridOption',
		'businessPartnerMainEvaluationClerkCopyPasteService',
		'businessPartnerMainEvaluationPermissionDescriptor'
	];

	function businessPartnerMainEvaluationClerkCommonController(
		$scope,
		$rootScope,
		businessPartnerMainEvaluationClerkType,
		basicsPermissionServiceFactory,
		busiessPartnerMainEvaluationDynamicGridOption,
		businessPartnerMainEvaluationClerkCopyPasteService,
		businessPartnerMainEvaluationPermissionDescriptor
	) {

		let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');
		var evalClerkHasRead = businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALCLERK'));
		var evalGrpDataClerkHasRead = businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALGROUPCLERK'));
		var evalSubGrpDataClerkHasRead = businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALSUBGROUPCLERK'));
		var getClerkInfo = busiessPartnerMainEvaluationDynamicGridOption.getClerkInfo;

		var clerkInfo = getClerkInfo(businessPartnerMainEvaluationClerkType.EVAL, evalClerkHasRead);

		var formConfigOptions = {
			showGrouping: false,
			groups: [{
				gid: 'clerk',
				header: '',
				isOpen: true,
				sortOrder: 1
			}],
			rows: [{
				gid: 'clerk',
				rid: 'clerkGrid',
				label: '',
				label$tr$: '',
				model: 'clerks',
				type: 'directive',
				directive: 'business-partner-evaluation-common-dynamic-grid-directive',
				options: angular.extend(clerkInfo, {
					isEvalGrpOrSubGrpClerkOn: false
				}),
				sortOrder: 1,
				readonly: false
			}]
		};

		$scope.data = {
			clerks: null
		};

		$scope.formConfigOptions = {
			configure: formConfigOptions
		};

		$scope.formContainerOptions = {
			formOptions: $scope.formConfigOptions
		};

		$scope.updateClerkGrid = updateClerkGrid;

		$scope.$on('$destroy', function () {
			businessPartnerMainEvaluationClerkCopyPasteService.clearCache();
		});

		// //////////////////////////
		function updateClerkGrid(isEvalGrpOrSubGrpClerkOn, clerkType, isExchange) {
			isExchange = isExchange || false;
			if (!isExchange) {
				updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, false);
			} else {
				clerkType = isEvalGrpOrSubGrpClerkOn ? businessPartnerMainEvaluationClerkType.GROUP : businessPartnerMainEvaluationClerkType.EVAL;
				clerkInfo = getClerkInfo(clerkType);
				var currentService = tryGetService(clerkInfo.serviceName);
				if (currentService) {
					var currentParentService = currentService.parentService();
					if (currentParentService) {
						var parentItem = currentParentService.getSelected();
						if (parentItem) {
							if (parentItem.IsEvaluationSubGroupData && isEvalGrpOrSubGrpClerkOn) {
								clerkType = businessPartnerMainEvaluationClerkType.SUBGROUP;
								clerkInfo = null;
							}
							var permissionObjectInfo = parentItem.EvalPermissionObjectInfo;
							businessPartnerMainEvaluationPermissionService.setPermissionObjectInfo(permissionObjectInfo)
								.then(function () {
									updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, false);
								});
						} else {
							updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, true);
						}
					}
				}
			}
		}

		function updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, useOriginalRight) {
			var clerkInfo = getClerkInfo(clerkType);
			if (!useOriginalRight) {
				if (clerkType === businessPartnerMainEvaluationClerkType.GROUP) {
					clerkInfo.hasRead = businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALGROUPCLERK'));
				} else if (clerkType === businessPartnerMainEvaluationClerkType.SUBGROUP) {
					clerkInfo.hasRead = businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALSUBGROUPCLERK'));
				}
			} else {
				if (clerkType === businessPartnerMainEvaluationClerkType.GROUP) {
					clerkInfo.hasRead = evalGrpDataClerkHasRead;
				} else if (clerkType === businessPartnerMainEvaluationClerkType.SUBGROUP) {
					clerkInfo.hasRead = evalSubGrpDataClerkHasRead;
				}
			}

			$rootScope.$emit('dynamic-grid-permission:changed', {
				clerk: angular.extend(clerkInfo, {
					isEvalGrpOrSubGrpClerkOn: isEvalGrpOrSubGrpClerkOn
				})
			});
		}

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
	}
})(angular);