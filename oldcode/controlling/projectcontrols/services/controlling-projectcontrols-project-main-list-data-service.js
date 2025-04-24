
(function (angular) {

	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);

	controllingProjectControlsModule.factory('controllingProjectcontrolsProjectMainListDataService',
		['_', '$injector', 'controllingCommonProjectMainListDataServiceFactory',
			function (_, $injector, controllingCommonProjectMainListDataServiceFactory) {

				let serviceOption = {
					module : controllingProjectControlsModule,
					moduleName : moduleName,
					serviceName : 'controllingProjectcontrolsProjectMainListDataService',
					updateUrl : 'controlling/projectcontrols/main/',
					displayModuleName : 'cloud.desktop.moduleDisplayNameControllingProjectControls',
				};

				let service = controllingCommonProjectMainListDataServiceFactory.createService(serviceOption);

				service.doPrepareUpdateCall = function(updateData){
					if(!updateData || !updateData.GroupingItemToSave){
						return;
					}

					let controllingProjectcontrolsDashboardService = $injector.get('controllingProjectcontrolsDashboardService');

					let ribHistoryId = controllingProjectcontrolsDashboardService.getRIBHistoryId();

					if(!ribHistoryId || ribHistoryId < 1){
						updateData.GroupingItemToSave = [];
						return;
					}

					let groupingItemToSave = [];
					let modifiedSACValues = controllingProjectcontrolsDashboardService.getModifiedSACValue();
					let configService = $injector.get('controllingProjectControlsConfigService');
					let editableFactorColumns = configService.getEditableFactorColumns();
					_.forEach(updateData.GroupingItemToSave, function(item){
						if(item.GroupingItem && item.GroupingItem.EditableInfo){
							let groupingItem = service.createControllingUnitGroupingItem(item, ribHistoryId);

							// Process WCF and BCF and Custiom_factor
							_.forEach(editableFactorColumns, function(column){
								let field = column.field;
								let propDefInfo = column.propDefInfo;

								if(_.isNumber(item.GroupingItem[field]) && item.GroupingItem[field + '_IS_MODIFIED']){
									groupingItem.GroupingItem.Fields.push({
										MdcContrFormulaPropDefFk: propDefInfo && propDefInfo.item ? propDefInfo.item.Id : -1,
										Value:item.GroupingItem[field]
									});
								}
							})

							// Process SAC
							let groupingItemModifiedSACValues = _.filter(modifiedSACValues, function(value){
								return value.RelCoFk === groupingItem.GroupingItem.ControllingUnitFk &&
									value.RelConccFk === groupingItem.GroupingItem.ControllingUnitCostCodeFk;
							});
							if(groupingItemModifiedSACValues.length > 0){
								_.forEach(groupingItemModifiedSACValues, function(val){
									groupingItem.GroupingItem.Fields.push({
										MdcContrFormulaPropDefFk: val.MdcContrFormulaPropDefFk,
										Value: val.Value,
										Period: val.Period
									});
								});
							}

							groupingItemToSave.push(groupingItem);
						}
					});

					updateData.GroupingItemToSave = groupingItemToSave;
				};

				service.createControllingUnitGroupingItem = function(item, ribHistoryId){
					let retValue = {
						MainItemId: item.MainItemId,
						GroupingItem:{
							Id:item.GroupingItem.Id,
							PrjHistoryFk: ribHistoryId,
							ControllingUnitFk: item.GroupingItem.EditableInfo.ControllingUnitFk,
							ControllingUnitCostCodeFk: item.GroupingItem.EditableInfo.ControllingUnitCostCodeFk,
							Fields:[]
						}};

					return retValue;
				};

				service.handleUpdateDone = function (response){
					if(response && response.GroupingItemToSave && response.GroupingItemToSave.length > 0){
						$injector.get('controllingProjectcontrolsDashboardService').load();
					}
				};

				return service;
			}
		]);
})(angular);
