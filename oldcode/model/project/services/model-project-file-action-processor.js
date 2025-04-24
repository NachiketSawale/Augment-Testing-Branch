/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectFileActionProcessor
	 * @function
	 *
	 * @description
	 * The modelProjectFileActionProcessor translates an action string into a list of actions descriptions usable by an action formatter
	 */

	angular.module(moduleName).service('modelProjectFileActionProcessor', ModelProjectFileActionProcessor);

	ModelProjectFileActionProcessor.$inject = ['_', 'modelProjectFileConversionService',
		'platformDialogService', '$translate', 'servicesSchedulerUIJobLogDialogService'];

	function ModelProjectFileActionProcessor(_, modelProjectFileConversionService, platformDialogService,
	                                         $translate, servicesSchedulerUIJobLogDialogService) {
		var service = this;

		function updateStatus(newStatusId) {
			var that = this; // jshint ignore:line

			that.State = newStatusId;
			if (that.Status) {
				var icon;
				switch (newStatusId) {
					case -1: // new
					case 0:
						icon = 'status-icons ico-status05';
						that.StatusText = $translate.instant('model.project.conversionState.new');
						break;
					case 1: // conversion in progress
						icon = 'status-icons ico-status43';
						that.StatusText = $translate.instant('model.project.conversionState.inProgress');
						break;
					case 2: // success
					case 3: // success (with minor errors)
						icon = 'status-icons ico-status02';
						that.StatusText = $translate.instant('model.project.conversionState.success');
						break;
					default: // failed
						icon = 'status-icons ico-status01';
						that.StatusText = $translate.instant('model.project.conversionState.failure');
						break;
				}
				that.Status.actionList[0].icon = icon;
			}
		}

		this.provideActionSpecification = function provideActionSpecification(action, actionList, state) {
			if (action === 'Conversion') {
				actionList.push({
					toolTip: $translate.instant('model.project.convertModel'),
					icon: 'tlb-icons ico-settings',
					callbackFn: modelProjectFileConversionService.convert,
					readonly: !(state <= 0 || state >= 3)
				});
			}
			if (action === 'Status') {
				actionList.push({
					toolTip: $translate.instant('model.project.showLog'),
					icon: null,
					callbackFn: function showModelLog (item) {
						switch (item.State) {
							case -1:
							case 0:
							case 1:
								return platformDialogService.showMsgBox('model.project.logNotYetAvailable',  'cloud.common.informationDialogHeader', 'info');
							default:
								return item.JobFk >= 1 ?
									servicesSchedulerUIJobLogDialogService.showLogDialog(item.JobFk) :
									platformDialogService.showMsgBox('model.project.noLinkedJob',  'cloud.common.informationDialogHeader', 'info');
						}
					},
					readonly: false
				});
			}
		};

		this.processItem = function processItem (item) {
			if (item.Action) {
				item.Action.actionList = [];
				service.provideActionSpecification(item.Action.Action, item.Action.actionList, item.State);
			}
			if (item.Status) {
				item.Status.actionList = [];
				service.provideActionSpecification(item.Status.Status, item.Status.actionList, item.State);
				item.updateStatus = updateStatus;

				item.updateStatus(item.State);
			}
		};

		this.revertProcessItem = function revertProcessItem (item) {
			if (item.Action) {
				item.Action.length = 0;
				delete item.Action;
			}
			if (item.Status) {
				item.Status.length = 0;
				delete item.Status;
				delete item.updateStatus;
				delete item.StatusText;
			}
		};
	}
})(angular);
