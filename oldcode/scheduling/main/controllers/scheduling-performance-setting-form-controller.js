/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingPerformanceSettingFormController',
		['_', '$scope', '$translate',
			function (_, $scope, $translate) {

				let dataItems = $scope.dataItem;
				var config = {
					title: $translate.instant('FormWizard'),
					dataItem: dataItems,
					formConfiguration: formConfiguration()
				};

				function formConfiguration() {
					return {
						fid: 'scheduling.main.settingsDialog',
						version: '1.0.0',
						showGrouping: true,
						readonly:false,
						groups: [
							{
								gid: 'performance',
								header: 'Performance Settings',
								header$tr$: 'scheduling.main.headerPerformanceSettingsDialog',
								isOpen: true,
								visible: true,
								sortOrder: 1
							},
							{
								gid: 'general',
								header: 'General Settings',
								header$tr$: 'scheduling.main.headerGeneralSettings',
								isOpen: true,
								visible: true,
								sortOrder: 2
							}
						],
						rows: [
							{
								readonly:false,
								gid: 'performance',
								rid: 'dueDate',
								label: 'Due Date',
								label$tr$: 'scheduling.main.dueDate',
								type: 'dateutc',
								model: 'dueDate',
								sortOrder: 1,
								options: {
									editable:true
								}

							},
							{
								readonly:false,
								gid: 'performance',
								rid: 'startDate',
								label: 'Description test',
								label$tr$: 'cloud.common.entityDescription',
								type: 'description',
								model: 'description',
								sortOrder: 2,
								options: {
									editable:true
								}
							},
							{
								readonly:false,
								gid: 'general',
								rid: 'enableTransientRootEntity',
								label: 'Enable Transient Root Entity',
								label$tr$: 'scheduling.main.enableTransientRootEntity',
								type: 'boolean',
								model: 'enableTransientRootEntity',
								sortOrder: 3,
								options: {
									editable:true
								}
							}
						]
					}
				}
				$scope.formContainerOptions = {formOptions: {configure: config.formConfiguration}};
			}
		]);

})(angular);
