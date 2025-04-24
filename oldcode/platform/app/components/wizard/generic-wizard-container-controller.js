(function (angular) {

	'use strict';

	angular.module('platform').controller('genericWizardContainerController', ['_', 'globals', '$scope', '$element', 'genericWizardContainerLayoutService', '$injector', 'platformGridAPI', '$timeout', '$rootScope', 'platformCreateUuid', '$q', 'genericWizardUseCaseConfigService', '$http', 'basicsLookupDataContainerListService', 'infoBarService', '$translate', 'genericWizardService', 'genericWizardErrorService', function (_, globals, $scope, $element, layoutService, $injector, platformGridAPI, $timeout, $rootScope, platformCreateUuid, $q, genericWizardUseCaseConfigService, $http, lookupDataContainerListService, infoBarService, $translate, genericWizardService, genericWizardErrorService) {
		var containerId = $scope.$eval($element[0].attributes['container-id'].nodeValue);
		var moduleFk = $scope.$eval($element[0].attributes.modulefk.nodeValue);
		moduleFk = moduleFk ? moduleFk : $element[0].attributes.modulefk.nodeValue;
		var dependentDataService;
		var configUuid = $element[0].attributes['config-uuid'].nodeValue;
		var startEntityId = $scope.$eval($element[0].attributes['start-entity-id'].nodeValue);
		var module = $injector.get('basicsConfigMainService').getByModuleIdSync(moduleFk);
		var internalName = module.InternalName;
		var info = layoutService.getContainerLayoutByContainerId(containerId, internalName);
		var useCaseConfig = genericWizardUseCaseConfigService.getUseCaseContainer(configUuid, info.uuid);
		$scope.useCaseConfig = useCaseConfig;
		useCaseConfig.internalName = internalName;
		var layout = info.layout;
		var dataService = info.ctnrInfo.dataServiceName ? $injector.get(info.ctnrInfo.dataServiceName) : info.ctnrInfo.dataServiceProvider();



		if (!dataService.getSelected && dataService.getService) {
			dataService = dataService.getService({moduleName: internalName});
		}

		if (dataService.getSelected && info.ctnrInfo.ContainerType !== 'chart' || info.ctnrInfo.forceServiceCreate) {
			var dataServiceName = info.ctnrInfo.dataServiceName ? info.ctnrInfo.dataServiceName : dataService.getServiceName() ? dataService.getServiceName() : dataService.getItemName();
			dataService = genericWizardService.getDataServiceByName(dataServiceName, useCaseConfig);
		}

		if(!dataService.getSelected && dataService.getGenericService && useCaseConfig.parentService){
			var parentService = $injector.get(useCaseConfig.parentService);
			dataService = dataService.getGenericService(parentService,{uuid:useCaseConfig.uuid});
		}

		genericWizardService.setDataService(dataService, info.ctnrInfo.dataServiceName);
		var validationService = null;
		if (info.ctnrInfo && (info.ctnrInfo.validationServiceName || info.ctnrInfo.validationServiceProvider)) {
			validationService = info.ctnrInfo.validationServiceName ? $injector.get(info.ctnrInfo.validationServiceName) : info.ctnrInfo.validationServiceProvider();
			validationService = _.isFunction(validationService) ? validationService(dataService) : validationService;
		}
		if (useCaseConfig.helperService) {
			var helperService = _.cloneDeep($injector.get(useCaseConfig.helperService));
			genericWizardService.setDataService(helperService, useCaseConfig.helperService);
		}

		var formUnWatch;
		var gridUnWatch;
		var unregisterStepChanged;

		function setGridList(list, entity) {
			if (entity) {
				list = [entity];
			}
			if (list && _.isArray(list) && $scope.gridId) {
				platformGridAPI.items.data($scope.gridId, list);
			}
		}

		function addNewGridItem(list, entity) {
			if (entity) {
				list = [entity];
			}
			if (list && _.isArray(list) && $scope.gridId) {
				var gridItems = platformGridAPI.items.data($scope.gridId);
				gridItems = _.isArray(gridItems) && !_.isEmpty(gridItems) ? gridItems : [];
				gridItems.push(entity);
				platformGridAPI.items.data($scope.gridId, gridItems);
				refreshGrid();
			}
		}

		function refreshGrid() {
			platformGridAPI.grids.refresh($scope.gridId, true);
		}

		function getDataServiceForContainer(containerUuid) {
			var module = genericWizardUseCaseConfigService.getModuleFromContainerUuid(configUuid, containerUuid);
			var dataServiceName = lookupDataContainerListService.getDataServiceNameFromContainer({
				Module: module,
				ContainerUuid: useCaseConfig.dependentContainer
			});
			return genericWizardService.getDataServiceByName(dataServiceName, genericWizardUseCaseConfigService.getUseCaseContainer(configUuid, containerUuid));
		}

		function processData(data, processorList) {
			data = _.isArray(data) ? data : [data];
			_.each(data, function (dataItem) {
				_.each(processorList, function (processor) {
					processor.processItem(dataItem);
				});
				if (dataItem.__rt$data && dataItem.__rt$data.readonly && !dataItem.__rt$data.useCaseAllowReadonly) {
					// readonly is done by column / row config
					dataItem.__rt$data.readonly = null;
				}
				if (_.get(useCaseConfig, 'selectionContainer.includeAll')) {
					dataItem.IsIncluded = true;
				}
			});
		}

		function getPayloadData(containerUseCaseConfig) {
			var payLoad = {};
			if (!_.isEmpty(containerUseCaseConfig.dependentContainer)) {
				var dependentDataService = getDataServiceForContainer(containerUseCaseConfig.dependentContainer);
				var parentEntity = dependentDataService.getSelected();
				if (containerUseCaseConfig.params && _.isObject(containerUseCaseConfig.params)) {
					var wizardConfig = genericWizardService.config;
					_.forEach(containerUseCaseConfig.params, function (value, key) {
						if (_.isString(value)) {
							var val = _.get(parentEntity, value);
							if (val) {
								_.set(payLoad, key, val);
							} else {
								_.set(payLoad, key, _.get(wizardConfig, value));
							}
						} else {
							_.set(payLoad, key, value);
						}
					});
				}
			} else if (containerUseCaseConfig.isStartEntity) {
				payLoad.Id = startEntityId;
			}
			return payLoad;
		}

		function buildFilterRequest(paramObject) {
			var pattern = '';
			_.forEach(paramObject, function (value, key) {
				pattern += key + '=' + value;
			});
			return {
				'filter': '',
				'Pattern': pattern,
				'PageSize': 100,
				'PageNumber': 0
			};
		}

		function loadData() {
			if (useCaseConfig.dataUrl) {
				var paramObject = getPayloadData(useCaseConfig);
				if (useCaseConfig.filterRequest) {
					paramObject = buildFilterRequest(paramObject);
				}
				var dataPromise;
				if (!useCaseConfig.helperService) {
					dataPromise = $http({
						url: globals.webApiBaseUrl + useCaseConfig.dataUrl,
						method: useCaseConfig.usePost || useCaseConfig.filterRequest ? 'POST' : 'GET',
						params: !useCaseConfig.usePost && !useCaseConfig.filterRequest ? paramObject : null,
						data: useCaseConfig.usePost || useCaseConfig.filterRequest ? paramObject : null
					});
				} else {
					if (useCaseConfig.helperService) {
						var helperService = genericWizardService.getDataServiceByName(useCaseConfig.helperService);
						dataPromise = helperService.loadData(paramObject);
					}
				}
				$scope.loading = true;
				dataPromise.then(function (result) {
					$scope.loading = false;
					var processor = dataService.getDataProcessor();
					var data = _.isArray(result) ? result : result.data;
					if (data) {
						if (useCaseConfig.dtoAccess) {
							data = _.get(data, useCaseConfig.dtoAccess);
						}

						var configLookupDataList = useCaseConfig.info ? useCaseConfig.info.lookupData : null;
						if (configLookupDataList) {
							_.forEach(data, function (item) {
								var lookupData = {};
								_.forEach(configLookupDataList, function (configLookupData) {
									var fk = configLookupData.fk;
									var propertyPath = configLookupData.propertyPath;
									var lookupPropertyName = configLookupData.lookupPropertyName;
									var tempData = _.find(_.get(result.data, configLookupData.name), {Id: item[fk]});
									if (propertyPath && lookupPropertyName) {
										tempData = _.get(tempData, propertyPath);
										tempData = {[lookupPropertyName]: tempData};
									}
									_.merge(lookupData, tempData);
								});
								item.lookup = lookupData;
							});
						}
						processData(data, processor);
						updateItemList(null, data);
						try {
							triggerContainerValidationFunction();
						} catch (e) {
							// ignore errors because dependend data may not be loaded yet
						}
					}
				});
			}
		}

		function updateItemList(e, entity) {
			if (entity) {
				var list;

				if (_.isArray(entity)) {
					list = [].concat(entity);
				} else {
					list = [entity];
				}
				dataService.setList(list);
				setGridList(list);
				if (!_.isEmpty(list)) {
					dataService.setSelected(list[0]);
					if (useCaseConfig.selectEvent) {
						$rootScope.$emit('genwiz:' + useCaseConfig.selectEvent);
					}
					selectItem(null, {item: list[0], dataServiceName: info.ctnrInfo.dataServiceName});
				}
				safeUpdateToolbar();
				setInfo(list);
			}
		}

		function setInfo(list) {
			var displayMember = useCaseConfig.info ? useCaseConfig.info.displayMember : null;
			var container = genericWizardService.getContainerById(containerId);
			if (displayMember && container) {
				var infoBarConfig = {
					moduleName: internalName,
					uuid: useCaseConfig.uuid,
					title: container.Instance.TitleInfo && container.Instance.TitleInfo.Description ? container.Instance.TitleInfo.Description : $translate.instant(lookupDataContainerListService.getItemById(internalName, useCaseConfig.uuid).title),
					list: list,
					stepFk: container.Instance.GenericWizardStepFk,
					displayMember: displayMember,
					navigationEnabled: dataService.isRoot,
					filterFn: useCaseConfig.info.filterFn
				};

				infoBarService.setInfo(infoBarConfig);
			}
		}

		$scope.setInfo = setInfo;

		function setDataItem() {
			$scope.dataItem = dataService.getSelected ? dataService.getSelected() : dataService.getService().getSelected();
			$scope.tools.update();
		}

		function triggerContainerValidationFunction() {
			if (_.isFunction(useCaseConfig.validFn)) {
				genericWizardErrorService.removeContainerMessages(useCaseConfig.uuid);
				var messageList = useCaseConfig.validFn(useCaseConfig.uuid);
				genericWizardErrorService.addMessageList(messageList);
			}
		}

		function initForm() {

			dataService.registerSelectionChanged(setDataItem);
			if (_.isFunction(dataService.registerEntityCreated)) {
				dataService.registerEntityCreated(setDataItem);
			}

			formUnWatch = $scope.$watch(function () {
				return dataService.getSelected ? dataService.getSelected() : dataService.getService().getSelected();
			}, function watch(newVal, oldVal) {
				if (newVal !== oldVal) {
					setDataItem();
				}
			});

			$scope.formConfig = {
				configure: layout,
				onPropertyChanged: function () {
					dataService.markCurrentItemAsModified();
				}
			};

			layout.dirty = function () {
				if (dataService.markCurrentItemAsModified) {
					dataService.markCurrentItemAsModified();
				}
				(dataService.gridRefresh || angular.noop)();
				triggerContainerValidationFunction();
			};

			if (validationService) {
				addValidation(layout.rows);
			}
		}

		function addValidation(rows) {
			_.forEach(rows, function (row) {
				var rowModel = row.model ? row.model : row.field ? row.field : null;
				if (rowModel) {
					rowModel = rowModel.replace(/\./g, '$');
					var syncName = 'validate' + rowModel;
					var asyncName = 'asyncValidate' + rowModel;

					if (validationService[syncName]) {
						row.validator = validationService[syncName];
					}

					if (validationService[asyncName]) {
						row.asyncValidator = validationService[asyncName];
					}
				}
			});
		}

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});

			selected = _.isArray(selected) ? selected[0] : selected;
			if (selected && selected.__group) {
				return;
			}

			if ((!selected && $scope.selectedEntityID !== -1) || (selected && $scope.selectedEntityID !== selected.Id)) {
				// Special handling of NonDataRow (internally used in grid | grouping) -> set empty entity
				if (selected && selected.__nonDataRow) {
					var oldSel = $scope.getSelectedItem();
					if (oldSel) {
						platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, selected);
					}
					selected = oldSel;
				}
				$scope.selectedEntityID = (selected) ? selected.Id : -1;
				if (selected && dataService.getSelected() && dataService.getSelected().Id !== selected.Id) {
					dataService.setSelected(selected);
				}
			}
			safeUpdateToolbar();
		}

		function safeUpdateToolbar() {
			if ($scope.tools && !_.isEmpty($scope.tools.items) && $scope.tools.update) {
				$scope.tools.update();
			}
		}

		function initGrid() {

			$scope.gridId = platformCreateUuid();

			function onEntityDelete(e, broadCastObject) {
				if (info.ctnrInfo.dataServiceName !== broadCastObject.dataServiceName) {
					return;
				}
				platformGridAPI.items.data($scope.gridId, broadCastObject.items);
				platformGridAPI.grids.refresh($scope.gridId, false);
			}

			if (_.isFunction(dataService.registerEntityCreated)) {
				dataService.registerEntityCreated(addNewGridItem);
			}
			if (_.isFunction(dataService.registerDataModified)) {
				dataService.registerDataModified(refreshGrid);
			}

			if (useCaseConfig.selectionContainer) {
				layout.rows.unshift({
					editor: 'boolean',
					field: 'IsIncluded',
					formatter: 'boolean',
					id: 'IsIncluded',
					isPinned: true,
					name: 'IsIncluded',
					name$tr$: 'platform.wizard.isIncluded',
					width: 100,
					toolTip$tr$: 'platform.wizard.isIncluded',
					sortable: false,
					sortOrder: 0,
					headerChkbox: true,
					useTimeout: true,
					rerenderOnResize: true
				});
			}
			// validation
			if (validationService) {
				addValidation(layout.rows);
			}

			var gridConfig = {
				columns: layout.rows,
				data: [],
				id: $scope.gridId,
				lazyInit: false,
				options: {
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					skipPermissionCheck: true
				},
				enableConfigSave: false,
				passThrough: {
					rowHeight: 35
				}
			};

			if (!_.isEmpty(useCaseConfig.parentProp) && !_.isEmpty(useCaseConfig.childProp)) {
				gridConfig.options.tree = true;
				gridConfig.options.parentProp = useCaseConfig.parentProp;
				gridConfig.options.childProp = useCaseConfig.childProp;
			}

			gridUnWatch = $scope.$watch(function () {
				return $scope.gridCtrl !== undefined;
			}, function () {
				$timeout(function () {
					updateItemList();
					gridUnWatch();
				}, 10);
			});

			platformGridAPI.grids.config(gridConfig);

			$scope.gridData = {
				state: $scope.gridId
			};

			function onCellModified() {
				triggerContainerValidationFunction();
				$scope.$apply();
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', function () {
				triggerContainerValidationFunction();
				$scope.$apply();
			});

			unregisterStepChanged = $rootScope.$on('stepChanged', function () {
				safeUpdateToolbar();
				platformGridAPI.grids.resize($scope.gridId);
				if (useCaseConfig.selectEvent && genericWizardService.isContainerInCurrentStep(useCaseConfig.uuid)) {
					$rootScope.$emit('genwiz:' + useCaseConfig.selectEvent);
				}
			});

			$rootScope.$on('onEntityCreated', selectItem);
			$rootScope.$on('selectionChangeInDetail', selectItem);
			$rootScope.$on('entityDeleted', onEntityDelete);
		}

		function selectItem(e, broadCastObject) {

			// only interessted in events from container with the same dataServiceName
			if (info.ctnrInfo.dataServiceName !== broadCastObject.dataServiceName || !$scope.gridId) {
				return;
			}
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});

			if (selected && selected.Id !== broadCastObject.item.Id || !selected && broadCastObject) {
				platformGridAPI.rows.selection({
					gridId: $scope.gridId,
					rows: [broadCastObject.item]
				});
			}
			$scope.tools.update();
		}

		function initToolBar() {

			var toolItems = [];

			var previewButton = {
				id: 'preview',
				caption: 'basics.common.preview.button.previewCaption',
				type: 'item',
				iconClass: 'tlb-icons ico-preview-form',
				hideItem: true,
				fn: function previewFile() {
					dataService.previewFile();
				},
				disabled: function disabled() {
					var selectedItem = dataService.getSelected();
					return !selectedItem || (selectedItem && !(selectedItem.FileArchiveDocFk || selectedItem.ArchiveElementId || selectedItem.Url));
				}
			};

			if (useCaseConfig.isDocumentContainer) {
				toolItems.push(previewButton);
			}

			$scope.tools = {
				cssClass: 'tools',
				rootPath: 'tools',
				overflow: true,
				showImages: true,
				showTitles: false,
				items: toolItems,
				version: Math.random(),
				update: function () {
					$scope.tools.version += 1;
				}
			};
		}

		function initChart() {
			$scope.isChart = true;
			var containerConfig = genericWizardService.getContainerById(containerId);
			var jsonContainerConfig = lookupDataContainerListService.getItemById(internalName, containerConfig.Instance.ContainerUuid);
			$scope.getContentValue = function (contentType) {
				switch (contentType) {
					case 'serviceDescriptor':
						return jsonContainerConfig.serviceDescriptor || jsonContainerConfig.uuid;
					case'permission':
						return jsonContainerConfig.permission || jsonContainerConfig.uuid;
					case'configService':
						return jsonContainerConfig.configService;
				}
			};

			$scope.getContainerUUID = function () {
				return jsonContainerConfig.uuid;
			};
			$scope.setTools = _.noop;
		}

		function init() {

			switch (info.ctnrInfo.ContainerType.toLowerCase()) {
				case 'detail':
					initForm();
					break;

				case 'grid':
					initGrid();
					break;

				case 'chart':
					initChart();
					break;
			}

			if (!_.isEmpty(useCaseConfig.dependentContainer)) {
				dependentDataService = getDataServiceForContainer(useCaseConfig.dependentContainer);
				dependentDataService.registerSelectionChanged(loadData);
			} else {
				loadData();
			}
		}

		init();
		initToolBar();

		$scope.$on('$destroy', function () {

			if (_.isFunction(formUnWatch)) {
				formUnWatch();
			}

			if (_.isFunction(gridUnWatch)) {
				gridUnWatch();
			}

			if (dependentDataService) {
				dependentDataService.unregisterSelectionChanged(loadData);
			}

			if (_.isFunction(dataService.unregisterSelectionChanged)) {
				dataService.unregisterSelectionChanged(setDataItem);
			}

			if (_.isFunction(dataService.unregisterEntityCreated)) {
				dataService.unregisterEntityCreated(setDataItem);
			}

			if ($scope.gridId) {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			if (unregisterStepChanged) {
				unregisterStepChanged();
			}

			if (_.isFunction(dataService.unregisterEntityCreated)) {
				dataService.unregisterEntityCreated(addNewGridItem);
			}
			if (_.isFunction(dataService.unregisterDataModified)) {
				dataService.unregisterDataModified(refreshGrid);
			}
		});

	}
	]);
})(angular);
