(function (angular) {
	'use strict';

	const moduleName = 'basics.workflow';
	angular.module(moduleName).factory('genericWizardInstanceInfoObjectService', genericWizardInstanceInfoObjectService);

	genericWizardInstanceInfoObjectService.$inject = [];

	function genericWizardInstanceInfoObjectService() {
		const service = {};

		let infoMapList = [];

		service.setInfoObject = function (wizardInstanceId, infoObject) {
			const infoMap = getInfoMapByWizardInstanceId(wizardInstanceId);
			if (infoMap) {
				let existingInfoObject = infoMap.infoObject;
				if (_.isObjectLike(infoObject) && _.isObjectLike(existingInfoObject) && !_.isArray(infoObject) && !_.isArray(existingInfoObject)) {
					_.extend(existingInfoObject, infoObject);
				} else {
					existingInfoObject = infoObject;
				}
			} else {
				infoMapList.push({
					key: wizardInstanceId,
					infoObject: infoObject
				});
			}
		};

		service.getInfoObjectByWizardInstanceId = function (wizardInstanceId) {
			const infoMap = getInfoMapByWizardInstanceId(wizardInstanceId);
			return infoMap ? infoMap.infoObject : null;
		};

		service.removeInfoObjectByWizardInstanceId = function (wizardInstanceId) {
			infoMapList = _.remove(infoMapList, {key: wizardInstanceId});
		};

		function getInfoMapByWizardInstanceId(wizardInstanceId) {
			return _.find(infoMapList, {key: wizardInstanceId});
		}

		return service;
	}

})(angular);