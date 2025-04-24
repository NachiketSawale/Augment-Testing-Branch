/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	mainView.$inject = ['mainViewService'];

	function mainView(mainViewService) {
		var directive = {};
		directive.scope = {};
		directive.templateUrl = globals.appBaseUrl + 'app/components/layoutsystem/templates/main-view.html';
		directive.controller = ['$scope', function ($scope) {
			$scope.tabContentUrl = mainViewService.getTabContent();
		}];

		return directive;
	}

	/**
	 * @ngdoc directive
	 * @name platform.mainView
	 * @element div
	 * @restrict A
	 * @priority 0
	 * @scope
	 * @description
	 * main view of the applications, the views of a module are displayed within this area.
	 *
	 * @example
	 * <doc:example>
	 * <doc:source>
	 *      <div class="fullheight" main-view></div>
	 *      <pre>{{text}}</pre>
	 * </doc:source>
	 * </doc:example>
	 */
	angular.module('platform').directive('mainView', mainView);

})(angular);