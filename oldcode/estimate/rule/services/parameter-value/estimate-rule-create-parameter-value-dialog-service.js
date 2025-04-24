/**
 * Created by lnt on 4/26/2019.
 */

(function (angular) {
	/* global globals, _ */

	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleCreateParameterValueDialogService', [
		'$q', '$translate', '$http', '$injector', 'PlatformMessenger', 'platformModalService', 'platformDataServiceFactory', 'estimateParameterComplexInputgroupLookupService', 'estimateMainParameterValueLookupService',
		'platformRuntimeDataService',
		function (
			$q, $translate, $http, $injector, PlatformMessenger,  platformModalService, platformDataServiceFactory, estimateParameterComplexInputgroupLookupService, estimateMainParameterValueLookupService,
			platformRuntimeDataService) {

			let service = {
				showDialog: showDialog,
				dataService: null
			};

			// show the dialog
			function showDialog(entity) {
				let defer = $q.defer();

				estimateMainParameterValueLookupService.getParamValues().then(function (respone) {
					let projectId = estimateMainParameterValueLookupService.getProjectId2ParameterValue();
					let sorting;
					$injector.get('estimateParamComplexLookupCommonService').mergeCusParamValue(entity, respone.data);
					let itemValues = _.filter(respone.data, function (item) {
						if (item.Code === entity.Code) {
							item.Description = item.DescriptionInfo.Description;
							sorting = item.Sorting;
							return true;
						}
					});

					service.dataService = createDataService(entity, projectId, sorting);  // create a data server for the dialog controller

					var generateNewGuid = function generateGuid() {
						var guid = '';
						var count = 32;
						while (count--) {
							guid += Math.floor(Math.random() * 16.0).toString(16);
						}
						return guid;
					};

					let defaultOptions = {
						headerText: $translate.instant('estimate.rule.CreateParameterValue'),
						templateUrl: globals.appBaseUrl + 'estimate.rule/templates/estimate-rule-create-parameter-value-dialog.html',
						backdrop: false,
						width: 'max',
						maxWidth: '1000px',
						gridData: [],                               // grid data
						uuid: generateNewGuid(),   // grid id (uuid)
						item: entity,
						itemValues: itemValues
					};

					platformModalService.showDialog(defaultOptions).then(function (result) {
						defer.resolve(result);
					});
				});

				// get the service
				function createDataService(entity, projectId, sorting) {
					let itemsToSave = [],
						itemsToDelete = [];

					let serviceOption = {
						module: angular.module(moduleName),
						serviceName: 'estimateRuleCreateParameterValueDialogService',
						entitySelection: {},
						presenter: {list: {}}
					};

					let container = platformDataServiceFactory.createNewComplete(serviceOption);
					let dataService = container.service;
					let data = container.data;

					dataService.setOkbuttonStatus = new PlatformMessenger();

					dataService.setList = function (items) {
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							data.itemList.push(item);
						});
						data.itemList = data.itemList.length ? _.uniqBy(data.itemList, 'Id') : [];

						$injector.get('estimateMainCommonCalculationService').resetParameterDetailValueByCulture(data.itemList);

						data.listLoaded.fire(null, data.itemList);
					};

					function setItemToSave(item) {
						let modified = _.find(itemsToSave, {Id: item.Id});
						if (!modified) {
							itemsToSave.push(item);
						}
					}

					function addItem(item) {
						setItemToSave(item);
					}

					dataService.createItem = function createItem() {
						// server create
						let httpRoute = globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/createitem',
							postData = {
								PrjProjectFk: projectId,
								Code: entity.Code,
								ValueType: entity.ValueType
							};

						return $http.post(httpRoute, postData).then(function (response) {
							let item = response.data;
							if (item && item.Id) {
								item.Sorting = sorting + 1;
								sorting = item.Sorting;
								addItem(item);
								data.itemList.push(item);
								platformRuntimeDataService.readonly(item,
									[{field: 'ParameterCode', readonly: true},
										{field: 'IsDefault', readonly: true},
										{field: 'ValueType', readonly: true}]);
								data.listLoaded.fire(null, data.itemList);
								// when create parameter value, set ok button as disable
								let validationService = $injector.get('ruleCreateParamValueDialogValidationService');
								let result = validationService.validateDescription(item, item.Description, 'Description', true);
								dataService.setOkbuttonStatus.fire(result.valid);

								dataService.setSelected(item);
							}
							return item;
						});
					};

					dataService.deleteItem = function deleteItem(selectedItem) {
						if (selectedItem && selectedItem.Version > 0) {
							itemsToDelete.push(selectedItem);
						}

						$injector.get('estimateParamUpdateService').handleDeleteParamValue(selectedItem);

						itemsToSave = _.filter(itemsToSave, function (d) {
							return d.Id !== selectedItem.Id;
						});

						data.itemList = _.filter(data.itemList, function(item){
							return item.Id !== selectedItem.Id;
						});
						data.listLoaded.fire();

						// when create parameter value, set ok button as disable
						let validationService = $injector.get('ruleCreateParamValueDialogValidationService');
						let result;
						for(let i=0; i<data.itemList.length; i++){
							result = validationService.validateDescription(data.itemList[i], data.itemList[i].Description, 'Description', true);
							dataService.setOkbuttonStatus.fire(result.valid);
							if(!result.valid){
								break;
							}
						}

						let selectItem = data.itemList.length > 0 ? data.itemList[data.itemList.length -1] : null;
						dataService.setSelected(selectItem);
					};

					dataService.getDataToSave = function(){
						let data = {itemsToSave: itemsToSave, itemsToDelete: itemsToDelete};
						return data;
					};

					dataService.setItemListAsReadonly = function() {
						let itemList = dataService.getList();
						angular.forEach(itemList, function (item) {
							platformRuntimeDataService.readonly(item, [{field: 'Description', readonly: true},
								{field: 'ParameterCode', readonly: true},
								{field: 'IsDefault', readonly: true},
								{field: 'ValueType', readonly: true},
								{field: 'Value', readonly: true},
								{field: 'ValueDetail', readonly: true},
								{field: 'ValueText', readonly: true},
								{field: 'Sorting', readonly: true}]);
						});
					};

					return dataService;
				}

				return defer.promise;
			}

			return service;
		}
	]);

})(angular);
