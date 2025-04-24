(function (angular) {
	'use strict';

	angular.module('documents.project').service('documentsProjectFileActionProcessor',
		['platformDialogService', '$translate',
			function (platformDialogService, $translate) {


				function updateStatus(newStatusId) {
					var that = this;
					that.ModelJobState = newStatusId;
					if (that.ModelJobState) {
						var icon;
						switch (newStatusId) {
							case undefined:
							case null:
							case -2:
								icon = 'status-icons ico-status42';
								that.ModelStatus.actionList[0].readonly = true;
								that.StatusText = $translate.instant('basics.common.modelState.loading');
								break;
							case -1:
							case 0:
								icon = null;
								that.ModelStatus.actionList[0].readonly = true;
								that.StatusText = $translate.instant('basics.common.modelState.nopreview');
								break;
							case 1:
							case 2: // conversion in progress
								icon = 'status-icons ico-status42';
								that.StatusText = $translate.instant('basics.common.modelState.inProgress');
								break;
							case 4: // success
							case 7: // success (with minor errors)
								icon = 'status-icons ico-status02';
								that.StatusText = $translate.instant('basics.common.modelState.ready');
								break;
							default: // failed
								icon = 'status-icons ico-status01';
								that.StatusText = $translate.instant('basics.common.modelState.failed');
								break;
						}
						that.ModelStatus.actionList[0].icon = icon;
					}
				}

				var processItem = function processItem(item) {
					if (!item.ModelStatus) {
						item.ModelStatus = {};
					}
					item.ModelStatus.actionList = [];
					item.ModelStatus.actionList.push({
						toolTip: $translate.instant('basics.common.showLog'),
						icon: null,
						callbackFn: function showModelLog(item) {
							if(item.ModelJobState !== -1 && item.JobLoggingMessage && item.JobLoggingMessage.length > 0){
								return platformDialogService.showMsgBox(item.JobLoggingMessage, 'Scheduler Log');
							}
							return null;
						},
						readonly: false
					});
					item.updateStatus = updateStatus;
					item.updateStatus(item.ModelJobState);
				};
				this.processItem = processItem;

				this.revertProcessItem = function revertProcessItem(item) {
					if (item.ModelStatus) {
						item.ModelStatus.length = 0;
						delete item.ModelStatus;
						delete item.updateStatus;
						delete item.StatusText;
					}
				};

				this.processData = function processData(dataList) {
					angular.forEach(dataList, function (item) {
						processItem(item);
					});
					return dataList;
				};
			}]);
})(angular);