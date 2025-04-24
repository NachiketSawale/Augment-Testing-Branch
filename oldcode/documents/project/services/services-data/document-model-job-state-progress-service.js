(function(angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	const moduleName = 'documents.project';
	angular.module(moduleName).factory('documentModelJobStateProgressService', [
		'$http', '$translate', 'PlatformMessenger', '_', 'platformGridAPI', '$timeout',
		'basicsCommonGridCellService', 'basicsCommonGridFormatterHelper', 'platformDialogService',
		function ($http, $translate, PlatformMessenger, _, platformGridAPI, $timeout,
			basicsCommonGridCellService, basicsCommonGridFormatterHelper, platformDialogService) {

			const service = {
				data: [],
				gridId: '',
				refresh: refresh,
				formatter: formatter
			};

			function refresh(data, gridId) {
				service.data = data;

				if (gridId) {
					service.gridId = gridId.toLowerCase();
				}
				if (!service.gridId) {
					return;
				}

				if (platformGridAPI.grids.exist(service.gridId)) {
					basicsCommonGridCellService.updateColumn(service.gridId, 'modelstatus');
				}

				service.data = [];
			}

			/* jshint -W072 */
			function getStatusDescription(value, id) {
				let description = '', icon = '', isReadOnly = false;

				switch (value?.toString()) {
					case '-2':
					case '0':
						icon = 'status-icons ico-status42';
						isReadOnly = true;
						description = $translate.instant('basics.common.modelState.loading');
						break;
					case undefined:
					case null:
					case '-1':
						icon = null;
						isReadOnly = true;
						description = $translate.instant('basics.common.modelState.nopreview');
						break;
					case '1':
					case '5': //no convert file
						icon = 'status-icons ico-status171';
						description = $translate.instant('basics.common.modelState.applicable');
						break;
					case '2': // conversion in progress
						icon = 'status-icons ico-status42';
						description = $translate.instant('basics.common.modelState.inProgress');
						break;
					case '4': // success
					case '7': // success (with minor errors)
						icon = 'status-icons ico-status02';
						description = $translate.instant('basics.common.modelState.ready');
						break;
					default: // failed
						icon = 'status-icons ico-status01';
						description = $translate.instant('basics.common.modelState.failed');
						break;
				}

				const toolTip = $translate.instant('basics.common.showLog');
				let imageHtml = isReadOnly
					? ('<i class="block-image ' + icon + '"></i>')//control-icons
					: ('<button class="' + icon + ' gridcell-ico" title="' + toolTip + '" id="doc_mdl_state_' + id + '"></button>');
				if (icon === null) {
					imageHtml = '';
				}
				return imageHtml + '<span class="pane-r">' + description + '</span>';
			}

			// noinspection JSUnusedLocalSymbols
			function formatter(row, cell, value, columnDef, dataContext, plainText, uniqueId) {
				value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

				let formatHtml = getStatusDescription(value, dataContext.Id);

				if (value === 3) {
					$timeout(function () {
						const targetElement = $('#doc_mdl_state_' + dataContext.Id);
						targetElement.on('click', function () {
							if (dataContext.JobLoggingMessage && dataContext.JobLoggingMessage.length > 0) {
								platformDialogService.showMsgBox(dataContext.JobLoggingMessage, $translate.instant('basics.common.showLog'));
								if (dataContext.PreviewModelFk) {
									service.reConvertPreviewModel(dataContext);
								} else if (dataContext.FileArchiveDocFk) {
									service.getPreviewModelStatus(dataContext.FileArchiveDocFk);
								}
							}
						});
					}, 200);
				}
				if (!dataContext || !service.data.length) {
					return formatHtml;
				}

				const entity = _.find(service.data, {Id: dataContext.Id});

				if (entity && uniqueId) {
					// update status cell
					$('#' + uniqueId).html(formatHtml);
				}

				return formatHtml;
			}

			service.getPreviewModelStatus = function getPreviewModelStatus(fileArchiveDocFk) {
				return $http.get(globals.webApiBaseUrl + 'documents/projectdocument/getjobstatusbyfilearchivedocfk?fileArchiveDocFk=' + fileArchiveDocFk);
			};

			service.reConvertPreviewModel = function (doc) {
				$http.post(globals.webApiBaseUrl + 'documents/projectdocument/reconvertpreviewmodel', doc).then(function (res) {
					const model = res.data || res;
					doc.ModelJobState = 2;
					doc.PreviewModelFk = model.PreviewModelFk;
				});
			};

			return service;
		}
	]);

})(angular);