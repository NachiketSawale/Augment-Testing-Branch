
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).directive('cosGlobalParamGroupContainer', cosGlobalParamGroupContainer);

	cosGlobalParamGroupContainer.$inject = [
		'_','$injector',
		'$http',
		'$timeout',
		'platformGridAPI',
		'cloudCommonGridService',
		'basicsLookupdataParentChildGridDataService',
		'constructionSystemMainInstanceHeaderParameterService',
		'platformDataServiceSelectionExtension',
		'constructionSystemMainInstanceService',
		'constructionSystemMainInstanceHeaderParameterFormatterProcessor',
		'basicsLookupdataLookupDescriptorService'
	];

	function cosGlobalParamGroupContainer(_,$injector, $http, $timeout, platformGridAPI, cloudCommonGridService,
		basicsLookupdataParentChildGridDataService, childDataService, platformDataServiceSelectionExtension, constructionSystemMainInstanceService,
		formatterProcessor, basicsLookupdataLookupDescriptorService) {
		var options = {
				parent: {
					uuid: '60c71b8ac0914eeaad2a2fe12de50450',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/instanceheaderparameter/',
						endRead: 'getglobalparamgroup',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							window.console.log(readData);
							if(childDataService && childDataService.insHeaderId){
								readData.InsHeaderId = childDataService.insHeaderId;
							}
							window.console.log(this);
						}
					},
					presenter: {
						tree: {
							parentProp: 'CosGlobalParamGroupFk',
							childProp: 'CosGlobalParamGroupChildren',
							showChildrenItems: true
						}
					},
					columns: [
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							formatter: 'code',
							readonly: true,
							width: 150
						},
						{
							id: 'description',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'translation',
							readonly: true,
							width: 150
						}
					],
					dataProcessor: [
						{
							processItem: function (entity) {
								if (entity.HasChildren) {
									entity.image = 'ico-folder-assemblies';
								}
							}
						}
					],
					lazyInit: false
				}
			}, searchOptions = {
				searchValue: ''
			};

		// create service
		var containerParentDataService = basicsLookupdataParentChildGridDataService.createDataService({
			role: 'parent',
			key: options.parent.key,
			presenter: options.parent.presenter,
			httpRead: options.parent.httpRead,
			dataProcessor: _.isArray(options.parent.dataProcessor) ? options.parent.dataProcessor : []
		});

		containerParentDataService.clear = function clear() {
			// overrid clear function,make sure loaded data was stored.
		};
		containerParentDataService.isLoaded = false;

		// use for dialog
		var dialogParentDataService = basicsLookupdataParentChildGridDataService.createDataService({
			role: 'parent',
			key: options.parent.key,
			presenter: options.parent.presenter,
			httpRead: options.parent.httpRead,
			dataProcessor: _.isArray(options.parent.dataProcessor) ? options.parent.dataProcessor : []
		});
		dialogParentDataService.clear = function clear() {
			// overrid clear function,make sure loaded data was stored.
		};
		dialogParentDataService.isLoaded = false;

		options.parent.dataService = containerParentDataService;

		var dialogOptions = _.cloneDeep(options);
		dialogOptions.parent.dataService = dialogParentDataService;

		function controller(scope, keyCodes, $translate) {
			scope.options = options;

			// dialog
			if(scope.parentGuid){
				scope.options = dialogOptions;
				scope.options.parent.uuid = scope.parentGuid;
			}

			scope.searchOptions = {
				search: search,
				onSearchInputKeyDown: onSearchInputKeyDown,
				onSearchInputkeyup: onSearchInputkeyup,
				searchValue: searchOptions.searchValue
			};

			scope.gridOptions = {
				parent: {
					dataService: scope.options.parent.dataService,
					uuid: scope.options.parent.uuid,
					gridData: {
						state: scope.options.parent.uuid
					},
					columns: scope.options.parent.columns,
					lazyInit: scope.options.parent.lazyInit
				}
			};
			const parentDataService = scope.options.parent.dataService;
			parentDataService.registerSelectionChanged(onParentSelectionChanged);
			parentDataService.listLoaded.register(loaded);


			function loadData(service) {
				var url = service.httpRead.route + service.httpRead.endRead;
				var method = service.httpRead.usePostForRead;
				service.loadListStart.fire();
				var param;
				if (_.isFunction(service.httpRead.getRequestParam)) {
					param = service.httpRead.getRequestParam();
				}
				if (method) {
					return $http.post(url, param ? param : {});
				} else {
					url = param ? url + param : url;
					return $http.get(url);
				}
			}

			var gridListener = scope.$watch(function () {
				return scope.gridCtrl !== undefined;
			}, function () {
				$timeout(function () {
					parentDataService.listLoaded.fire();
					updateSelection();
					gridListener();
				}, 10);
			});
			parentDataService.load();
			constructionSystemMainInstanceService.registerRefreshRequested(parentDataService.refresh);
			scope.$on('$destroy', function () {
				parentDataService.unregisterSelectionChanged(onParentSelectionChanged);
				constructionSystemMainInstanceService.unregisterRefreshRequested(parentDataService.refresh);
				parentDataService.listLoaded.unregister(loaded);
				parentDataService.isLoaded = false;
			});

			function updateSelection() {
				var dataServSel = parentDataService.getSelected();
				if (platformDataServiceSelectionExtension.isSelection(dataServSel)) {
					platformGridAPI.rows.selection({
						gridId: scope.gridOptions.parent.uuid,
						rows: [dataServSel]
					});
				}
			}

			function loaded() {
				parentDataService.isLoaded = true;
			}

			function searchGlobalParamGroup(searchValue) {
				var url = parentDataService.httpRead.route + parentDataService.httpRead.endRead;
				parentDataService.loadListStart.fire();
				var param = {
					InsHeaderId: childDataService.insHeaderId,
					SearchValue: searchValue
				};
				$http.post(url, param).then(function (res) {
					var response = res.data ? res.data : res;
					parentDataService.setTree(response);
				});
			}
			function search(searchValue) {
				searchOptions.searchValue = searchValue;
				searchGlobalParamGroup(searchValue);
				loadChildren({searchValue: searchValue});
				parentDataService.setSelected(null);
				parentDataService.listLoaded.fire();
			}

			function loadChildren(filterData) {
				childDataService.setFilterData(filterData);
				var selectedItem = parentDataService.getSelected();
				childDataService.refresh().then(function(data) {
					childDataService.setDescriptionForParameterValue(data.data.cosglobalparamvalue);
					childDataService.setCosParameterTypeFkAndIslookup(data.data);
					basicsLookupdataLookupDescriptorService.attachData(data.data || {});
					angular.forEach(data.data.dtos, function(e) {
						formatterProcessor.processItem(e);
					});
					childDataService.setList(data.data.dtos);
					if (selectedItem) {
						childDataService.setSelected(_.find(data.data.dtos, {Id: selectedItem.Id}));
						childDataService.removeModified();
					}
				});
			}

			function onSearchInputKeyDown($event, searchValue) {
				if (event.keyCode === keyCodes.ENTER || scope.instantSearch) {
					search(searchValue);
				}
			}
			function onSearchInputkeyup($event, searchValue){
				childDataService.setFilterData({searchValue: searchValue});
			}

			function onParentSelectionChanged() {
				var selectedItem = parentDataService.getSelected();
				if (selectedItem !== null) {
					loadChildren({cosGlobalParamGroupFk: selectedItem.Id});
				}
			}
		}

		return {
			restrict: 'A',
			// scope: {},
			controller: ['$scope', 'keyCodes', '$translate', controller],
			link: function (scope) {

				function refreshGridSize() {
					platformGridAPI.grids.resize('60c71b8ac0914eeaad2a2fe12de50450');
					platformGridAPI.grids.resize('9cfa2cb7188e400c84f98073520f8efb');
				}

				var splitter = angular.element('#cosGlobalParamGroupSplitter').data('kendoSplitter');// element.closest('.k-splitter').data('kendoSplitter');
				if (splitter) {
					splitter.bind('layoutChange', refreshGridSize);
				}

				scope.$on('$destroy', function () {
					if (splitter) {
						splitter.unbind('layoutChange', refreshGridSize);
					}
				});
			}
		};
	}

})(angular);