(function () {
	/* global globals, _ */

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBidCreationService
	 * @function
	 *
	 * @description
	 * The service that handles the creation of a bid and subsequent bid boq based on the various settings that are done
	 * in the related wizard dialog.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainBidCreationService', ['$q', '$http', '$timeout', '$injector', 'platformModalService',
		'platformTranslateService', 'basicsLookupdataLookupDescriptorService', 'estimateMainService', 'estimateMainDynamicConfigurationService','mainViewService','platformGenericStructureService', 'estimeMainCraeteBidOptionProfileService',
		function ($q, $http, $timeout, $injector, platformModalService, translateService, basicsLookupdataLookupDescriptorService, estimateMainService, estimateMainDynamicConfigurationService, mainViewService, platformGenericStructureService, profileService) {

			let service = {};

			// local buffers
			let _loadingStatus = false;

			service.getLoadingStatus = function () {
				return _loadingStatus;
			};

			let _hasSurcharge4boq = false;

			service.hasSurcharge4boq = function(){
				return _hasSurcharge4boq;
			};

			service.showBidCreationWizardDialog = function () {

				translateService.registerModule(moduleName);
				translateService.registerModule('basics.common');

				// load grid data for project change grids
				let promises = [];

				let projectId = estimateMainService.getSelectedProjectId();

				let estHeaderId = estimateMainService.getSelectedEstHeaderId();

				promises.push($http.get(globals.webApiBaseUrl + 'boq/project/iscontainersurcharge4boq?projectId=' + projectId + '&estHeaderId=' + estHeaderId));

				promises.concat(preLoadDataBeforePopup());

				$q.all(promises).then(function (response) {

					_hasSurcharge4boq = response[0].data;

					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/wizard/estimate-main-bid-creation-wizard.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						// headerTextKey: 'sales.bid.wizard.generateBid',
						width: '700px',
						minWidth: '750px',
						// height: '550px',
						resizeable: true,
						value: {
							wizard: {
								steps: [{
									id: 'basic',
									disallowBack: true,
									disallowNext: false,
									canFinish: false
								},{
									id: 'structure',
									disallowBack: false,
									disallowNext: false,
									canFinish: false
								},{
									id: 'uppConfig',
									disallowBack: false,
									disallowNext: false,
									canFinish: false
								},{
									id: 'projectChange',
									disallowBack: false,
									disallowNext: false,
									canFinish: true
								},{
									id: 'surchargeItemSelect',
									disallowBack: false,
									disallowNext: false,
									canFinish: true
								},{
									id: 'optional',
									disallowBack: false,
									disallowNext: false,
									canFinish: true
								}]
							},
							entity:{
								selector: {},
								__selectorSettings: {}
							},
							wizardName: 'wzdlg'
						}
					};
					platformModalService.showDialog(modalOptions);
				});
			};
			// the needed data before popup
			function preLoadDataBeforePopup() {
				let promises = [];
				promises.push($injector.get('estimateMainBidLookupService').getList());
				promises.push($injector.get('salesBidNumberGenerationSettingsService').load());

				return promises;
			}

			function getFlagTreeItems(creationSettings) {
				if (creationSettings && creationSettings.EstimateOptional) {
					return _.map(creationSettings.EstimateOptional, function (item) {
						return {
							Id: item.Id.replace('LS',''),
							IsOptional: item.IsOptional,
							IsOptionalIt: item.IsOptionalIt,
							IsFixedPrice: item.IsFixedPrice
						};
					});
				}
			}

			function getCreationData(creationSettings) {
				let resultDeferred = $q.defer();
				let projectChangeLineItemsDeferred = $q.defer();

				if(creationSettings.ProjectChangeLineItems) {
					// The third page of the wizard sets some filtering conditions for the line items that form the base for the assignments
					// on which the creation of the bid boqs is based. Especially the project change assignment is the core criteria for filtering
					// the line items.

					// First of all look for all the project change items related to the currently selected project
					let projectInfo = estimateMainService.getSelectedProjectInfo();

					if(angular.isUndefined(projectInfo) || (projectInfo === null) || !_.isNumber(projectInfo.ProjectId)) {
						resultDeferred.reject();
					}

					projectChangeLineItemsDeferred.resolve(creationSettings.ProjectChangeOrders);
				}
				else {
					// No filtering via project change attribute
					projectChangeLineItemsDeferred.resolve([]);
				}
				projectChangeLineItemsDeferred.promise.then(function(projectChangeResult) {
					let creationData = {
						EstimateHeaderId: creationSettings.EstimateHeaderFk,
						MajorLineItems: creationSettings.MajorLineItems,
						ProjectChangeLineItems: creationSettings.ProjectChangeLineItems,
						DeleteOriginalBidBoq: creationSettings.DeleteOriginalBidBoq,
						BidId: creationSettings.BidHeaderFk,
						ProjectId: creationSettings.ProjectFk,
						StructureType: creationSettings.StructureType,
						BoqItemQuantityFromType: creationSettings.BoqItemQuantityFromType,
						SplitPerStructure: creationSettings.SplitPerStructure,
						StructureURPAssignments: creationSettings.StructureURPAssignments,
						EstUppUsingURP: creationSettings.EstUppUsingURP,
						CalculateHours: creationSettings.CalculateHours,
						EstimateScope: creationSettings.estimateScope,
						FilterRequest: estimateMainService.getLastFilter(),
						FlagTreeItems: getFlagTreeItems(creationSettings),
						GroupingColumns: creationSettings.GroupingColumns,
						Module: creationSettings.Module,
						OutputColumns: creationSettings.OutputColumns,
						UpdateFpBoqUnitRate: creationSettings.UpdateFpBoqUnitRate,
						CopyPriceIndex : creationSettings.PriceColumns.length > 0 ? (_.filter(creationSettings.PriceColumns, {'checked': true})).map(function (item){return item.Id;}) : []
					};

					if(creationSettings.CopyLineItemRete){
						creationData.CopyPriceIndex.push(0);
					}

					// Add project change settings
					creationData.ProjectChangeStatus = [];
					creationData.ProjectChangeDetails = [];
					creationData.ProjectChangeOrders = [];
					if (creationSettings.ProjectChangeLineItems) {

						// Reduce the result array of the project change handling to an array of ids
						projectChangeResult = _.map(_.filter(projectChangeResult, function (item) {
							return item.ChangeOrderSelected;
						}), function (item) {
							return item.Id;
						});

						creationData.ProjectChangeOrders = (angular.isDefined(projectChangeResult) && (projectChangeResult !== null) && _.isArray(projectChangeResult) && projectChangeResult.length > 0) ? projectChangeResult : [];
					}
					creationData.SurchargeTextNoteBoqItems = creationSettings.SurchargeTextNoteBoqItems;
					if(creationData.SurchargeTextNoteBoqItems && creationData.SurchargeTextNoteBoqItems.length > 0){
						_.forEach(creationData.SurchargeTextNoteBoqItems, function (item){
							item.BoqItems = [];
						});
					}
					resultDeferred.resolve(creationData);
				});
				return resultDeferred.promise;
			}

			function getChangeOrderSelectedIds(creationSettings) {
				let projectChangeResult = creationSettings.ProjectChangeOrders;
				return _.map(_.filter(projectChangeResult, function (item) {
					return item.ChangeOrderSelected;
				}), function (item) {
					return item.Id;
				});
			}

			/**
			 * @ngdoc function
			 * @name createBidBoqsEx
			 * @function
			 * @methodOf estimate.main.estimateMainBidCreationService
			 * @description Create bid boqs based on given creation settings coming from the corresponding creation wizard dialog
			 * @param _creationData
			 * @param {Object} creationSettings: controlling the process of creating the bid boqs
			 * @returns {Object} promise indicating the advance of the creation
			 */
			service.createBidBoqsEx = function createBidBoqsEx(_creationData, creationSettings) {
				let errorResultPromise = $q.when(false);
				let resultDeferred = $q.defer();

				if (angular.isUndefined(creationSettings) || (creationSettings === null)) {
					return errorResultPromise;
				}
				getCreationData(creationSettings).then(function (creationData) {
					let bidCreationDataDto = {
						CreationData: creationData,
						BidHeaderCreationData: _creationData
					};
					bidCreationDataDto.CreationData.StructureMainId = _creationData.StructureMainId;
					bidCreationDataDto.CreationData.BidId = bidCreationDataDto.CreationData.BidId - 0;

					if(_creationData.AssignChangeToBidHeader){
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/alllineitemassignsamechange', bidCreationDataDto.CreationData).then(function (result) {
							if(result && result.data){
								postCreate(bidCreationDataDto, resultDeferred);
							}else{
								platformModalService.showYesNoDialog('estimate.main.bidCreationWizard.bidCreatePrjChangeCheck', $injector.get('$translate').instant('estimate.main.bidCreationWizardCreateBid')).then(function(yesOrNo){
									if(yesOrNo && yesOrNo.yes){
										bidCreationDataDto.CreationData.ContainDifferentChange = true;
										postCreate(bidCreationDataDto, resultDeferred);
									}else{
										resultDeferred.reject();
									}
								});
							}
						});
					}else{
						postCreate(bidCreationDataDto, resultDeferred);
					}
				},
				function () {
					// Error case when filtering line items
					resultDeferred.reject();
				});

				return resultDeferred.promise;
			};

			function postCreate(bidCreationDataDto, resultDeferred){
				$http.post(globals.webApiBaseUrl + 'sales/bid/createbidfromestimate', bidCreationDataDto).then(function (result) {
					if (angular.isDefined(result) && (result !== null) && angular.isDefined(result.data) && (result.data !== null)) {
						resultDeferred.resolve(result.data);
					}
				},
				function () {
					// Error case when creating bid boqs
					resultDeferred.reject();
				});
			}

			function updateBidBoqs(bidHeaderData, creationSettings) {
				let resultDeferred = $q.defer();
				let errorResultPromise = $q.when(false);
				if (angular.isUndefined(creationSettings) || (creationSettings === null)) {
					return errorResultPromise;
				}

				getCreationData(creationSettings).then(function (creationData) {
					let updateDataDto = {
						CreationData: creationData,
						BidHeaderCreationData: bidHeaderData
					};
					updateDataDto.CreationData.StructureMainId = bidHeaderData.StructureMainId;

					$http.post(globals.webApiBaseUrl + 'sales/bid/boq/updateboqs', updateDataDto).then(function (result) {
						if (angular.isDefined(result) && (result !== null) && angular.isDefined(result.data) && (result.data !== null)) {
							resultDeferred.resolve(result.data);
						}
					},
					function () {
						// Error case when creating bid boqs
						resultDeferred.reject();
					});
				});

				return resultDeferred.promise;
			}

			function getBidHeaderFromLookup(bidCode) {
				let estHeaderId = parseInt(estimateMainService.getSelectedEstHeaderId());
				let projectId = estimateMainService.getSelectedProjectId() || -1;
				let cacheData = $injector.get('estimateMainBidLookupService').getCacheDataList();

				let condition = {ProjectFk: projectId, EstHeaderFk: estHeaderId };
				if(bidCode) {
					condition.Code = bidCode;
				}

				return _.find(cacheData, condition) || null;
			}

			function bidCodeLookupField() {
				return {
					// type: 'inputselect',
					type: 'directive',
					directive: 'estimate-main-bid-lookup',
					visible: true, // for the form re-render
					validator: null, // no need
					asyncValidator: null, // no need for unique checking
					options: {
						displayMember: 'Code',
						valueMember: 'Code',
						isTextEditable: false
					}
				};

			}

			function isAnyAssignmentByStructure(structureType, estimateScope, groupFk, entity) {
				let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
				let filterRequest = estimateScope === 1 ? estimateMainService.getLastFilter() : null;
				let groupId = groupFk ? groupFk.substr(2, groupFk.length - 2) : null;
				let estimateFilterData = {
					StructureType: structureType,
					StructureMainId : $injector.get('estimateWizardStructureTypeLookupService').getSelectMainId(structureType),
					EstHeaderFk: estHeaderFk,
					EstimateScope: estimateScope,
					FilterRequest: groupFk ? estimateMainService.getLastFilter() : filterRequest,
					MajorLineItems: entity.MajorLineItems,
					ProjectChangeLineItems: entity.ProjectChangeLineItems,
					GroupFk: groupId,
					ProjectId:  estimateMainService.getSelectedProjectId() || 0
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/isanyassignmentbystructure', estimateFilterData);
			}

			function handleGroupColumns() {
				let config = estimateMainDynamicConfigurationService.getStandardConfigForListView();
				let scheme = estimateMainDynamicConfigurationService.getDtoScheme();

				let grouped = mainViewService.customData('66788defaa8f43319b5122462e09c41d', 'grpInfo') || [];

				let groupingColumnsState = [];

				_.each(grouped, function (item) {
					let cid = item.cid;
					let column = _.find(config.columns, {id: cid});
					let grouping;
					if(column.formatter === 'history'){
						let fieldstr = column.field.split('.');
						let field = fieldstr[fieldstr.length-1].charAt(0).toUpperCase() + fieldstr[fieldstr.length-1].slice(1);
						grouping = scheme[field].grouping || field;
					}else {
						let groupings = scheme[column.$field || column.field].groupings;
						if (groupings) { // new logic with multiple grouping items mapping, check
							// no search for grouping info for finding correct mapping, grouping is an array of {groupcolid: string, mappinghint: string}
							let _groupInfo = _.find (groupings,{ mappinghint: _.toLower(column.id)} );
							grouping = (_groupInfo || groupings[0] || {}).groupcolid;
						}
						if (!grouping) {
							grouping = scheme[column.$field || column.field].grouping || column.$field || column.field;
						}
						// grouping = grouping || column.$field || column.field;
					}

					let groupingColumnId = grouping.split(':')[0];
					let metadata = _.find(platformGenericStructureService.getMetadata(), { groupColumnId: groupingColumnId });

					let newItem = {
						id: cid,
						levels: 0,
						depth: metadata && metadata.maxLevels || 1,
						grouping: grouping,
						metadata: metadata
					};

					fillWithState(newItem, item.state);

					groupingColumnsState.push(newItem);
				});

				let groupingColumns = [];

				_.forEach(groupingColumnsState, function (group) {
					let split = group.grouping.split('.');

					if (split.length === 1 || split.length === 3 && group.metadata) {
						if (_.isArray(group.dateoption) && !_.isEmpty(group.dateoption)) {
							_.forEach(group.dateoption, function (option) {
								groupingColumns.push({
									groupColumnId: group.grouping,
									groupType: group.metadata && group.metadata.groupType || 1,
									depth: group.depth,
									dateOption: option,
									sortingBy: group.sortDesc
								});
							});
						} else {
							groupingColumns.push({
								groupColumnId: group.grouping,
								groupType: group.metadata && group.metadata.groupType || 1,
								depth: group.depth,
								dateOption: _.isString(group.dateoption) ? group.dateoption : null,
								sortingBy: group.sortDesc
							});
						}
					}
				});

				return groupingColumns;
			}

			function fillWithState(item, state) {
				// Add logic to be executed when the group state changes. In this case level to be displayed.
				item.sortDesc = 0;
				item.selectToday = 0;
				item.strictTillLevel = 0;

				if (item) {
					_.forOwn(state, function (value, key) {
						if (value.state === 'checked') {
							switch (key) {
								case 'allLvls':
									item.levels = 0;
									item.depth = item.metadata && item.metadata.maxLevels || 1;
									break;

								case 'till_1':
									item.levels = item.depth = 1;
									break;

								case 'till_2':
									item.levels = item.depth = 2;
									break;

								case 'till_3':
									item.levels = item.depth = 3;
									break;

								case 'till_4':
									item.levels = item.depth = 4;
									break;

								case 'till_5':
									item.levels = item.depth = 5;
									break;
								case 'date':
									item.dateoption = 'Date';
									break;
								case 'brkdwn':
									item.dateoption = [];
									_.forOwn(value, function (val, key) {
										if (val.state === 'checked') {
											switch (key) {
												case 'year':
													item.dateoption.push('Year');
													break;
												case 'month':
													item.dateoption.push('Month');
													break;
												case 'calwk':
													item.dateoption.push('CalenderWeek');
													break;
												case 'wkday':
													item.dateoption.push('WeekDay');
													break;
												case'day':
													// eslint-disable-next-line no-case-declarations
													let dayOption = 'Day';
													switch (val.selected) {
														case 'dayYear':
															dayOption = 'DayYear';
															break;
														default:
															dayOption = 'Day';
															break;
													}
													item.dateoption.push(dayOption);
													break;
											}
										}
									});
									break;
								case 'sortDesc':
									item.sortDesc = 1;
									break;
								case 'selectToday':
									item.selectToday = 1;
									break;
								case 'strictTillLevel':
									item.strictTillLevel = 1;
									break;
							}
						}
					});

					if (state && state.grpColor) {
						item.colorOptions = {color: state.grpColor.color, enabled: state.grpColor.state === 'checked'};
					}

					if (item.metadata && item.metadata.maxLevels < item.depth) {
						item.depth = item.metadata.maxLevels;
					}
				}
			}

			function saveBidCreatingConfig(entity, bidId){
				let profile={};
				profile.ProfileName= 'Bid creating config';
				profile.ProfileAccessLevel='System';
				profile.GroupKey = profileService.getSaveGroupKey()+ ':'+ bidId;
				profile.AppId = profileService.getSaveAppId();
				profile.PropertyConfig = JSON.stringify({
					MajorLineItems : entity.MajorLineItems,
					// ProjectChangeLineItems: entity.ProjectChangeLineItems,
					EstUppUsingURP: entity.EstUppUsingURP,
					PriceColumns: entity.PriceColumns,
					CalculateHours: entity.CalculateHours,
					CopyLineItemRete: entity.CopyLineItemRete,
					estimateScope: entity.estimateScope,
					UpdateFpBoqUnitRate: entity.UpdateFpBoqUnitRate
					// DeleteOriginalBidBoq: entity.DeleteOriginalBidBoq
				});
				profile.IsDefault = false;
				profileService.saveProfile(profile);
			}

			function getBidCreatingConfig(bidId){
				return profileService.getProfile({
					GroupKey: profileService.getSaveGroupKey()+ ':'+ bidId,
					AppId: profileService.getSaveAppId()
				}).then(function (data){
					if(data && data.data && data.data[0]){
						return JSON.parse(data.data[0].PropertyConfig);
					}else{
						return null;
					}
				});
			}

			return angular.extend(service, {
				bidCodeLookupField: bidCodeLookupField,
				updateBidBoqs: updateBidBoqs,
				getBidHeaderFromLookup: getBidHeaderFromLookup,
				isAnyAssignmentByStructure : isAnyAssignmentByStructure,
				getChangeOrderSelectedIds : getChangeOrderSelectedIds,
				handleGroupColumns: handleGroupColumns,
				saveBidCreatingConfig: saveBidCreatingConfig,
				getBidCreatingConfig: getBidCreatingConfig
			});
		}
	]);
})(angular);
