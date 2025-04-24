(() => {
	'use strict';

	function cloudDesktopHeaderService() {
		/*
			Module-Description contains max. 3 fields. Project/Module/lineItem.
			e.g.: AAAAAA-B\00002 - prc1234 / 1 - Baulogistik - LV / 1
			The corresponding object-variable could look like this:
		 */
		const defaultModuleInfo = function () {
			return {
				project: {
					description: ''
				},
				module: {
					description: ''
				},
				lineItem: {
					description: '',
					cssClass: 'font-bold'
				}
			}
		};

		function castModuleInfoToOutput(moduleObject) {
			let outputLabels = [];

			if(moduleObject.lineItem) {
				moduleObject.lineItem.cssClass = 'font-bold';
			}
			if(moduleObject.project) {
				moduleObject.project.moduleName = 'project.main';
			}

			return _.filter(moduleObject, function (module) {
				return module.description && module.description !== '';
			});
		}

		function getModuleInfoObject(entityText) {
			/*
				Object variable is used to create an array for the HTML Output.
			 */
			let splitDescription = entityText.split(' / ');
			let moduleInfo = defaultModuleInfo();
			splitDescription.forEach((item, index) => {
				let key = Object.keys(moduleInfo)[index];
				moduleInfo[key].description = item;
			});

			return moduleInfo;
		}

		/*
			returns a array for the breadcrumb-Output in header.
			['project'. 'module', 'lineItem']
		 */
		function getModuleInfo(moduleText, entityText) {
			let moduleInfoAsLabel = '';

			if(typeof entityText === 'string' && entityText === 'desktoppage') {
					return [moduleText];
			}

			if (entityText) {
				if (typeof entityText !== 'object') {
					/*
					It started as a string. Object is new. Therefore the string is converted to Object.
					There the string is converted to Object.
					 */
					entityText = getModuleInfoObject(entityText);
				}

				moduleInfoAsLabel = castModuleInfoToOutput(entityText);
			}

			return moduleInfoAsLabel;
		}

		let service = {
			getModuleInfo: getModuleInfo
		};

		return service;
	}

	angular.module('cloud.desktop').factory('cloudDesktopHeaderService', cloudDesktopHeaderService);
})();