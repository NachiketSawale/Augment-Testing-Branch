(function (angular) {
	'use strict';

	let moduleName = 'project.inforequest';

	angular.module(moduleName).factory('projectInfoRequestDragDropService', ProjectInfoRequestDragDropService);

	ProjectInfoRequestDragDropService.$inject = ['$injector'];

	function ProjectInfoRequestDragDropService($injector) {
		let service = {};

		service.setClipboardMode = setClipboardMode;
		service.canDrag = canDrag;
		service.doCanPaste = doCanPaste;
		service.copy = copy;
		service.doPaste = doPaste;

		return service;

		function setClipboardMode(/* cut */) {

		}

		function canDrag(type) {
			return true;
		}

		function doCanPaste(obj , type, item, itemService) {
			const toBeAssignedToChange = 2;
			if(itemService.getServiceName() === 'projectInfoRequestChangeDataService'){
				return obj.data.some(item => item.Rfi2ChangeTypeFk === toBeAssignedToChange);
			}
			if(itemService.getServiceName() === 'projectInfoRequestDefectDataService'){
				return obj.data.some(item => item.Rfi2DefectTypeFk === toBeAssignedToChange);
			}
			return false;
		}

		function copy(/* items, type, itemService */) {
		}

		function doPaste(obj, item, type/* , callback */) {
		}
	}

})(angular);