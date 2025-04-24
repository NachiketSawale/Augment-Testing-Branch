/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRoundingConfigUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Rounding Config UI for dialog.
	 */
	angular.module(moduleName).factory('estimateMainRoundingConfigUIConfigurationService', ['_',
		function (_) {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'roundingConfig',
						header: 'Rounding Configuration',
						header$tr$: 'estimate.main.roundingConfigDialogForm.dialogRoundingConfigHeaderText',
						isOpen: true,
						visible: true,
						sortOrder: 5
					}
				],
				rows: [
					{
						gid: 'roundingConfig',
						rid: 'estRoundingConfigType',
						label: 'Rounding Config Type',
						label$tr$: 'estimate.main.roundingConfigDialogForm.roundingConfigType',
						type: 'directive',
						directive: 'estimate-main-rounding-config-type-lookup',
						model: 'estRoundingConfigTypeFk',
						options: {
							serviceName: 'estimateMainRoundingConfigTypeLookupService',
							displayMember: 'DescriptionInfo.Translated',
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
						gid: 'roundingConfig',
						rid: 'editRoundingConfigType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.columnConfigurationDialogForm.editType',
						type: 'boolean',
						model: 'isEditRoundingConfigType',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'roundingConfig',
						rid: 'estRoundingConfigDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						type: 'description',
						model: 'estRoundingConfigDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'roundingConfig',
						label: 'Rounding Configure Detail',
						label$tr$: 'estimate.main.roundingConfigDialogForm.roundingConfigDetail',
						rid: 'estRoundingConfigDetail',
						type: 'directive',
						model: 'estRoundingConfigDetail',
						directive: 'estimate-main-rounding-config-detail-grid',
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
						return row.rid === 'editRoundingConfigType';
					});
				}

				if(isAssemblies){
					_.remove(deepCopiedFormConfiguration.groups, function(group){
						return group.header === 'Rounding Config';
					});
				}
				return deepCopiedFormConfiguration;
			};

			return service;

		}
	]);

})(angular);
