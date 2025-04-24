
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.configuration');

	angular.module(moduleName).constant('formulaAggregateType', {
		CAL: 'CALCULATED',
		SUM: 'SUM',
		NONE: ''
	});

	module.factory('controllingConfigurationFormulaDefinitionDataService', ['_', '$q', '$http', '$injector', 'platformDataServiceFactory','contrConfigFormulaDefProcessor','platformRuntimeDataService','contrConfigFormulaTypeHelper',
		'platformModalService', '$translate',
		function (_, $q, $http, $injector, platformDataServiceFactory, contrConfigFormulaDefProcessor, platformRuntimeDataService, contrConfigFormulaTypeHelper,
			platformModalService, $translate) {
			let serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingConfigurationFormulaDefinitionDataService',
					entityNameTranslationID: 'controlling.configuration.ConfFormulaDefinitionTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/Configuration/ContrFormulaPropDefController/',
						endRead: 'getFormulaPropDefList',
						usePostForRead: true,
						initReadData: function (readData) {
							return readData;
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'Controlling/Configuration/ContrFormulaPropDefController/', endCreate: 'create'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'Controlling/Configuration/ContrFormulaPropDefController/', endUpdate: 'delete'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								if(readData && readData.dtos){
									_.forEach(readData.dtos, function (item){
										item.IsBaseConfigData = (item.Id < 1000000);
										item.Code = item.Code || '';
									});
								}
								return data.handleReadSucceeded(readData ? readData : [], data);
							},
							handleCreateSucceeded: function (item) {
								$injector.get('controllingConfigFormulaDefValidationService').validateNewEntity(item);
								platformRuntimeDataService.readonly(item, [
									{field: 'IsEditable', readonly: true}
								]);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'ContrFormulaPropDefToSave',
							moduleName: 'controlling.configuration.ConfFormulaDefinitionTitle',
							codeField: 'Code',
							descField: 'DescriptionInfo.Translated'
						}
					},
					dataProcessor: [contrConfigFormulaDefProcessor],
					translation: {
						uid: 'controllingConfigurationFormulaDefinitionDataService',
						title: 'controlling.configuration.ConfFormulaDefinitionTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'MdcContrFormulaPropDefDto',
							moduleSubModule: 'Controlling.Configuration'
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canDeleteCallBackFunc: function () {
							if(service && service.getSelectedEntities){
								let selectedItems = service.getSelectedEntities();

								if(!selectedItems || selectedItems.length <= 0){return false;}

								if(_.filter(selectedItems, {IsBaseConfigData: true}).length > 0) {return false;}

								if(_.filter(selectedItems, function (item){
									return contrConfigFormulaTypeHelper.isCac_m(item.BasContrColumnTypeFk) && item.IsDefault;
								}).length > 0) {
									return false;
								}

								let isReferenced = false;
								let existList = service.getList();
								_.forEach(selectedItems, function (item){
									if(isReferenced) {return;}

									let reg = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
									let codes = [];
									_.forEach(existList, function (formula){
										if(isReferenced || formula.Id === item.Id || !formula.Formula || formula.Formula === '') {return;}


										codes = formula.Formula.match(reg);
										if(codes && _.find(codes, function (c){ return c && c.toUpperCase() === item.Code;})){
											isReferenced = true;
										}

									});

									if(isReferenced) {return;}
									if(item.Formula){
										codes = item.Formula.match(reg);
										if(codes){
											_.forEach(codes, function (code){
												if(isReferenced) {return;}

												let exist = _.find(existList, function (e){
													return e.Code === code.toUpperCase() && e.Id !== item.Id;
												});

												if(exist && contrConfigFormulaTypeHelper.isWcfOrBcf(exist.BasContrColumnTypeFk) && exist.IsDefault){
													isReferenced = true;
												}
											});
										}
									}
								});

								return !isReferenced;
							}
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = serviceContainer.service;
			serviceContainer.data.updateOnSelectionChanging = null;

			serviceContainer.data.doUpdate = null;

			service.getServiceContainerData = function getServiceContainerData() {
				return serviceContainer.data;
			};

			service.isReadonly = function isReadonly(){
				return false;
			};
			service.clearSelectedItem = function(){
				serviceContainer.data.selectedItem = null;
			};

			service.handleOnUpdate = function (updateData, response) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
			};

			service.getParameters = function getParameters(entity){
				let preListService = $injector.get('controllingConfigurationColumnDefinitionDataService');
				let preList = preListService.getList();
				let selected = entity || service.getSelected();
				let list = service.getList();
				if(selected){
					list = _.filter(list, function (item){
						return item.Id !== selected.Id;
					});
				}

				if(!preList || preList.length <= 0){
					return preListService.load().then(function (){
						preList = preListService.getList();
						return mergeList();
					});
				}

				return $q.when(mergeList());

				function mergeList(){
					_.forEach(preList, function (item){
						list.push(item);
					});

					return _.map(list, 'Code');
				}
			};

			let originalDeleteFunc = service.deleteEntities;
			service.deleteEntities = function deleteEntities(entities){
				if(!entities || entities.length <= 0){
					return;
				}

				let ids = _.map(entities, 'Id');
				$http.post(globals.webApiBaseUrl + 'Controlling/Configuration/ContrFormulaPropDefController/isformulainuse', ids).then(function (response){
					if(response && response.data){
						platformModalService.showMsgBox($translate.instant('controlling.configuration.formulaIsInUse'), 'Warning', 'warning');
					}else{
						originalDeleteFunc(entities);
					}
				});
			};

			return serviceContainer.service;
		}]);

	module.service('contrConfigFormulaDefProcessor', contrConfigFormulaDefProcessor);

	contrConfigFormulaDefProcessor.$inject = ['_', '$translate', '$injector', 'platformRuntimeDataService', 'contrConfigFormulaTypeHelper'];

	function contrConfigFormulaDefProcessor(_, $translate, $injector, platformRuntimeDataService, contrConfigFormulaTypeHelper) {

		this.processItem = function processItem(item) {
			item.ignoreFormulaInput = function (){
				return this.IsBaseConfigData || contrConfigFormulaTypeHelper.isFactorType(this.BasContrColumnTypeFk);
			};

			if(item.IsBaseConfigData){
				platformRuntimeDataService.readonly(item, [
					{field: 'Code', readonly: true},
					{field: 'DescriptionInfo', readonly: true},
					{field: 'Formula', readonly: true},
					{field: 'BasContrColumnTypeFk', readonly: true}
				]);
			}
			platformRuntimeDataService.readonly(item, [
				{field: 'IsDefault', readonly: !contrConfigFormulaTypeHelper.isDefaultEditable(item.BasContrColumnTypeFk)},
				{field: 'IsVisible', readonly: contrConfigFormulaTypeHelper.isCac_m(item.BasContrColumnTypeFk)},
				{field: 'IsEditable', readonly: (!contrConfigFormulaTypeHelper.isCustFactor(item.BasContrColumnTypeFk) && !(!item.IsBaseConfigData &&  contrConfigFormulaTypeHelper.isSac(item.BasContrColumnTypeFk)))},
				{field: 'Aggregates', readonly: item.IsBaseConfigData || contrConfigFormulaTypeHelper.isCustFactor(item.BasContrColumnTypeFk) | contrConfigFormulaTypeHelper.isCac_m(item.BasContrColumnTypeFk)}
			]);
		};
	}
})();
