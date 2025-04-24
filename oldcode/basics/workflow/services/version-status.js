/* globals angular */
(function () {
	'use strict';

	var statusObject = {
		design: {id: 1, description: 'design', descriptionTr: ''},
		active: {id: 2, description: 'active', descriptionTr: ''},
		inactive: {id: 3, description: 'inactive', descriptionTr: ''}
	};

	var status2Id = {};
	status2Id[statusObject.design.id] = statusObject.design;
	status2Id[statusObject.active.id] = statusObject.active;
	status2Id[statusObject.inactive.id] = statusObject.inactive;

	angular.module('basics.workflow').value('basicsWorkflowVersionStatus', statusObject);

	angular.module('basics.workflow').value('basicsWorkflowVersionStatusToId', status2Id);

})();
