/**
 * Created by Baedeker on 2015-04-20
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformSidebarWizardCommonTasksService
	 * @description
	 * Service for standarad wizard task description and execution
	 */
	angular.module('platform').factory('platformSidebarWizardCommonTasksService', ['platformModalService', '$translate',

		function (platformModalService, $translate) {

			var service = {
				prepareMessageText: getMessageText,
				showErrorNoSelection: showErrorNoSelection,
				showSuccessfullyDoneMessage: showSuccessfullyDoneMessage,
				assertSelection: assertSelection,
				provideDisableInstance: provideDisableInstance,
				provideEnableInstance: provideEnableInstance,
				provideSetValueToSimpleField: provideSetValueToSimpleField
			};

			/* jshint -W072 */ // many parameters because they are needed
			function getMessageText(msgTextID, entities, codeField, placeHolder) {
				var msgText = '';
				if (entities && angular.isArray(entities)) {
					if (placeHolder && codeField) {
						msgText = getCollection(msgTextID, entities, codeField, placeHolder);
					}
				} else {
					if (placeHolder && codeField) {
						var param = {};
						param[placeHolder] = entities[codeField];
						msgText = $translate.instant(msgTextID, param);
					} else {
						msgText = $translate.instant(msgTextID);
					}
				}

				return msgText;
			}

			/* jshint -W072 */ // many parameters because they are needed
			function getCollection(msgTextID, entities, codeField, placeHolder) {
				var msgText = '';
				var collection = '';

				angular.forEach(entities, function (ent) {
					collection += collection.length > 0 ? ', ' + ent[codeField] : ent[codeField];
				});

				if (placeHolder && codeField) {
					var param = {};
					param[placeHolder] = collection;
					msgText = $translate.instant(msgTextID, param);
				}

				return msgText;
			}

			function showErrorNoSelection(title, message) {
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: message || service.prepareMessageText('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};

				return platformModalService.showDialog(modalOptions);
			}

			function showSuccessfullyDoneMessage(title, message) {
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: message || service.prepareMessageText('cloud.common.doneSuccessfully'),
					iconClass: 'ico-info'
				};

				return platformModalService.showDialog(modalOptions);
			}

			function assertSelection(selItem, title, message) {
				var allow = false;
				if (selItem && selItem.Id >= 0) {
					allow = true;
				} else {
					service.showErrorNoSelection(title, message);
				}

				return allow;
			}

			/* jshint -W072 */ // many parameters because they are needed
			function provideDisableInstance(dataService, caption, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, id) {
				function disableInstance() {
					var selected = dataService.getSelected();
					var selectedEntities = dataService.getSelectedEntities();

					var modalOptions = {
						headerText: $translate.instant(captionTR),
						bodyText: '',
						iconClass: 'ico-info'
					};
					if (selectedEntities && selectedEntities.length >= 2) {
						modalOptions.bodyText = getMessageText('cloud.common.questionDisableSelection', selectedEntities, codeField, 'sel');
						var doneSelection = [];
						var notDoneSelection = [];
						return platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
							.then(function (result) {
								if (result.yes) {
									angular.forEach(selectedEntities, function (sel) {
										if (sel.IsLive) {
											sel.IsLive = false;
											dataService.markItemAsModified(sel);
											doneSelection.push(sel);
											// modalOptions.bodyText = getMessageText(doneMsg, selected, codeField, placeHolder);
										} else {
											notDoneSelection.push(sel);
											// modalOptions.bodyText = getMessageText(nothingToDoMsg, selected, codeField, placeHolder);
										}
									});
									modalOptions.bodyText = '';
									if (doneSelection && doneSelection.length > 0) {
										modalOptions.bodyText = getMessageText(doneMsg, doneSelection, codeField, placeHolder);
									}
									if (notDoneSelection && notDoneSelection.length > 0) {
										modalOptions.bodyText += getMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
									}
									return platformModalService.showDialog(modalOptions);
								}
							});
					} else if (selected && selected.Id > 0) {
						if (selected.IsLive) {
							selected.IsLive = false;
							dataService.markCurrentItemAsModified();

							modalOptions.bodyText = getMessageText(doneMsg, selected, codeField, placeHolder);
						} else {
							modalOptions.bodyText = getMessageText(nothingToDoMsg, selected, codeField, placeHolder);
						}
						return platformModalService.showDialog(modalOptions);
					} else {
						modalOptions.bodyText = getMessageText('cloud.common.noCurrentSelection');
						return platformModalService.showDialog(modalOptions);
					}
				}

				return {
					id: id || 'commonWizardTasksDisableInstance',
					text: caption,
					text$tr$: captionTR,
					type: 'item',
					showItem: true,
					cssClass: 'rw md',
					fn: disableInstance
				};
			}

			/* jshint -W072 */ // many parameters because they are needed
			function provideEnableInstance(dataService, caption, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, id) {
				function enableInstance() {
					var selected = dataService.getSelected();
					var selectedEntities = dataService.getSelectedEntities();

					var modalOptions = {
						headerText: $translate.instant(captionTR),
						bodyText: '',
						iconClass: 'ico-info'
					};

					if (selectedEntities && selectedEntities.length >= 2) {
						modalOptions.bodyText = getMessageText('cloud.common.questionEnableSelection', selectedEntities, codeField, 'sel');
						var doneSelection = [];
						var notDoneSelection = [];
						return platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
							.then(function (result) {
								if (result.yes) {
									angular.forEach(selectedEntities, function (sel) {
										if (!sel.IsLive) {
											sel.IsLive = true;
											dataService.markItemAsModified(sel);
											doneSelection.push(sel);
										} else {
											notDoneSelection.push(sel);
										}
									});
									modalOptions.bodyText = '';
									if (doneSelection && doneSelection.length > 0) {
										modalOptions.bodyText = getMessageText(doneMsg, doneSelection, codeField, placeHolder);
									}
									if (notDoneSelection && notDoneSelection.length > 0) {
										modalOptions.bodyText += ' ' + getMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
									}
									return platformModalService.showDialog(modalOptions);
								}
							});
					} else if (selected && selected.Id > 0) {
						if (!selected.IsLive) {
							selected.IsLive = true;
							dataService.markCurrentItemAsModified();

							modalOptions.bodyText = getMessageText(doneMsg, selected, codeField, placeHolder);
						} else {
							modalOptions.bodyText = getMessageText(nothingToDoMsg, selected, codeField, placeHolder);
						}
						return platformModalService.showDialog(modalOptions);
					} else {
						modalOptions.bodyText = getMessageText('cloud.common.noCurrentSelection');
						return platformModalService.showDialog(modalOptions);
					}
				}

				return {
					id: id || 'commonWizardTasksDisableInstance',
					text: caption,
					text$tr$: captionTR,
					type: 'item',
					showItem: true,
					cssClass: 'rw md',
					fn: enableInstance
				};
			}

			function provideSetValueToSimpleField(conf) {
				return doProvideSetValueToSimpleField(
					conf.dataService, conf.caption, conf.captionTR, conf.codeField, conf.changeProp, conf.newVal, conf.doneMsg,
					conf.nothingToDoMsg, conf.placeHolder, conf.id, conf.validator, conf.validatorMsg
				);
			}

			function doProvideSetValueToSimpleField(dataService, caption, captionTR, codeField, changeProp, newVal, doneMsg, nothingToDoMsg, placeHolder, id, validator, validatorMsg) {
				function setEntityValueToSimpleField() {
					var selected = dataService.getSelected();
					var selectedEntities = dataService.getSelectedEntities();

					var modalOptions = {
						headerText: $translate.instant(captionTR),
						bodyText: '',
						iconClass: 'ico-info'
					};
					var validationFn = validator && _.isFunction(validator) ? validator : function () {
						return true;
					};
					if (selectedEntities && selectedEntities.length >= 2) {
						modalOptions.bodyText = getMessageText('cloud.common.questionEnableSelection', selectedEntities, codeField, 'sel');
						var doneSelection = [];
						var notDoneSelection = [];
						var validationErrors = [];

						return platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
							.then(function (result) {
								if (result.yes) {
									angular.forEach(selectedEntities, function (sel) {
										if (sel[changeProp] !== newVal && validationFn(sel)) {
											sel[changeProp] = newVal;
											dataService.markItemAsModified(sel);
											doneSelection.push(sel);
										} else if (!validationFn(sel)) {
											validationErrors.push(sel);
										} else {
											notDoneSelection.push(sel);
										}
									});
									modalOptions.bodyText = '';
									if (doneSelection && doneSelection.length > 0) {
										modalOptions.bodyText = getMessageText(doneMsg, doneSelection, codeField, placeHolder);
									}
									if (notDoneSelection && notDoneSelection.length > 0) {
										modalOptions.bodyText += ' ' + getMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
									}
									if (validationErrors && validationErrors.length > 0) {
										modalOptions.bodyText += ' ' + getMessageText(validatorMsg, validationErrors, codeField, placeHolder);
									}
									return platformModalService.showDialog(modalOptions);
								}
							});
					} else if (selected && selected.Id > 0) {
						if (selected[changeProp] !== newVal && validationFn(selected)) {
							selected[changeProp] = newVal;
							dataService.markCurrentItemAsModified();

							modalOptions.bodyText = getMessageText(doneMsg, selected, codeField, placeHolder);
						} else if (!validationFn(selected)) {
							modalOptions.bodyText = getMessageText(validatorMsg, selected, codeField, placeHolder);
						} else {
							modalOptions.bodyText = getMessageText(nothingToDoMsg, selected, codeField, placeHolder);
						}
						return platformModalService.showDialog(modalOptions);
					} else {
						modalOptions.bodyText = getMessageText('cloud.common.noCurrentSelection');
						return platformModalService.showDialog(modalOptions);
					}
				}

				return {
					id: id || 'commonWizardTasksDisableInstance',
					text: caption,
					text$tr$: captionTR,
					type: 'item',
					showItem: true,
					cssClass: 'rw md',
					fn: setEntityValueToSimpleField
				};
			}

			return service;
		}
	]);
})(angular);
