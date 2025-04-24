/*
 * $Id: lacking-permission-info.js 603039 2020-09-14 08:13:32Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	platformLackingPermissionInfoController.$inject = ['$scope', '_', 'platformPermissionService', 'mainViewService', '$translate', 'globals', '$http'];

	function platformLackingPermissionInfoController($scope, _, platformPermissionService, mainViewService, $translate, globals, $http) {
		var ctrl = this; // jshint ignore:line

		ctrl.uuid = $scope.$parent.$parent.getContainerUUID();
		ctrl.container = mainViewService.getContainerByUuid(ctrl.uuid);
		ctrl.toggleState = false;
		ctrl.permissionInfo = $translate.instant('platform.containerContentNotShownLoading');

		ctrl.toggle = function toggle() {
			ctrl.toggleState = !ctrl.toggleState;
		};

		ctrl.toggleIcon = function toggleIcon() {
			return ctrl.toggleState ? 'ico-down' : 'ico-up';
		};

		ctrl.lockIcon = function () {
			return ctrl.toggleState ? 'ico-permission-lock-red' : 'ico-permission-lock-grey';
		};

		platformPermissionService.loadDescriptor(ctrl.container.permission)
			.then(function (result) {
				ctrl.permissionInfo = result.path.replace(/\//g, ' / ');
			});
	}

	var componentConfig = {
		templateUrl: 'app/components/layoutsystem/templates/lacking-permission-info.html',
		controller: platformLackingPermissionInfoController
	};

	angular.module('platform').component('platformLackingPermissionInfo', componentConfig);
})(angular);
