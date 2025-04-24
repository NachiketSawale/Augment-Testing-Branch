/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetStatusIconService
	 * @function
	 *
	 * @description This service provides icons and texts that match entries in the MDL_CHANGESETSTATUS table.
	 */
	angular.module('model.changeset').service('modelChangeSetStatusIconService', modelChangeSetStatusIconService);

	modelChangeSetStatusIconService.$inject = ['platformIconBasisService'];

	function modelChangeSetStatusIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath('');

		const icons = [
			platformIconBasisService.createCssIconWithId(1, 'model.changeset.stateRequested', 'status-icons ico-status05'),
			platformIconBasisService.createCssIconWithId(2, 'model.changeset.stateRunning', 'status-icons ico-status43'),
			platformIconBasisService.createCssIconWithId(3, 'model.changeset.stateCompleted', 'status-icons ico-status02'),
			platformIconBasisService.createCssIconWithId(4, 'model.changeset.stateIncomplete', 'status-icons ico-status01')
		];

		platformIconBasisService.extend(icons, this);
	}
})(angular);
