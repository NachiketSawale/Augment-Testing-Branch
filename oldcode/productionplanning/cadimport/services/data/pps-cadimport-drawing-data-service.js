(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.cadimport';
	var module = angular.module(moduleName);
	module.factory('ppsCadimportDrawingDataService', [
		'platformDataServiceFactory', 'productionplanningDrawingPinningContextExtension', '$http',
		'PlatformMessenger', 'ppsCadImportHelperService',
		'platformModalService', 'ppsCadimportDrawingProcessor',
		'platformModuleNavigationService', '$q',
		'platformDataServiceDataProcessorExtension',
		'$translate', 'platformTranslateService',
		'platformDialogService', '$sce',
		function (platformDataServiceFactory, pinningContextExtension, $http,
				  PlatformMessenger, ppsCadImportHelperService,
				  platformModalService, ppsCadimportDrawingProcessor,
				  navigationService, $q,
				  platformDataServiceDataProcessorExtension,
				  $translate, platformTranslateService,
				  platformDialogService, $sce) {
			var serviceInfo = {
				flatRootItem: {
					module: module,
					serviceName: 'ppsCadimportDrawingDataService',
					entityNameTranslationID: 'productionplanning.drawing.entityDrawing',
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/engineering/cadimport/',
						endRead: 'customfiltered',
						usePostForRead: true
					},
					entityRole: {
						root: {
							itemName: 'Drawing',
							moduleName: 'cloud.desktop.moduleDisplayNameEngineeringCADImport'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							//useCurrentClient: true,
							//includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false,
							pinningOptions: pinningContextExtension.createPinningOptions()
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.dtos || []
								};
								_.forEach(readData.dtos, function (dto) {
									container.service.onPropertyChange({entity: dto, col: 'ImportModel'});
								});
								return container.data.handleReadSucceeded(result, data);
							}
						}
					},
					dataProcessor: [ppsCadimportDrawingProcessor]
				}
			};
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			container.service.onImportingEvent = new PlatformMessenger();

			container.service.canImportCad = function () {
				if (_.find(container.service.getList(), {isImporting: true})) {
					return false;
				}
				return _.some(container.service.getSelectedEntities(), function (entity) {
					return entity.IsSuccessfully !== 2;
				});
			};

			container.service.importCad = function () {
				var canImportEntities = _.filter(container.service.getSelectedEntities(), function (entity) {
					if (entity.IsSuccessfully !== 2) {
						return true;
					}
				});
				var drawingCodes = _.map(canImportEntities, 'Code').join(' ');
				var bodyText = platformTranslateService.instant('productionplanning.cadimport.importConfirmBody', undefined, true) + '<br>' + drawingCodes;
				ensureNotInProductionOrInTransport(canImportEntities).then(function (result) {
					if(!result) {
						return;
					}
					platformModalService.showYesNoDialog(bodyText, 'productionplanning.cadimport.importCadBtn', 'yes')
						.then(function (result) {
							if (result.yes) {
								_.forEach(canImportEntities, function (selected) {
									selected.isImporting = true;
								});
								refreshUI();
								container.service.onImportingEvent.fire(null, {isImporting: true});
								$http.post(globals.webApiBaseUrl + 'productionplanning/engineering/cadimport/import', canImportEntities).then(function (response) {
									if (response && response.data) {
										var promises = [];
										var successInfo = '';
										var warningInfo = '';
										var errorInfo = '';
										var errorInfoDetail = '';
										var successIds = [];
										_.forEach(canImportEntities, function (selected) {
											var result = _.find(response.data, {Id: selected.Id});
											if (_.get(result, 'Successed')) {
												successIds.push(selected.DrawingId);
												selected.Version = 0;
												promises.push(container.service.deleteItem(selected));
												if (result.WarningInfo && result.WarningInfo.length > 0) {
													warningInfo += '<h4>' + selected.Code + '</h4>' + result.WarningInfo + '<br><br>';
												} else {
													successInfo += selected.Code + ' ';
												}
											} else {
												selected.isImporting = false;
												errorInfo += selected.Code + ' ';
												errorInfoDetail += '<h4>' + selected.Code + '</h4>' + result.Info + '<br>'+ result.Info1 + '<br><br>';
											}
										});
										if (_.some(response.data, {Successed: false})) {
											container.service.onImportingEvent.fire(null, {isImporting: false});
											refreshUI();
										}

										$q.all(promises).then(function () {
											bodyText = '';
											if (successInfo) {
												bodyText += platformTranslateService.instant('productionplanning.cadimport.importSuccessful', undefined, true) + '<br>' + successInfo + '<br>';
											}
											if (warningInfo) {
												bodyText += platformTranslateService.instant('productionplanning.cadimport.importSuccessful', undefined, true) + '<br>' + warningInfo + '<br>';
											}
											if (errorInfo) {
												if (bodyText) {
													bodyText += '<br>';
												}
												bodyText += platformTranslateService.instant('productionplanning.cadimport.importFailed', undefined, true) + '<br>' + errorInfo;
											}
											bodyText = $sce.trustAsHtml(bodyText);
											var dialogOption = {
												bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.cadimport/templates/cad-import-dialog-template.html',
												bodyFlexColumn: true,
												bodyMarginLarge: true,
												resizeable: true,
												windowClass: 'error-dialog',
												iconClass: _.isEmpty(successIds) ? 'error' : 'info',
												headerText: '*Import',
												headerText$tr$: 'productionplanning.cadimport.importCadBtn',
												dataItem: {
													alarm: {},
													details: {
														show: false,
														texts: [platformTranslateService.instant('cloud.common.showDetails', undefined, true), platformTranslateService.instant('cloud.common.hideDetails', undefined, true)]
													},
													exception: {
														errorCodeMessage: function () {
															return bodyText;
														},
														errorDetail: $sce.trustAsHtml(errorInfoDetail)
													}
												},
												buttons: [{
													id: 'ok'
												}, {
													id: 'showDetails',
													caption$tr$: 'cloud.common.showDetails',
													show: function (info) {
														var exception = _.get(info, 'modalOptions.dataItem.exception');
														if (exception) {
															return exception.errorDetail;
														}
														return false;
													},
													fn: function ($event, info) {
														if (_.has(info, 'modalOptions.dataItem.details')) {
															// save the intial sizes
															var sizes = _.get(info, 'scope.dialog.sizes');
															if (!sizes) {
																var modalContent = $event.target.closest('.modal-content');
																_.set(info, 'scope.dialog.sizes', {
																	initWidth: modalContent.clientWidth,
																	initHeight: modalContent.clientHeight
																});
															}

															// functionallity
															info.modalOptions.dataItem.details.show = !info.modalOptions.dataItem.details.show;
															info.button.caption = info.modalOptions.dataItem.details.texts[+info.modalOptions.dataItem.details.show];

															var element = angular.element($event.target.closest('.modal-content'));
															if (!info.modalOptions.dataItem.details.show) {
																// save expanded size values
																_.set(info, 'scope.dialog.sizes.expandedWidth', element[0].clientWidth);
																_.set(info, 'scope.dialog.sizes.expandedHeight', element[0].clientHeight);

																element.width(_.get(info, 'scope.dialog.sizes.initWidth'));
																element.height(_.get(info, 'scope.dialog.sizes.initHeight'));
																//element.removeClass('expanded');
																// element.css({'width': _.get(info, 'scope.dialog.sizes.initWidth'), 'height': _.get(info, 'scope.dialog.sizes.initHeight')});
															} else {
																if (_.has(info, 'scope.dialog.sizes.expandedWidth')) {
																	element.width(_.get(info, 'scope.dialog.sizes.expandedWidth'));
																	element.height(_.get(info, 'scope.dialog.sizes.expandedHeight'));
																}
																//element.addClass('expanded');
															}
														}
													}
												}]
											};
											if (!_.isEmpty(successIds)) {
												dialogOption.customButtons = [{
													id: 'goToDrawing',
													caption: '*Go to Drawing(s)',
													caption$tr$: 'productionplanning.cadimport.goToDrawing',
													disabled: false,
													autoClose: false,
													cssClass: 'app-icons ico-test',
													fn: function (event, info) {
														info.$close();
														navigationService.navigate({
															moduleName: 'productionplanning.drawing'
														}, {DrawingIds: successIds}, 'DrawingIds');
													}
												}];
											}
											platformDialogService.showDialog(dialogOption);
										});
									}
								});
							}
						});
				});

			};

			container.service.onPropertyChangeEvent = new PlatformMessenger();
			container.service.onPropertyChange = function (args) {
				if (args && args.entity && args.col === 'ImportModel') {
					container.service.gridRefresh();//have to refresh grid if set isTransient for detail row
					ppsCadImportHelperService.updateSelection(args.entity[args.col], args.entity.PersistObject.Previews);
					container.service.onPropertyChangeEvent.fire(null, args);
				}
			};

			function ensureNotInProductionOrInTransport(canImportEntities) {
				var valid = true;
				if (angular.isArray(canImportEntities)) {
					for (var i = 0; i < canImportEntities.length; i++) {
						var treeRoots = canImportEntities[i].PersistObject.Previews;
						for (var j = 0; j < treeRoots.length; j++) {
							valid = canImportEntities[i].ImportModel !== 5 || !isInProductionOrIntransport(treeRoots[j]);
							if(!valid) {
								break;
							}
						}
						if(!valid) {
							break;
						}
					}
				}
				if(valid) {
					return $q.when(true);
				} else {
					return platformModalService.showDialog({
						headerText: $translate.instant('productionplanning.cadimport.drawingImportNotAllow'),
						bodyText: $translate.instant('productionplanning.cadimport.notAllowWihleInProdOrInTran'),
						iconClass: 'ico-error'
					}).then(function () {
						return false;
					});
				}
			}

			function isInProductionOrIntransport(previewItem) {
				if(_.isNil(previewItem)) {
					return false;
				}

				var inProdOrInTrs = previewItem.IsChecked && (previewItem.InProduction || previewItem.InTransport);
				if(!inProdOrInTrs && angular.isArray(previewItem.ChildItems)) {
					for (var i = 0; i < previewItem.ChildItems.length; i++) {
						inProdOrInTrs = isInProductionOrIntransport(previewItem.ChildItems[i]);
						if(inProdOrInTrs) {
							break;
						}
					}
				}
				return inProdOrInTrs;
			}

			function refreshUI() {
				platformDataServiceDataProcessorExtension.doProcessData(container.data.itemList, container.data);
				container.service.gridRefresh();
			}

			return container.service;
		}
	]);
})();