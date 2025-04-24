(function () {
	'use strict';
	var moduleName = 'productionplanning.report';
	angular.module(moduleName).factory('productionplanningReportProductFilterClipboardService', ClipboardService);
	ClipboardService.$inject = ['productionplanningReportProductFilterDataService'];
	function ClipboardService(productFilterDataService) {
		var service = {
			doCanPaste: doCanPaste,
			copy: copy,
			canDrag: canDrag
		};
		var clipboard = {data: null, type: null};

		function doCanPaste() {
			return false;
		}

		function copy(data, type) {
			clipboard.data = data;
			clipboard.type = type;
		}

		function canDrag() {
			var dragItem = productFilterDataService.getSelected();
			return !_.isNil(dragItem);
		}

		return service;
	}
})();