/**
 * Created by reimer on 06.03.2017
 */

(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainGaebImportService', ['$q',
		'$http',
		'$translate',
		'platformModalService',
		'platformDialogService',
		'platformLongTextDialogService',
		'platformTranslateService',
		'$log',
		'boqMainGaebHelperService',
		'basicsLookupdataLookupDefinitionService',
		'basicsCommonSimpleUploadService',
		function ($q,
			$http,
			$translate,
			platformModalService,
			platformDialogService,
			platformLongTextDialogService,
			translateService,
			$log,
			boqMainGaebHelperService,
			basicsLookupdataLookupDefinitionService,
			basicsCommonSimpleUploadService) {

			var service = {};

			var selectGaebFile = function (importOptions) {

				var fileElement = angular.element('<input type="file" />');
				if (fileElement) {
					importOptions.allowedExtensions = boqMainGaebHelperService.getAllowedGaebExt(importOptions.wizardParameter);
					var fileFilter = importOptions.allowedExtensions.toString();
					fileElement.attr('accept', fileFilter);
					if (importOptions.allowMultipleFileSelection) {
						fileElement.attr('multiple', '');
					}
					fileElement.bind('change', function () {
						recursiveFileLoop(fileElement[0].files, 0, importOptions).then(function (){
							importOptions.createItemService.load();
						});
					});
					fileElement.bind('destroy', function () {
						fileElement.unbind('change');
					});
					fileElement.focus().click();
				}
			};

			function recursiveFileLoop(files, fileIx, importOptions) {
				var deferred = $q.when(false);
				if (fileIx < files.length) {

					var file = files[fileIx];
					return processSelectedGaebFile(importOptions, file).then(function () {
						recursiveFileLoop(files, ++fileIx, angular.copy(importOptions));
					});
				}
				return deferred.promise;
			}

			function processSelectedGaebFile(importOptions, file) {

				var deferred = $q.defer();
				var boqMainService = importOptions.boqMainService;

				var fileExt =  boqMainGaebHelperService.getFileExt(file.name);
				if ((fileExt.includes('84')) && boqMainService.getList().length <= 1){
					showImportFailedWarning('boq.main.gaebX84ImportError');
					return deferred.promise;
				}

				var result = boqMainGaebHelperService.validateFileExt(file.name, importOptions.allowedExtensions);
				if (result.error) {
					showImportFailedWarning(result.message).then(function () {
						deferred.resolve();
					});
				} else {

					var createItemCall = createItem;
					createItemCall(importOptions).then(function () {
						updateAndExecute(importOptions, function () {

							service.parseGaebFile(importOptions.GaebInfo, file).then(function (data) {
								importOptions.GaebInfo = data;   // add gaeb info
								var errorCounter = importOptions.GaebInfo.Errors.length;
								var bodyText = $translate.instant('boq.main.GaebFileContainsErrors', {p1: importOptions.GaebInfo.OriginalFileName}, {p2: errorCounter}) + ' ' + $translate.instant('basics.common.continue');

								var logOptions = {};
								logOptions.title = 'GAEB Import Preview';
								logOptions.content = '<h1>Preview GAEB file ' + importOptions.GaebInfo.OriginalFileName + ' import</h1>';
								logOptions.content += '<p>Label:' + importOptions.GaebInfo.LblBoQ + '</p>';
								logOptions.content += '<p>Error(s):</p>';
								angular.forEach(importOptions.GaebInfo.Errors, function (item) {
									logOptions.content += '<p>' + item + '</p>';
								});

								if (errorCounter===0 || importOptions.GaebInfo.SuppressGaebImportErrorCheck) {
									continueImport(importOptions);
								} else {
									const options = {
										width: '700px',
										headerText$tr$: 'basics.common.questionDialogDefaultTitle',
										iconClass: 'ico-question',
										bodyText: bodyText,
										details: {
											show: true,
											type: 'longtext',
											value: logOptions.content
										},
										buttons: [
											{ id: 'yes' },
											{ id: 'no' }
										]
									};
									platformDialogService.showDetailMsgBox(options).then(function(result) {
										if (result.yes) {
											continueImport(importOptions);
										}
									});
								}

								function continueImport(importOptions) {
									importOptions.GaebInfo = data;
									importOptions.GaebInfo.AddNewItems = true;
									importOptions.GaebInfo.OverwriteExistingItems = true;

									// setup wizard
									var hasOnlyRootItem = _.isEmpty(importOptions.boqRootItem.BoqItems);
									importOptions.wizardParameter.showPartialImportPage = showPartialImportPage(importOptions.GaebInfo.OriginalFileName) && !hasOnlyRootItem;
									importOptions.wizardParameter.showCatalogAssignmentPage = importOptions.GaebInfo.HasCatalogs;
									var showWizard = importOptions.wizardParameter.showPartialImportPage || importOptions.wizardParameter.showCatalogAssignmentPage;

									if (showWizard) {
										deferred.resolve(service.showMappingDialog(importOptions));
									} else {
										deferred.resolve(service.importGaebFile(importOptions));
									}
								}
							});
						});
					});
				}
				return deferred.promise;
			}

			function createItem(importOptions) {

				var deferred = $q.defer();

				if (importOptions.createItemService) {

					importOptions.createItemService.createItem().then(function (newCompositeItem) {
						importOptions.boqRootItem = newCompositeItem.BoqRootItem;
						importOptions.GaebInfo.BoqHeaderId = newCompositeItem.BoqRootItem.BoqHeaderFk;
						deferred.resolve();
					});

				} else {
					deferred.resolve();
				}
				return deferred.promise;
			}

			function updateAndExecute(importOptions, fn) {

				if (importOptions.mainService) {
					importOptions.mainService.updateAndExecute(fn);
				} else {
					fn();
				}
			}

			function showImportFailedWarning(message) {
				var modalOptions = {
					headerTextKey: 'boq.main.warning',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				return platformModalService.showDialog(modalOptions);
			}

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.showImportDialog = function (importOptions) {

				if (importOptions.boqMainService === null) {
					$log.warn('Must pass boqMainService!');
					return;
				}

				// importOptions.boqRootItem = importOptions.boqMainService.getSelected();
				importOptions.boqRootItem = importOptions.boqMainService.getRootBoqItem();

				if (_.isEmpty(importOptions.boqRootItem)) {
					showImportFailedWarning('boq.main.gaebImportBoqMissing');
					$log.warn('GAEB import not possible - reason: No BoQ is selected!');
					// return;
				}

				if (!Object.prototype.hasOwnProperty.call(importOptions, 'projectId')) {
					importOptions.projectId = importOptions.boqMainService.getSelectedProjectId() || 0;
				}

				if (!Object.prototype.hasOwnProperty.call(importOptions, 'wizardParameter')) {
					importOptions.wizardParameter = {};
				}

				// service.reset();
				importOptions.GaebInfo = {};
				importOptions.GaebInfo.BoqHeaderId = importOptions.boqRootItem.BoqHeaderFk;
				importOptions.GaebInfo.ProjectId = importOptions.projectId; // WIC has no Project assignment!
				importOptions.allowMultipleFileSelection = false;
				selectGaebFile(importOptions);
				// });

			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.showImportMultipleFilesDialog = function (importOptions) {

				if (!Object.prototype.hasOwnProperty.call(importOptions, 'createItemService') || importOptions.createItemService === null) {
					$log.warn('Must pass createItemService to create BoQs!');
					return;
				}

				if (!Object.prototype.hasOwnProperty.call(importOptions, 'projectId')) {
					$log.warn('Must pass projectId!');
					return;
				}

				if (!Object.prototype.hasOwnProperty.call(importOptions, 'wizardParameter')) {
					importOptions.wizardParameter = {};
				}

				if (Object.prototype.hasOwnProperty.call(importOptions.createItemService, 'canCreate') && !importOptions.createItemService.canCreate()) {
					$log.warn('Creation of BoQ headers is prohibited!');
					return;
				}

				importOptions.GaebInfo = {};
				importOptions.GaebInfo.ProjectId = importOptions.projectId; // WIC has no Project assignment!
				importOptions.allowMultipleFileSelection = true;
				selectGaebFile(importOptions);

			};

			var deleteTempFileOnServer = function (gaebInfo) {

				$http.post(globals.webApiBaseUrl + 'boq/main/import/deletelocalgaebfile', gaebInfo).then(
					function successCallback() {
						angular.noop();
					},
					function errorCallback() {    // suppress exception dialog
						angular.noop();
					});
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.showMappingDialog = function (importOptions) {

				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-gaeb-import-wizard.html',
					backdrop: false,
					windowClass: 'form-modal-dialog',
					headerTextKey: 'boq.main.gaebImport',
					resizeable: true,
					width: '75%',
					importOptions: importOptions
					// value: { selectedId: -1 }  // object that will be returned
				};

				return platformModalService.showDialog(modalOptions).then(function (result) {
					if (result) {
						return service.importGaebFile(importOptions);
					} else {
						return deleteTempFileOnServer(importOptions.GaebInfo);
					}
					// return result;
				});

			};

			function parseGaebFileCall(file, model) {
				return basicsCommonSimpleUploadService.uploadFile(file, {
					basePath: 'boq/main/import/',
					customRequest: {
						Model: model,
						OriginalFileName: file.name
					}
				});
			}

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.parseGaebFile = function (defaultGaebInfo, fileData) {
				return parseGaebFileCall(fileData, angular.toJson(defaultGaebInfo)).then(
					function (response) {
						return response.GaebInfoData;
					});
			};

			var processImportGeabFile = function (gaebInfo) {

				var canceller = $q.defer();

				var cancel = function (reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http.post(globals.webApiBaseUrl + 'boq/main/import/importlocalgaebfile', gaebInfo, {timeout: canceller.promise}).then(
						function (response) {
							return response.data;
						}
					);

				return {
					promise: promise,
					cancel: cancel
				};
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.importGaebFile = function (importOptions) {
				var request = processImportGeabFile(importOptions.GaebInfo);

				return request.promise.then(function(response) {
						if (response.Result===true && importOptions.boqMainService!==null) {
							importOptions.boqMainService.refreshBoqData(true);  // call succeeded function
						}
						let topDescription = response.Result ? $translate.instant('boq.main.importSucceeded') : $translate.instant('boq.main.importFailed');
						let iconClass = response.Result ? 'tlb-icons ico-info' : 'tlb-icons ico-error';
						return platformLongTextDialogService.showDialog({
							headerText$tr$: 'boq.main.gaebImport',
							topDescription: { text: topDescription, iconClass: iconClass },
							codeMode: true,
							hidePager: true,
							dataSource: new function() {
								var detailText = '';
								if (response.Info) {
									detailText += response.Info.split('\\n').join('\n') + '\n\n'; // split+join reformats the text
								}
								if (_.some(response.Warnings)) {
									detailText += response.Warnings.join('\n');
								}
								platformLongTextDialogService.LongTextDataSource.call(this);
								this.current = detailText;
							}
						});

					},
					function (reason) {              /* jshint ignore:line */
						console.log('processImport canceled - reason: ' + reason.config.timeout.$$state.value);
					});
			};

			function showPartialImportPage(filename) {

				var whitelist = ['81', '82', '83', '85', '86'];
				return whitelist.includes(boqMainGaebHelperService.getFileExt(filename).slice(-2));
			}

			function init() {
				translateService.registerModule([moduleName, 'basics.common'], true);
				basicsLookupdataLookupDefinitionService.load([
					'boqMainCatalogAssignCatalogCombobox',
					'boqMainCatalogAssignCostgroupCombobox'
				]);
			}

			init();

			return service;

		}
	]);
})(angular);
