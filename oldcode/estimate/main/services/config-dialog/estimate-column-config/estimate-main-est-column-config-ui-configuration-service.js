/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstColumnConfigUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Column Config UI for dialog.
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigUIConfigurationService', ['_',
		function (_) {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'colConfig',
						header: 'Column Config',
						header$tr$: 'estimate.main.columnConfigurationDialogTitle',
						isOpen: true,
						visible: true,
						sortOrder: 2
					}
				],
				rows: [
					{
						gid: 'colConfig',
						rid: 'estColConfigType',
						label: 'Column Config Type',
						label$tr$: 'estimate.main.columnConfigurationDialogForm.colConfigType',
						type: 'directive',
						directive: 'estimate-main-column-config-type',
						model: 'estColConfigTypeFk',
						options: {
							serviceName: 'estimateMainColumnConfigTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true,
							showClearButton: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'colConfig',
						rid: 'editColConfigType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.columnConfigurationDialogForm.editType',
						type: 'boolean',
						model: 'isEditColConfigType',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'colConfig',
						rid: 'colConfigDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						type: 'description',
						model: 'columnConfigDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'colConfig',
						label: 'Column Configure Details',
						label$tr$: 'estimate.main.columnConfigurationDialogForm.columnConfigureDetails',
						rid: 'colConfigDetail',
						type: 'directive',
						model: 'columnConfigDetails',
						directive: 'estimate-main-column-config-detail-grid',
						sortOrder: 4
					}
				],
				overloads: {}
			};

			service.getFormConfig = function (customizeOnly, isAssemblies) {
				let deepCopiedFormConfiguration = angular.copy(formConfig);
				if (customizeOnly) {
					// Remove the first row that holds the checkbox to make the structure a specific one different form estimate.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editColConfigType';
					});
				}

				if(isAssemblies){
					_.remove(deepCopiedFormConfiguration.groups, function(group){
						return group.header === 'Column Config';
					});
				}
				return deepCopiedFormConfiguration;
			};

			return service;

		}
	]);

})(angular);
