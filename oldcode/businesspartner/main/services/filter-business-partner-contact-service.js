/**
 * @ngdoc service
 * @name filterBusinessPartnerContactService
 * @function
 *
 * @description delivery contact grid option from businesspartner on filter dialog.
 * @auther boom 4/9 2021
 */
/* jshint -W072 */
/* global Slick */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('filterBusinessPartnerContactService', ['_', 'platformGridAPI', 'platformRuntimeDataService', '$http',
		'platformDataProcessExtensionHistoryCreator', 'platformObjectHelper', '$q', 'businesspartnerContactPortalUserManagementService', '$injector', 'BasicsCommonDateProcessor','businessPartnerHelper',
		function (_, platformGridAPI, platformRuntimeDataService, $http, dataProcessExtension, platformObjectHelper, $q,
			businesspartnerContactPortalUserManagementService, $injector, BasicsCommonDateProcessor,helperService) {
			var ctOptions = {};
			var ctGridId = '015039777D6F4A1CA0BF9EEC6E9D244E';
			var isShowGrid = false;
			var arrayData = [];
			var readonlyFields = [];
			var branchContactMap =[];
			var needSetDefaultContact = true;

			let dateProcessor = new BasicsCommonDateProcessor(['BirthDate', 'SetInactiveDate']);
			var service = {
				setCtOptions: setCtOptions,
				setCtGridId: setCtGridId,
				setIsShowContracts: setIsShowContracts,
				getCtOptions: getCtOptions,
				getCtGridId: getCtGridId,
				getIsShowContracts: getIsShowContracts,
				setSelectContact: setSelectContact,
				setData: setData,
				pushArrayData: pushArrayData,
				getArrayData: getArrayData,
				SetSelected: SetSelected,
				resetArrayData: resetArrayData,
				getGridConfig: getGridConfig,
				getGridColumns: getGridColumns,
				pushBranchContactMap:pushBranchContactMap,
				getBranchContactMap:getBranchContactMap,
				resetBranchContactMap: resetBranchContactMap,
				setIsNeedDefaultContact: setIsNeedDefaultContact
			};
			return service;

			function resetArrayData(){
				arrayData = [];
			}
			function setCtOptions(modalOptions) {
				ctOptions = modalOptions;
			}

			function setCtGridId(gridId) {
				ctGridId = gridId;
			}

			function setIsShowContracts(isShowContracts) {
				isShowGrid = isShowContracts;
			}

			function setIsNeedDefaultContact(needDefaultContactOpt) {
				needSetDefaultContact = needDefaultContactOpt;
			}

			function getCtOptions() {
				return ctOptions;
			}

			function getCtGridId() {
				return ctGridId;
			}

			function getIsShowContracts() {
				return isShowGrid;
			}

			function setSelectContact(selectedBp, generateArrayData, headerEntity, contactField, selectedBranch) {
				let deferred = $q.defer();
				var pbContactParam = {Value: selectedBp.Id, filter: ''};
				var filterDatas = [];
				$http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (data) {
					if(selectedBp && data && !_.isNil(data.data) && !_.isNil(data.data.Main) && data.data.Main.length > 0){
						selectedBp.ContactDtos = data.data.Main;
					}
					//filter the contacts by branch
					if(!_.isNil(selectedBranch)){
						filterDatas = _.filter(data.data.Main, function (item) {
							return  item.SubsidiaryFk === selectedBranch.Id || _.isNil(item.SubsidiaryFk);
						});
					}else{
						filterDatas = data.data.Main;
					}
					if (filterDatas.length > 0) {
						_.forEach(filterDatas, function (item) {
							dateProcessor.processItem(item);
							dataProcessExtension.processItem(item);
						});
						if(!_.isNil(filterDatas) && filterDatas.length > 0){
							businesspartnerContactPortalUserManagementService.getAndMapProviderInfo(filterDatas)
								.then(function (filterDatas) {
									if(!_.isNil(headerEntity) && !_.isNil(contactField) && !_.isNil(headerEntity[contactField])){
										var contactFk = headerEntity[contactField];
										var foundContact = _.find(filterDatas, function (con) {
											return con.Id === contactFk;
										});
										if(!_.isNil(foundContact)){
											generateArrayData.push({bpId: selectedBp.Id, ctId: foundContact.Id});
											if(!_.isNil(selectedBranch)){
												service.pushBranchContactMap({branchId: selectedBranch.Id, ctId: foundContact.Id});
											}
										}
									}
									var contactDtos = [];
									if(!_.isNil(selectedBranch)){
										contactDtos = SetContactCheckByBranch(selectedBranch, filterDatas);
									}else{
										contactDtos = SetContactCheck(selectedBp,generateArrayData, filterDatas);
									}
									let checkContact = _.filter(contactDtos, {bpContactCheck: true});
									if (checkContact.length < 1 && contactDtos.length >= 1) {
										//get the contact which has the branch first
										var fistContact = contactDtos[0];
										var branchContacts =  _.filter(contactDtos, function (item) {
											return  item.SubsidiaryFk === selectedBranch.Id;
										});


										if(!_.isNil(branchContacts) && branchContacts.length > 0){
											if(needSetDefaultContact){
												branchContacts[0].bpContactCheck = true;
											}
											fistContact = branchContacts[0];
										}else{
											if(contactDtos.length > 0 && needSetDefaultContact){
												contactDtos[0].bpContactCheck = true;
											}
										}
										if(needSetDefaultContact){
											service.pushArrayData({bpId: selectedBp.Id, ctId: fistContact.Id});
											if(!_.isNil(selectedBranch)) {
												service.pushBranchContactMap({branchId: selectedBranch.Id, ctId: fistContact.Id});
											}
										}

										processExtensionHistory(contactDtos);
										SetSelected();
									}else{
										processExtensionHistory(contactDtos);
										if(!_.isNil(checkContact) && checkContact.length >= 1){
											SetSelected();
										}
									}
									getReadonlyFields();
									_.forEach(platformGridAPI.items.data(ctGridId), function (item) {
										platformRuntimeDataService.readonly(item, readonlyFields);
									});
								});
							deferred.resolve(true);
						}else{
							platformGridAPI.items.data(ctGridId, []);
							deferred.resolve(true);
						}

					}else {
						platformGridAPI.items.data(ctGridId, []);
						deferred.resolve(true);
					}
				});
				SetSelected();
				return deferred.promise;
			}
			function SetSelected(){
				var grid = platformGridAPI.grids.element('id', ctGridId);
				if(!_.isNil(grid) && !_.isNil(grid.dataView)){
					var rows = grid.dataView.getRows();
					if(!_.isNil(rows)){
						var index = _.findIndex(rows, function (c) {
							return c.bpContactCheck === true;
						});
						if(index !== -1){
							if(!_.isNil(grid.instance)){
								grid.instance.setSelectedRows([index]);
							}
						}
					}

				}
			}
			function SetContactCheck(selectedItem, generateArrayData, contactDtos) {
				contactDtos = _.isNil(contactDtos) ? _.filter(selectedItem.ContactDtos, { IsLive: true }) : contactDtos;
				const checkArray = _.find(generateArrayData, { bpId: selectedItem.Id });

				_.forEach(contactDtos, function (val) {
					val.bpContactCheck = !!(checkArray && val.Id === checkArray.ctId);
				});

				if (checkContactLength(contactDtos) === 1) {
					return contactDtos;
				}

				checkContactByRole(contactDtos);
				return contactDtos;
			}
			function SetContactCheckByBranch(selectedBranch, contactDtos) {
				var branchCtMap = getBranchContactMap();
				if(!_.isNil(contactDtos) && !_.isNil(branchCtMap)) {
					const checkArray = _.find(branchCtMap, { branchId: selectedBranch.Id });

					_.forEach(contactDtos, function (val) {
						val.bpContactCheck = !!(checkArray && val.Id === checkArray.ctId);
					});
				}

				if (checkContactLength(contactDtos) === 1) {
					return contactDtos;
				}

				checkContactByRole(contactDtos,selectedBranch.Id);
				return contactDtos;

			}
			function checkContactLength(contactDtos) {
				return _.filter(contactDtos, { bpContactCheck: true }).length;
			}
			function checkContactByRole(contactDtos,branchFk) {
				if (ctOptions.isFromProcurement) {
					setBpContactCheck(contactDtos, branchFk,'IsProcurement');
				}
				if (ctOptions.isFromSales) {
					setBpContactCheck(contactDtos, branchFk,'IsSales');
				}
			}

			function setBpContactCheck(contactDtos, branchFk, conditionKey) {
				let desiredContact = helperService.getDefaultContactByByConditionKey(contactDtos, branchFk, conditionKey);
				if (desiredContact) {
					let foundContact = contactDtos.find(contact => contact.Id === desiredContact.Id);
					if (foundContact) {
						foundContact.bpContactCheck = true;
					}
				}
			}

			function setData(datalist) {
				platformGridAPI.items.data(ctGridId, datalist);
				processExtensionHistory();
			}

			function pushArrayData(item) {
				let bpCt = _.find(arrayData, function (data) {
					return data.bpId === item.bpId && data.ctId === item.ctId;
				});
				if (!bpCt) {
					arrayData.push(item);
				}
			}

			function getArrayData() {
				return arrayData;
			}

			function pushBranchContactMap(item) {
				let bpCt = _.find(branchContactMap, function (data) {
					return data.branchId === item.branchId && data.ctId === item.ctId;
				});
				if (!bpCt) {
					branchContactMap.push(item);
				}
			}

			function getBranchContactMap() {
				return branchContactMap;
			}

			function resetBranchContactMap(){
				branchContactMap = [];
			}

			function getReadonlyFields() {
				if (_.isEmpty(readonlyFields)) {
					var columns = platformGridAPI.columns.getColumns(ctGridId);
					_.forEach(columns, function (column) {
						if (column.field !== 'bpContactCheck') {
							readonlyFields.push({field: column.field, readonly: true});
						}
					});
				}
			}
			function processExtensionHistory(items){
				_.forEach(items, function (item) {
					dateProcessor.processItem(item);
					dataProcessExtension.processItem(item);

				});
				platformGridAPI.items.data(ctGridId, items);
			}

			function changeEmailFormatter(gridColumns) {
				_.remove(gridColumns, {id: 'email'});
				_.remove(gridColumns, {id: 'emailprivate'});

				gridColumns.push({
					id: 'email',
					field: 'Email',
					name: 'Email',
					name$tr$: 'cloud.common.sidebarInfoDescription.email',
					width: 130
				}, {
					id: 'emailprivate',
					field: 'EmailPrivate',
					name: 'Private E-Mail',
					name$tr$: 'cloud.common.sidebarInfoDescription.emailprivate',
					width: 130
				});
				return gridColumns;
			}

			function getGridColumns() {
				var uiStandardService = $injector.get('businessPartnerMainContactUIStandardService');
				var settings = uiStandardService.getStandardConfigForListView();
				var gridColumns = angular.copy(settings.columns);
				gridColumns = changeEmailFormatter(gridColumns);
				gridColumns.unshift({
					id: 'Id',
					field: 'bpContactCheck',
					name: 'Selected',
					name$tr$: 'cloud.common.entitySelected',
					formatter: 'marker',
					editor: 'marker',
					editorOptions: {
						multiSelect: false
					},
					width: 60,
					validator: 'ContactCheckValidation',
					pinned: true
				});
				_.forEach(gridColumns,
					function (gridColumn) {
						if (gridColumn.formatter === 'boolean') {
							gridColumn.editor=null;
						}
					});
				return gridColumns;
			}

			function getGridConfig() {
				return {
					columns: getGridColumns(),
					data: [],
					id: ctGridId,
					gridId: ctGridId,
					lazyInit: true,
					options: {
						skipPermissionCheck: true,
						iconClass: 'control-icons',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						multiSelect: false,
						enableDraggableGroupBy: true,
						enableModuleConfig: true,
						enableConfigSave: true,
						editorLock: new Slick.EditorLock()
					}
				};
			}
		}
	]);
})(angular);