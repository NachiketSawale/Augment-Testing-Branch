/*
 * $Id: sidebar-wizard-definitions.js 522941 2018-11-23 14:01:06Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc constant
	 * @name platform.platformSidebarWizardDefinitions
	 * @function
	 * @requires
	 *
	 * @description Contains reusable definitions of wizards for the sidebar.
	 */
	angular.module('platform').constant('platformSidebarWizardDefinitions', (function generateWizardDefinitions() {
		var defs = {};

		defs.model = {
			wizards: {
				selection: {
					serviceName: 'modelViewerSelectionWizardService',
					wizardGuid: '550bbf52325741c5901cbed2ba126934',
					methodName: 'showDialog',
					canActivate: true
				},
				propertyBulkAssignment: {
					serviceName: 'modelMainPropkeysBulkAssignmentWizardService',
					wizardGuid: '0232e6e17d9a447db41bd0d18eb91dbb',
					methodName: 'runWizard',
					canActivate: true
				}
			}
		};

		defs.model.sets = {
			default: [
				defs.model.wizards.selection,
				defs.model.wizards.propertyBulkAssignment
			]
		};

		return defs;
	})());
})();