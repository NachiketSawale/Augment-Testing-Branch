(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemUpstreamClipboardService', ClipboardService);
	ClipboardService.$inject = ['ppsUpstreamItemDataService',
		'ppsCommonNotifyUpdatingService'];
	function ClipboardService(ppsUpstreamItemDataService,
		ppsCommonNotifyUpdatingService) {

		function createNewComplete(dataService) {

			let clipboard = {data: null, type: null};

			function doCanPaste(canPastedContent) {
				return false;
			}

			function copy(data, type) {
				clipboard.data = data;
				clipboard.type = type;
			}

			function canDrag() {
				return !ppsCommonNotifyUpdatingService.isUpdating();
			}

			function doPaste(pastedContent, selectedItem, type){

			}

			return {
				doCanPaste: doCanPaste,
				copy: copy,
				canDrag: canDrag,
				doPaste: doPaste
			};
		}



		let serviceCache = {};

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createNewComplete(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);
