/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeSet.modelChangeSetJobActionProcessor
	 * @function
	 *
	 * @description Adds an action specification on model comparison entities.
	 */
	angular.module('model.changeset').factory('modelChangeSetJobActionProcessor', modelChangeSetJobActionProcessor);

	modelChangeSetJobActionProcessor.$inject = ['_', 'platformDialogService', 'modelChangeSetStatusIconService',
		'$translate', 'servicesSchedulerUIJobLogDialogService'];

	function modelChangeSetJobActionProcessor(_, platformDialogService, modelChangeSetStatusIconService,
		$translate, servicesSchedulerUIJobLogDialogService) {

		function updateStatus(newStatusId) {
			const that = this;

			that.ChangeSetStatusFk = newStatusId;
			if (that.Status) {
				const statusInfo = modelChangeSetStatusIconService.getItemById(newStatusId);
				if (statusInfo) {
					that.Status.displayText = $translate.instant(statusInfo.text);
					that.Status.actionList[0].icon = statusInfo.res;
				}
			}
		}

		return {
			processItem: function (item) {
				item.Status = {
					actionList: [{
						toolTip: $translate.instant('model.changeset.showLog'),
						icon: 'tlb-icons ico-settings',
						callbackFn: function showModelChangeSetLog() {
							switch (item.ChangeSetStatusFk) {
								case 3:
								case 4:
									return item.JobFk >= 1 ?
										servicesSchedulerUIJobLogDialogService.showLogDialog(item.JobFk) :
										platformDialogService.showMsgBox('model.changeset.noLinkedJob', 'cloud.common.informationDialogHeader', 'info');
								default:
									return platformDialogService.showMsgBox('model.changeset.logNotYetAvailable', 'cloud.common.informationDialogHeader', 'info');
							}
						},
						readonly: false
					}]
				};
				item.updateStatus = updateStatus;

				item.updateStatus(item.ChangeSetStatusFk);
			},
			revertProcessItem: function (item) {
				delete item.Status;
				delete item.updateStatus;
			}
		};
	}
})(angular);
