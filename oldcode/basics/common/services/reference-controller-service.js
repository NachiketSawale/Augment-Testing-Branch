/**
 * Created by waz on 4/9/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	const module = angular.module(moduleName);

	module.factory('basicsCommonReferenceControllerService', ReferenceControllerService);
	ReferenceControllerService.$inject = ['platformPermissionService', '$timeout', 'basicsCommonToolbarExtensionService', '_'];

	function ReferenceControllerService(platformPermissionService, $timeout, basicsCommonToolbarExtensionService, _) {
		function extendReferenceButtons($scope, dataService, options) {
			extendToolItems($scope, dataService, options);
			if (!_.isNil(dataService.parentService())) {
				dataService.parentService().registerSelectionChanged($scope.tools.update);
			}
			dataService.registerSelectionChanged(function () {
				if ($scope.tools) {
					$scope.tools.update();
				}
				// Only the grid events call the updateButtons function. This events are out of the
				// digest cycle of angular. Therefor we have to start an new digest.
				$timeout(function () {
					$scope.$apply();
				});
			});
		}

		function setPermission(tool, permission) {
			if (_.isString(tool.permission)) {
				const split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}

		function extendToolItems($scope, dataService, options) {
			options = _.isNil(options) ? {} : options;
			let sort = _.isNil(options.sort) ? -10000 : options.sort;
			const hasCreateReference = _.isNil(options.hasCreateReference) ? !_.isNil(dataService.canCreateReference) : options.hasCreateReference;
			const hasDeleteReference = _.isNil(options.hasDeleteReference) ? !_.isNil(dataService.canDeleteReference) : options.hasDeleteReference;

			let permission = $scope.getContentValue('permissionReference');
			if (!permission) {
				permission = $scope.getContentValue('permission');
			}
			if (hasDeleteReference) {
				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: 'd' + sort,
					sort: sort++,
					type: 'divider'
				});
				const delRefTool = {
					id: 'deleteReference',
					caption: 'cloud.common.deleteReference',
					sort: sort++,
					type: 'item',
					iconClass: 'tlb-icons ico-reference-delete',
					permission: '#d',
					fn: function () {
						return dataService.deleteSelectedReferences();
					},
					disabled: function () {
						return !dataService.hasSelection() || !dataService.canDeleteReference();
					}
				};
				setPermission(delRefTool, permission);
				basicsCommonToolbarExtensionService.insertBefore($scope, delRefTool);
				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: 'd' + sort,
					sort: sort++,
					type: 'divider'
				});
			}
			if (hasCreateReference) {
				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: 'd' + sort,
					sort: sort++,
					type: 'divider'
				});
				const creRefTool = {
					id: 'createReference',
					caption: 'cloud.common.createReference',
					sort: sort++,
					type: 'item',
					iconClass: 'tlb-icons ico-reference-add',
					permission: '#c',
					fn: function () {
						return dataService.showReferencesSelectionDialog();
					},
					disabled: function () {
						const parentService = dataService.parentService();
						return _.isNil(parentService) ? !dataService.canCreateReference() : !parentService.hasSelection() || !dataService.canCreateReference();
					}
				};
				setPermission(creRefTool, permission);
				basicsCommonToolbarExtensionService.insertBefore($scope, creRefTool);
				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: 'd' + sort,
					sort: sort++,
					type: 'divider'
				});
			}

			// the toolbar items isn't order by the sort right now
			// $scope.tools.items = _.sortBy($scope.tools.items, 'sort');
		}

		return {
			extendReferenceButtons: extendReferenceButtons
		};
	}

})(angular);
