(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonManualLoggingHelper', [
		'$translate', '$injector',
		function ($translate, $injector) {
			this.createLoggingToolBtn = function (ppsEntityId, uiService, dataService, schemaOption, isPropertyMappedToDbColumn, translationService, logSucceedCallback) {
				return [{
					id: 'd0',
					type: 'divider',
					isSet: true,
					hideItem: false
				}, {
					id: 'addLog',
					caption: $translate.instant('productionplanning.common.manualLog.addLog'),
					type: 'item',
					// permission: (function () {
					// 	if (accessGuid) {
					// 		var p = {};
					// 		p[accessGuid] = 4;
					// 		return p;
					// 	}
					// 	return undefined;
					// })(),
					iconClass: 'tlb-icons ico-toggle-comment',
					fn: function () {
						// open dialog
						showManualLoggingDialog(ppsEntityId, uiService, dataService, schemaOption, isPropertyMappedToDbColumn, translationService).then(function(result) {
							// refresh log container
							if (result.ok) {
								if (angular.isFunction(logSucceedCallback)) {
									logSucceedCallback();
								}
							}
						});
					},
					disabled: function () {
						return !dataService.getSelected();
					}
				}];
			};

			function showManualLoggingDialog(ppsEntityId, uiService, dataService, schemaOption, isPropertyMappedToDbColumn, translationService) {
				var dialogService = $injector.get('ppsCommonManualLoggingDialogService');
				var dialogOptions = {
					width: '600px',
					resizeable: true,
					headerTextKey: 'productionplanning.common.manualLog.headerText',
					bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-form-detail.html',
					showOkButton: true,
					showCancelButton: true,
					disableOkButton: dialogService.disableOkButton,
					params: {
						controllerService: dialogService,
						controllerInitParam: {
							uiService: uiService,
							schemaOption: schemaOption,
							dataService: dataService,
							isPropertyMappedToDbColumn: isPropertyMappedToDbColumn,
							translationService: translationService,
							ppsEntityId: ppsEntityId
						}
					}
				};
				return $injector.get('platformModalService').showDialog(dialogOptions);
			}
		}
	]);
})();