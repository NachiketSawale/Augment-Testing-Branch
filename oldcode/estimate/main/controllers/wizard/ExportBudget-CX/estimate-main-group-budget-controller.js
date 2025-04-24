/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	angular.module('estimate.main').controller('estimateMainGroupBudgetController', ['_','$scope', '$injector','$http', 'platformModalService', '$translate',
		function (_, $scope, $injector, $http, platformModalService, $translate) {


			$scope.Entity = {
				GroupType: $scope.Context.InitialValues.GroupType || 4
			};

			$scope.Context.InitialValues.GroupType = $scope.Entity.GroupType;

			$scope.selections = {valueMember:'Id', displayMember:'Description',serviceName: 'estimateWizardStructureTypeSimpleLookupService' };

			$scope.onSelectedChanged = function(/* item */) {
				$scope.Context.InitialValues.GroupType = $scope.Entity.GroupType;
				generateDocDocum(selectedLineItems);
			};

			let selectedLineItems = [];

			function loadBudgetList(){
				$scope.Context.iTWOcxDocument = {
					DocCode: $scope.Context.InitialValues.iTWOcx_Document_DocCode ||'BGT',
					StatusName: $scope.Context.InitialValues.iTWOcx_Document_StatusName || 'OPEN',
					Title: $scope.Context.InitialValues.iTWOcx_Document_Title,
					ActionCodes: $scope.Context.InitialValues.iTWOcx_Document_ActionCodes || ['RIB-AM']
				};

				let estimateMainService = $injector.get('estimateMainService');
				let list = estimateMainService.getList();
				if((!list || list.length <= 0) && (!$scope.Context.Entity || !$scope.Context.Entity.Id)){
					// platformModalService.showMsgBox($translate.instant('estimate.main.exportBudget2CxWizard.noLineItem'), 'Info', 'ico-info');
					HandlePostResout(false,$translate.instant('estimate.main.exportBudget2CxWizard.noLineItem'));
					return;
				}

				selectedLineItems = estimateMainService.getSelectedEntities();
				selectedLineItems = !!selectedLineItems && selectedLineItems.length > 0 ? selectedLineItems : list;
				// if((!selectedLineItems || selectedLineItems.length <= 0) && (!$scope.Context.Entity || !$scope.Context.Entity.Id)){
				//     platformModalService.showMsgBox($translate.instant('estimate.main.exportBudget2CxWizard.noSelectedLineItem'), 'Info', 'ico-info');
				//     return;
				// }

				let estHeaderFk = 0;
				if(!!$scope.Context.Entity && !!$scope.Context.Entity.Id){
					estHeaderFk= $scope.Context.Entity.Id;
				}else{
					estHeaderFk = selectedLineItems[0].EstHeaderFk;
				}

				let postData = {EstHeaderFk: estHeaderFk, ReturnLineItemList: (!!$scope.Context.Entity && !!$scope.Context.Entity.Id), ProjectId: $injector.get('estimateMainService').getProjectId()};

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getestimateinfoforpublishbudgettocx', postData).then(function(response){
					if(response && response.data){
						selectedLineItems = response.data.LineItems && response.data.LineItems.length > 0 ? response.data.LineItems : selectedLineItems;
						_.forEach(selectedLineItems, function (item) {
							item.EstHeaderCode = response.data.EstHeaderCode;
						});
						generateDocDocum(selectedLineItems, response.data.ControllingUnits);
					}
				});
			}

			function generateDocDocum(lineItems, controllingUnits) {
				let groupkey = '';
				controllingUnits = controllingUnits || [];
				switch ($scope.Entity.GroupType) {
					case '1':
						groupkey = 'BoqItemFk';
						break;
					case '4':
						groupkey = 'MdcControllingUnitFk';
						break;
					case '3':
						groupkey = 'PrjLocationFk';
						break;
					case '2':
						groupkey = 'PsdActivityFk';
						break;
					default:
						groupkey = 'MdcControllingUnitFk';
						break;
				}

				let projectInfo = $injector.get('estimateMainService').getSelectedProjectInfo();
				if(!projectInfo && (!$scope.Context.Entity || !$scope.Context.Entity.Id)){
					// platformModalService.showMsgBox($translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'), 'Info', 'ico-info');
					HandlePostResout(false,$translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'));
					return;
				}

				// $scope.Context.iTWOcxDocument.Title = $scope.Context.iTWOcxDocument.Title || 'Publish Budget from Project '+projectInfo.ProjectNo+' / Estimate ' + lineItems[0].EstHeaderCode;
				$scope.Context.iTWOcxDocument.Title = $scope.Context.iTWOcxDocument.Title || 'Publish Budget from Estimate ' + lineItems[0].EstHeaderCode;

				let groups = _.groupBy(lineItems, groupkey),
					i = 0,
					// code = '0000',
					costList = [];
				$scope.Context.iTWOcxDocument.LineItems = [];
				_.forEach(groups, function (group) {
					let budgetValue = _.sumBy(group, 'Budget');
					let first = group[0];
					let controlingUnit = _.find(controllingUnits, {Id: first.MdcControllingUnitFk});
					// let budgetCode = code.substring(0, 4-(i+'').length) + i;
					let budgetCode = i;
					let item = {
						ItemNumber: controlingUnit ? controlingUnit.Code.replace(/\./g, ''): budgetCode,
						Code: controlingUnit ? controlingUnit.Code: budgetCode,
						Description: !!controlingUnit && !!controlingUnit.DescriptionInfo ? controlingUnit.DescriptionInfo.Translated : budgetCode,
						Value: budgetValue
					};
					let parent = controlingUnit ?  _.find(controllingUnits, {Id: controlingUnit.ControllingUnitFk}) : null;
					if(!parent){
						$scope.Context.iTWOcxDocument.LineItems.push(item);
						if(controlingUnit){
							if(_.find(costList, {code:item.ItemNumber})){ item.ItemNumber = _.find(costList, {code:item.ItemNumber}).index;}
							else{costList.push({code:item.ItemNumber, index: ++i});}
							item.ItemNumber = _.find(costList, {code:item.ItemNumber}).index;
						}
					}else{
						let child = item;
						while (parent){
							let parentItem = {
								ItemNumber: parent.Code,
								Code: parent.Code,
								Description: !!parent && !!parent.DescriptionInfo ? parent.DescriptionInfo.Translated : budgetCode,
								Value: 0,
								Child: child,
							};
							child = parentItem;
							parent = _.find(controllingUnits, {Id: parent.ControllingUnitFk});
						}

						let currentParent = null;
						while (child !== null){
							if(_.find(costList, {code:child.Code})){ child.ItemNumber = _.find(costList, {code:child.Code}).index;}
							else{costList.push({code:child.Code, index: ++i});}
							child.ItemNumber = (!!currentParent && !!currentParent.ItemNumber ? currentParent.ItemNumber + '.' : '') + _.find(costList, {code:child.Code}).index;

							if(!_.find($scope.Context.iTWOcxDocument.LineItems, {ItemNumber: child.ItemNumber})){
								$scope.Context.iTWOcxDocument.LineItems.push({
									ItemNumber: child.ItemNumber,
									Code: child.Code,
									Description: child.Description,
									Value: child.Value,

								});
							}
							currentParent = child;
							child = child.Child;
						}
					}
				});


				if($scope.Context.iTWOcxDocument.LineItems.length <= 0){
					HandlePostResout(false,$translate.instant('estimate.main.exportBudget2CxWizard.noSelectedLineItem'));
					// platformModalService.showMsgBox($translate.instant('estimate.main.exportBudget2CxWizard.noSelectedLineItem'), 'Info', 'ico-info');
				}else{
					if($scope.Context.InitialValues.AutoTransferIfConditionValid){
						$injector.get('estimateMainExternalUserService').loadExternalUserData();
					}
				}
			}

			function HandlePostResout(isSuccess, ErrorMessages) {
				$scope.Context.CxApiResult = $scope.Context.CxApiResult || {};
				$scope.Context.CxApiResult.HasPostDoc = true;
				$scope.Context.CxApiResult.DocIsPosting = false;
				$scope.Context.CxApiResult.IsSuccess = isSuccess;
				$scope.Context.CxApiResult.ErrorMessages = ErrorMessages;
			}

			loadBudgetList();
		}]);

	angular.module('estimate.main').controller('estimateMainGroupBudgetControllerV1', ['_','$scope', '$injector','$http', 'platformModalService', '$translate', 'cloudDesktopSidebarService',
		function (_, $scope, $injector, $http, platformModalService, $translate, cloudDesktopSidebarService) {


			$scope.Entity = {
				GroupType: $scope.Context.InitialValues.GroupType || 4
			};

			$scope.Context.InitialValues.GroupType = $scope.Entity.GroupType;


			let selectedLineItems = [];

			function loadBudgetList(){

				let estimateMainService = $injector.get('estimateMainService');
				let projectInfo = estimateMainService.getSelectedProjectInfo();
				if(!projectInfo && (!$scope.Context.Entity || !$scope.Context.Entity.Id)){
					// platformModalService.showMsgBox($translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'), 'Info', 'ico-info');
					HandlePostResout(false,$translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'));
					return;
				}

				let matchProjectNo = '';
				_.forEach($scope.Context.CxProject.Items, function (item) {
					if(item.Name.toUpperCase() === projectInfo.ProjectNo.toUpperCase()){
						matchProjectNo = item.Name;
					}
				});

				if(!matchProjectNo){
					HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.noMatchedProject'));
					return;
				}


				$scope.Context.iTWOcxDocument = {
					DocCode: $scope.Context.InitialValues.iTWOcx_Document_DocCode ||'BGT',
					StatusName: $scope.Context.InitialValues.iTWOcx_Document_StatusName || 'OPEN',
					Title: $scope.Context.InitialValues.iTWOcx_Document_Title,
					ActionCodes: $scope.Context.InitialValues.iTWOcx_Document_ActionCodes || ['RIB-AM']
				};

				selectedLineItems = estimateMainService.getSelectedEntities();
				if(!!selectedLineItems && selectedLineItems.length > 0){
					let filterLineItems = _.filter(selectedLineItems, function (item) {
						return !!item.MdcControllingUnitFk;
					});

					if(!selectedLineItems || filterLineItems.length <= 0){
						HandlePostResout(false,$translate.instant('estimate.main.exportBudget2CxWizard.noLineItem'));
						return;
					}else{
						selectedLineItems = filterLineItems;
					}
				}

				// handle lineItems filter out condition.
				let readData = {};
				readData.filter = '';
				let params = _.cloneDeep(cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault());
				_.forEach(params.PinningContext, function (pItem) {
					let pId = pItem.id;
					if (!_.isNumber(pId) && _.isObject(pId)) {
						pItem.id = pId.Id;
					}
				});
				if (params.ProjectContextId && !_.isNumber(params.ProjectContextId) && _.isObject(params.ProjectContextId)) {
					params.ProjectContextId = params.ProjectContextId.Id;
				}
				angular.extend(readData, params);
				readData.PageSize = null; // need to return all data;
				readData.OrderBy = null;

				let estHeaderId = 0;
				if(!readData.PinningContext || !_.find(readData.PinningContext, {token: 'estimate.main'})){
					let estHeaderFk = !!$scope.Context.Entity && !!$scope.Context.Entity.Id ? $scope.Context.Entity.Id : 0;
					if(estHeaderFk > 0){
						readData.PinningContext = readData.PinningContext || [];
						readData.PinningContext.push({token: 'estimate.main', id: 1001329, info: ''});
						estHeaderId = estHeaderFk;
					}else{
						HandlePostResout(false,$translate.instant('estimate.main.pinPrjOrEst'));
						return;
					}
				}else{
					estHeaderId = _.find(readData.PinningContext, {token: 'estimate.main'}).id;
				}

				// append leading structre filter condition
				if(!selectedLineItems || selectedLineItems.length <= 0){
					estimateMainService.extendSearchFilter(readData);
				}

				let postData = {EstHeaderFk:estHeaderId, ReturnLineItemList: (!selectedLineItems || selectedLineItems.length <= 0), ProjectId: projectInfo.ProjectId, filterRequest: readData};

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getestimateinfoforpublishbudgettocx', postData).then(function(response){
					if(response && response.data){
						selectedLineItems = response.data.LineItems && response.data.LineItems.length > 0 ? response.data.LineItems : selectedLineItems;
						_.forEach(selectedLineItems, function (item) {
							item.EstHeaderCode = response.data.EstHeaderCode;
						});
						generateDocDocum(selectedLineItems, response.data.ControllingUnits, matchProjectNo);
					}
				});
			}

			function generateDocDocum(lineItems, controllingUnits, matchProjectNo) {
				let groupkey = '';
				controllingUnits = controllingUnits || [];
				switch ($scope.Entity.GroupType) {
					case '1':
						groupkey = 'BoqItemFk';
						break;
					case '4':
						groupkey = 'MdcControllingUnitFk';
						break;
					case '3':
						groupkey = 'PrjLocationFk';
						break;
					case '2':
						groupkey = 'PsdActivityFk';
						break;
					default:
						groupkey = 'MdcControllingUnitFk';
						break;
				}

				$scope.Context.iTWOcxDocument.Title = $scope.Context.iTWOcxDocument.Title || 'Publish Budget from Estimate ' + lineItems[0].EstHeaderCode;

				let groups = _.groupBy(lineItems, groupkey),
					i = 0,
					// code = '0000',
					costList = [];
				$scope.Context.iTWOcxDocument.LineItems = [];
				_.forEach(groups, function (group) {
					let budgetValue = _.sumBy(group, 'Budget');
					let first = group[0];
					let controlingUnit = _.find(controllingUnits, {Id: first.MdcControllingUnitFk});
					// let budgetCode = code.substring(0, 4-(i+'').length) + i;
					let budgetCode = i;
					let item = {
						ItemNumber: controlingUnit ? controlingUnit.Code.replace(/\./g, ''): budgetCode,
						Code: controlingUnit ? controlingUnit.Code: budgetCode,
						Description: !!controlingUnit && !!controlingUnit.DescriptionInfo ? controlingUnit.DescriptionInfo.Translated : budgetCode,
						Value: budgetValue
					};
					let parent = controlingUnit ?  _.find(controllingUnits, {Id: controlingUnit.ControllingUnitFk}) : null;
					if(!parent){
						$scope.Context.iTWOcxDocument.LineItems.push(item);
						if(controlingUnit){
							if(_.find(costList, {code:item.ItemNumber})){ item.ItemNumber = _.find(costList, {code:item.ItemNumber}).index;}
							else{costList.push({code:item.ItemNumber, index: ++i});}
							item.ItemNumber = _.find(costList, {code:item.ItemNumber}).index;
						}
					}else{
						let child = item;
						while (parent){
							let parentItem = {
								ItemNumber: parent.Code,
								Code: parent.Code,
								Description: !!parent && !!parent.DescriptionInfo ? parent.DescriptionInfo.Translated : budgetCode,
								Value: 0,
								Child: child,
							};
							child = parentItem;
							parent = _.find(controllingUnits, {Id: parent.ControllingUnitFk});
						}

						let currentParent = null;
						while (child !== null){
							if(_.find(costList, {code:child.Code})){ child.ItemNumber = _.find(costList, {code:child.Code}).index;}
							else{costList.push({code:child.Code, index: ++i});}
							child.ItemNumber = (!!currentParent && !!currentParent.ItemNumber ? currentParent.ItemNumber + '.' : '') + _.find(costList, {code:child.Code}).index;

							if(!_.find($scope.Context.iTWOcxDocument.LineItems, {ItemNumber: child.ItemNumber})){
								$scope.Context.iTWOcxDocument.LineItems.push({
									ItemNumber: child.ItemNumber,
									Code: child.Code,
									Description: child.Description,
									Value: child.Value,

								});
							}
							currentParent = child;
							child = child.Child;
						}
					}
				});


				if($scope.Context.iTWOcxDocument.LineItems.length <= 0){
					HandlePostResout(false,$translate.instant('estimate.main.exportBudget2CxWizard.noSelectedLineItem'));
				}else{
					$injector.get('estimateMainExternalUserServiceV1').transferDocToiTWOcx($scope, matchProjectNo);
				}
			}

			function HandlePostResout(isSuccess, ErrorMessages) {
				$scope.Context.CxApiResult = $scope.Context.CxApiResult || {};
				$scope.Context.CxApiResult.HasPostDoc = true;
				$scope.Context.CxApiResult.DocIsPosting = false;
				$scope.Context.CxApiResult.IsSuccess = isSuccess;
				$scope.Context.CxApiResult.ErrorMessages = ErrorMessages;
			}

			loadBudgetList();
		}]);

})(angular);
