(function (angular) {
	'use strict';

	// noinspection JSValidateTypes
	angular.module('platform').service('platformBulkEditorReportService', platformBulkEditorReportService);

	platformBulkEditorReportService.$inject = ['_', '$q', '$injector', 'platformModalFormConfigService', 'platformObjectHelper', 'platformTranslateService', 'platformRuntimeDataService', 'platformDataValidationService', '$translate', 'moment'];

	function platformBulkEditorReportService(_, $q, $injector, platformModalFormConfigService, objectHelper, platformTranslateService, runtimeDataService, platformDataValidationService, $translate, moment) {
		const self = this;
		let concurrencyExcWasHandled = null;

		function getValidationErrors(entityChangeList) {
			return _.filter(entityChangeList, function (entityChanges) {
				var items = _.filter(entityChanges, function (change) {
					if (change.asyncValidationResult || change.validationResult) {
						return true;
					}
				});
				if (!_.isEmpty(items)) {
					return true;
				}
			});
		}

		self.processReport = function processReport(entityChangeList, response, itemService, validationService, gridConfig, headlessOption) {
			concurrencyExcWasHandled = false;
			var validationError = getValidationErrors(entityChangeList);
			// show report in headless mode only when validation errors occur
			if (!headlessOption || headlessOption && !_.isEmpty(validationError)) {
				const reportItem = processReportResults(headlessOption ? validationError : entityChangeList);
				showResultModal(reportItem, response, itemService, entityChangeList, validationService, gridConfig);
			}
		};

		function cleanChangesList(changesList) {
			_.each(changesList, (entityChangeList) => {
				_.remove(entityChangeList, function (changeObject) {
					// remove validationObject
					if (_.has(changeObject, 'error$tr$') && _.has(changeObject, 'error')) {
						return true;
					}
				});
			});
		}

		function handleConcurrencyException(response, dialogConfig, reportItem) {
			if (response && concurrencyExcWasHandled === false && response.status === 409 && response.userHasStartedDataReload) {
				dialogConfig.showOkButton = false;
				reportItem.changedRecords = 0;
				reportItem.unchangedRecords = reportItem.totalRecords;
			} else {
				delete dialogConfig.customBtn1;
				dialogConfig.showOkButton = true;

			}
		}

		function showResultModal(reportItem, response, itemService, entityChangeList, validationService, gridConfig) {
			const dialogConfig = {
				title: platformTranslateService.instant('platform.bulkEditor.changeReport', null, true),
				dataItem: reportItem,
				formConfiguration: {
					fid: 'bulkEditor.changeReport',
					showGrouping: true,
					groups: [
						{
							header$tr$: 'platform.bulkEditor.records',
							gid: 'platform.bulkEditor.records',
							isOpen: true,
							sortOrder: 100
						},
						{
							header$tr$: 'platform.bulkEditor.details',
							gid: 'platform.bulkEditor.details',
							isOpen: false,
							sortOrder: 110
						}
					],
					rows: [
						{
							gid: 'platform.bulkEditor.records',
							rid: 'changedRecords',
							label$tr$: 'platform.bulkEditor.totalRecords',
							type: 'integer',
							readonly: true,
							model: 'totalRecords',
							visible: true,
							sortOrder: 200
						},
						{
							gid: 'platform.bulkEditor.records',
							rid: 'changedRecords',
							label$tr$: 'platform.bulkEditor.changedRecords',
							type: 'integer',
							readonly: true,
							model: 'changedRecords',
							visible: true,
							sortOrder: 210
						},
						{
							gid: 'platform.bulkEditor.records',
							rid: 'unchangedRecords',
							label$tr$: 'platform.bulkEditor.unchangedRecords',
							type: 'integer',
							readonly: true,
							model: 'unchangedRecords',
							visible: true,
							sortOrder: 220
						},
						{
							gid: 'platform.bulkEditor.details',
							rid: 'logs',
							label$tr$: 'platform.bulkEditor.logs',
							type: 'text',
							readonly: true,
							model: 'logs',
							visible: true,
							sortOrder: 230,
							height: 150
						}
					]
				},
				showOkButton: true,
				customBtn1: {
					label: 'Apply Again',
					action: function action() {
						const serverSideBulkProcessing = _.isBoolean(gridConfig.serverSideBulkProcessing) && gridConfig.serverSideBulkProcessing;
						const bulkConfig = {serverSide: serverSideBulkProcessing};

						$injector.get('platformBulkEditorChangeProcessorService').runChanges(validationService, itemService, bulkConfig)
							.then(function (changes) {
								$injector.get('platformBulkEditorBaseService').getServiceWithUpdate(itemService).update().then(function () {
									concurrencyExcWasHandled = true;
									const reportItem = processReportResults(changes);
									showResultModal(reportItem, response, itemService);
								});
							});
					}
				}
			};

			platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);
			handleConcurrencyException(response, dialogConfig, reportItem);
			platformModalFormConfigService.showDialog(dialogConfig);
		}

		function processReportResults(entityChangesList) {
			cleanChangesList(entityChangesList);
			let changedEntities = 0;
			let unchangedEntities = 0;
			let logs = '';

			_.each(entityChangesList, function (entityChanges) {
				let isChanged = false;
				// get the displayMember from the first item
				const change = entityChanges && entityChanges[0] ? entityChanges[0] : null;
				logs += change ? change.entityDisplayMember + ':\n' : '';
				if (!_.isEmpty(entityChanges)) {
					// each changeObject belongs to an entity´s Property Change
					_.each(entityChanges, function (changeObject) {
						// 1 change is enough
						if (changeObject.isChanged || concurrencyExcWasHandled) {
							isChanged = true;
							logs += createLogMessage('platform.bulkEditor.msgChangeSuccess', changeObject);
						} else {
							if (changeObject.valueAlreadyAssigned) {
								logs += createLogMessage('platform.bulkEditor.msgNewOldValueAreTheSame', changeObject);
							}
							if (changeObject.isReadonly) {
								logs += createLogMessage('platform.bulkEditor.msgPropertyIsReadonly', changeObject);
							}
							if (changeObject.validationResult && changeObject.validationResult.valid === false) {
								if (changeObject.validationResult.error$tr$) {
									changeObject.validatioErrorMsg = $translate.instant(changeObject.validationResult.error$tr$, changeObject.validationResult.error$tr$param$);
								} else if (changeObject.validationResult.error) {
									changeObject.validatioErrorMsg = changeObject.validationResult.error;
								}
								logs += createLogMessage('platform.bulkEditor.msgChangeError', changeObject);
							}
							if (changeObject.asyncValidationResult && changeObject.asyncValidationResult.valid === false) {
								if (changeObject.asyncValidationResult.error$tr$) {
									changeObject.validatioErrorMsg = $translate.instant(changeObject.asyncValidationResult.error$tr$, changeObject.asyncValidationResult.error$tr$param$);
								} else if (changeObject.asyncValidationResult.error) {
									changeObject.validatioErrorMsg = changeObject.asyncValidationResult.error;
								}
								logs += createLogMessage('platform.bulkEditor.msgChangeError', changeObject);
							}
						}
					});
					logs += '\n';
				}

				if (isChanged) {
					changedEntities++;
				} else {
					unchangedEntities++;
				}
			});

			function createLogMessage(logMsgKey, changeObject) {
				return $translate.instant(logMsgKey, {
					property: changeObject.propertyDisplayMember,
					value: moment.isMoment(changeObject.desiredValue) ? changeObject.desiredValue.format('L LTS') : changeObject.desiredValue,
					validationErrorMsg: changeObject.validatioErrorMsg
				}) + '\n';
			}

			return {
				changedRecords: changedEntities,
				unchangedRecords: unchangedEntities,
				logs: logs,
				totalRecords: entityChangesList.length
			};
		}
	}
})(angular);
