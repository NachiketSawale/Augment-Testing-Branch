(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).service('ppsEngDetailerPlanningBoardClipboardService', ClipboardService);

	ClipboardService.$inject = [];

	function ClipboardService() {
		var clipboard = {data: null};

		this.canDrag = function () {
			return true;
		};

		this.canPaste = function () {
			return false;
		};

		this.copy = function (items) {
			clipboard.data = angular.copy(items);
		};

		this.getClipboard = function () {
			return clipboard;
		};
	}
})();