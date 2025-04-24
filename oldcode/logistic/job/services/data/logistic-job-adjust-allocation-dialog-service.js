/**
 * Created by leo on 10.07.2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobAllocationDialogService
	 * @description shows available allocations to a job
	 */
	angular.module(moduleName).service('logisticJobAdjustAllocationDialogService', LogisticJobAllocationDialogService);

	LogisticJobAllocationDialogService.$inject = ['_', '$http', '$injector', '$q', 'logisticJobPlantLocationDataService', 'PlatformMessenger',
		'platformModalService', 'logisticJobPlantAllocationUIStandardService', '$translate', 'logisticJobPlantAllocationDataService'];

	function LogisticJobAllocationDialogService(_, $http, $injector, $q, logisticJobPlantLocationDataService, PlatformMessenger,
	                                            platformModalService, configService, $translate, logisticJobPlantAllocationDataService) {

		var service = {};
		var dataItems = [];
		service.differQuantity = 0;
		var outQuantitySum = 0;
		var inQuantitySum = 0;
		var selectedOption = 'out';
		service.listLoaded = new PlatformMessenger();
		var usedConfig = {
			title: $translate.instant('logistic.job.adjustQuantities'),
			dataItems: [],
			gridConfiguration: {},
			dialogOptions: {}
		};

		service.entity = {};

		usedConfig.formOptions = {
			configure: {
				fid: 'logistic.job.base',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'baseGroup',
					rid: 'options',
					label: 'Option',
					label$tr$: 'logistic.job.option',
					type: 'radio',
					model: 'options',
					options: {
						labelMember: 'Description',
						valueMember: 'Value',
						groupName: 'options',
						items: [
							{Id: 1, Description: $translate.instant('logistic.job.outgoingPlant'), Value: 'out'},
							{Id: 2, Description: $translate.instant('logistic.job.incomingPlant'), Value: 'in'},
						]
					},
					sortOrder: 1,
					change: function (entity) {
						selectedOption = entity.options;
						service.load(selectedOption);
					}
				}, {
					gid: 'baseGroup',
					rid: 'quantity',
					label: 'Quantity',
					label$tr$: 'logistic.job.differQuantity',
					type: 'quantity',
					model: 'quantity',
					readonly: true,
					sortOrder: 2,
				}]
			}
		};

		var gridConf = _.cloneDeep(configService.getStandardConfigForListView());
		angular.forEach(gridConf.columns, function (col) {
			col.editor = null;
		});
		var col = _.find(gridConf.columns, function(col){
			return col.field === 'Quantity';
		});
		if(col){
			col.pinned = true;
		}
		usedConfig.gridConfiguration.columns = _.union([{
			field: 'Select',
			editor: 'boolean',
			formatter: 'boolean',
			id: 'select',
			name: 'Selected',
			name$tr$: 'cloud.common.entitySelected',
			toolTip: 'Select',
			toolTip$tr$: 'cloud.common.entitySelected',
			pinned: true,
			validator: function (entity, value) {
				if (value) {
					if (selectedOption === 'out') {
						outQuantitySum = outQuantitySum - entity.Quantity + entity.NewQuantity;
					} else {
						inQuantitySum = inQuantitySum - entity.Quantity + entity.NewQuantity;
					}
				} else {
					if (selectedOption === 'out') {
						outQuantitySum = outQuantitySum - entity.NewQuantity + entity.Quantity;
					} else {
						inQuantitySum = inQuantitySum - entity.NewQuantity + entity.Quantity;
					}
				}
				service.differQuantity = inQuantitySum - outQuantitySum;
				service.entity.quantity = service.differQuantity;
			}
		}, {
			field: 'NewQuantity',
			editor: 'quantity',
			formatter: 'percent',
			id: 'newQuantity',
			name: 'New Quantity',
			name$tr$: 'logistic.job.entityNewQuantity',
			toolTip: ' New quantity for allcation',
			toolTip$tr$: 'logistic.job.entityNewQuantityTip',
			pinned: true,
			validator: function (entity, value) {
				if (entity.Select) {
					if (selectedOption === 'out') {
						outQuantitySum = outQuantitySum + value;
					} else {
						inQuantitySum = inQuantitySum + value;
					}
					service.differQuantity = inQuantitySum - outQuantitySum;
					service.entity.quantity = service.differQuantity;
				}
			}
		}], gridConf.columns);

		usedConfig.gridConfiguration.uuid = '3458159e15bb46a9a67e396343c9f533';
		usedConfig.gridConfiguration.version = '1.0.0';
		usedConfig.dialogOptions.disableOkButton = function () {
			return !_.some(dataItems, function (item) {
				return item.Select;
			});
		};

		service.getGridConfiguration = function getGridConfiguration() {
			return usedConfig.gridConfiguration;
		};
		service.getFormConfiguration = function getFormConfiguration() {
			return usedConfig.formOptions;
		};

		service.getGridUUID = function () {
			return usedConfig.gridConfiguration.uuid;
		};

		service.getList = function () {
			return dataItems;
		};

		service.load = function (option) {
			var url;
			var selected = logisticJobPlantLocationDataService.getSelected();
			if (selected) {
				var defer = $q.defer();
				var data = {Pkey1: selected.JobFk};
				selectedOption = option;
				service.entity.option = option;
				if (option === 'out') {
					url = globals.webApiBaseUrl + 'logistic/job/plantallocation/listbyparent';
				} else {
					url = globals.webApiBaseUrl + 'logistic/job/plantallocation/listbyheaderin';
					data.PKey2 = selected.PlantFk;
				}
				$http.post(url, data).then(function (response) {
					dataItems = [];
					if (response && response.data) {
						if (option === 'out') {
							response.data = _.filter(response.data, {'PlantFk': selected.PlantFk});
						}
						var sum = 0;
						angular.forEach(response.data, function (item) {
							item.Select = false;
							item.NewQuantity = 0;
							sum += item.Quantity;
						});
						if (option === 'out') {
							outQuantitySum = sum;
							inQuantitySum = service.differQuantity + outQuantitySum;
						} else {
							inQuantitySum = sum;
							outQuantitySum = inQuantitySum - service.differQuantity;
						}
						dataItems = response.data;
						defer.resolve(response.data);
						service.listLoaded.fire(null, dataItems);
					}
				});
				return defer.promise;
			}
			return null;
		};

		function handleAdjustQuantities() {
			var newItems = [];
			angular.forEach(dataItems, function (item) {
				if (item.Select && item.NewQuantity !== item.Quantity) {
					item.Quantity = item.NewQuantity;
					newItems.push(item);
				}
			});
			if (newItems.length > 0) {

				logisticJobPlantAllocationDataService.parentService().registerUpdateDone(updateDone);
				logisticJobPlantAllocationDataService.markEntitiesAsModified(newItems);
				logisticJobPlantAllocationDataService.parentService().update();
			}
		}

		service.showLookup = function showLookup() {
			var dlgOptions = usedConfig.dialogOptions || {};
			dlgOptions.headerText = usedConfig.title;
			dlgOptions.bodyTemplateUrl = globals.appBaseUrl + 'logistic.job/templates/logistic-job-adjust-allocation-dialog.html';
			dlgOptions.backdrop = false;
			dlgOptions.height = '500px';
			dlgOptions.resizeable = true;
			dlgOptions.showCancelButton = true;
			dlgOptions.showOkButton = true;
			var selected = logisticJobPlantLocationDataService.getSelected();
			if (selected) {
				service.differQuantity = selected.Quantity;
				service.entity.quantity = service.differQuantity;
				service.entity.options = selectedOption;
			}
			platformModalService.showDialog(dlgOptions).then(function (result) {
				if (result.ok) {
					handleAdjustQuantities();
				}
			});
		};

		function updateDone() {
			logisticJobPlantLocationDataService.load();
		}

		service.unregisterAll = function unregisterAll() {
			logisticJobPlantAllocationDataService.parentService().unregisterUpdateDone(updateDone);
		};

		return service;
	}
})(angular);
