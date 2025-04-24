/**
 * $Id: boq-main-rounding-config-ui-configuration-service.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides Boq Rounding Config UI for dialog.
	 */
	angular.module(moduleName).factory('boqMainRoundingConfigUIConfigurationService', ['_', '$injector',
		function (_, $injector) {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'roundingConfig',
						header: 'Rounding Config',
						header$tr$: 'estimate.main.roundingConfigurationDialogForm.dialogTitle',
						isOpen: true,
						visible: true,
						sortOrder: 5
					}
				],
				rows: [
					{
						gid: 'roundingConfig',
						rid: 'boqRoundingConfigType',
						label: 'Rounding Config Type',
						label$tr$: 'estimate.main.roundingConfigurationDialogForm.roundingConfigType',
						type: 'directive',
						directive: 'boq-main-rounding-config-type-lookup',
						model: 'boqRoundingConfigTypeFk',
						options: {
							serviceName: 'boqMainRoundingConfigTypeLookupService',
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
						gid: 'roundingConfig',
						rid: 'editRoundingConfigType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.columnConfigurationDialogForm.editType',
						type: 'boolean',
						model: 'isEditRoundingConfigType',
						checked: false,
						disabled: false,
						visible: true,
						change: function changeEditRoundingConfigType(entity) {
							let boqMainRoundingConfigDataService = $injector.get('boqMainRoundingConfigDataService');
							boqMainRoundingConfigDataService.maintainReadOnlyState();
							if(_.isObject(entity) && _.isNumber(entity.boqRoundingConfigTypeFk)) {
								entity.boqRoundingConfigTypeFk = null;
							}
							boqMainRoundingConfigDataService.onItemChange.fire(entity);
						},
						sortOrder: 2
					},
					{
						gid: 'roundingConfig',
						rid: 'roundingConfigDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						type: 'description',
						model: 'boqRoundingConfigDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'roundingConfig',
						label: 'Rounding Configure Detail',
						label$tr$: 'estimate.main.roundingConfigurationDialogForm.roundingConfigDetail',
						rid: 'roundingConfigDetail',
						type: 'directive',
						model: 'boqRoundingConfigDetail',
						directive: 'boq-main-rounding-config-detail-grid',
						sortOrder: 4
					}
				],
				overloads: {}
			};

			service.getFormConfig = function (customizeOnly) {
				let deepCopiedFormConfiguration = angular.copy(formConfig);
				if (customizeOnly) {
					// Remove the first row that holds the checkbox to make the structure a specific one different from boq.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editRoundingConfigType';
					});
				}

				return deepCopiedFormConfiguration;
			};

			return service;

		}
	]);

})(angular);
