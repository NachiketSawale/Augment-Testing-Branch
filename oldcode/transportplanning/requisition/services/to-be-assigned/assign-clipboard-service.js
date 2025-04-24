(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('transportplanningToBeAssignedClipboardService', ClipboardService);
	ClipboardService.$inject = ['ppsCommonNotifyUpdatingService'];
	function ClipboardService(ppsCommonNotifyUpdatingService) {

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
				let selected = dataService.getSelected();
				if(selected){
					return !dataService.getSelected().TrsProductBundleFk && !ppsCommonNotifyUpdatingService.isUpdating();
				}
				return false;
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