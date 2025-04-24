/* globals angular */
(function () {
	'use strict';
	const moduleName = 'productionplanning.formulaconfiguration';

	var statusObject = {
		new: {id: 0, description: 'design', descriptionTr: ''},
		release: {id: 1, description: 'active', descriptionTr: ''},
		inactive: {id: 2, description: 'inactive', descriptionTr: ''}
	};

	var status2Id = {};
	status2Id[statusObject.new.id] = statusObject.new;
	status2Id[statusObject.release.id] = statusObject.release;
	status2Id[statusObject.inactive.id] = statusObject.inactive;

	angular.module(moduleName).value('ppsFormulaVersionStatus', statusObject);

	angular.module(moduleName).value('ppsFormulaVersionStatusToId', status2Id);

})();
