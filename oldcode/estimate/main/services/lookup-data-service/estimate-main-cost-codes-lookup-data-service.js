(function (angular) {
	'use strict';
	angular.module('estimate.main').factory('estimateMainCostCodesLookupDataService', [
		'_',
		'$timeout',
		'$http',
		'$translate',
		'$q',
		'$injector',
		'PlatformMessenger',
		'platformGridAPI',
		'estimateMainJobCostcodesLookupService',
		'estimateMainLookupService',
		'estimateMainCommonService',
		'cloudCommonGridService',
		function (_, $timeout, $http, $translate, $q, $injector,PlatformMessenger, platformGridAPI, estimateMainJobCostcodesLookupService, estimateMainLookupService, estimateMainCommonService, cloudCommonGridService) {
			const uuid = '353cb6c50ba84ca9b82e695911fa6cdb';
			let lookupOptions = {};
			let userDefinedService = null;
			let doCreatePrjCostCode = false;

			function isAssemblyModule() {
				return platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118') /* Assembly */ || platformGridAPI.grids.exist('02580d5adb6b48429302166d9e9ac8c6'); /* Plant Assembly */
			}

			function isPrjAssembly() {
				return platformGridAPI.grids.exist('51f9aff42521497898d64673050588f4') || platformGridAPI.grids.exist('20c0401f80e546e1bf12b97c69949f5b') || platformGridAPI.grids.exist('bedc9497ca84537ae6c8cabbb0b8faeb') /* Plant Assembly Resource */;
			}

			function isRiskModule() {
				return platformGridAPI.grids.exist('202eae863efc4c1f9a2cd4d685e346b7');
			}

			function isCrewMixModule() {
				return platformGridAPI.grids.exist('90f4fa0bd6d249d0a2b7d3112f8ae03f') || platformGridAPI.grids.exist('2b2193f79ef74177a34a2345cd5d9e25');
			}

			function isProjectCrewMixModule() {
				return platformGridAPI.grids.exist('5fbf701267ea4e20b4723a7d46dbee24');
			}

			const service = {};

			service.setDoCreatePrjCostCode = function(value){
				doCreatePrjCostCode = value;
			};

			service.onSelectionChangedFired = new PlatformMessenger();

			service.init = function ($scope, callback) {
				angular.extend(lookupOptions, $scope.options);
				var columns = $scope.lookupOptions.columns;
				if ($scope.lookupOptions  && $scope.lookupOptions.lookupOptions && Object.hasOwnProperty.call($scope.lookupOptions.lookupOptions, 'userDefinedConfigService')){
					userDefinedService = $injector.get($scope.lookupOptions.lookupOptions.userDefinedConfigService);
					userDefinedService.attachDataToColumnLookup = function(data, gridUuid, reLoad, currentJobFk){
						let flattenCostCodeList = [];
						cloudCommonGridService.flatten(data, flattenCostCodeList, 'CostCodes');

						let attachDataFn, attachOptions;

						if(isAssemblyModule() || isPrjAssembly()){
							attachDataFn = userDefinedService.attachDataForLookup;
							attachOptions = {
								isPrjAssembly : isPrjAssembly(),
								reLoad : reLoad,
								currentJobFk : currentJobFk
							};
						}else{
							attachDataFn = userDefinedService.attachDataFromExtend;
							attachOptions = {
								isForCostCodeLookup : true,
								currentJobFk : currentJobFk
							};
						}

						if(_.isFunction(attachDataFn)){
							attachDataFn(flattenCostCodeList, null, attachOptions).then(function(){
								platformGridAPI.grids.refresh(gridUuid);
							});
						}
					};

					let userDefinedColumns = userDefinedService.getDynamicColumnsForLookUp();
					userDefinedColumns = _.filter(userDefinedColumns, function(item){ return !item.field.endsWith('Total'); });

					_.forEach(userDefinedColumns, function(col){
						col.editor = null;
						col.readonly = true;
					});
					$scope.lookupOptions.columns = columns.concat(userDefinedColumns);
				}else{
					userDefinedService = {
						loadDynamicColumns: function(){ return $q.when([]); },
						getDynamicColumns: function(){ return $q.when([]); },
						attachDataToColumn: function(){ return $q.when([]); },
						attachDataFromExtend: function(){ return $q.when([]); },
						attachDataToColumnLookup: function(){ return $q.when([]); }
					};
				}
				callback(userDefinedService);
			};

			service.canHideCreateItem = function () {
				return lookupOptions.usageContext !== 'estimateMainResourceService';
			};

			service.canCreateChildItem = function () {
				return !(lookupOptions.usageContext === 'estimateMainResourceService' && doCreatePrjCostCode);
			};

			service.getList = function (opt, entity) {
				if(lookupOptions.usageContext === 'estimateMainResourceService'){
					service.onSelectionChangedFired.fire();
				}
				if (isAssemblyModule() || isCrewMixModule() || lookupOptions.useMasterData) {
					return estimateMainLookupService.getEstCostCodesTreeForAssemblies().then(function (data) {
						userDefinedService.attachDataToColumnLookup(data, uuid, true);
						return $q.when(data);
					});
				} else {
					return estimateMainJobCostcodesLookupService.getEstCostCodesTreeByJob(entity, isPrjAssembly()).then(function (data) {
						const currentJobFk = estimateMainJobCostcodesLookupService.getCurrentJobFk();
						if (userDefinedService) {
							userDefinedService.attachDataToColumnLookup(data, uuid, true, currentJobFk);
						}
						return $q.when(data);
					});
				}
			};

			service.getDefault = function (opt, entity) {
				let item = {};
				let list;
				if (isAssemblyModule() || isCrewMixModule() || lookupOptions.useMasterData) {
					list = estimateMainLookupService.getEstCostCodesTreeForAssemblies();
				} else {
					list = estimateMainJobCostcodesLookupService.getEstCostCodesTreeByJob(entity);
				}
				for (let i = 0; i < list.length; i++) {
					if (list[i].IsDefault === true) {
						item = list[i];
						break;
					}
				}
				return item;
			};

			service.getItemByKey = function (value, options, entity) {
				if(lookupOptions.usageContext === 'estimateMainResourceService'){
					service.onSelectionChangedFired.fire();
				}
				const basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				if (_.isNumber(value)) {
					if (basicsLookupdataLookupDescriptorService.hasLookupItem('estmdccostcodes', value)) {
						return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('estmdccostcodes', value));
					}
					switch (options.usageContext) {
						case 'estimateMainResourceService':
							return estimateMainJobCostcodesLookupService.getEstCCByIdAsyncByJobId(value, entity);
						default:
							return estimateMainLookupService.getMdcCCById(value);
					}
				} else {
					if (entity && entity.MdcCostCodeFk > 0) {
						switch (options.usageContext) {
							case 'estimateMainResourceService':
								if (basicsLookupdataLookupDescriptorService.hasLookupItem('estmdccostcodes', entity.MdcCostCodeFk)) {
									return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('estmdccostcodes', entity.MdcCostCodeFk));
								}
								return estimateMainJobCostcodesLookupService.getEstCCByIdAsyncByJobId(entity.MdcCostCodeFk, entity);
							default:
								return $q.when(estimateMainLookupService.getMdcCCById(entity.MdcCostCodeFk));
						}
					}
					return $q.when();
				}
			};

			service.getSearchList = function (value, field, entity, isSpecificSearch) {
				if(lookupOptions.usageContext === 'estimateMainResourceService'){
					service.onSelectionChangedFired.fire();
				}
				if (isAssemblyModule() || isCrewMixModule() || lookupOptions.useMasterData) {
					return estimateMainLookupService.getSearchEstCostCodesList(value, field, isSpecificSearch).then(function (data) {
						if (userDefinedService) {
							userDefinedService.attachDataToColumnLookup(data, uuid);
						}
						return data;
					});
				} else {
					entity = entity ? entity : $injector.get('estimateMainResourceService').getSelected();
					let prjAssemblyResourceEntity = entity ? entity : $injector.get('projectAssemblyResourceService').getSelected();
					return estimateMainJobCostcodesLookupService.getSearchList(value, field, isSpecificSearch, isPrjAssembly() ? prjAssemblyResourceEntity : entity, isPrjAssembly()).then(function (data) {
						let currentJobFk = estimateMainJobCostcodesLookupService.getCurrentJobFk();
						if (userDefinedService) {
							userDefinedService.attachDataToColumnLookup(data, uuid, false, currentJobFk);
						}
						return data;
					});
				}
			};

			service.selectedItemsChanged = function (selectedItems) {
				if (lookupOptions.usageContext) {
					const serviceContext = $injector.get(lookupOptions.usageContext);
					if (serviceContext && angular.isFunction(serviceContext.getCostCodeLookupSelectedItems)) {
						serviceContext.getCostCodeLookupSelectedItems({}, selectedItems || []);
					}
				}
			};

			service.selectedItemChanged = function (selectedItem) {
				if (isCrewMixModule()) {
					$injector.get('basicsEfbsheetsCommonService').setSelectedLookupItem(selectedItem, false);
				} else if (isProjectCrewMixModule()) {
					$injector.get('basicsEfbsheetsCommonService').setSelectedLookupItem(selectedItem, true);
				} else {
					const usageContextService = lookupOptions.usageContext ? $injector.get(lookupOptions.usageContext) : null;
					if (usageContextService && angular.isFunction(usageContextService.setSelectedLookupItem)) {
						usageContextService.setSelectedLookupItem(selectedItem);
					} else {
						estimateMainCommonService.setSelectedLookupItem(selectedItem);
					}
				}
			};

			service.refreshData = function (callback) {
				if (isAssemblyModule() || isCrewMixModule()) {
					estimateMainLookupService.refreshEstCostCodesTreeForAssemblies().then(function (data) {
						let costCodes = _.filter(data, function (item) {
							return item.CostCodeParentFk === null;
						});
						if (userDefinedService) {
							userDefinedService.attachDataToColumnLookup(costCodes, uuid, true);
						}
						callback(costCodes);
					});
				}
				if (isRiskModule()) {
					estimateMainLookupService.getListFilterByCompanyAsync().then(function (data) {
						callback(
							_.filter(data, function (item) {
								return item.CostCodeParentFk === null;
							})
						);
					});
				} else {
					estimateMainJobCostcodesLookupService.refreshEstCostCodesTree(isPrjAssembly()).then(function (data) {
						let costCodes = _.filter(data, function (item) {
							return item.CostCodeParentFk === null;
						});
						let currentJobFk = estimateMainJobCostcodesLookupService.getCurrentJobFk();
						if (userDefinedService) {
							userDefinedService.attachDataToColumnLookup(costCodes, uuid, true, currentJobFk);
						}
						callback(costCodes);
					});
				}
			};

			return service;
		},
	]);
})(angular);
