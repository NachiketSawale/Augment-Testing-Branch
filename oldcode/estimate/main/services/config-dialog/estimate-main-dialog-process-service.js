/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDialogProcessService
	 * @function
	 * @description
	 * estimateMainDialogProcessService is the data service to process Complete Estimate configuration .
	 */
	angular.module(moduleName).factory('estimateMainDialogProcessService', ['platformRuntimeDataService', 'PlatformMessenger','$injector',
		function (platformRuntimeDataService, PlatformMessenger, $injector) {

			let service = {
					processItem: processItem,
					isStrDetailReadOnly: isStrDetailReadOnly,
					isRootAssignTypeDetailReadOnly: isRootAssignTypeDetailReadOnly,
					isRootAssignTypeParamDetailReadOnly: isRootAssignTypeParamDetailReadOnly,
					isColDetailReadOnly: isColDetailReadOnly,
					isTolDetailReadOnly: isTolDetailReadOnly,
					setDialogConfig: setDialogConfig,
					getDialogConfig: getDialogConfig,
					clearConfig: clearConfig,
					setReadOnly: setReadOnly,
					onRefreshStrDetail: new PlatformMessenger(),
					onRefreshUppDetail: new PlatformMessenger(),
					onRefreshColDetail: new PlatformMessenger(),
					onRefreshTolDetail: new PlatformMessenger(),
					onRefreshRootAssignDetail: new PlatformMessenger(),
					onRefreshRootAssignParamDetail: new PlatformMessenger(),
					onRefreshRoundingConfigDetail: new PlatformMessenger()
				},
				isStructDetailReadOnly = true,
				isColumnConfigDetailReadOnly = true,
				isTotalsConfigDetailReadOnly = true,
				isRootAssignmentTypeDetailReadOnly = true,
				isRootAssignmentTypeParamDetailReadOnly = true;

			// use this config to defined which case using
			let dialogConfig = {
				editType: 'estimate',// estimate / customizeforall / customizeforcolumn / customizeforstructure / customizeforupp / customizefortotals
				columnConfigTypeId: '',
				totalsConfigTypeId:'',
				structureConfigTypeId: '',
				uppConfigTypeId: '',
				costBudgetConfigTypeId:'',
				columnConfigFk: '',
				totalsConfigFk:'',
				structureConfigFk: '',
				uppConfigFk: '',
				configTypeId: '',
				configFk: '',
				costBudgetConfigFk:'',
				isInUse: false
			};
			let defaultDialogConfig = angular.copy(dialogConfig);

			// reset the dialogconfig
			function clearConfig() {
				dialogConfig = defaultDialogConfig;
			}

			function getDialogConfig() {
				return dialogConfig;
			}

			function setDialogConfig(item) {
				dialogConfig = item ? item : dialogConfig;
				return dialogConfig;
			}

			function processItem(item, rows) {
				let fields = [],
					isEditEst = item.isEditEstType,
					isEditCol = item.isEditColConfigType,
					isEditTol = item.isEditTolConfigType,
					isEditTolActiveStr = item.ActivateLeadingStr,
					isEditStruct = item.isEditStructType,
					isEditUpp = item.isEditUppType,
					isEditRoundingConfig = item.isEditRoundingConfigType,
					noBoqInfo = !item || !item.BoqHeaderId;
				// isEditCostBudget = item.isEditCostBudgetConfigType;

				let dialogId = $injector.get('estimateMainEstUppDataService').getDialogId();
				let dialogUserSettingService = $injector.get('dialogUserSettingService');

				/* jshint -W074 */ // this function's cyclomatic complexity is too high.
				angular.forEach(rows, function (row) {
					let readOnly = true;
					switch (row.rid.trim()) {
						case 'estConfigType':
						case 'editEstType':
							readOnly = !!isEditEst;
							break;
						case 'estConfigDesc':
							readOnly = !isEditEst;
							break;
						case 'isColumnConfig':
							readOnly = !isEditEst;
							break;
						case 'boqWicGroup':
							readOnly = !isEditEst;
							break;
						case 'estColConfigType':
						case 'editColConfigType':
							readOnly = !isEditEst || !!isEditCol;
							break;
						case 'colConfigDesc':
						case 'colConfigDetail':
							readOnly = !isEditEst || !isEditCol;
							break;
						case 'estTolConfigType':
						case 'editTolConfigType':
							readOnly = !isEditEst || !!isEditTol;
							break;
						case 'estTotalsConfigDesc':
						case 'estTotalsConfigDetail':
						case 'estTolConfigActiveUnitRateStrQty':
							readOnly = !isEditEst || !isEditTol;
							break;
						case 'estTolConfigStrTypeProjectCostGroup':
						case 'estTolConfigStrTypeEnterpriseCostGroup':
							item.LeadingStrPrjCostgroup = item.LeadingStr === 5 ? item.LeadingStrPrjCostgroup: null;
							item.LeadingStrEntCostgroup = item.LeadingStr === 6 ? item.LeadingStrEntCostgroup: null;
							break;
						case 'estStructType':
						case 'editEstStructType':
							readOnly = !isEditEst || !!isEditStruct;
							break;
						case 'estStructConfigDesc':
						case 'getQuantityTotalToStructure':
						case 'estStructDetail':
							readOnly = !isEditEst || !isEditStruct;
							break;
						case 'estUppType':
						case 'editEstUppType':
						case 'estUppConfigDesc':
						case 'estUppDetail':
							readOnly = !isEditUpp;
							break;
						case 'estRoundingConfigType':
							readOnly = !isEditEst || !!isEditRoundingConfig;
							break;
						case 'editRoundingConfigType':
							readOnly = !isEditEst || !!isEditRoundingConfig;
							break;
						case 'estRoundingConfigDesc':
						case 'estRoundingConfigDetail':
							readOnly = !isEditEst || !isEditRoundingConfig;
							break;
					}
					// customizing module
					if (dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' ) {
						switch (dialogConfig.editType){
							case 'customizeforall':
								// the tables of the sub-configs (which can be changed separatly,
								// like column estimate, structure) itself and the descriptions should be readonly,
								// only the types can change
								readOnly = !(row.gid === 'estConfig' || row.rid === 'estColConfigType' || row.rid === 'estStructType' || row.rid === 'estTolConfigType' || row.rid === 'costBudgetConfigType' || row.rid === 'estRuleAssignType' || row.rid === 'estRoundingConfigType');
								break;
							case 'customizeforroundingconfig':
								// the tables of the sub-configs (which can be changed separatly,
								// like column estimate, structure) itself and the descriptions should be readonly,
								// only the types can change
								readOnly = row.rid === 'estRoundingConfigType';
								break;
							case 'estBoqUppConfig':
								if(row.rid.trim() === 'estUppType'){
									readOnly = noBoqInfo || (item.BoqHeaderId && $injector.get('estimateMainUpp2CostcodeDetailDataService').getIsCurrentBoqUppConfiged()) || isEditUpp;
								}else if(row.rid.trim() === 'BoqId'){
									readOnly = false;
								}else if(row.rid.trim() === 'estUppEditType'){
									readOnly = noBoqInfo || isEditUpp || $injector.get('estimateMainUpp2CostcodeDetailDataService').getIsCurrentBoqUppConfiged();
								}else if(row.rid.trim() === 'isDisabled'){
									{
										readOnly = false;
										item.IsDisabled = dialogUserSettingService.getCustomConfig(dialogId, 'IsDisabled') ?? false;
									}
								}else if( row.rid.trim() === 'isFixedPrice'){
									{
										readOnly = false;
										item.IsFixedPrice = dialogUserSettingService.getCustomConfig(dialogId, 'IsFixedPrice') ?? false;
									}
								}else if(row.rid.trim() === 'isAQOptionalItems'){
									{
										readOnly = false;
										item.IsAQOptionalItems = dialogUserSettingService.getCustomConfig(dialogId, 'IsAQOptionalItems') ?? false;
									}
								}else if(row.rid.trim() === 'isDayWork'){
									{
										readOnly = false;
										item.IsDayWork = dialogUserSettingService.getCustomConfig(dialogId, 'IsDayWork') ?? false;
									}
								}else{
									readOnly = readOnly || false;
								}
								break;
							default:
								readOnly = false;
								break;
						}
					}

					if (row.rid === 'colConfigDetail') {
						setColDetailReadOnly(readOnly);
						// if no column config type selected in customization module,then set create button disabled
						if(dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' && angular.isDefined(item.estColConfigTypeFk) && (item.estColConfigTypeFk ===null || item.estColConfigTypeFk===0)){
							setColDetailReadOnly(true);
						}
						if (readOnly){
							setReadOnly(item.estColumnConfigDetails, readOnly);
						}else {
							setConfigDetailReadOnly(item.estColumnConfigDetails);
						}
						service.onRefreshColDetail.fire();
					}

					if (row.rid === 'estTolConfigStrType') {
						if (dialogConfig.editType === 'customizefortotals'){
							readOnly = !(isEditTolActiveStr);
						}else{
							readOnly = !(isEditEst && isEditTol && isEditTolActiveStr);
						}
					}

					if (row.rid === 'estTolConfigStrTypeProjectCostGroup'){
						let prjCostGroupId = 5;
						let isPrjCostGroupActive = [prjCostGroupId].indexOf(item.LeadingStr) > -1;
						if (isPrjCostGroupActive && dialogConfig.editType !== 'customizefortotals'){
							$injector.get('estimateMainTotalsConfigStructureTypeServiceCostGroup').setCostGroupType(prjCostGroupId, dialogConfig.editType);
						}

						if (dialogConfig.editType === 'customizefortotals'){
							readOnly =  !(isPrjCostGroupActive);
						}else{
							readOnly = !(isEditEst && isEditTol && isPrjCostGroupActive && isEditTolActiveStr);
						}
					}

					if (row.rid === 'estTolConfigStrTypeEnterpriseCostGroup'){
						let entCostGroupId = 6;
						let isEntCostGroupActive = [entCostGroupId].indexOf(item.LeadingStr) > -1;
						if (isEntCostGroupActive){
							// Enterprise Cost group can be shown in estimate and customization totals
							$injector.get('estimateMainTotalsConfigStructureTypeServiceCostGroup').setCostGroupType(entCostGroupId, dialogConfig.editType);
						}

						if (dialogConfig.editType === 'customizefortotals'){
							readOnly =  !(isEntCostGroupActive);
						}else{
							readOnly = !(isEditEst && isEditTol && isEntCostGroupActive && isEditTolActiveStr);
						}
					}

					if (row.rid === 'estTotalsConfigDetail') {
						setTolDetailReadOnly(readOnly);
						// if no column config type selected in customization module,then set create button disabled
						if (dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' && angular.isDefined(item.estTolConfigTypeFk) && (item.estTolConfigTypeFk === null || item.estTolConfigTypeFk === 0)) {
							setTolDetailReadOnly(true);
						}

						if (readOnly) {
							setReadOnly(item.EstTotalsConfigDetails, readOnly);
							setReadOnly(item.estCostcodeAssignDetails, readOnly);
						} else {
							setTotalsDetailReadOnly(item.EstTotalsConfigDetails);
							setTotalsDetailReadOnly(item.estCostcodeAssignDetails);

							if(item.EstTotalsConfigDetails && item.EstTotalsConfigDetails.length) {
								_.forEach (item.EstTotalsConfigDetails, function (d) {
									let fields = [];
									fields.push ({field: 'BasUomFk', readonly: !!d.LineType});
									fields.push ({field: 'IsLabour', readonly: !!d.LineType});
									fields.push ({field: 'EstTotalDetail2CostTypes', readonly: !!d.LineType});
									fields.push ({field: 'EstTotalDetail2ResourceFlags', readonly: !!d.LineType});
									platformRuntimeDataService.readonly (d, fields);
								});
							}
						}
						service.onRefreshTolDetail.fire();
					}

					if (row.rid === 'estStructDetail') {
						setStrDetailReadOnly(readOnly);
						if(dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' && angular.isDefined(item.estStructTypeFk) && (item.estStructTypeFk ===null || item.estStructTypeFk===0)){
							setStrDetailReadOnly(true);
						}
						setReadOnly(item.estStructureConfigDetails, readOnly, true);
						if(item.estStructureConfigDetails){
							$injector.get('estimateMainStructureConfigDetailDataService').setCodeColReadOnly(item.estStructureConfigDetails, readOnly);
						}

						service.onRefreshStrDetail.fire();
					}

					if (row.rid === 'estRootAssignmentDetail') {
						setRootAssignTypeDetailReadOnly(readOnly);
						if(dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' && angular.isDefined(item.estRuleAssignTypeFk) && (item.estRuleAssignTypeFk ===null || item.estRuleAssignTypeFk===0)){
							setRootAssignTypeDetailReadOnly(true);
						}
						setReadOnly(item.estRootAssignmentDetails, readOnly, true);

						service.onRefreshRootAssignDetail.fire();
						// setRootAssignTypeDetailReadOnly(readOnly);
					}

					if (row.rid === 'estRootAssignmentParamsDetail') {
						setRootAssignTypeParamDetailReadOnly(readOnly);
						setRootAssignTypeDetailReadOnly(readOnly);
						if(dialogConfig.editType !== 'estimate' && dialogConfig.editType !== 'assemblies' && angular.isDefined(item.estRuleAssignTypeFk) && (item.estRuleAssignTypeFk ===null || item.estRuleAssignTypeFk===0)){
							setRootAssignTypeDetailReadOnly(true);
						}

						// service.onRefreshRootAssignDetail.fire();
						service.onRefreshRootAssignParamDetail.fire();
					}

					if (row.rid === 'estUppDetail') {
						let upp2costCodes = $injector.get('estimateMainUpp2CostcodeDetailDataService').getList();
						setReadOnly($injector.get('cloudCommonGridService').flatten(upp2costCodes, [], 'CostCodes'), readOnly && !$injector.get('estimateMainUpp2CostcodeDetailDataService').getIsCurrentBoqUppConfiged());
						service.onRefreshUppDetail.fire();
					}

					if(row.rid === 'EstAllowanceConfigTypeFk'){
						readOnly = false;
					}

					if (row.rid === 'estRoundingConfigDetail') {
						$injector.get('estimateMainRoundingConfigDetailProcessService').processItems(item.estRoundingConfigDetail, readOnly);
						service.onRefreshRoundingConfigDetail.fire();
					}

					fields.push({field: row.model, readonly: readOnly, disabled: readOnly});
				});
				platformRuntimeDataService.readonly(item, fields);
			}

			// set all items readonly or editable
			function setReadOnly(items, isReadOnly, ignoreCodeColumn) {
				let fields = [],
					item = _.isArray(items) ? items[0] : null;

				_.forOwn(item, function (value, key) {
					let field = {field: key, readonly: isReadOnly};
					fields.push(field);
				});

				if(ignoreCodeColumn){
					fields = _.filter(fields, function (i) {
						return i.field !== 'Code';
					});
				}

				angular.forEach(items, function (item) {
					if (item && item.Id) {
						platformRuntimeDataService.readonly(item, fields);
					}
				});

			}

			// set config detail items readonly or editable
			function setConfigDetailReadOnly(items) {
				let fields = [];
				angular.forEach(items, function (item) {
					if (item.__rt$data){
						item.__rt$data.readonly = [];
					}
					fields = [];

					if (item && item.Id) {
						if (item.ColumnId === 1){ // Code
							fields.push({field: 'LineType', readonly: true});
							fields.push({field: 'MdcCostCodeFk', readonly: true});
						}
						if (item.LineType === 1){ // CostCodes
							fields.push({field: 'MaterialLineId', readonly: true});
						}
						else if (item.LineType === 2){ // Material
							fields.push({field: 'MdcCostCodeFk', readonly: true});
						}

						platformRuntimeDataService.readonly(item, fields);
					}
				});

			}

			function setTotalsDetailReadOnly(items) {
				let fields = [];
				angular.forEach(items, function (item) {
					fields = [{field: 'Sorting', readonly: true}];
					if (item.__rt$data){
						item.__rt$data.readonly = [];
					}
					if (item && item.Id) {
						platformRuntimeDataService.readonly(item, fields);
					}
				});
			}

			// set structure detail tools readonly
			function setStrDetailReadOnly(isReadOnly) {
				isStructDetailReadOnly = isReadOnly;
			}

			// is structure detail tools readonly
			function isStrDetailReadOnly() {
				return isStructDetailReadOnly;
			}

			function setColDetailReadOnly(isReadOnly) {
				isColumnConfigDetailReadOnly = isReadOnly;
			}

			function isColDetailReadOnly() {
				return isColumnConfigDetailReadOnly;
			}


			function setTolDetailReadOnly(isReadOnly) {
				isTotalsConfigDetailReadOnly = isReadOnly;
			}

			function isTolDetailReadOnly() {
				return isTotalsConfigDetailReadOnly;
			}

			// set structure detail tools readonly
			function setRootAssignTypeDetailReadOnly(isReadOnly) {
				isRootAssignmentTypeDetailReadOnly = isReadOnly;
			}

			// is structure detail tools readonly
			function isRootAssignTypeDetailReadOnly() {
				return isRootAssignmentTypeDetailReadOnly;
			}

			function setRootAssignTypeParamDetailReadOnly(isReadOnly) {
				isRootAssignmentTypeParamDetailReadOnly = isReadOnly;
			}

			// is structure detail tools readonly
			function isRootAssignTypeParamDetailReadOnly() {
				return isRootAssignmentTypeParamDetailReadOnly;
			}

			return service;

		}]);
})(angular);
