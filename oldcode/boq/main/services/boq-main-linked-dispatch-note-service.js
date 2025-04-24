(function () {
	/* global angular, globals , Platform , $, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainLinkedDispatchNoteService', ['platformGridControllerService', 'boqMainLinkedDispatchNoteUiService', 'boqMainLinkedDispatchNoteDataService',
		'$translate',
		function (platformGridControllerService, boqMainLinkedDispatchNoteUiService, boqMainLinkedDispatchNoteDataService,
			$translate) {

			return {
				initController: function (scope, rootScope, moduleName) {

					let linkedDispatchNoteDataService = boqMainLinkedDispatchNoteDataService.getService({moduleName: moduleName});

					platformGridControllerService.initListController(scope, boqMainLinkedDispatchNoteUiService, linkedDispatchNoteDataService, null, {
						columns: [], enableCopyPasteExcel: false
					});

					scope.containerHeaderInfo = {
						prefix: $translate.instant('cloud.common.Container') + ': ',
						parentContainerName: ' '
					};

					function registerModuleChangedMessage(parentContainerName) {
						if (parentContainerName !== scope.containerHeaderInfo.parentContainerName) {
							scope.containerHeaderInfo.parentContainerName = parentContainerName;
						}
					}
					boqMainLinkedDispatchNoteDataService.registerModuleChangedMessage(registerModuleChangedMessage);

					function onParentGridCellClick(evt, parentInfo) {
						linkedDispatchNoteDataService.triggerParentClick(parentInfo);
					}

					const unregistParentGridCellClick = rootScope.$on('linked-dispatch-note-parent-grid-click', onParentGridCellClick);

					scope.$on('$destroy', function () {
						boqMainLinkedDispatchNoteDataService.unregisterModuleChangedMessage(registerModuleChangedMessage);
						unregistParentGridCellClick();
					});
				}
			};
		}
	]);

	angularModule.factory('boqMainLinkedDispatchNoteUiService', ['$injector', 'platformUIStandardConfigService', 'platformModuleNavigationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'boqMainTranslationService', 'boqMainLinkedDispatchNoteLookupService', 'productionplanningProductEngProdComponentMdcMaterialCostCodeFkLookupConfigService',
		function ($injector, platformUIStandardConfigService, platformModuleNavigationService, platformSchemaService, basicsLookupdataConfigGenerator, boqMainTranslationService, boqMainLinkedDispatchNoteLookupService, mdcMaterialCostCodeFkLookupConfigService) {
			function getRootService() {
				var rootService = $injector.get('boqMainService');
				while (rootService.parentService()) {
					rootService = rootService.parentService();
				}
				return rootService;
			}

			function overloadDispatchRecordFk(displayProperty) {
				var ret;
				ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'boqMainLinkedDispatchNoteLookupService',
					additionalColumns: false,
					valMember: 'Id',
					dispMember: displayProperty
				});
				ret.readonly = true;
				return ret;
			}

			function overloadDispatchHeaderCode() {
				const moduleName = 'logistic.dispatching';

				var ret = overloadDispatchRecordFk('HeaderCode');
				ret.navigator = {
					'moduleName': moduleName,
					'navFunc': function (dummy, item) {
						getRootService().updateAndExecute(function () {
							platformModuleNavigationService.navigate({'moduleName': moduleName}, {'Id': boqMainLinkedDispatchNoteLookupService.getHeaderId(item.DispatchRecordFk)}, 'Code');
						});
					}
				};

				return ret;
			}

			function overloadDispatchProductCode() {
				const moduleName = 'productionplanning.producttemplate';

				var ret = overloadDispatchRecordFk('ProductCode');
				ret.navigator = {
					'moduleName': moduleName,
					'navFunc': function (dummy, item) {
						getRootService().updateAndExecute(function () {
							platformModuleNavigationService.navigate({'moduleName': moduleName}, {'Id': boqMainLinkedDispatchNoteLookupService.getProductDescriptionId(item.DispatchRecordFk)}, 'Code');
						});
					}
				};

				return ret;
			}

			var domainSchema = platformSchemaService.getSchemaFromCache({
				moduleSubModule: 'Boq.Main',
				typeName: 'BoqItem2DispatchRecordDto'
			});
			var gridLayout =
				{
					fid: 'boq.main.boqitem2dispatchrecord.grid.config',
					groups: [{
						'gid': 'basicData',
						'attributes': ['boqitemfk', 'dispatchrecordnumber', 'dispatchrecordquantity', 'dispatchrecordheadercode', 'dispatchrecordheaderdescr', 'dispatchrecordproductcode', 'dispatchrecordproductdescr', 'userdefiend1', 'userdefined2', 'userdefined3', 'engdrwcomptypefk', 'mdcmaterialcostcodeproductfk','productcomponentquantity', 'productcomponentuomfk']
					}, {'gid': 'entityHistory', 'isHistory': true}],
					overloads: {
						dispatchrecordnumber: overloadDispatchRecordFk('RecordNo'),
						dispatchrecordquantity: overloadDispatchRecordFk('Quantity'),
						// dispatchrecorddatedffective: overloadDispatchRecordFk('DateEffective'), todo
						dispatchrecordheadercode: overloadDispatchHeaderCode(),
						dispatchrecordheaderdescr: overloadDispatchRecordFk('HeaderDescr'),
						dispatchrecordproductcode: overloadDispatchProductCode(),
						dispatchrecordproductdescr: overloadDispatchRecordFk('ProductDescr'),
						boqitemfk: {
							readonly: true,
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BoqItem',
									displayMember: 'Reference'
								}
							},
						},
						engdrwcomptypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype',
							null,
							{
								showIcon: true,
								filterKey: 'productionplanning-product-engProdComponent-engdrwcomptypefk-filter'
							}),
						mdcmaterialcostcodeproductfk: mdcMaterialCostCodeFkLookupConfigService.provideMdcMaterialCostCodeFkLookupConfig(),
						productcomponentuomfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							readonly:true
						})
					}
				};

			let service = new platformUIStandardConfigService(gridLayout, domainSchema.properties, boqMainTranslationService);
			let readonlyColumns = ['engdrwcomptypefk', 'mdcmaterialcostcodeproductfk','productcomponentquantity', 'productcomponentuomfk'];
			_.forEach(service.getStandardConfigForListView().columns, col => {
				if(_.indexOf(readonlyColumns, col.id) > -1) {
					col.editor = null;
				}
			});
			let addition = {
				grid: _.concat($injector.get('platformObjectHelper').extendGrouping([{
					afterId: 'mdcmaterialcostcodeproductfk',
					id: 'mdcmaterialcostcodeproductfkdescription',
					field: 'MdcMaterialCostCodeProductFk',
					name: '*Result Description',
					name$tr$: 'boq.main.MdcMaterialCostCodeProductDesc',
					formatter: 'dynamic',
					readonly: true,
					domain: function (item, column) {
						var prop = $injector.get('drawingComponentTypes').lookupInfo[item.EngDrwCompTypeFk];
						if (prop && prop.column) {
							column.formatterOptions = _.clone(prop.lookup.formatterOptions);
							column.formatterOptions.displayMember = 'DescriptionInfo.Translated';
						} else {
							column.editorOptions = null;
							column.formatterOptions = null;
						}
						return 'lookup';
					}
				}]))
			};
			$injector.get('platformUIStandardExtentService').extend(service, addition, domainSchema.properties);
			return service;
		}
	]);

	angularModule.factory('boqMainLinkedDispatchNoteDataService', ['platformDataServiceFactory', '$timeout', 'platformDataServiceSelectionExtension',
		'$translate', '$injector', 'boqMainLinkedDispatchNoteLookupService',
		function (platformDataServiceFactory, $timeout, platformDataServiceSelectionExtension,
			$translate, $injector, dispatchNoteLookupService) {

			let dispatchNoteServiceCache = {},
				dispatchNoteDataCaches = {},
				selectionChangedFns = {},
				configCaches = {};

			let lastRequestId = 0;
			let lastSelectedItem;
			let moduleContext = {
				moduleName: ' ',
				parentService: null,
				title: ' '
			};
			let usingModuleChangedMessage = new Platform.Messenger();

			const SELECTIONCHANGED = 'SelectionChanged';
			const MODULENAME = 'sales.common';

			function createNewComplete(options) {

				let parentService = options.parentService;

				const serviceOptions = {
					flatRootItem: {
						module: angular.module(MODULENAME),
						serviceName: 'boqMainLinkedDispatchNoteDataService',
						entityRole: {
							root: {itemName: 'BoqItem2DispatchRecord'},
						},
						actions: {delete: false, create: false},
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/boqitem2dispatchrecord/', endRead: 'list',
							usePostForRead: true,
							initReadData: function (readData) {
								const parentId = moduleContext.parentService.getSelected().Id;
								readData.ParentId = parentId;
								lastRequestId = parentId;

								switch (moduleContext.uuid) {
									case '689e0886de554af89aadd7e7c3b46f25': // Wip
										readData.From = 'WIP';
										break;
									case '39608924dc884afea59fe04cb1434543': // Bill
										readData.From = 'BILL';
										break;
									case '65294188ea2f4aeea7f1243ecf096434':  // BoqStructure of BILL
									case '6e5b061fc7014aec91717edbb576312c':  // BoqStructure of WIP
										readData.From = 'BOQITEM';
										break;
								}
							},
						},
						presenter: {
							list: {
								incorporateDataRead: function(readData, data){
									let result = {
										FilterResult: readData.FilterResult,
										dtos: readData.Dtos || []
									};
									dispatchNoteLookupService.setDispatchRecords({
										DispatchRecords: readData.DispatchRecords,
										DispatchHeaders: readData.DispatchHeaders,
										Products: readData.Products
									});
									return serviceContainer.data.handleReadSucceeded(result, data);
								}
							}
						},
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.showHeaderAfterSelectionChanged = null;

				dispatchNoteDataCaches[moduleContext.moduleName] = serviceContainer.data;
				let service = serviceContainer.service;

				function initContainer() {
					const title = $translate.instant(moduleContext.title);
					usingModuleChangedMessage.fire(title);
					doReadDispatchData(moduleContext.moduleName);
				}

				function onParentItemSelectedChange(e, entity) {

					lastSelectedItem = entity;
					if (!entity) {
						const moduleName = moduleContext.moduleName;
						let data = dispatchNoteDataCaches[moduleName];
						if (platformDataServiceSelectionExtension.supportSelection(data)) {
							platformDataServiceSelectionExtension.deselect(data);
						}
						data.clearContent(data);
						return;
					}

					let selectedItem = moduleContext.parentService.getSelected();
					if (!selectedItem) {
						return;
					}

					initContainer(service);
				}

				service.triggerParentClick = function (parentInfo) {
					if (lastSelectedItem === parentInfo.clickedItem) {
						return;
					}
					lastSelectedItem = parentInfo.clickedItem;

					let selChangedFn = selectionChangedFns[parentInfo.title + SELECTIONCHANGED];
					if (selChangedFn) {
						moduleContext = configCaches[parentInfo.uuid];
						selChangedFn(null, parentInfo.clickedItem);
					}
				};

				service.isSubItemService = () => false;
				return service;
			}

			function getService(serviceOptions) {

				if (!dispatchNoteServiceCache[serviceOptions.moduleName]) {
					dispatchNoteServiceCache[serviceOptions.moduleName] = createNewComplete(serviceOptions);
				}
				return dispatchNoteServiceCache[serviceOptions.moduleName];
			}

			function doReadDispatchData(moduleName) {
				let dataService = dispatchNoteServiceCache[moduleName];
				if (dataService && angular.isDefined(moduleContext.parentService)) {
					const parentSelected =  moduleContext.parentService.getSelected();
					if (parentSelected && parentSelected.Id !== lastRequestId) {
						dataService.load();
					}
				}
			}

			function register(options) {
				if (!options.uuid || !options.moduleName || !options.parentService) {
					throw new Error('Please Set Linked Dispatch Note Configuration.');
				}

				if (angular.isDefined(moduleContext[options.uuid])) {
					return;
				} else {
					configCaches[options.uuid] = options;
				}

				//set moduleContext to WIP or BILL as init
				moduleContext = configCaches['689e0886de554af89aadd7e7c3b46f25'] || configCaches['39608924dc884afea59fe04cb1434543'] || {};

				let leadingService = _.isString(options.parentService) ? $injector.get(options.parentService) : options.parentService;
				if (leadingService) {
					selectionChangedFns[options.title + SELECTIONCHANGED] = function (e, entity) {
						// this will stop capture
						if (!entity) {
							return;
						}

						usingModuleChangedMessage.fire(moduleContext.title);
						doReadDispatchData(moduleContext.moduleName);
					};

					leadingService.registerSelectionChanged(selectionChangedFns[options.title + SELECTIONCHANGED]);
				}

				$injector.get('platformTranslateService').registerModule(MODULENAME);
			}

			// if sub module exist, please unRegister it
			function unRegister() {
				selectionChangedFns = {};
			}

			function registerModuleChangedMessage(fn) {
				usingModuleChangedMessage.register(fn);
			}

			function unregisterModuleChangedMessage(fn) {
				usingModuleChangedMessage.unregister(fn);
			}

			return {
				getService: getService,
				register: register,
				unRegister: unRegister,
				registerModuleChangedMessage: registerModuleChangedMessage,
				unregisterModuleChangedMessage: unregisterModuleChangedMessage,
			};

		}
	]);

	angularModule.factory('boqMainLinkedDispatchNoteLookupService', ['$q', '$http', 'platformLookupDataServiceFactory', '$timeout',
		function ($q, $http, platformLookupDataServiceFactory, $timeout) {
			let _service = platformLookupDataServiceFactory.createInstance({}).service;
			let _dispatchRecords = [];

			_service.getItemById = function (id) {
				return _.find(_dispatchRecords, ['Id', id]);
			};
			_service.getItemByIdAsync = function (id) {
				return $q.when(_service.getItemById(id));
			};

			_service.setRootBoqItem = function (rootBoqItem) {
				_dispatchRecords = [];
				if (rootBoqItem) {
					$http.get(globals.webApiBaseUrl + 'boq/main/boqitem2dispatchrecord/lookupdata' + '?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function (response) {
						_service.setDispatchRecords(response.data);
					});
				}
			};

			_service.setDispatchRecords = function (data){
				_dispatchRecords = data.DispatchRecords;
				_.forEach(_dispatchRecords, function (dispatchRecord) {
					const header = _.find(data.DispatchHeaders, {'Id': dispatchRecord.DispatchHeaderFk});
					dispatchRecord.HeaderId = header.Id;
					dispatchRecord.HeaderCode = header.Code;
					dispatchRecord.HeaderDescr = header.Description;
					const product = _.find(data.Products, {'Id': dispatchRecord.ProductFk});
					if (product) {
						dispatchRecord.ProductDescriptionFk = product.ProductDescriptionFk;
						dispatchRecord.ProductCode = product.Code;
						dispatchRecord.ProductDescr = product.DescriptionInfo.Translated ?? product.DescriptionInfo.Description;
					}
				});
			};

			_service.getHeaderId = function (recordId) {
				return _.find(_dispatchRecords, {'Id': recordId}).HeaderId;
			};

			_service.getProductDescriptionId = function (recordId) {
				return _.find(_dispatchRecords, {'Id': recordId}).ProductDescriptionFk;
			};

			return _service;
		}
	]);
})();
