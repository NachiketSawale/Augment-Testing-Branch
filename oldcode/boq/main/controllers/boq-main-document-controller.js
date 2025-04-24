(function () {
	/* global globals, _ */
	'use strict';

	var angModule = angular.module('boq.main');

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angModule.controller('boqMainDocumentController', ['$scope', 'boqMainService', 'boqMainDocumentService',
		function ($scope, boqMainService, boqMainDocumentService) {
			boqMainDocumentService.initController($scope, boqMainService);
		}
	]);

	angModule.factory('boqMainDocumentService', ['platformGridControllerService', 'boqMainDocumentUiService', 'boqMainDocumentDataService',
		function (platformGridControllerService, boqMainDocumentUiService, boqMainDocumentDataService) {
			return {
				initController: function ($scope, boqMainService) {
					var dataServiceContainer = boqMainDocumentDataService.getService($scope, boqMainService);
					var validationService = null;
					platformGridControllerService.initListController($scope, boqMainDocumentUiService, dataServiceContainer.service, validationService, {columns: []});

					boqMainDocumentDataService.extendForUploadDownload($scope, dataServiceContainer);
				}
			};
		}
	]);

	angModule.factory('boqMainDocumentUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'boqMainTranslationService',
		function (PlatformUIStandardConfigService, platformSchemaService, basicsLookupdataConfigGenerator, boqMainTranslationService) {
			var domainSchema;
			var gridLayout;

			domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'BoqItemDocumentDto'}).properties;
			domainSchema.DocOwner = {domain: 'description'};

			gridLayout =
				{
					fid: 'boq.main.document.grid.config',
					groups: [{'gid': 'basicData', 'attributes': ['docowner', 'description', 'originfilename', 'documenttypefk']},
						{'gid': 'entityHistory', 'isHistory': true}],
					overloads:
						{
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
							originfilename: {readonly: true},
							docowner: {readonly: true, isTransient: true}
						}
				};

			return new PlatformUIStandardConfigService(gridLayout, domainSchema, boqMainTranslationService);
		}
	]);

	angModule.factory('boqMainDocumentDataService', [
		'$http', 'platformDataServiceFactory', 'platformDialogService', 'basicsCommonServiceUploadExtension', 'basicsCommonUploadDownloadControllerService', 'boqMainCommonService', 'boqMainCrbService', 'boqMainCrbVariableDataService',
		function ($http, platformDataServiceFactory, platformDialogService, basicsCommonServiceUploadExtension, basicsCommonUploadDownloadControllerService, boqMainCommonService, boqMainCrbService, boqMainCrbVariableDataService) {
			var serviceContainer;
			var boqMainService;
			var crbVariableService;
			var currentBoqItem;
			var currentCrbVariable;
			var baseRoute = globals.webApiBaseUrl + 'boq/main/document/';

			function attachPropertyDocOwner(boqItemDocument) {
				var crbVariable;
				var prdProduct;

				if (_.isObject(currentBoqItem)) {
					crbVariable = _.find(crbVariableService.getList(), {'Id': boqItemDocument.CrbBoqVariableFk});
					prdProduct = boqItemDocument.CrbPrdProductFk === null ? null : currentBoqItem.PrdProduct;

					boqItemDocument.DocOwner = currentBoqItem.Reference;
					if (_.isObject(crbVariable)) {
						boqItemDocument.DocOwner += ' - ' + crbVariable.Number;
					} else if (_.isObject(prdProduct)) {
						boqItemDocument.DocOwner += ' - ' + prdProduct.ProductName;
					}
				}
			}

			function addDocumentsToUi(documents) {
				_.forEach(documents, function (document) {
					attachPropertyDocOwner(document);

					serviceContainer.data.itemList.push(document);
					serviceContainer.data.markItemAsModified(document, serviceContainer.data);
					serviceContainer.service.setSelected(document);
				});

				serviceContainer.data.listLoaded.fire();
			}

			function onPrdProductChanged(prdDocuments) {
				_.forEach(_.filter(serviceContainer.data.itemList, function (document) {
					return document.CrbPrdProductFk !== null;
				}), function (document) {
					serviceContainer.data.deleteItem(document, serviceContainer.data);
				});

				addDocumentsToUi(prdDocuments);
			}

			function onCrbVariablesDeleted(dummy, deletedCrbVariables) {
				_.forEach(deletedCrbVariables, function (crbVariable) {
					_.remove(serviceContainer.data.itemList, {'CrbBoqVariableFk': crbVariable.Id});
				});
				serviceContainer.data.listLoaded.fire();
			}

			function createDocument(fileInfo, isCrbVariableTheDocumentOwner) {
				$http.post(baseRoute + 'create', {FileName: fileInfo.fileName}).then(function (response) {
					var createdBoqItemDocument = response.data;
					createdBoqItemDocument.FileArchiveDocFk = fileInfo.FileArchiveDocId;
					if (isCrbVariableTheDocumentOwner) {
						createdBoqItemDocument.CrbBoqVariableFk = currentCrbVariable.Id;
					} else {
						createdBoqItemDocument.BoqHeaderFk = currentBoqItem.BoqHeaderFk;
						createdBoqItemDocument.BoqItemFk = currentBoqItem.Id;
						boqMainService.markItemAsModified(currentBoqItem);
					}

					addDocumentsToUi([createdBoqItemDocument]);
				});
			}

			function uploadDocument(fileInfo) {
				if (_.isObject(currentBoqItem)) {
					if (_.isObject(currentCrbVariable)) {
						platformDialogService.showDialog({
							headerText$tr$: 'boq.main.assignDocument',
							bodyTemplateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-assign-document.html',
							showOkButton: true,
							showCancelButton: true,
							resizeable: true,
							height: '200px',
							minHeight: '100px',
							width: '300px',
							minWidth: '200px',
							fileInfo: fileInfo
						});
					} else {
						createDocument(fileInfo, false);
					}
				}
			}

			function onCurrentBoqItemChanged() {
				currentBoqItem = boqMainService.getSelected();
				currentCrbVariable = null;
			}

			function onCurrentCrbVariableChanged() {
				currentCrbVariable = crbVariableService.getCurrentCrbVariable();
			}

			function onCrbVariablesLoaded() {
				serviceContainer.data.listLoaded.fire();
			}

			return {
				getService: function ($scope, boqMainServiceParam) {
					if (boqMainService !== boqMainServiceParam) {
						serviceContainer = null;
						boqMainService = boqMainServiceParam;
						crbVariableService = boqMainCrbVariableDataService.getService(boqMainService);
					}

					// Registers/Unregisters functions
					boqMainService.registerSelectionChanged(onCurrentBoqItemChanged);
					crbVariableService.registerListLoaded(onCrbVariablesLoaded);
					crbVariableService.registerSelectionChanged(onCurrentCrbVariableChanged);
					crbVariableService.registerEntityDeleted(onCrbVariablesDeleted);
					boqMainCrbService.prdProductChanged.register(onPrdProductChanged);
					$scope.$on('$destroy', function () {
						boqMainService.unregisterSelectionChanged(onCurrentBoqItemChanged);
						crbVariableService.unregisterListLoaded(onCrbVariablesLoaded);
						crbVariableService.unregisterSelectionChanged(onCurrentCrbVariableChanged);
						crbVariableService.unregisterEntityDeleted(onCrbVariablesDeleted);
						boqMainCrbService.prdProductChanged.unregister(onPrdProductChanged);
					});

					// Creates the service
					if (!_.isObject(serviceContainer)) {
						var serviceOptions =
							{
								flatLeafItem:
									{
										entityRole: {leaf: {itemName: 'BoqItemDocument', parentService: boqMainService}},
										actions: {delete: true, create: false},
										useItemFilter: true,
										httpRead:
											{
												route: baseRoute, endRead: 'list',
												initReadData: function (readData) {
													currentBoqItem = boqMainService.getSelected(); // Also covers the use case that this UI container apears for the first time
													var boqHeaderId = _.isObject(currentBoqItem) ? currentBoqItem.BoqHeaderFk : -1;
													var boqItemId = _.isObject(currentBoqItem) ? currentBoqItem.Id : -1;
													readData.filter = '?boqHeaderId=' + boqHeaderId + '&boqItemId=' + boqItemId;
												}
											},
										presenter: {
											list: {
												incorporateDataRead: function (readData, data) {
													return serviceContainer.data.handleReadSucceeded(readData, data);
												}
											}
										}
									}
							};
						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

						// If the container of service 'crbVariableService' is not shown the documents of the CRB variables are hidden
						// (value of property 'BoqItemDocument.DocOwner' cannot be set because of the not available CRB variables)
						serviceContainer.data.getList = function () {
							var filteredDocuments = _.filter(serviceContainer.data.itemList, function (boqItemDocument) {
								return boqItemDocument.CrbBoqVariableFk === null || _.some(crbVariableService.getList());
							});

							_.forEach(filteredDocuments, function (bqItemDocument) {
								attachPropertyDocOwner(bqItemDocument);
							});

							return filteredDocuments;
						};
						serviceContainer.service.getList = serviceContainer.data.getList;
					}

					return serviceContainer;
				},

				extendForUploadDownload: function ($scope, serviceContainer) {
					basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, {
						uploadServiceKey: 'boq-document',
						uploadConfigs: {SectionType: 'BoqDocument', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
						canPreview: true,
						canCancelUpload: false,
						uploadFilesCallBack: function (dummy, fileInfo) {
							uploadDocument(fileInfo);
						},
						getExtension: function (defaultDocumentTypes) {
							return boqMainService.isCrbBoq() ? '.png,.jpg,.jpeg,.pdf,.zip,.zipx,.txt,.rtf,.xls,.xlsx,.ods,.doc,.docx,.odt,.dwg,.dxf' // For any changes here the redundant list in the server code ('CrbDataExchangeLogic.CrbFileExtensionsWhiteList') must be changed too.
								: _.map(defaultDocumentTypes, function (itm) {
									return _.isString(itm.Extention) ? '.' + itm.Extention.replace('.', '').replace('*', '') : '.';
								}).join();
						}
					});

					serviceContainer.service.singleUploadVisible = false;
					serviceContainer.service.canPreviewEditOfficeDocument = false;
					serviceContainer.service.canMultipleUploadFiles = function () {
						var currentBoqItem = boqMainService.getSelected();
						return serviceContainer.service.basicCanMultipleUploadFiles() &&
							!(boqMainCommonService.isRoot(currentBoqItem) || (boqMainService.isCrbBoq() && currentBoqItem.BoqLineTypeFk === 1));
					};
					_.forEach($scope.tools.items, function (item) {
						if ('multipleupload' === item.id) {
							item.permission = '#c';
						} // Sets the permission that causes the auto hide in the readonly mode
					});

					basicsCommonUploadDownloadControllerService.initGrid($scope, serviceContainer.service);
				},

				createDocument: createDocument
			};
		}
	]);

	angModule.controller('boqMainAssignDocumentController', ['$scope', '$translate', 'boqMainDocumentDataService',
		function ($scope, $translate, boqMainDocumentDataService) {
			$scope.documentOwners = {items: [{id: 'crbVar', name: $translate.instant('boq.main.crbVariableTitle')}, {id: 'boqItem', name: $translate.instant('boq.main.boqStructure')}], valueMember: 'id', displayMember: 'name'};
			$scope.selectedDocumentOwner = 'crbVar';
			$scope.dialog.getButtonById('ok').fn = function () {
				$scope.$close({ok: true});
				boqMainDocumentDataService.createDocument($scope.dialog.modalOptions.fileInfo, $scope.selectedDocumentOwner === 'crbVar');
			};
		}
	]);
})();
