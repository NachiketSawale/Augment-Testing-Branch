/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name cloud.platform.directive:platformLayoutSplitter
	 * @element div
	 * @restrict A
	 * @scope
	 * @description
	 * Initializes the splitter.
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('platform').directive('platformLayoutSplitter', platformLayoutSplitter);

	platformLayoutSplitter.$inject = ['mainViewService', '$timeout', '_'];

	function platformLayoutSplitter(mainViewService, $timeout) {
		var directive = {};
		var splitter = null;

		directive.restrict = 'A';
		directive.link = function (scope) {
			// TODO: add get splitter information here.
			var splitterInfo = mainViewService.getSplitterDef();

			for (var i = 0; i < splitterInfo.length; i++) {
				$('#' + splitterInfo[i].selectorName).kendoSplitter({
					panes: splitterInfo[i].panes,
					orientation: splitterInfo[i].orientation
				});
			}

			// Resize canvas when splitter resizes
			var toPromise = $timeout(function () {
				var splitterInfo = mainViewService.getSplitterDef();

				if (splitterInfo) {
					for (var i = 0; i < splitterInfo.length; i++) {
						splitter = $('#' + splitterInfo[i].selectorName).data('kendoSplitter');
						if (splitter) {
							splitter.bind('resize', mainViewService.setSplitterDef);
						}
					}
				}
				$timeout.cancel(toPromise);
			}, 0, false);

			var unregister = [scope.$on('$destroy', function () {
				if (splitter) {
					splitter.unbind('resize', mainViewService.setSplitterDef);
					splitter.destroy();
					splitter = null;
				}

				_.over(unregister)();
				unregister = null;
			})];
		};

		return directive;
	}
})(angular);