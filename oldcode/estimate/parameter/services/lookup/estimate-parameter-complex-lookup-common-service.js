/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals,$q, $ */
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookupCommonService
	 * @function
	 *
	 * @description
	 * estimateParamComplexLookupCommonService provides all lookup common fn. for estimate Parameters complex lookup
	 */
	angular.module(moduleName).factory('estimateParamComplexLookupCommonService', ['_', '$translate', 'PlatformMessenger', 'estimateParameterComplexInputgroupLookupService', '$http', '$injector', '$q','$translate','$timeout','platformGridAPI',
		'estimateParamUpdateService', 'platformCreateUuid', 'estimateParamComplexLookupService', 'estimateParameterFormatterService',
		'basicsLookupdataPopupService', 'basicsLookupdataConfigGenerator', 'estimateParameterComplexLookupValidationService',
		'estimateCommonLookupValidationService', 'platformModalService','estimateMainService', 'estimateRuleParameterConstant','userFormOpenMethod','estMainParamItemNames',
		function (
			_, $tranlate, PlatformMessenger, estParamComplexInputgroupLookupService, $http, $injector, $q, $translate,$timeout, platformGridAPI,
			estimateParamUpdateService, platformCreateUuid, estimateParamComplexLookupService, estimateParameterFormatterService,
			basicsLookupdataPopupService, basicsLookupdataConfigGenerator, paramValidationService,
			estimateCommonLookupValidationService, platformModalService, estimateMainService, estimateRuleParameterConstant,userFormOpenMethod,estMainParamItemNames) {

			// Object presenting the service
			let service = {};

			let currentTabIndexOfUserForm = 0;
			let newFormWindIsOpen = false;
			let currentRuleId = 0;
			let currentParamDataService = null;
			let currentPermissionUuid = '';
			let currentMainDataService = null;
			let isPrjAssemblyCat = false;
			let canEditContainer = [
				'51f9aff42521497898d64673050588f4', // project assembly
				'b0b09a5709be478e9da50d8adbd3aa6d', // project assembly cat
				'234bb8c70fd9411299832dcce38ed118', // master assembly
				'179d44d751834dabb06ef4ba1f425d3c', // master assembly cat
				'342bf3af97964f5ba24d3e3acc2242dd' // boq
			];

			let parameterGrade = {
				projectParam : 3001,
				GlobalParam : 3002,
				RuleParameter : 3003
			};

			service.setCurrentParamService = function(ser){
				currentParamDataService = ser;
			};
			service.getCurrentParamService = function(){
				return currentParamDataService;
			};

			service.setCurrentGridContent = function (permissionUuid, mainDataService) {
				currentPermissionUuid = permissionUuid;
				currentMainDataService = mainDataService;
			};

			let popupToggle = basicsLookupdataPopupService.getToggleHelper();
			service.onCloseOverlayDialog = new PlatformMessenger();
			service.onParameterSaved = new PlatformMessenger();
			service.getOptions = function getOptions(scope){
				let config = scope.$parent.$parent.groups;
				if(!config){return;}
				let group = _.find(scope.$parent.$parent.groups, {gid : 'ruleAndParam'});

				// fix parameter not found error in the Assembly module's assembly detail form
				if(!group){
					group = _.find(scope.$parent.$parent.groups, {gid : 'basicData'});

					if(!group){
						return;
					}
				}

				let ruleConfig = _.find(group.rows, {rid : 'param'});
				return ruleConfig ? ruleConfig.formatterOptions : null;
			};

			service.openPopup = function openPopup(e, scope) {
				let popupOptions = {
					templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
					title: 'estimate.parameter.params',
					showLastSize: true,
					controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 900,
					height: 400,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new(),
					zIndex: 1000,
					showActionButtons: true
				};
				newFormWindIsOpen = false;

				// toggle popup
				let instance = popupToggle.toggle(popupOptions);

				if(instance) {
					instance.okClicked.then(function () {
						let _gridId = estParamComplexInputgroupLookupService.gridGuid();
						let gRows = platformGridAPI.grids.element('id', _gridId).instance.getData().getRows();

						if(_gridId && (gRows.length > 0)) {
							platformGridAPI.grids.commitEdit(_gridId);
							platformGridAPI.grids.cancelEdit(_gridId);

							$timeout(function () {
								let platformNavBarService = $injector.get('platformNavBarService');
								platformNavBarService.getActionByKey('save').fn();
								instance.close();
							}, 300);
						}
					});
				}

				function controller($scope, lookupControllerFactory, $popupInstance) {

					let options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);
					estParamComplexInputgroupLookupService.initController($scope, lookupControllerFactory, options, $popupInstance, getAllColumns());

					service.setCurrentParamService(estParamComplexInputgroupLookupService.dataService);
					let dataService = options.realDataService ? $injector.get(options.realDataService): $injector.get(options.itemServiceName);
					let entity = dataService.getSelected();
					if(!entity && dataService.getServiceName && dataService.getServiceName() === 'estimateMainBoqService'){
						// in Boq Container, the root item Id == -1, So when user to estimate from other module,
						// no selected value even you click on it.
						let entities = dataService.getSelectedEntities();
						entity = entities && entities.length > 0 ? entities[0] : entity;
					}

					let result = service.HandleUserFormTab($scope, entity);
					if(result && result.then){
						result.then(function () {
							let includeUserFormRules = _.find(entity.RuleAssignment, function (item) { return !!item.FormFk;});
							let indexItem = includeUserFormRules ? _.find($scope.tabs, {contextFk:includeUserFormRules.Id}) : null;
							$scope.tabClick(indexItem || $scope.tabs[0], 'user_form_assign_parameter_frame', 3);
						});
					}

					if (!isEditable()) {
						$scope.tools.items = _.filter($scope.tools.items,(e)=> !['t1','t2'].includes(e.id));
						angular.forEach($scope.displayItem, function (item) {
							let fields = service.setReadOnly(item, true);
							$injector.get('platformRuntimeDataService').readonly(item, fields);
						});
					}

					$scope.onContentResized = function () {
						resize();
					};

					function resize() {
						$timeout(function () {
							platformGridAPI.grids.resize($scope.gridId);
						});
					}

					// for close the popup-menu
					$scope.$on('$destroy', function () {
						if ($scope.$close) {
							$scope.$close();
						}
					});
				}
			};

			service.setReadOnly = function (items, isReadOnly) {
				let fields = [];
				// item = _.isArray(items) ? items[0] : null;

				_.forOwn(items, function (value, key) {
					let field = { field: key, readonly: isReadOnly };
					fields.push(field);
				});
				return fields;
			};

			service.HandleUserFormTab = function ($scope, entity) {
				currentTabIndexOfUserForm = 0;
				currentRuleId = 0;
				let userFormCommonService = $injector.get('basicsUserformCommonService');
				userFormCommonService.formDataSaved.register(service.syncUserFromToParameter);
				userFormCommonService.winOnClosed.register(service.userFormWinClose);
				service.onParameterSaved.register(parameterSaveFinish);

				$scope.$on('$destroy', function () {
					userFormCommonService.formDataSaved.unregister(service.syncUserFromToParameter);
					userFormCommonService.winOnClosed.unregister(service.userFormWinClose);
					service.onParameterSaved.unregister(parameterSaveFinish);
				});

				$scope.currentParamDataService = currentParamDataService;

				$scope.tabs = [];
				let openOption = [{name: $translate.instant('basics.userform.newWindow'), method:1}]; // ,{name: $translate.instant('basics.userform.tab'), method:3}];
				let openOptionNews = [{name: $translate.instant('basics.userform.newWindow'), method:1}];

				let i = 1,
					formTab=null;

				if (entity && entity.RuleAssignment) {
					let ids = [],
						rubricFk = 70;

					let ruleAssigns = currentParamDataService && currentParamDataService.isPupopUpParameterWin && currentParamDataService.isPupopUpParameterWin() ? [entity.RuleAssignment[entity.RuleAssignment.length-1]] : entity.RuleAssignment;
					_.forEach(ruleAssigns, function (item) {
						if(item){
							if (item.FormFk && _.filter(ids, {FormId: item.FormFk, ContextId: item.MainId || item.Id}).length <= 0) {
								ids.push({FormId: item.FormFk, ContextId: item.OriginalMainId || item.MainId || item.Id});
							}
							if(item.IsPrjRule || item.PrjEstRuleFk > 0){
								rubricFk = 79;
							}
						}
					});
					if (ids.length > 0) {
						formTab = $http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + rubricFk, ids).then(function (response) {
							if (response && response.data) {
								_.forEach(response.data, function (item) {
									let currentRule = _.find(entity.RuleAssignment, {Id: item.ContextId}) || _.find(entity.RuleAssignment, {MainId: item.ContextId});
									$scope.tabs.push({
										name: currentRule.Code,
										currRule: currentRule,
										index: i + 1,
										className: i === 1 ? 'userFormAssignParamTabBg' :'',
										userFormFk: item.Id,
										contextFk: currentRule.MainId || currentRule.Id,
										formDataId: item.CurrentFormDataId,
										rubricFk: rubricFk,
										display:'none',
										displayNew:'none',
										openOptions:openOption,
										openOptionNews: openOptionNews,
										width: item.FormWidth,
										height: item.FormHeight
									});
									i++;
								});
							}
						});
					}
				}
				if(entity && entity.FormFk && (!currentParamDataService || !currentParamDataService.isPupopUpParameterWin || !currentParamDataService.isPupopUpParameterWin())){
					formTab = $http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 78, [{FormId: entity.FormFk, ContextId: entity.Id, ContextId1: entity.EstHeaderFk}]).then(function (response) {
						if (response && response.data) {
							_.forEach(response.data, function (item) {
								$scope.tabs.push({
									name: item.Description,
									index: i + 1,
									className: i === 1 ? 'userFormAssignParamTabBg' :'',
									userFormFk: item.Id,
									contextFk: entity.Id,
									context1Fk: entity.EstHeaderFk,
									formDataId: item.CurrentFormDataId,
									rubricFk: 78,
									display:'none',
									displayNew:'none',
									openOptions:openOption,
									openOptionNews: openOptionNews,
									width: item.FormWidth,
									height: item.FormHeight
								});
								i++;
							});
						}
					});
				}

				$scope.paramsTab = [];
				let anyUserForm = (entity && entity.RuleAssignment && _.find(entity.RuleAssignment,function(item){return !!item.FormFk;})) || (entity && !!entity.FormFk);
				$scope.paramsTab.push({name: $translate.instant('estimate.main.assigned'), index: 1, className: anyUserForm ? '' : 'userFormAssignParamTabBg'});
				$scope.showParamGrid = !anyUserForm;
				// $scope.showParamGridCover = anyUserForm;
				$scope.SaveResult = false;
				$scope.showIframe = anyUserForm;

				$scope.tabClick = function (item, frameId, openMethod) {
					if(newFormWindIsOpen){
						return;
					}

					$scope.SaveResult = false;
					var userFormEditable = isEditable(),
						jframe = $('#' + frameId)[0],
						win = jframe.contentWindow;
					if ($(jframe).attr('src') !== 'about:blank' && currentTabIndexOfUserForm !== item.index) {
						$(jframe).attr('src', 'about:blank');
					}

					if (item.index === 1) {
						currentTabIndexOfUserForm = item.index;
						goToTab(1);
						return;
					}

					if(currentTabIndexOfUserForm === item.index && openMethod !== 1){
						return;
					}

					_.forEach($scope.tabs,function (tab) {
						tab.display = 'none';
						tab.displayNew = 'none';
					});

					var userFormCommonService = $injector.get('basicsUserformCommonService');
					var userFormOption = {
						formId: item.userFormFk,
						formDataId: item.formDataId,
						contextId: item.contextFk,
						context1Id : item.context1Fk,
						editable: userFormEditable,
						modal: openMethod === 1,
						rubricFk: item.rubricFk,
						openMethod: openMethod - 0,
						iframe: jframe
					};
					if(item.rubricFk === 79){
						currentRuleId = item.contextFk;
					}else {
						currentRuleId = 0;
					}

					var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
					var currentParamDataService = $injector.get('estimateParamComplexLookupCommonService').getCurrentParamService();
					var paramDatas = currentParamDataService.getList();

					// $scope.showParamGridCover = false;

					$timeout(function () {
						basicsUserFormPassthroughDataService.setInitialData({
							params: paramDatas,
							currentRule: item.currRule,
							contextInfo: basicsUserFormPassthroughDataService.getContextInfo()
						});

						if (openMethod !== userFormOpenMethod.NewWindow) {
							userFormCommonService.setOption(userFormOption);

							if (item.index !== 1) {
								goToTab(item.index);
								if (currentTabIndexOfUserForm !== item.index) {
									currentTabIndexOfUserForm = item.index;
									userFormOption.openMethod = 4;
									userFormCommonService.showData(userFormOption);
								} else {
									if (typeof win.initFormData === 'function') {
										win.initFormData();
									}
								}
							}
						} else {
							// goToTab(1);
							// currentTabIndexOfUserForm = 1;
							newFormWindIsOpen = true;
							userFormCommonService.showData(userFormOption);
						}
					}, 200);



					function goToTab(index) {
						// let gridId = currentParamDataService.getGridId();
						_.forEach($scope.tabs, function (tab) {
							tab.className = '';
						});
						_.forEach($scope.paramsTab, function (tab) {
							tab.className = '';
						});

						if (index === 1) {
							$scope.showParamGrid = true;
							// $scope.showParamGridCover = false;
							$scope.showIframe = false;
							$scope.paramsTab[0].className = 'userFormAssignParamTabBg';
							if($scope.onContentResized && _.isFunction($scope.onContentResized)){
								$scope.onContentResized();
							}
						} else {
							item.className = 'userFormAssignParamTabBg';
							$scope.showParamGrid = false;
							$scope.showIframe = true;
						}

						if(!$scope.currentParamDataService || !$scope.currentParamDataService.isPupopUpParameterWin || !$scope.currentParamDataService.isPupopUpParameterWin()){
							$(jframe.parentNode.parentNode.parentNode.parentNode.parentNode).css('width', item.width-0>0 && index !== 1 ? item.width : 900);
							$(jframe.parentNode.parentNode.parentNode.parentNode.parentNode).css('height', item.height-0>0 && index !== 1 ? item.height : 400);
						}
					}
				};

				$scope.openMethodOption = function (item, isOpen) {
					if(currentTabIndexOfUserForm === item.index){
						item.displayNew = isOpen ?  'block' : 'none';
						return;
					}
					item.display = isOpen ?  'block' : 'none';
				};

				return formTab;

				function parameterSaveFinish(){
					$scope.SaveResult = true;
				}
			};

			service.userFormWinClose = function () {
				newFormWindIsOpen = false;
			};

			service.syncUserFromToParameter = function syncUserFromToParameter(formDateId, args) {
				newFormWindIsOpen = false;
				let formData = args.formData;
				if(!formData){
					syncParamFinished();
					return;
				}

				let newParams = [];
				if(!!formData.parameters && formData.parameters.length > 0)
				{
					newParams = formData.parameters;
					_.forEach(newParams, function (item){
						item.Code = item.Code.replace(/-/ig, '_');
					});
				}else{
					if(formData.length === 0){
						syncParamFinished();
						return;
					}
					formData = _.filter(formData, function (item) {
						return item.paramCode && item.columnName;
					});
					if(formData.length === 0){
						syncParamFinished();
						return;
					}

					let pGroup = _.groupBy(formData, 'paramCode');
					pGroup = _.filter(pGroup, function (group) {
						return  !_.find(group, {columnName: 'BeChecked'}) || (_.find(group, {columnName: 'BeChecked'}) ? _.find(group, {columnName: 'BeChecked'}).value :false);
					});
					_.forEach(pGroup, function (group) {
						let paramCode = _.find(group, {columnName: 'Code'}) ? _.find(group, {columnName: 'Code'}).value :'';
						let item ={
							Code : paramCode,
							ParameterValue: _.find(group, {columnName: 'ParameterValue'}) ? _.find(group, {columnName: 'ParameterValue'}).value.toString() :'',
							ValueDetail: _.find(group, {columnName: 'ValueDetail'}) ? _.find(group, {columnName: 'ValueDetail'}).value :'',
							UomFk: _.find(group, {columnName: 'UomFk'}) ? _.find(group, {columnName: 'UomFk'}).value :'',
							ItemValue: _.find(group, {columnName: 'ItemValue'}) ? _.find(group, {columnName: 'ItemValue'}).value :'',
							Desc: _.find(group, {columnName: 'Desc'}) ? _.find(group, {columnName: 'Desc'}).value :''
						};
						item.Code = item.Code || (item.ParameterValue ? _.find(group, {columnName: 'ParameterValue'}).paramCode : '');
						newParams.push(item);
					});
				}


				let allPermisson = [], createNewParams = [], oldParams = currentParamDataService.getList();
				_.forEach(newParams, function (item) {
					if(item.Code){
						item.Code = item.Code.toUpperCase();
						let oldParam = _.find(oldParams, {Code: item.Code});
						if(oldParam){
							mergeNewParamToOld(oldParam, item);
							if(oldParam.ProjectEstRuleFk -0 !== currentRuleId - 0 && currentRuleId - 0 > 0){
								oldParam.ProjectEstRuleFk = currentRuleId;
								currentParamDataService.UpdateParameter(oldParam, 'ProjectEstRuleFk');
							}
						}else{
							if(!!item.ParameterValue || !!item.ValueDetail || (item.UomFk && item.UomFk !== '0')){
								let permission = currentParamDataService.createItem(item.Code, true).then(function (param) {
									param.Code = item.Code;
									param.EstParameterGroupFk = 3;
									param.ValueType = estimateRuleParameterConstant.Decimal2;
									if(item.ParameterValue){
										if(item.ParameterValue.toLowerCase() === 'false' || item.ParameterValue.toLowerCase() === 'true'){
											param.ValueType = estimateRuleParameterConstant.Boolean;
										}else if(!item.ParameterValue.match(new RegExp('^[-]?\\d+(\\.\\d+)?$', 'g'))){
											param.ValueType = estimateRuleParameterConstant.Text;
										}
									}
									param.ProjectEstRuleFk = currentRuleId - 0 > 0 ? currentRuleId : null;
									param.DescriptionInfo.OtherLanguages = item.DescriptionInfo ? item.DescriptionInfo.OtherLanguages : null;
									mergeNewParamToOld(param, item);
									createNewParams.push(param);
								});
								allPermisson.push(permission);
							}
						}
					}
				});
				if(allPermisson.length > 0){
					$q.all(allPermisson).then(function () {

						if(currentParamDataService.asyncValidateCode) {
							let codeValidationPermissons = [];
							_.forEach(createNewParams, function (item) {
								item.OldParameterValue = item.ParameterValue;
								item.OldValueDetail = item.ValueDetail;
								item.IsCreateFromUserForm = true;
								codeValidationPermissons.push(currentParamDataService.asyncValidateCode(item, item.Code, 'Code'));
							});

							$q.all(codeValidationPermissons).then(function (){
								_.forEach(createNewParams, function (item){
									item.ParameterValue = item.Version === -1 ? item.OldParameterValue : item.ParameterValue;
									item.ValueDetail = item.Version === -1 ? item.OldValueDetail : item.ValueDetail;
								});

								validataValueDetail(currentParamDataService);
								syncParamFinished();
							});
						}else{
							validataValueDetail(currentParamDataService);
							syncParamFinished();
						}
					});
				}else{
					validataValueDetail(currentParamDataService);
					syncParamFinished();
				}

			};

			function syncParamFinished(){
				if(currentParamDataService.syncParametersFinished){
					currentParamDataService.syncParametersFinished();
				}

				service.onParameterSaved.fire();
			}

			function validataValueDetail(dataService) {
				let list = _.filter(dataService.getList(), function (item) {
					return item.needValidation;
				});
				if(!list || list.length === 0){
					dataService.gridRefresh();
					return;
				}

				let estimateRuleCommonService = $injector.get('estimateRuleCommonService');
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let permissions = [];
				_.forEach(list, function (item) {
					let dataService = $injector.get('estimateParamDataService');
					if(!dataService.getModule || !dataService.getModule()){
						dataService.getModule = function () {
							return 'RuleParameter';
						};
					}
					let result = estimateRuleCommonService.getAsyncParameterDetailValidationResult(item, item.ValueDetail, 'ValueDetail', dataService);
					permissions.push(result);
					result.then(function (data) {
						platformRuntimeDataService.applyValidationResult(data, item, 'ValueDetail');
					});
				});

				if(permissions.length === 0){
					dataService.gridRefresh();
					return;
				}

				$q.all(permissions).then(function () {
					dataService.gridRefresh();
				});
			}

			function mergeNewParamToOld(oldParam, newParam){
				let oldParamValue = oldParam.ParameterValue;
				let oldParamValueDetail = oldParam.ValueDetail;
				if(oldParam.ValueType === estimateRuleParameterConstant.Boolean) {
					oldParam.ParameterValue = !newParam.ParameterValue || newParam.ParameterValue === '0' || newParam.ParameterValue.toLowerCase() === 'false' ? 0 : 1;
					oldParam.ValueDetail = '';
					if(oldParamValue !== oldParam.ParameterValue){
						currentParamDataService.UpdateParameter(oldParam, 'ParameterValue');
					}

				}else if(oldParam.ValueType === estimateRuleParameterConstant.Text || oldParam.ValueType === estimateRuleParameterConstant.TextFormula) {
					let oldParamText = oldParam.ParameterText;
					oldParam.ParameterValue = 0;
					oldParam.ValueDetail = newParam.ValueDetail || oldParam.ValueDetail;
					oldParam.ValueText = newParam.ParameterValue || oldParam.ValueText;
					oldParam.ParameterText = newParam.ParameterValue || oldParam.ParameterText;
					if(oldParamValueDetail !== oldParam.ValueDetail || oldParamText !== oldParam.ParameterText){
						currentParamDataService.UpdateParameter(oldParam, 'ParameterText');
					}
				}else{
					if(newParam.ParameterValue){
						newParam.ParameterValue = (newParam.ParameterValue + '').match(new RegExp('^[-]?\\d+(\\.\\d+)?$', 'g')) ? parseFloat(newParam.ParameterValue) : 0;
					}
					oldParam.ParameterValue = newParam.ParameterValue === 0 ? 0 : (newParam.ParameterValue || oldParam.ParameterValue);
					oldParam.ValueDetail = newParam.ParameterValue === 0 ? '0' : (newParam.ValueDetail || oldParam.ValueDetail);
					if(oldParamValueDetail !== oldParam.ValueDetail){
						currentParamDataService.UpdateParameter(oldParam, 'ValueDetail');
						oldParam.needValidation = !!oldParam.ValueDetail && true;
					}else if(oldParamValue !== oldParam.ParameterValue){
						currentParamDataService.UpdateParameter(oldParam, 'ParameterValue');
					}
				}
				newParam.UomFk = newParam.UomFk || '';
				newParam.UomFk = newParam.UomFk.match(new RegExp('\\d+','g')) ? parseInt(newParam.UomFk) : 0;
				let oldUomFk = oldParam.UomFk;
				oldParam.UomFk = newParam.UomFk || oldParam.UomFk;
				if(oldUomFk !== oldParam.UomFk){
					currentParamDataService.UpdateParameter(oldParam, 'UomFk');
				}

				if(newParam.Desc){
					oldParam.DescriptionInfo = oldParam.DescriptionInfo || {};
					let oldDesc = oldParam.DescriptionInfo.Description;
					oldParam.DescriptionInfo.Description = newParam.Desc;
					oldParam.DescriptionInfo.Translated = newParam.DescriptionInfo ? newParam.DescriptionInfo.Translated :  newParam.Desc;
					if(oldDesc !== newParam.Desc){
						oldParam.DescriptionInfo.Modified = true;
						currentParamDataService.UpdateParameter(oldParam, 'DescriptionInfo');
					}
				}
			}



			service.onSelectionChange = function onSelectionChange(args, scope){
				let  entity = args.entity,
					lookupItems = _.isArray(args.previousItem) ? args.previousItem : [args.previousItem];
				let opt = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);
				service.cusParameterValueAssignments(args.selectedItem).then(function () {
					if(args.selectedItem && args.selectedItem.Id){
						if(args.selectedItem.ValueType ===1 ){
							if(args.selectedItem.ValueDetail && (args.selectedItem.ValueDetail+'').indexOf('.') < 0) {
								args.selectedItem.ValueDetail += '.000';
							}else {
								args.selectedItem.ValueDetail = args.selectedItem.DefaultValue;
							}
						}else if(args.selectedItem.ValueType ===2) {
							args.selectedItem.ValueDetail = null;
						}
						let selectedItem = angular.copy(args.selectedItem);
						selectedItem.MainId = 0;
						lookupItems.push(args.selectedItem);
						estimateParamUpdateService.setParamToSave([selectedItem], entity, opt.itemServiceName, opt.itemName);
						entity.Param = entity.Param.concat(_.map(_.uniq(lookupItems,'Id'), 'Code'));
					}else{
						estimateParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null , entity, opt.itemServiceName, opt.itemName);
					}
					scope.ngModel = entity.Param;
					estParamComplexInputgroupLookupService.refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
				});
			};

			service.clearAllItems = function clearAllItems(args, scope, canDelete) {
				let opt = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope),
					lookupItems = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

				if (lookupItems && lookupItems.length > 0) {
					let entity = args.entity;

					estimateParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);

					// if the user not initialize the parameter controller, the complexLookupService.dataService will have no function,
					// so here make the function not undefined
					let complexLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');
					if (!complexLookupService.dataService.getEstLeadingStructureContext) {
						complexLookupService.dataService.getEstLeadingStructureContext = function getEstLeadingStructureContext() {
							// let item = angular.copy(scope.entity);
							let item = {};
							let selectItem = $injector.get(opt.itemServiceName).getSelected();
							if (selectItem) {
								item = estimateParamUpdateService.getLeadingStructureContext(item, selectItem, opt.itemServiceName, opt.itemName);
							}
							return {item: item, itemName: opt.itemName};
						};
					}

					if (!complexLookupService.dataService.getEstLeadingStructContext) {
						complexLookupService.dataService.getEstLeadingStructContext = function getEstLeadingStructContext() {
							let item = {};
							item = estimateParamUpdateService.getLeadingStructureContext(item, entity, opt.itemServiceName, opt.itemName);
							return {item: item, itemName: opt.itemName};
						};
					}
					if (canDelete) {
						// service.onCloseOverlayDialog.fire();
						entity.Param = estimateParameterFormatterService.getParamNotDeleted(opt.itemName);
						scope.ngModel = entity.Param;
						estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
						estParamComplexInputgroupLookupService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
					} else {
						let mainService = opt.realDataService === 'estimateAssembliesService' ? $injector.get(opt.realDataService) : $injector.get(opt.itemServiceName);
						mainService = !mainService ? estimateMainService : mainService;
						let updateService = estMainParamItemNames.includes(opt.itemName)? estimateMainService : mainService;

						if ((opt.itemServiceName === 'estimateMainService' || opt.itemServiceName === 'estimateMainAssembliesCategoryService') && entity.EstHeaderFk) {
							$injector.get('estimateMainService').setSelectedEstHeaderId(entity.EstHeaderFk);
						}

						if (opt.itemServiceName === 'projectAssemblyStructureService' || opt.itemServiceName === 'projectAssemblyMainService') {
							mainService = $injector.get('projectMainService');
						}

						if (_.isFunction(mainService.update)) {
							return updateService.update().then(function () {
								entity.Param = estimateParameterFormatterService.getParamNotDeleted(opt.itemName);
								scope.ngModel = entity.Param;
								estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
								estParamComplexInputgroupLookupService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
								mainService.fireItemModified(entity);
								if (opt.realDataService || opt.itemServiceName) {
									let realDataService = $injector.get(opt.realDataService || opt.itemServiceName);
									if(Object.prototype.hasOwnProperty.call(realDataService, 'getGridId')){
										$injector.get('platformGridAPI').rows.refreshRow({
											gridId: realDataService.getGridId(),
											item: entity
										});
									}
								}
							});
						}
					}
				}
				return $q.when();
			};

			// if the parameter has same code,same datatype,keep assembly parameter
			service.clearSameParameter = function clearSameParameter(lineItem,assemblyParameter) {
				let scope = {
					entity: lineItem,
					$parent: {
						$parent: {
							config: {
								formatterOptions: {
									dataServiceMethod: 'getItemByRuleAsync',
									dataServiceName: 'estimateRuleFormatterService',
									itemName: 'EstLineItems',
									itemServiceName: 'estimateMainService',
									serviceName: 'basicsCustomizeRuleIconService',
									validItemName: 'EstLineItems'
								}
							}
						}
					}
				};
				scope.$parent.$parent.config.formatterOptions = {
					dataServiceMethod: 'getItemByParamAsync',
					dataServiceName: 'estimateParameterFormatterService',
					itemName: 'EstLineItems',
					itemServiceName: 'estimateMainService',
					serviceName: 'estimateParameterFormatterService',
					validItemName: 'EstLineItems'
				};

				let opt = scope.$parent.$parent.config.formatterOptions;

				let existsParam = estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
				if(existsParam && existsParam.length > 0) {

					let toDeleteParamter = [];

					angular.forEach(existsParam, function (lineItemParam) {
						_.filter(assemblyParameter, function (assParam) {
							if (assParam.Code === lineItemParam.Code && assParam.ValueType === lineItemParam.ValueType) {
								toDeleteParamter.push(lineItemParam);
							}
						});
					});

					if (toDeleteParamter.length > 0) {
						estimateParamUpdateService.setParamToDelete(toDeleteParamter && toDeleteParamter.length ? toDeleteParamter : null, lineItem, opt.itemServiceName, opt.itemName);

						lineItem.Param = estimateParameterFormatterService.getParamNotDeleted(opt.itemName) ? estimateParameterFormatterService.getParamNotDeleted(opt.itemName) : lineItem.Param;
						scope.ngModel = lineItem.Param;
						estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
						estParamComplexInputgroupLookupService.refreshRootParam(lineItem, scope.ngModel, opt.RootServices);
					}
				}

			};

			service.getColumns = function getColumns(){
				return [
					{
						id: 'code',
						formatter: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						editor: 'directive',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						},
						editorOptions: {
							directive: 'basics-common-limit-input',
							validKeys: {
								regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
							}
						},
						width: 70
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						editor : 'translation',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						maxLength: 255,
						grouping: {
							title: 'cloud.common.entityDescription',
							getter: 'Description',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				];
			};

			function getAllColumns(){
				let addCols = [
					{
						id: 'estparamgrpfk',
						field: 'EstParameterGroupFk',
						name: 'EstParameterGroupFk',
						width: 120,
						toolTip: 'Est Parameter Group Fk',
						editor : 'lookup',
						formatter: 'lookup',
						name$tr$: 'basics.customize.estparametergroup',
						grouping: {
							title: 'basics.customize.estparametergroup',
							getter: 'EstParameterGroupFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'valuedetail',
						field: 'ValueDetail',
						name: 'ValueDetail',
						width: 120,
						toolTip: 'ValueDetail',
						editor : 'comment',
						formatter: 'comment',
						name$tr$: 'basics.customize.valuedetail',
						grouping: {
							title: 'basics.customize.valuedetail',
							getter: 'ValueDetail',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'uomfk',
						field: 'UomFk',
						name: 'UomFk',
						width: 120,
						toolTip: 'UomFk',
						editor : 'integer',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityUoM',
						grouping: {
							title: 'cloud.common.entityUoM',
							getter: 'UomFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'parametervalue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 120,
						toolTip: 'ParameterValue',
						editor : 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'basics.customize.parametervalue',
						/* grouping: {
							title: 'basics.customize.parametervalue',
							getter: 'ParameterValue',
							aggregators: [],
							aggregateCollapsed: true
						}, */
						domain: function (item, column) {
							let domain;
							if (item.ValueType === estimateRuleParameterConstant.TextFormula) {

								domain = 'directive';
								column.field = 'ParameterText';
								column.ValueText = null;
								column.editorOptions = {
									lookupDirective: 'parameter-value-type-text-formula-lookup',
									lookupType: 'ParamValueTypeTextFormulaLookup',
									dataServiceName: 'estimateMainParameterValueLookupService',
									valueMember: 'Id',
									displayMember: 'Value',
									isTextEditable: true,
									showClearButton: true
								};

								column.formatterOptions = {
									lookupType: 'ParamValueTypeTextFormulaLookup',
									dataServiceName: 'estimateMainParameterValueLookupService',
									displayMember: 'Value',
									field: 'ParameterText',
									isTextEditable: true,
									multiSelect: true
								};
							}else if(item.ValueType === estimateRuleParameterConstant.Boolean ){

								domain = 'boolean';
								column.DefaultValue = false;
								column.field = 'ParameterValue';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.regex = null;

							}else if(item.ValueType === estimateRuleParameterConstant.Text){

								domain = 'description';
								column.DefaultValue = 0;
								column.field = 'ParameterText';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.maxLength= 255;
								column.regex = null;
							}else{   // means the valueType is Decimal2 or the valueType is Undefined

								domain = 'quantity';
								column.DefaultValue = null;
								column.field = 'ParameterValue';
								column.editorOptions = { decimalPlaces: 3 };
								column.formatterOptions = { decimalPlaces: 3 };
							}

							return domain;
						}
					},
					{
						id: 'defaultvalue',
						field: 'DefaultValue',
						name: 'DefaultValue',
						width: 120,
						toolTip: 'DefaultValue',
						editor : 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'estimate.parameter.defaultValue',
						/* grouping: {
							title: 'basics.customize.defaultValue',
							getter: 'DefaultValue',
							aggregators: [],
							aggregateCollapsed: true
						}, */
						domain: function (item, column) {
							let domain;
							if(item.ValueType === estimateRuleParameterConstant.Boolean ){

								domain = 'boolean';
								column.DefaultValue = false;
								column.field = 'DefaultValue';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.regex = null;
								column.readonly = true;

							}else if(item.ValueType === estimateRuleParameterConstant.Text  || item.ValueType === estimateRuleParameterConstant.TextFormula ){

								domain = 'description';
								column.DefaultValue = null;
								column.field = 'ValueText';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.maxLength= 255;
								column.regex = null;
								column.readonly = true;

							}else{   // means the valueType is Decimal2 or the valueType is Undefined

								domain = 'quantity';
								column.DefaultValue = null;
								column.field = 'DefaultValue';
								column.editorOptions = { decimalPlaces: 3 };
								column.formatterOptions = { decimalPlaces: 3 };
								column.readonly = true;
							}
							return domain;
						}
					},
					{
						id: 'valuetype',
						field: 'ValueType',
						name: 'Value Type',
						width: 120,
						toolTip: 'Value Type',
						name$tr$: 'estimate.parameter.valueType',
						grouping: {
							title: 'basics.customize.valueType',
							getter: 'ValueType',
							aggregators: [],
							aggregateCollapsed: true
						},
						required: false,
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'estimate-rule-parameter-type-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ParameterValueType',
							dataServiceName: 'estimateRuleParameterTypeDataService',
							displayMember: 'Description'
						}
					},

					{
						id: 'islookup',
						field: 'IsLookup',
						name: 'IsLookup',
						width: 120,
						toolTip: 'IsLookup',
						editor : 'boolean',
						formatter: 'boolean',
						name$tr$: 'estimate.parameter.isLookup',
						grouping: {
							title: 'basics.customize.isLookup',
							getter: 'IsLookup',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'estruleparamvaluefk',
						field: 'EstRuleParamValueFk',
						name: 'Item Value',
						width: 100,
						toolTip: 'Item Value',
						name$tr$: 'estimate.parameter.estRuleParamValueFk',
						required: false,
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'estimate-main-parameter-value-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EstMainParameterValues',
							dataServiceName: 'estimateMainParameterValueLookupService',
							displayMember: 'DescriptionInfo.Translated'
						},
						grouping: {
							title: 'estimate.parameter.estRuleParamValueFk',
							getter: 'EstRuleParamValueFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'prjEstRuleFk',
						field: 'ProjectEstRuleFk',
						name: 'Project Rule',
						width: 120,
						toolTip: 'Project Rule',
						name$tr$: 'estimate.parameter.prjEstRule',
						readonly : true,
						grouping: {
							title: 'estimate.parameter.prjEstRule',
							getter: 'ProjectEstRuleFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				];
				let columns = service.getColumns().concat(addCols);
				let uomConfig = _.find(columns, function (item) {
					return item.id === 'uomfk';
				});

				let paramgrpConfig = _.find(columns, function (item) {
					return item.id === 'estparamgrpfk';
				});

				let prjEstRuleConfig = _.find(columns, function (item) {
					return item.id === 'prjEstRuleFk';
				});

				angular.extend(uomConfig,basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true }).grid);

				angular.extend(paramgrpConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup').grid);

				let prjEstRuleLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfig({
					dataServiceName: 'projectEstimateRuleLookupDataService',
					enableCache: true,
					readonly : true,
					filter: function () {
						let prjId = estimateMainService.getSelectedProjectId();
						return prjId ? prjId : -1;
					}});

				angular.extend(prjEstRuleConfig,prjEstRuleLookupConfig.grid);

				estimateCommonLookupValidationService.addValidationAutomatically(columns, paramValidationService);

				return columns;
			}

			service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				if (!entity) {
					return;
				}
				let column = {formatterOptions: {serviceName: 'estimateParameterFormatterService', acceptFalsyValues: true, showOverlayTemplate: true}},
					service = $injector.get('platformGridDomainService');

				let param = [];
				if(_.isArray(entity.Param)){
					param = entity.Param && entity.Param.length ? { params:entity.Param } : 'default';
				}
				return service.formatter('imageselect')(null, null, param, column, entity, null, null);
			};

			function isEditable() {

				if(currentPermissionUuid) {
					let permissionService = $injector.get('platformPermissionService');
					if (!permissionService.hasWrite(currentPermissionUuid)) {
						return false;
					}
					if (canEditContainer.includes(currentPermissionUuid)) {
						return true;
					}
				}

				if(currentMainDataService && _.isFunction(currentMainDataService.isReadonly)){
					if(currentMainDataService.isReadonly()){
						return false;
					}
				}

				if ($injector.get('estimateMainService').getHeaderStatus() || !$injector.get('estimateMainService').hasCreateUpdatePermission()) {
					return false;
				}

				if(currentMainDataService && currentMainDataService.getServiceName() === 'estimateMainRootService')
				{
					return true;
				}

				return true;
			}

			service.getProjectId = function getProjectId() {
				let projectId = null;// the wic boq ,assembly module no need get the projectId

				let estimateParamDataService = $injector.get('estimateParamDataService');

				// assembly module get the parameters from the  estimateAssembliesService
				let isAssembly = $injector.get('estimateAssembliesService').getIsAssembly();

				// estimate module get the paramters from the estimateParamDataService
				let isEstimate = estimateMainService.getIsEstimate();

				let isFromWicBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();

				let isFromProjectBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqProject();

				let fromModule = estimateParamDataService.getModule();
				if(fromModule && fromModule.toLowerCase()==='project')
				{
					projectId = estimateParamDataService.getProjectId();

				}else if(fromModule && fromModule.toLowerCase()==='estlineitems'){
					projectId = isEstimate ? estimateMainService.getSelectedProjectId() : null;
				}


				if(isFromProjectBoq)
				{
					projectId = $injector.get('boqMainService').getSelectedProjectId();

				}
				if(isFromWicBoq)
				{
					projectId = null;

				}

				if(service.getIsPrjAssemblyCat() || service.checkIsPrjAssembly()){
					let projectMainSelected = $injector.get('projectMainService').getSelected();
					projectId = projectMainSelected ? projectMainSelected.Id : null;
				}

				if (isAssembly)
				{
					// after assign rule show parameter dailog window
					projectId = null;  // no need search the parameter by projectId in assembly module

				}
				if (isEstimate && !(fromModule && fromModule.toLowerCase()==='project'))
				{
					projectId = estimateMainService.getSelectedProjectId();
				}

				return projectId;
			}

			service.setIsPrjAssemblyCat = function setIsPrjAssemblyCat(opt) {
				isPrjAssemblyCat = opt.itemName === 'EstAssemblyCat' && opt.itemServiceName === 'projectAssemblyStructureService';
			}

			service.getIsPrjAssemblyCat = function getIsPrjAssemblyCat(){
				return isPrjAssemblyCat;
			}

			service.checkIsPrjAssembly = function checkIsPrjAssembly() {
				return $injector.get('projectAssemblyMainService').getIsPrjAssembly();
			}

			service.getCurrentOption = function setCurrentOption(scope) {
				return scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);
			}

			service.cusParameterValueAssignments = function cusParameterValueAssignments(cusLookupParameterToSave, isForceReload) {
				let deferred = $q.defer();
				if((cusLookupParameterToSave.SourceId === parameterGrade.GlobalParam && cusLookupParameterToSave.Islookup) || isForceReload){
					let estParamValueToSave = estimateParamUpdateService.getParamValueToSave();
					let ignoreCreationParamValueDesc = [];
					_.forEach(estParamValueToSave, function (item) {
						if(item.CusParamId === cusLookupParameterToSave.Id){
							ignoreCreationParamValueDesc.push(item.DescriptionInfo.Description)
						}
					});
					let requestData = {
						code: cusLookupParameterToSave.Code,
						ValueTypes : [],
						PrjProjectFk: service.getProjectId(),
						IgnoreCreationParamValueDesc: ignoreCreationParamValueDesc.length ? ignoreCreationParamValueDesc : null
					};

					$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/cusparametervalueassignments', requestData).then(function (response) {
						if(response && response.data){
							_.forEach(response.data, function (item) {
								item.CusParamId = cusLookupParameterToSave.Id;
								item.CusParamCode = cusLookupParameterToSave.Code;
								estimateParamUpdateService.AddParamValueToSave(item);
							});
						}
						deferred.resolve();
					});
				}else {
					deferred.resolve();
				}

				return deferred.promise;
			}

			service.mergeCusParamValue = function mergeCusParamValue(selectedParam , estParamValues) {
				let estParamValueToSave = estimateParamUpdateService.getParamValueToSave();
				_.forEach(estParamValueToSave, function (item) {
					if(item.CusParamCode === selectedParam.Code){
						estParamValues.push(item);
					}
				});
			}

			return service;
		}]);
})(angular);
