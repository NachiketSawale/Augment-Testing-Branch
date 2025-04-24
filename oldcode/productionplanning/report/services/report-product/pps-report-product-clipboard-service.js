(function () {
	/*giobals angular*/
	'use strict';
	var moduleName = 'productionplanning.report';
	angular.module(moduleName).factory('productionplanningReportProductClipboardService', ClipboardService);
	ClipboardService.$inject = ['productionplanningReportReportDataService'];
	function ClipboardService(reportDataService) {
		var service = {};

		service.doCanPaste = function (canPastedContent) {
			var canPaste = false;

			if (canPastedContent.type === 'ReportrProductFilter') {
				var selectedItem = reportDataService.getSelected();
				canPaste = !_.isNil(selectedItem);
			}

			return canPaste;
		};

		service.doPaste = function (pastedContent) {
			if (pastedContent.type === 'ReportrProductFilter') {
				pastedContent.itemService.paste(pastedContent.data, reportDataService.getSelected());
			}
		};

		return service;
	}
})();