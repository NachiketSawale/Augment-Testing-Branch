/**
 * Created by bh on 07.05.2018.
 */
(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainRenumberService
	 * @function
	 *
	 * @description
	 * boqMainRenumberService is the data service for all functionality related to boq renumbering functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainRenumberService', ['$http', '$q', '$rootScope', '$log', 'platformModalService', 'platformModalFormConfigService', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformSidebarWizardConfigService', 'platformGridAPI', '$translate',
		'boqMainRenumberDialogConfigService', 'boqMainDocPropertiesService', 'boqMainCommonService', 'boqMainLineTypes', '$injector',
		function ($http, $q, $rootScope, $log, platformModalService, platformModalFormConfigService, platformTranslateService, platformSidebarWizardCommonTasksService, platformSidebarWizardConfigService, platformGridAPI, $translate,
			boqMainRenumberDialogConfigService, boqMainDocPropertiesService, boqMainCommonService, boqMainLineTypes, $injector) {

			var service = {};

			var renumberOptions = {
				renumberMode: 1 // 1: renumber whole boq; 2: renumber currently selected items
			};

			function cleanUpSelection(selectedItems, boqMainService) {
				// For the grid allows multi selection of items in a tree we have to clean up the selection to avoid
				// having double entries and only have those items that make sense in terms of renumbering.

				var cleanedUpSelectedItems = [];
				var remainingSelectedItems = [];

				if (!_.isArray(selectedItems) || selectedItems.length === 0) {
					return null;
				}

				var boqRootItem = _.find(selectedItems, {BoqLineTypeFk: boqMainLineTypes.root});
				if (_.isObject(boqRootItem)) {
					// In case the root is selected we assume having to renumber the whole boq so all other selections are useless.
					return [boqRootItem];
				}

				// For the moment it doesn't make sense to renumber single items as selected positions or items not having a reference number so we remove them from the selection
				selectedItems = _.filter(selectedItems, function (item) {
					return boqMainCommonService.isDivisionOrRoot(item) && !boqMainCommonService.isTextElementWithoutReference(item);
				});

				// Now sort items by hierarchical level
				selectedItems = _.sortBy(selectedItems, function (item) {
					return boqMainService.getBoqItemLevel(item);
				});

				// First add all selected items on the highest identical level
				var higestIdenticalLevel = boqMainService.getBoqItemLevel(selectedItems[0]);

				angular.forEach(selectedItems, function (item) {
					if (boqMainService.getBoqItemLevel(item) === higestIdenticalLevel) {
						cleanedUpSelectedItems.push(item);
					} else {
						remainingSelectedItems.push(item); // These items are expected to have a level beneath the highest identical level
					}
				});

				// The remaining selected items could be a part of the children hierarchy of the items on the highest level.
				// To check this we determine the parent path of the remaining items and look if there are items included from the
				// highest or remaining levels. If so we remove those remaining items from the list of remaining selected items.
				var parentPathMaps = _.map(remainingSelectedItems, function (remainingItem) {
					var parentPath = [];
					boqMainService.getBoqItemById(remainingItem, parentPath);
					return {item: remainingItem, parentPath: parentPath, matches: false};
				});

				angular.forEach(parentPathMaps, function (parentPathItem) {

					// Check if the given remaining items parent path includes items already in the selectedItems list
					_.forEach(selectedItems, function (selectedItem) {
						if (parentPathItem.item !== selectedItem) {
							if (_.isObject(_.find(parentPathItem.parentPath, {Id: selectedItem.Id}))) {
								parentPathItem.matches = true;
							}
						}
					});

					if (!parentPathItem.matches) {
						// This item isn't located below any of the other selected items
						cleanedUpSelectedItems.push(parentPathItem.item);
					}
				});

				return cleanedUpSelectedItems;
			}

			function checkSettings(boqMainService, handleSaveOfDefaultProperties) {
				// Check if the modified document properties are valid
				var errorList = [];
				var promise = $q.when(true);
				if (!boqMainDocPropertiesService.checkDocumentProperties(errorList)) {

					// Construct error message out of returned errorList
					var errorMessage = '';

					angular.forEach(errorList, function (errorEntry) {
						errorMessage += errorEntry + '<br>';
					});

					// Now we try to show an error dialog
					var errorModalOptions = {
						headerTextKey: 'boq.main.BoqStructureInvalid',
						bodyText: errorMessage,
						showOkButton: true,
						iconClass: 'ico-error'
					};

					return platformModalService.showDialog(errorModalOptions).then(function () {
						return false;
					});
				}

				if (handleSaveOfDefaultProperties && !boqMainDocPropertiesService.getEditVal() && boqMainDocPropertiesService.getSelectedBoqHeader() > 0) {
					// We're now also allowed to change some settings of default boq porperties.
					// For we may not change the default properties itself we solve this problem by
					// generating new specific boq properties and attach them to the currently loaded
					// boq header.

					// Look if there are modifications
					if (boqMainDocPropertiesService.hasModifications()) {

						// Ask user if he want to create specific boq properties when doing the following save.
						return platformModalService.showYesNoDialog('boq.main.createSpecificBoqProperties', 'boq.main.navDocumentProperties', 'yes').then(function (modalResult) {
							if (modalResult.yes) {
								boqMainDocPropertiesService.setSpecificStrFlag(true);
								boqMainDocPropertiesService.getSelectedDocProp().BoqTypeId = null;
								boqMainDocPropertiesService.setEditVal(true, true);
								return true;
							}

							return false;
						});
					}
				}

				return promise;
			}

			function checkForDecoupledVersionBoqItemsAndInform(boqMainService) {
				let decoupledVersionBoqItems = boqMainService.getDecoupledVersionBoqItems(boqMainService.getRootBoqItem());
				if(_.isArray(decoupledVersionBoqItems) && decoupledVersionBoqItems.length > 0) {

					let detailText = '<h2>' +  $translate.instant('boq.main.decoupledVersionBoqItemsDetailText') + '</h2>';
					_.forEach(decoupledVersionBoqItems, function (decoupledVersionBoqItem) {
						detailText += '<p> - ' + $translate.instant('boq.main.Reference') + ': ' + decoupledVersionBoqItem.Reference + '</p>';
					});

					let dialogOptions = {
						width: '600px',
						headerText: $translate.instant('boq.main.decoupledVersionBoqItemsHeaderText'),
						iconClass: 'ico-info',
						bodyText: $translate.instant('boq.main.decoupledVersionBoqItemsBodyText'),
						details: {
							show: false,
							type: 'longtext',
							value: detailText
						}
					};

					return $injector.get('platformDialogService').showDetailMsgBox(dialogOptions).then(function () {
						return true;
					});
				}
			}

			service.renumberBoqItems = function renumberBoqItems(boqMainService) {
				var modalRenumberBoqConfig;
				var modalOptions;
				var title = 'boq.main.boqRenumber';

				if (!boqMainService.isRootBoqItemLoaded()) {
					modalOptions = {
						headerTextKey: 'boq.main.warning',
						bodyTextKey: 'boq.main.gaebImportBoqMissing', // Delivers a reasonable message although originally meant for boq import.
						showOkButton: true,
						iconClass: 'ico-warning'
					};
					platformModalService.showDialog(modalOptions);
					$log.warn('Renumbering not possible - reason: No BoQ is selected!');
					return;
				}

				var renumberAll = $translate.instant('boq.main.renumberModeAll');
				var renumberSelected = $translate.instant('boq.main.renumberModeSelected');

				modalRenumberBoqConfig = {
					title: $translate.instant(title),
					dataItem: renumberOptions,
					formConfiguration: boqMainRenumberDialogConfigService.getFormConfig(renumberAll, renumberSelected),
					dialogOptions: {
						width: '70%'
					},
					resizeable:true,
					showOkButton: false,
					handleCancel: function handleCancel() {
						boqMainDocPropertiesService.setRenumberMode(false);
					},
					customBtn1: {
						label: $translate.instant('boq.main.renumberProperties'),
						action: function action() {
							platformGridAPI.grids.commitAllEdits();
							checkSettings(boqMainService).then(function (result) {
								var errorModalOptions = null;
								var selectedBoqItems = null;
								if (result) {
									if (renumberOptions.renumberMode === 2) {
										selectedBoqItems = boqMainService.getSelectedEntities();
										selectedBoqItems = cleanUpSelection(selectedBoqItems, boqMainService);

										if (!_.isArray(selectedBoqItems) || selectedBoqItems.length === 0) {
											errorModalOptions = {
												headerTextKey: 'boq.main.renumberInvalidSelection',
												bodyTextKey: 'boq.main.renumberNoValidSelection',
												showOkButton: true,
												iconClass: 'ico-error'
											};

											return platformModalService.showDialog(errorModalOptions).then(function () {
												return false;
											});
										}
									}

									boqMainService.renumberBoq(selectedBoqItems, boqMainDocPropertiesService.getStructureDetail()).then(function (renumberSucceeded) {
										let errorModalOptions = null;
										let result = false;
										if (!renumberSucceeded) {
											errorModalOptions = {
												headerTextKey: 'boq.main.renumberAborted',
												bodyTextKey: 'boq.main.renumberFailed',
												showOkButton: true,
												iconClass: 'ico-error'
											};

											return platformModalService.showDialog(errorModalOptions).then(function () {
												return result;
											});
										}
										else {
											checkForDecoupledVersionBoqItemsAndInform(boqMainService);
										}
									});

									boqMainDocPropertiesService.setRenumberMode(false);
								}
							});
						}
					},
					customBtn2: {
						label: $translate.instant('boq.main.renumberPropertiesSave'),
						action: function action() {
							platformGridAPI.grids.commitAllEdits();
							checkSettings(boqMainService, true).then(function (result) {
								if (result) {
									boqMainDocPropertiesService.saveDocumentProperties().then(function (savedDocumentProperties) {
										var errorModalOptions = null;
										var selectedBoqItems = null;
										if (angular.isDefined(savedDocumentProperties)) {

											// Reload the structure for the current boq header
											boqMainService.reloadStructureForCurrentHeader().then(function () {
												if (renumberOptions.renumberMode === 2) {
													selectedBoqItems = boqMainService.getSelectedEntities();
													selectedBoqItems = cleanUpSelection(selectedBoqItems, boqMainService);

													if (!_.isArray(selectedBoqItems) || selectedBoqItems.length === 0) {
														errorModalOptions = {
															headerTextKey: 'boq.main.renumberInvalidSelection',
															bodyTextKey: 'boq.main.renumberNoValidSelection',
															showOkButton: true,
															iconClass: 'ico-error'
														};

														return platformModalService.showDialog(errorModalOptions).then(function () {
															return false;
														});
													}
												}

												// The saved properties and structure details can be determined on server side and do not have to be handed over here.
												boqMainService.renumberBoq(selectedBoqItems).then(function (renumberSucceeded) {
													if (!renumberSucceeded) {
														errorModalOptions = {
															headerTextKey: 'boq.main.renumberAborted',
															bodyTextKey: 'boq.main.renumberFailed',
															showOkButton: true,
															iconClass: 'ico-error'
														};

														return platformModalService.showDialog(errorModalOptions).then(function () {
															return false;
														});
													}
													else {
														checkForDecoupledVersionBoqItemsAndInform(boqMainService);
													}
												});

												boqMainDocPropertiesService.setRenumberMode(false);
											});
										}
									});
								}
							});
						}
					}
				};

				platformTranslateService.translateFormConfig(modalRenumberBoqConfig.formConfiguration);

				modalRenumberBoqConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

				boqMainDocPropertiesService.load(boqMainService).then(function () {
					boqMainDocPropertiesService.setRenumberMode(true);
					platformModalFormConfigService.showDialog(modalRenumberBoqConfig);
				});
			};

			return service;
		}]);
})();
