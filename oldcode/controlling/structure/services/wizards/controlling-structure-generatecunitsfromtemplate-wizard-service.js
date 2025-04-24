/**
 * $Id: controlling-structure-generatecunitsfromtemplate-wizard-service.js 108308 2024-02-08 17:27:06Z suela.tahiri $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	angular.module(moduleName).factory('controllingStructureGenerateControllingUnitsFromTemplateWizardService',
		['$q', 'globals', '_', '$injector', '$http', '$translate', 'platformTranslateService', 'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService',
			'basicsLookupdataConfigGenerator', 'projectMainForCOStructureService', 'cloudCommonGridService', 'controllingStructureMainService',
			function ($q, globals, _, $injector, $http, $translate, platformTranslateService, platformModalFormConfigService, platformSidebarWizardCommonTasksService,
			          basicsLookupdataConfigGenerator, projectMainForCOStructureService, cloudCommonGridService, controllingStructureMainService) {

				function createMap(oldEntities, newIds) {
					var oldIds = _.map(_.sortBy(oldEntities, 'Id'), 'Id');
					var old2NewIds = {};
					_.each(_.range(_.size(newIds)), function (i) {
						if (oldIds[i]) {
							old2NewIds[oldIds[i]] = newIds[i];
						}
					});
					return old2NewIds;
				}

				function takeOver(source, target) {
					target.DescriptionInfo.Description = source.DescriptionInfo.Translated;
					target.DescriptionInfo.Translated = source.DescriptionInfo.Translated;

					let properties = ['Assignment01', 'Assignment02', 'Assignment03', 'Assignment04', 'Assignment05', 'Assignment06', 'Assignment07', 'Assignment08',
						'Assignment09', 'Assignment10', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'ControllingGrpDetail01Fk',
						'ControllingGrpDetail02Fk', 'ControllingGrpDetail03Fk', 'ControllingGrpDetail04Fk', 'ControllingGrpDetail05Fk', 'ControllingGrpDetail06Fk',
						'ControllingGrpDetail07Fk', 'ControllingGrpDetail08Fk', 'ControllingGrpDetail09Fk', 'ControllingGrpDetail10Fk', 'ControllingCatFk', 'IsAccountingElement',
						'IsAssetmanagement', 'IsBillingElement', 'IsDefault', 'IsFixedBudget', 'IsIntercompany', 'IsPlanningElement', 'IsTimekeepingElement', 'IsPlantmanagement',
						'IsStockmanagement', 'UomFk'];

					_.each(properties, function (propName) {
							target[propName] = source[propName];
						});

					return target;
				}

				function getFullUrl(url){
					return globals.webApiBaseUrl + url;
				}

				function getDefaultSelectedItem(){
					let selectedItem = controllingStructureMainService.getSelected();
					if(!selectedItem){
						selectedItem = _.first(controllingStructureMainService.getList());
					}

					return selectedItem;
				}

				function bulkCreateOnServerFromTemplate(param) {
					const projectId = param.projectId;
					const templateId = param.templateId;
					const templateUnitItemsSelectedIds = param.templateUnitItemsSelectedIds;

					// get all necessary data:
					// - controlling unit templates
					// - controlling unit template groups
					const request = {PKey1: templateId};
					const allPromises = [];
					allPromises.push($http.post(getFullUrl('controlling/controllingunittemplate/unit/treebyparent'), request));
					allPromises.push($http.post(getFullUrl('controlling/controllingunittemplate/unit/group/listbytemplate'), request));
					allPromises.push($http.get(getFullUrl('controlling/structure/unitgroup/listbyproject?projectId=' + projectId), request));
					allPromises.push(projectMainForCOStructureService.update());

					return $q.all(allPromises).then(function (promiseData) {
						let unitTemplates = [];
						cloudCommonGridService.flatten(_.get(promiseData[0], 'data') || [], unitTemplates, 'ControltemplateUnitChildren');
						const unitGroups = _.get(promiseData[1], 'data') || [];
						const projectUnitGroups = _.get(promiseData[2], 'data') || [];

						// filter according to selected units
						unitTemplates = _.filter(unitTemplates, function (item) {return _.includes(templateUnitItemsSelectedIds, item.Id);}); // TODO: check perf

						let selectedItem = getDefaultSelectedItem();

						/*
						* if controlling unit list is empty, create a root controlling unit as selected controlling unit;
						* */
						if (!selectedItem) {
							const createData = {
								ProjectId: projectId,
								ControllingUnitParentId: null,
								ControllingUnitParent: null
							};
							$http.post(getFullUrl('controlling/structure/create'), createData).then(function (responseCreate) {
								selectedItem = responseCreate.data;
								const updateData = {
									ControllingUnitsToSave: [{
											EntitiesCount: 1,
											MainItemID: selectedItem.Id,
											ControllingUnits: selectedItem
										}],
									MainItemId: projectId,
									SaveCharacteristicsOngoing: true
								};
								$http.post(getFullUrl('controlling/structure/update'), updateData).then(function () {
									selectedItem.ControllingUnitChildren = [];
									generateControllingUnitFromTemplate(projectId, templateId, unitTemplates, unitGroups, projectUnitGroups, selectedItem, param);
								});
							});
						}
						else {
							generateControllingUnitFromTemplate(projectId, templateId, unitTemplates, unitGroups, projectUnitGroups, selectedItem, param);
						}
					});
				}


				function generateControllingUnitFromTemplate(projectId, templateId, templateUnits, cuGroups, projectCUGroups, selectedItem, generateParam){
					let selectedCUScope = [selectedItem];// getTemplateUnitItemsFlattened([selectedItem], 'ControllingUnits');
					const controllingUnits = controllingStructureMainService.getList();
					if(selectedItem.ControltemplateFk || selectedItem.ControltemplateUnitFk){
						while(selectedItem && (selectedItem.ControltemplateFk || selectedItem.ControltemplateUnitFk)) {
							selectedItem = _.find(controllingUnits, {'Id': selectedItem.ControllingunitFk });
						}
						selectedCUScope = getTemplateUnitItemsFlattened([selectedItem], 'ControllingUnits');
					}else if(_.isArray(selectedItem.ControllingUnits)){
						_.forEach(selectedItem.ControllingUnits, function(controllingUnit){
							if(controllingUnit.ControltemplateFk || controllingUnit.ControltemplateUnitFk){
								selectedCUScope = selectedCUScope.concat(getTemplateUnitItemsFlattened([controllingUnit], 'ControllingUnits'));
							}
						});
					}

					if(!selectedItem){
						throw new Error('Please select an item first.');
					}

					if(!_.isArray(selectedItem.ControllingUnitChildren)){
						selectedItem.ControllingUnitChildren = _.isArray(selectedItem.ControllingUnits) ? selectedItem.ControllingUnits : [];
					}

					let removedRootTeplateUnit = _.first(_.remove(templateUnits, {ControltemplateUnitFk: null}));
					const rootControllingTemplateUnitCode = removedRootTeplateUnit ? removedRootTeplateUnit.Code : '';

					// remove unit groups which are already available
					cuGroups = _.filter(cuGroups, function (unitGroup) {
						var relatedUnit = _.find(controllingUnits, {ControltemplateUnitFk: unitGroup.ControltemplateUnitFk});
						if (relatedUnit) {
							return !_.some(projectCUGroups, {
								ControllingunitFk: relatedUnit.Id,
								ControllinggroupFk: unitGroup.ControllingGroupFk,
								ControllinggroupdetailFk: unitGroup.ControllingGrpDetailFk
							});
						} else {
							return true;
						}
					});

					function findCreatedCU(ControllingUnitList, TemplateId, TemplateUnitId){
						return _.find(ControllingUnitList, (controllingUnit) => {
							return controllingUnit.ControltemplateUnitFk === TemplateUnitId && controllingUnit.ControltemplateFk === TemplateId;
						});
					}

					let newControllingUnitList = [];
					let newControllingUnitListTemp = [];
					/*
					* response from pm, we do not consider to update the existed item
					* but the code should be kept in here for now
					*
					let toUpdatedControllingUnitList = [];
					*/

					_.forEach(templateUnits, (unit) => {
						let createdCU = findCreatedCU(selectedCUScope, unit.ControltemplateFk, unit.Id);
						if(!createdCU){
							newControllingUnitListTemp.push(unit);
						}
						/*
						* response from pm, we do not consider to update the existed item
						* but the code should be kept in here for now
						*
						if(createdCU){
							let clone = _.clone(createdCU);
							clone.Code = unit.Code;
							takeOver(unit, clone);
							toUpdatedControllingUnitList.push(clone);
						}else{
							newControllingUnitListTemp.push(unit);
						}
						*/
					})

					const newCUSize = _.size(newControllingUnitListTemp);
					/*
					* response from pm, we do not consider to update the existed item
					* but the code should be kept in here for now

					// only update the existed controlling unit(generate from controlling unit template)
					const updateSize = _.size(toUpdatedControllingUnitList);
					if(updateSize > 0 && newCUSize == 0){
						controllingStructureMainService.markEntitiesAsModified(toUpdatedControllingUnitList);
						projectMainForCOStructureService.update();
					}else if(newCUSize > 0){
					}
					 */
					if(newCUSize > 0){
						const url = getFullUrl('controlling/structure/bulkcreate?projectId=') + projectId + '&number=' + newCUSize + '&groupNumber=' + _.size(cuGroups);
						const params = {ProjectId: projectId, number: newCUSize, groupNumber: _.size(cuGroups)};
						return $http.post(url, params).then(function(response){
							const data = response && response.data ? response.data : {};
							// process ids (change mapping template to created ids)
							const Ids = _.isArray(data.Ids) ? data.Ids : [];
							// use id from ControllingUnit (controlling unit used as template for default values)
							const blankItem = data.ControllingUnit ? data.ControllingUnit : null;
							if (blankItem && blankItem.Id) {
								Ids.unshift(blankItem.Id);
							}

							_.forEach(newControllingUnitListTemp, (unit) => {
								let newControllingUnit = angular.copy(blankItem);
								let existedParentControllingUnit = findCreatedCU(selectedCUScope, unit.ControltemplateFk, unit.ControltemplateUnitFk);
								if(!existedParentControllingUnit){
									existedParentControllingUnit = findCreatedCU(newControllingUnitList, unit.ControltemplateFk, unit.ControltemplateUnitFk);
								}

								newControllingUnit.Id = Ids.shift();
								newControllingUnit.ControllingunitFk = existedParentControllingUnit ? existedParentControllingUnit.Id : selectedItem.Id;
								newControllingUnit.ControltemplateFk = unit.ControltemplateFk;
								newControllingUnit.ControltemplateUnitFk = unit.Id;
								newControllingUnit.Code = unit.Code;

								newControllingUnitList.push(_.clone(takeOver(unit, newControllingUnit)));
							})

							/*
							* response from pm, we do not consider to update the existed item
							* but the code should be kept in here for now
							*
							newControllingUnitList = newControllingUnitList.concat(toUpdatedControllingUnitList);
							*/

							const GroupIds = _.isArray(data.GroupIds) ? data.GroupIds : [];
							const clonerGroup = data.ControllingUnitGroup ? data.ControllingUnitGroup : null;
							if (clonerGroup && clonerGroup.Id) {
								GroupIds.unshift(clonerGroup.Id);
							}
							const old2NewGroupIds = createMap(cuGroups, GroupIds);

							const newGroups = [];
							const old2NewIds = createMap(templateUnits, Ids);
							_.forEach(cuGroups, function (group) {
								var newGroup = _.cloneDeep(clonerGroup);

								// check if related already available
								var relatedUnit = _.find(controllingUnits, {ControltemplateUnitFk: group.ControltemplateUnitFk});

								// update group ids from unit groups
								newGroup.Id = old2NewGroupIds[group.Id];
								newGroup.ControllingunitFk = relatedUnit ? relatedUnit.Id : old2NewIds[group.ControltemplateUnitFk];

								// take over
								newGroup.ControllinggroupFk = group.ControllingGroupFk;
								newGroup.ControllinggroupdetailFk = group.ControllingGrpDetailFk;
								return newGroup;
							});

							var BulkCreateDataOnServer = {
								// IsCheckRootLevelRestrictionDisabled is always true, remove the unncessary code;
								// ignore root template unit if root already available
								IsCheckRootLevelRestrictionDisabled: true,
								EntitiesCount: _.size(newControllingUnitList) + _.size(newGroups),
								ProjectId: projectId,
								ControllingUnitCompleteList: _.map(newControllingUnitList, function (u) {
									return {
										ControllingUnits: u,
										ControllingUnitGroupsToSave: _.filter(newGroups, {ControllingunitFk: u.Id}) || []
									};
								}),
								IsKeepTemplateCode: generateParam.IsKeepTemplateCode,
								ReplaceTemplateRootCode: generateParam.ReplaceTemplateRootCode,
								TemplateId: templateId,
								ControllingUnitParent: selectedItem,
								RootControllingTemplateUnitCode: rootControllingTemplateUnitCode
							};

							return $http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreateonserverfromtemplate', BulkCreateDataOnServer)
								.then(function (response) {
									let data = response && response.data;
									if(!data.generateFailed){
										controllingStructureMainService.load();
									}else {
										let bodyText = '';

										if(data.generateResult){
											let result = data.generateResult;

											function generateBodyText(textKey, codes){
												bodyText += $translate.instant(textKey) + '<br>';
												_.map(codes, (code) => {
													bodyText = bodyText + '[' + code + ']' + '<br>';
												})

												bodyText += '<br>';
											}

											if(result.existedDuplicatedCode && _.isArray(result.duplicatedCodeds) && result.duplicatedCodeds.length > 0){
												generateBodyText('controlling.structure.generateControllingUnitsFromTemplate.duplicatedCodeInfo', result.duplicatedCodeds);
											}

											if(result.existedOverlengthCodes && _.isArray(result.overlengthCodes) && result.overlengthCodes.length > 0){
												generateBodyText('controlling.structure.generateControllingUnitsFromTemplate.overlengthCodeInfo', result.overlengthCodes);
											}
										}

										if(bodyText !== ''){
											let modalOptions = {
												headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
												bodyText: bodyText + $translate.instant('controlling.structure.generateControllingUnitsFromTemplate.continueGenerateCode'),
												showYesButton: true,
												showNoButton: true,
												iconClass: 'ico-info'
											};

											$injector.get('platformModalService').showDialog(modalOptions).then(function (res) {
												if(res.yes){
													controllingStructureMainService.markEntitiesAsModified(data.newControllingUnits);
													projectMainForCOStructureService.update().then(function(){
														controllingStructureMainService.load();
													});
												}else{
													controllingStructureMainService.load();
												}
											});
										}

									}
								});
						});
					}
				}

				function getNewUnit(projectId, templateId, unitTemplates, unitGroups, projectUnitGroups, isKeepTemplateCode, controllingUnits, rootEntity) {
					const currentExistedParentId = rootEntity.Id;
					const selectedEntity = controllingStructureMainService.getSelected() ? controllingStructureMainService.getSelected() : rootEntity;
					rootEntity.ControllingUnitChildren = rootEntity.ControllingUnits ? rootEntity.ControllingUnits : [];
					selectedEntity.ControllingUnitChildren = selectedEntity.ControllingUnits ? selectedEntity.ControllingUnits : [];

					let removedParentId = null;
					let removedList = _.remove(unitTemplates, {ControltemplateUnitFk: null});
					removedParentId = _.get(_.first(removedList), 'Id') || null;

					// remove unit groups which are already available
					unitGroups = _.filter(unitGroups, (unitGroup) => {
						var relatedUnit = _.find(controllingUnits, {ControltemplateUnitFk: unitGroup.ControltemplateUnitFk});
						if (relatedUnit) {
							return !_.some(projectUnitGroups, {
								ControllingunitFk: relatedUnit.Id,
								ControllinggroupFk: unitGroup.ControllingGroupFk,
								ControllinggroupdetailFk: unitGroup.ControllingGrpDetailFk
							});
						} else {
							return true;
						}
					});

					var params = {ProjectId: projectId, number: _.size(unitTemplates), groupNumber: _.size(unitGroups)};
					var parastr = '?projectId=' + params.ProjectId + '&number=' + params.number + '&groupNumber=' + params.groupNumber;
					var canCreate = $injector.get('controllingStructureNumberGenerationServiceProvider').canCreateCode(params.ProjectId).hasToCreate;

					return $http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreate' + parastr, params).then(function (response) {

						// process ids (change mapping template to created ids)
						var Ids = _.get(response, 'data.Ids') || [];

						// use id from ControllingUnit (controlling unit used as template for default values)
						var cloner = _.get(response, 'data.ControllingUnit');
						if (_.has(cloner, 'Id')) {
							Ids.unshift(cloner.Id);
						}
						// create map
						var old2NewIds = createMap(unitTemplates, Ids);

						var newUnits = _.map(unitTemplates, function (u) {
							// update or new?
							// check if current unit template was already used
							var newUnit;

							// is sequence from rubric category is defined than we keep the old logic, it means we can add a item from same template just ONCE
							if (canCreate) {
								var toBeUpdated = _.find(controllingUnits, {ControltemplateFk: u.ControltemplateFk, ControltemplateUnitFk: u.Id});
								if (toBeUpdated) {
									newUnit = _.clone(toBeUpdated);      // TODO: check
									if (newUnit.ControllingUnits) {
										newUnit.ControllingUnits.length = 0;
									}
									newUnit.HasChildren = false;
								} else {
									newUnit = _.cloneDeep(cloner);

									// check if parent already existed
									var parent = _.find(controllingUnits, {ControltemplateUnitFk: u.ControltemplateUnitFk});

									// update ids from unit templates
									newUnit.Id = old2NewIds[u.Id];
									newUnit.ControllingunitFk = parent ? parent.Id : old2NewIds[u.ControltemplateUnitFk];

									if (u.ControltemplateUnitFk === removedParentId && currentExistedParentId > 0) {
										newUnit.ControllingunitFk = controllingStructureMainService.getSelected() ? controllingStructureMainService.getSelected().Id : currentExistedParentId;
									}

									newUnit.ControltemplateFk = templateId;
									newUnit.ControltemplateUnitFk = u.Id;

									newUnit.Code = u.Code;
								}
							}
							// else we can add same item from template under different controlling units
							else {
								newUnit = _.cloneDeep(cloner);

								// check if parent already existed
								var parent = _.find(controllingUnits, { ControltemplateUnitFk: u.ControltemplateUnitFk });

								newUnit.Id = old2NewIds[u.Id];
								newUnit.ControllingunitFk =  old2NewIds[u.ControltemplateUnitFk];

								if (u.ControltemplateUnitFk === removedParentId && currentExistedParentId > 0) {
									newUnit.ControllingunitFk = controllingStructureMainService.getSelected() ? controllingStructureMainService.getSelected().Id : currentExistedParentId;
								}

								newUnit.ControltemplateFk = templateId;
								newUnit.ControltemplateUnitFk = u.Id;

								newUnit.Code = u.Code;
							}
							takeOver(u, newUnit);

							return newUnit;
						});

						var GroupIds = _.get(response, 'data.GroupIds') || [];

						// use id from ControllingUnitGroup
						var clonerGroup = _.get(response, 'data.ControllingUnitGroup');
						if (_.has(clonerGroup, 'Id')) {
							GroupIds.unshift(clonerGroup.Id);
						}
						// create map
						var old2NewGroupIds = createMap(unitGroups, GroupIds);

						var newGroups = _.map(unitGroups, function (g) {
							var newGroup = _.cloneDeep(clonerGroup);

							// check if related already available
							var relatedUnit = _.find(controllingUnits, {ControltemplateUnitFk: g.ControltemplateUnitFk});

							// update group ids from unit groups
							newGroup.Id = old2NewGroupIds[g.Id];
							newGroup.ControllingunitFk = relatedUnit ? relatedUnit.Id : old2NewIds[g.ControltemplateUnitFk];

							// take over
							newGroup.ControllinggroupFk = g.ControllingGroupFk;
							newGroup.ControllinggroupdetailFk = g.ControllingGrpDetailFk;
							return newGroup;
						});

						var BulkCreateDataOnServer = {
							// IsCheckRootLevelRestrictionDisabled is always true, remove the unncessary code;
							// ignore root template unit if root already available
							IsCheckRootLevelRestrictionDisabled: true,
							EntitiesCount: _.size(newUnits) + _.size(newGroups),
							ProjectId: projectId,
							ControllingUnitCompleteList: _.map(newUnits, function (u) {
								return {
									ControllingUnits: u,
									ControllingUnitGroupsToSave: _.filter(newGroups, {ControllingunitFk: u.Id}) || []
								};
							}),
							IsKeepTemplateCode: isKeepTemplateCode,
							TemplateId: templateId,
							ControllingUnitParent: selectedEntity
						};

						return $http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreateonserverfromtemplate', BulkCreateDataOnServer)
							.then(function (/* response */) {
								controllingStructureMainService.load();
							});
					});
				}

				var api = {
					getTemplateUnitsById: function (templateId) {
						return $http.post(globals.webApiBaseUrl + 'controlling/controllingunittemplate/unit/treebyparent', {filter: '', PKey1: templateId}).then(function (response) {
							return response.data;
						}, function onError() {
						});
					}
				};

				var templateUnitItems = []; // binded to select directive
				let templateUnitItemList = []; // binded to select directive

				function getTemplateUnitItems() {
					return templateUnitItems;
				}

				function getTemplateUnitItemList() {
					return templateUnitItemList;
				}

				function areTemplateUnitItemsSelected() {
					// check root node first (without flatten tree)
					if (_.some(templateUnitItems) && (_.isUndefined(templateUnitItems[0].IsMarked) || templateUnitItems[0].IsMarked === false)) {
						return false;
					}
					return true;
				}

				function getTemplateUnitItemsFlattened(items, childProp) {
					var flattened = [];
					cloudCommonGridService.flatten(items, flattened, childProp);
					return flattened;
				}

				function resetTemplateUnitItems() {
					templateUnitItems.length = 0; // reset
					templateUnitItemList.length = 0;
				}

				function onControlTemplateChanged(entity) {
					resetTemplateUnitItems();
					validateMergeTemplateCode(entity);
					if (entity.ControltemplateFk > 0) {
						api.getTemplateUnitsById(entity.ControltemplateFk).then(function (units) {
							_.each(units, function (unit) {
								templateUnitItems.push(unit);
							});
							templateUnitItemList = getTemplateUnitItemsFlattened(units, 'ControltemplateUnitChildren');
							validateMergeTemplateCode(entity);
						});
					}
				}

				function getDefaultControlTemplateFK(){
					let selectedCU = getDefaultSelectedItem();

					let defaultControlTemplateFk = null;
					if(selectedCU && selectedCU.ControltemplateFk){
						defaultControlTemplateFk = selectedCU.ControltemplateFk;
					}else if(selectedCU && _.isArray(selectedCU.ControllingUnits)){
						let childScope = getTemplateUnitItemsFlattened([selectedCU], 'ControllingUnits');
						defaultControlTemplateFk = _.first(_.filter(_.map(childScope,'ControltemplateFk'), function(item){ return _.isNumber(item);}));
					}else{
						const selectedProject = projectMainForCOStructureService.getSelected();
						defaultControlTemplateFk = selectedProject.ControltemplateFk;
					}

					return defaultControlTemplateFk;
				}

				function validateMergeTemplateCode(entity){
					entity.DisableOkButton = false;
					let result = $injector.get('platformDataValidationService').createSuccessObject();

					if(entity.ReplaceTemplateRootCode){
						let templateUnitList = getTemplateUnitItemList();
						let templateRootItem = _.find(templateUnitList, {'ControltemplateUnitFk': null});

						let rootCodeRegex = new RegExp('(^[a-zA-Z0-9]+[a-zA-Z0-9\\s]*[a-zA-Z0-9]+$)|(^[a-zA-Z0-9]+$)', 'g');
						if(templateRootItem && rootCodeRegex.test(templateRootItem.Code)){
							let childTemplateUnits = _.filter(templateUnitList, (item) => {
								return item && item.IsMarked && item.ControltemplateUnitFk > 0;
							})

							if(_.find(childTemplateUnits, (unit) => { return !unit.hasOwnProperty('Code') || !_.startsWith(unit.Code, templateRootItem.Code + '-'); })){
								entity.DisableOkButton = true;
							}
						}else{
							entity.DisableOkButton = true;
						}

						if(entity.DisableOkButton){
							result.valid = false;
							result.error = $translate.instant('controlling.structure.generateControllingUnitsFromTemplate.codeMappingError');
						}
					}

					$injector.get('platformRuntimeDataService').applyValidationResult(result, entity, 'ReplaceTemplateRootCode');
				}

				function generateControllingUnitsFromTemplateWizard() {

					var selectedProject = projectMainForCOStructureService.getSelected(),
						title = 'controlling.structure.generateControllingUnitsFromTemplate.title';
					if (!selectedProject) {
						var msg = $translate.instant('controlling.structure.noCurrentProjectSelection');
						platformSidebarWizardCommonTasksService.showErrorNoSelection(title, msg);
						return;
					}

					// init
					// var templateIdFromRootUnit = _.get(_.first(controllingStructureMainService.getList()), 'ControltemplateFk') || null;
					var dataItem = {
						ControltemplateFk: getDefaultControlTemplateFK(),
						IsKeepTemplateCode: false, // default value is false
						ReplaceTemplateRootCode: false,
						DisableOkButton: false
					};
					onControlTemplateChanged(dataItem);

					var modalDialogConfig = {
						title: $translate.instant(title),
						dataItem: dataItem,
						resizeable: true, // TODO: see also ALM #138642 + missing border
						formConfiguration: {
							fid: 'controlling.structure.generateControllingUnitsFromTemplateWizardDialog',
							version: '0.2.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['controltemplatefk', 'templateUnitsGrid']
							},{
								gid: 'config',
								attributes: ['iskeeptemplatecode', 'replacerootcode']
							}],
							rows: [
								// Controlling Unit Template Lookup
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
									{
										dataServiceName: 'controllingControllingunittemplateLookupService',
										showClearButton: true
									},
									{
										gid: 'baseGroup',
										rid: 'controltemplatefk',
										model: 'ControltemplateFk',
										sortOrder: 1,
										label: 'Control Template',
										label$tr$: 'controlling.structure.generateControllingUnitsFromTemplate.template',
										change: onControlTemplateChanged
									}
								),
								// grid with select column template units
								{
									gid: 'baseGroup',
									rid: 'templateUnitsGrid',
									label: 'Units',
									label$tr$: 'controlling.structure.generateControllingUnitsFromTemplate.templateunits',
									type: 'directive',
									directive: 'controlling-structure-select-template-unit',
									options: {
										serviceName: 'controllingStructureGenerateControllingUnitsFromTemplateWizardService',
										getListName: 'getTemplateUnitItems',
										items: templateUnitItems,
										selectionChanged: function onTemplateUnitSelectionChanged(/* selectedItem TODO */) {

										},
										markerChanged: function onTemplateUnitChanged() {
											validateMergeTemplateCode(dataItem);
										}
									},
									readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1,
									cssClass: 'flex-container overflow-hidden'
								},
								// Generate the number based on defined number sequence
								{
									gid: 'config',
									rid: 'iskeeptemplatecode',
									label: 'Keep Template Code',
									label$tr$: 'controlling.structure.generateControllingUnitsFromTemplate.keepTemplateCode',
									model: 'IsKeepTemplateCode',
									required: false,
									readonly: false,
									type: 'boolean',
									change: function (entity) {
										entity.ReplaceTemplateRootCode = false;
										validateMergeTemplateCode(entity);
									},
									sortOrder: 1
								},
								{
									gid: 'config',
									rid: 'replacerootcode',
									label: 'Merge Root Code',
									label$tr$: 'controlling.structure.generateControllingUnitsFromTemplate.replaceCodeWithPrjCode',
									toolTip: 'Replace Template Root Code with Project Number',
									toolTip$tr$: 'controlling.structure.generateControllingUnitsFromTemplate.toolTip',
									model: 'ReplaceTemplateRootCode',
									required: false,
									readonly: false,
									type: 'boolean',
									change: function (entity) {
										entity.IsKeepTemplateCode = false;
										validateMergeTemplateCode(entity);
									},
									sortOrder: 1
								}
							]
						},
						dialogOptions: {
							disableOkButton: function () {
								return dataItem.ControltemplateFk === null || !areTemplateUnitItemsSelected() || dataItem.DisableOkButton;
							}
						},
						handleOK: function handleOK(result) {
							projectMainForCOStructureService.updateAndExecute(function () {

								// get ids of selected unit templates
								var param = {
									projectId: selectedProject.Id,
									templateId: _.get(result, 'data.ControltemplateFk') || -1,
									templateUnitItemsSelectedIds: _.map(_.filter(getTemplateUnitItemsFlattened(getTemplateUnitItems(), 'ControltemplateUnitChildren'), {IsMarked: true}), 'Id'),
									IsKeepTemplateCode: _.get(result, 'data.IsKeepTemplateCode'),
									ReplaceTemplateRootCode: _.get(result, 'data.ReplaceTemplateRootCode'),
								};

								var optClient = true;
								// we are using client generation method now,
								// because we want to have also preview on the client
								var promise = optClient ? bulkCreateOnServerFromTemplate(param) : $http.post(globals.webApiBaseUrl + 'controlling/structure/generatefromtemplate', param);
								promise.then(function (response) {
									if (_.get(response, 'data.withErrors') === false) {
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
									}
								}, function () {
									// TODO: on error
								});
							});
						},
						handleCancel: function handleCancel() {
						}
					};

					platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
					platformModalFormConfigService.showDialog(modalDialogConfig);
				}

				return {
					getTemplateUnitItems: getTemplateUnitItems,
					resetTemplateUnitItems: resetTemplateUnitItems,
					generateControllingUnitsFromTemplateWizard: generateControllingUnitsFromTemplateWizard
				};
			}
		]);
})();
