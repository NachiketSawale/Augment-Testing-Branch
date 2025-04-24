(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	let module = angular.module(moduleName);

	module.factory('controllingGeneralContractorBudgetShiftWizardDataService', ['_', '$q', '$http', '$injector', 'globals', 'platformDataServiceFactory', '$translate', 'platformRuntimeDataService', 'platformGridAPI',
		function (_, $q, $http, $injector, globals, platformDataServiceFactory, $translate, platformRuntimeDataService, platformGridAPI){
			let service = {};

			let originlaObj = {
				Id: 0,
				Code:'',
				SourceOrTarget: 'Target',
				Description: '',
				Comment: '',
				MdcCounitTargetFk: null,
				PackageBudget: 0,
				BudgetInPackNSub:0,
				AvaiBudget: 0,
				ShiftBudget: 0,
				TotalBudget: 0,
				__rt$data: {
					errors: {
						MdcCounitTargetFk: {error: generateEmptyCUError()},
						Description: {error: generateEmptyDescError()}
					},
					readonly: [
						{field: 'Description', readonly: true},
						{field: 'Code', readonly: true}
					]
				}
			};

			let loadData = function () {
				let costControl = $injector.get('controllingGeneralcontractorCostControlDataService').getSelected();
				let totalBudgetShift = costControl.Budget;
				let source =
					{
						Id:1,
						SourceOrTarget: 'Source',
						Code:'',
						Description: '',
						Comment: '',
						MdcCounitTargetFk: Math.abs(costControl.Id),
						PackageBudget: costControl.PackageValueNet - 0,
						BudgetInPackNSub:0,
						AvaiBudget: 0,
						ShiftBudget: -((costControl.OwnBudget - 0) + (costControl.OwnBudgetShift - 0) - (costControl.PackageValueNet - 0)),
						TotalBudget: totalBudgetShift,
						SorurceType:true,
						__rt$data: {
							errors: {
								Description: {error: generateEmptyDescError()}
							},
							readonly: [
								{field: 'SourceOrTarget', readonly: true},
								{field: 'MdcCounitTargetFk', readonly: true},
								{field: 'BudgetInPackNSub', readonly: true},
								{field: 'AvaiBudget', readonly: true},
								{field: 'TotalBudget', readonly: true},
								{field: 'Code', readonly: true}
							]
						}
					};

				source.AvaiBudget = source.TotalBudget + source.ShiftBudget;
				source.BudgetInPackNSub = source.TotalBudget + source.ShiftBudget;

				if(source.ShiftBudget > 0){
					source.ShiftBudget = 0;
				}
				let list = [source];
				if((totalBudgetShift)> 0) {
					let targetOne = angular.copy(originlaObj);
					targetOne.Id = 2;
					targetOne.ShiftBudget = -source.ShiftBudget;
					targetOne.AvaiBudget = targetOne.TotalBudget + targetOne.ShiftBudget;
					list.push(targetOne);
				}

				serviceContainer.data.handleReadSucceeded(list, serviceContainer.data);

				return $http.get(globals.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/getmaxcodebyproject?projectId='+getProjectId()).then(function (res){
					if(res && res.data){
						_.forEach(list, function (item){
							item.Code = res.data;
						});
					}

					return list;
				});
			};

			function appendPackgeBudgetTotal(item, controllingUnitFk){
				let costControl = _.find($injector.get('controllingGeneralcontractorCostControlDataService').getList(), function (item){
					return item.Id === controllingUnitFk;
				});

				if(costControl){
					item.PackageBudget = costControl.PackageValueNet - 0;
					item.BudgetInPackNSub = item.PackageBudget + costControl.SubTotalBudget;
					return $q.when(item);
				}

				return $http.get(globals.webApiBaseUrl + 'procurement/package/total/gettotalbycuid?projectId='+ getProjectId() +'&controllingUnitId=' + (controllingUnitFk || item.MdcCounitTargetFk)).then(function (res){
					if(res && res.data && res.data.length > 0){
						_.forEach(res.data, function (total){
							item.PackageBudget += (total.ValueNet||0);
						});
					}

					return item;
				});
			}


			let estimateMainRootServiceOptions = {
					module: module,
					serviceName: 'controllingGeneralContractorBudgetShiftWizardDataService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadData,
						resourceFunctionParameters: []
					},
					entitySelection: {},
					presenter: {list: {}},
					entityRole: {root: {
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						itemName: 'BudgetShift',
						moduleName: 'Controlling General'
					}},
					actions: {}
				},
				serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainRootServiceOptions);
			service = serviceContainer.service;

			serviceContainer.data.updateOnSelectionChanging = null;
			serviceContainer.data.doUpdate = null;
			service.markItemAsModified = null;

			service.isAnyBudgetToShift = function (){
				let source = _.find(service.getList(), {SorurceType:true});

				return source && source.ShiftBudget < 0 && (source.TotalBudget - source.BudgetInPackNSub) > 0;
			};

			service.isBudgetShiftFinish = function (){
				let list = service.getList();
				let total = 0;
				_.forEach(list, function (item){
					total += item.ShiftBudget;
				});

				return total === 0;
			};

			service.isBudgetShiftOverproof = function (){
				let source = _.find(service.getList(), {SorurceType:true});

				return source.TotalBudget - source.BudgetInPackNSub < 0 - source.ShiftBudget;
			};

			service.createItem = function (shiftBudget){
				if(!service.isAnyBudgetToShift() || service.isBudgetShiftFinish()){
					return;
				}

				let list = service.getList();
				let maxId = 0;
				_.forEach(list, function (item){
					maxId = item.Id > maxId ? item.Id : maxId;
				});
				let newItem = angular.copy(originlaObj);
				newItem.Id = maxId + 1;
				newItem.ShiftBudget = shiftBudget || 0;
				newItem.AvaiBudget = newItem.ShiftBudget;

				let source = _.find(list, {Id:1});
				newItem.Code = source.Code;
				newItem.Description = source.Description;
				if(source.Description){
					removeError(newItem, 'Description');
				}

				let newList = [];
				_.forEach(list, function (item){newList.push(angular.copy(item));});
				newList.push(newItem);

				let data = serviceContainer.data;
				serviceContainer.data.handleReadSucceeded(newList, data);
			};

			service.deleteItem = function (){
				let selected = service.getSelected();
				if(!selected || selected.SorurceType) {return;}

				let list = service.getList();

				let newList = [];
				_.forEach(list, function (item){
					item.Id !== selected.Id && newList.push(angular.copy(item));
				});

				let total = 0;
				_.forEach(newList, function (item){
					total += item.ShiftBudget;
				});

				if(total <= 0){
					clearShiftBudetColumnError(newList);
				}

				let data = serviceContainer.data;
				serviceContainer.data.handleReadSucceeded(newList, data);
			};

			service.loadData = function loadData(){
				return service.load();
			};

			function generateEmptyCUError(){
				return $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('controlling.generalcontractor.ControllingUnitFk')});
			}

			function generateEmptyDescError(){
				return $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('controlling.generalcontractor.Description')});
			}

			service.controllingUnitChange = function (entity,value){
				if(!value){
					return {
						apply: true, valid: false,
						error: generateEmptyCUError()
					};
				}

				if(!entity.selectedLeafCu){
					return {
						apply: true, valid: false,
						error: $translate.instant('controlling.generalcontractor.ErrorLeafNodeCu')
					};
				}

				let list = service.getList();
				let sameCu = null;
				_.forEach(list, function (item){
					if(item.Id !== entity.Id && item.MdcCounitTargetFk === value){
						sameCu = item;
					}
				});

				if(sameCu){
					return {
						apply: true, valid: false,
						error: $translate.instant('controlling.generalcontractor.RepeatedCu')
					};
				}

				let costControl = _.find($injector.get('controllingGeneralcontractorCostControlDataService').getList(), {Id: value});
				if(costControl) {
					entity.TotalBudget = costControl.Budget;
					entity.PackageBudget = 0;
					entity.AvaiBudget = entity.TotalBudget + entity.ShiftBudget;
				}

				return true;
			};

			service.controllingUnitChangeAsyn = function (entity, newValue){
				return appendPackgeBudgetTotal(entity, newValue).then(function (){
					return true;
				});
			};

			service.ShiftBudgetChange = function (entity, newValue){
				newValue -= 0;
				let result = {apply: true, valid: true};
				let list = service.getList();

				if(entity.SorurceType){
					newValue = newValue > 0 ? -newValue : newValue;
					if(-newValue > entity.TotalBudget - entity.BudgetInPackNSub){
						result.valid = false;
						result.error = $translate.instant('controlling.generalcontractor.ShiftBudgetOutRange');
						return result;
					}else{
						if(list.length === 2){
							_.forEach(list, function(item){
								if(item.Id !== entity.Id){
									item.ShiftBudget = -newValue;
									item.AvaiBudget = item.TotalBudget + item.ShiftBudget;
								}
							});
						}else if(list.length > 2){
							let sum = 0;
							_.forEach(list, function (item){
								sum += (item.Id !== entity.Id ? item.ShiftBudget : newValue);
							});

							let lastOne = list[list.length - 1];
							lastOne.ShiftBudget -= sum;
							if(lastOne.ShiftBudget < 0){
								lastOne.ShiftBudget = 0;
							}
							lastOne.AvaiBudget = lastOne.TotalBudget + lastOne.ShiftBudget;
						}
					}
				}

				let total = 0;
				_.forEach(list, function (item){
					total += (item.Id !== entity.Id ? item.ShiftBudget : newValue);
				});

				entity.AvaiBudget = entity.TotalBudget + newValue;

				if(total > 0){
					result.valid = false;
					result.error = $translate.instant('controlling.generalcontractor.ShiftBudgetBigThenTotal');
					return result;
				}else{
					entity.ShiftBudget = newValue;
					total < 0 && service.isAnyBudgetToShift() && !service.isBudgetShiftOverproof() && service.createItem(-total);
					clearShiftBudetColumnError(list,true);
				}

				_.forEach(scope.tools.items, function (item) {
					if (item.id === 'create'){
						item.disabled = !service.isAnyBudgetToShift() || service.isBudgetShiftOverproof() || service.isBudgetShiftFinish();
					}
				});
				scope.tools.update();

				return result;
			};

			let gridGuid = '81D7FE4E05D543BBA5E8C99C95C3414B';

			service.CodeChangeChangeAsyn = function (entity, newValue){

				if(!newValue){
					return $q.when({
						apply: true, valid: false,
						error: $translate.instant('controlling.generalcontractor.EmptyCode')
					});
				}

				return $http.get(globals.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/checkcodeisexist?projectId='+getProjectId()+'&code=' + newValue).then(function (res){
					if(res && !res.data){
						let list = service.getList();

						_.forEach(list, function (item){
							if(item.Id !== entity.Id){
								item.Code = newValue;
								platformGridAPI.rows.refreshRow({gridId: gridGuid,item:item});
							}
						});

						return true;
					}else{
						return {
							apply: true, valid: false,
							error: $translate.instant('controlling.generalcontractor.CodeAlreadyExist')
						};
					}
				});
			};

			service.DescriptionChange = function (entity, value){
				let list = service.getList();

				_.forEach(list, function (item){
					if(item.Id !== entity.Id){
						item.Description = value;

						if(!value){
							item.__rt$data = item.__rt$data || {};
							item.__rt$data.errors = item.__rt$data.errors || {};
							item.__rt$data.errors.Description = {error: generateEmptyDescError()};
						}else{
							removeError(item, 'Description');
						}

						platformGridAPI.rows.refreshRow({gridId: gridGuid,item:item});
					}
				});

				if(!value){
					return {
						apply: true, valid: false,
						error: generateEmptyDescError()
					};
				}

				return true;
			};

			function removeError(item, model){
				if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[model]){
					delete  item.__rt$data.errors[model];
				}
			}

			function clearShiftBudetColumnError(list,refreshRow){
				_.forEach(list, function (item){
					let sourceTotalValidate = item.Id === 1 && (item.TotalBudget - item.BudgetInPackNSub) > 0 - item.ShiftBudget;
					if(item.Id !== 1 || sourceTotalValidate) {
						platformRuntimeDataService.applyValidationResult(true, item, 'ShiftBudget');
					}
					refreshRow && platformGridAPI.rows.refreshRow({gridId: gridGuid,item:item});
				});
			}

			function getProjectId(){
				let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
				let context = cloudDesktopPinningContextService.getContext();
				let prjItem = _.find(context, {'token': 'project.main'});
				return prjItem.id;
			}

			service.hasAnyError = function (){
				let list = service.getList();
				let total = 0;
				let anyEmptyOrErrorCu = false;
				_.forEach(list, function (item){
					total += item.ShiftBudget;
					anyEmptyOrErrorCu = (anyEmptyOrErrorCu)
						|| (!item.MdcCounitTargetFk && item.ShiftBudget > 0 )
						|| (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.MdcCounitTargetFk && item.__rt$data.errors.MdcCounitTargetFk.error)
						|| (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.Code && item.__rt$data.errors.Code.error)
						|| (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.Description && item.__rt$data.errors.Description.error);
				});

				let source = _.find(list, {Id: 1});
				return total !== 0 || anyEmptyOrErrorCu || list.length === 1 || source.ShiftBudget === 0 || service.isBudgetShiftOverproof();
			};

			service.createBudgetShift = function (){
				let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
				let item = cloudDesktopPinningContextService.getPinningItem('project.main');
				let data = {
					ProjectId : item.id,
					BudgetShiftItemDtos: service.getList()
				};

				return $http.post(globals.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/createbudgetshift', data);
			};

			service.canCreate = service.canAutoCreateRow = function (){
				// this function can't be removed, otherwise, the wizard window will close automatically after clicking Enter key
				return true;
			};

			let scope = null;
			service.setScope = function ($scope){
				scope = $scope;
			};

			return service;
		}
	]);
})(angular);


(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorBudgetShiftWizardUiService', ['platformTranslateService','$injector',
		function (platformTranslateService, $injector){
			let dataService = $injector.get('controllingGeneralContractorBudgetShiftWizardDataService');
			let gridColumns = [
				{ id: 'code', field: 'Code', name: 'Code', width: '50px', editor:'code',   toolTip: 'Code', formatter: 'code', name$tr$: 'controlling.generalcontractor.Code',
					asyncValidator: function (entity, value){
						return dataService.CodeChangeChangeAsyn(entity,value);
					}
				},
				{ id: 'descriptionCol', field: 'Description', name: 'Description', toolTip: 'Description', editor:'description',  maxLength:252, formatter: 'description', name$tr$: 'controlling.generalcontractor.Description',
					validator: function (entity, value){
						return dataService.DescriptionChange(entity, value);
					}
				},
				{ id: 'budget', field: 'TotalBudget', name: 'TotalBudget', toolTip: 'Total Budget', formatter: 'money', name$tr$: 'controlling.generalcontractor.TotalBudget'},
				{ id: 'shiftBudget', field: 'ShiftBudget', name: 'ShiftBudget', toolTip: 'Shift Budget',  formatter: 'money', name$tr$: 'controlling.generalcontractor.ShiftBudget',
					editor: 'directive',
					editorOptions: {
						directive: 'controlling-general-contstactor-shift-budget-input'
					},
					validator: function (entity, value, model){
						return dataService.ShiftBudgetChange(entity, value, model);
					}
				},
				{ id: 'avaiBudget', field: 'AvaiBudget', name: 'AvaiBudget', toolTip: 'Budget after shift',  formatter: 'money', name$tr$: 'controlling.generalcontractor.AvaiBudget'},
				{ id: 'BudgetInPackNSub', field: 'BudgetInPackNSub', name: 'BudgetInPackNSub', toolTip: 'Budget spent',  formatter: 'money', name$tr$: 'controlling.generalcontractor.BudgetInPackNSub'},
				{ id: 'sourceOrTar', field: 'SourceOrTarget', name: 'SourceOrTarget', width: '80px',   toolTip: 'Source/Target', formatter: 'description', name$tr$: 'controlling.generalcontractor.SourceOrTarget'},
				{ id: 'mdccounittargetfk', field: 'MdcCounitTargetFk', name: 'ControllingUnit', width: '90px', toolTip: 'Controlling Unit',  name$tr$: 'controlling.generalcontractor.ControllingUnit',
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
					editor: 'directive',
					editorOptions: {
						lookupDirective: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
						filterKey: 'est-prj-controlling-unit-filter',
						considerPlanningElement: true,
						selectableCallback: function(dataItem){
							return dataItem.IsPlanningElement;
						},
						additionalColumns: true,
						addGridColumns: [{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							grouping: true,
							width: 300,
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription'
						}],
						lookupOptions: {
							showClearButton: true
						}
					},
					validator: function (entity, value, model){
						return dataService.controllingUnitChange(entity, value, model);
					},
					asyncValidator: function (entity, value){
						return dataService.controllingUnitChangeAsyn(entity, value);
					}
				},
				{  id:'mdccounittargetfkdescription', name: 'Controlling Unit-Description',
					name$tr$: 'controlling.generalcontractor.entityControllingUnitDescription',
					additionalColumn:{
						field: 'DescriptionInfo',
						formatter: 'translation',
						grouping: true,
						id: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 300
					},
					field: 'MdcCounitTargetFk',
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'ControllingUnit', 'displayMember': 'Code'}
				},
				{ id: 'comment', field: 'Comment', name: 'Comment', toolTip: 'Comment', editor:'description', maxLength:256, formatter: 'description', name$tr$:  'controlling.generalcontractor.Comment'}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			let service = {};

			service.getStandardConfigForListView = function () {
				return {
					columns: gridColumns
				};
			};

			return service;
		}
	]);
})(angular);
