/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	let estimateCommonModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemCopyPasteService
	 *
	 */
	estimateCommonModule.factory('estimateMainLineItemCopyPasteService', ['globals', '_', '$q','$injector', 'estimateMainService',
		'cloudCommonGridService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
		function (globals, _, $q, $injector, estimateMainService, cloudCommonGridService, basicsLookupdataLookupDataService,
			basicsLookupdataLookupDescriptorService) {
			let costGroupCatIds = [];
			let costGroups = [];

			let service = {};

			service.copyPaste = function copyPaste() {
				$injector.get('estimateCommonCopyPasteService').pasteSelection(estimateMainService.gridId, {
					dataService: estimateMainService,
					customOnPasteCompleteHandler: customOnPasteCompleteHandler,
					customCollectionLookupTypeFun: customCollectionLookupTypeFun
				});
			};

			function customCollectionLookupTypeFun(copyColumnLookupTypeObj, columnDef) {
				let columnName = columnDef.field;
				if(columnName.indexOf('costgroup_') !== -1){
					let catId = _.find(costGroupCatIds, function (item) {
						return item === columnDef.costGroupCatId;
					});
					if(!catId){
						costGroupCatIds.push(columnDef.costGroupCatId);
					}
					return;
				}
				let copyLookupType = _.find(copyColumnLookupTypeObj, function (item) {
					return item.lookupType === columnDef.formatterOptions.lookupType;
				});
				if(!copyLookupType){
					copyColumnLookupTypeObj.push({field: columnName, lookupType: columnDef.formatterOptions.lookupType});
				}
			}

			function customOnPasteCompleteHandler(copyColumnLookupTypeObj, changeObjects, modifiedItems) {
				let promises = [];
				let costGroupCats = null;
				if(costGroupCatIds.length > 0){
					let costGroupPromise = basicsLookupdataLookupDataService.getSearchList('CostGroup',{
						AdditionalParameters: {
							catalogIds: costGroupCatIds,
							costGroupType: 0
						},
						RequirePaging: false
					}).then(function (respond){
						cloudCommonGridService.flatten(respond.items, costGroups, 'ChildItems');
						if(costGroups.length > 0){
							costGroupCats = costGroups.reduce((acc, item) => {
								const key = item.CostGroupCatFk.toString();
								acc[key] = acc[key] || [];
								acc[key].push(item);
								return acc;
							}, {});
						}
					});
					promises.push(costGroupPromise);
				}
				_.forEach(copyColumnLookupTypeObj, function (item) {
					let columnName = item.field;
					if(columnName.indexOf('ConfDetail') !== -1){
						return;
					}
					switch (columnName) {
						case 'PrjLocationFk':
							promises.push($injector.get('estimateMainLocationLookupService').loadAsync(true));
							break;
						case 'PrcStructureFk':
							promises.push($injector.get('estimateMainProcurementStructureService').load());
							break;
						case 'MdcControllingUnitFk':
							promises.push($injector.get('estimateMainControllingService').load());
							break;
						case 'PsdActivityFk':
							promises.push($injector.get('estimateMainActivityService').load());
							break;
						default:
							promises.push(basicsLookupdataLookupDescriptorService.loadData(item.lookupType));
					}
				});
				$q.all(promises).then(function () {
					_.forEach(changeObjects, function (item){
						let columnName = item.affectedProperty;
						if(columnName.indexOf('ConfDetail') !== -1){
							item.valid = true;
							item.isChanged = !item.isReadonly;
							if(item.isReadonly){
								item.desiredValue = item.oldValue;
							}
							return;
						}
						if(item.isReadonly){
							item.isChanged = false;
							item.desiredValue = item.oldValue;
							return;
						}
						if(item.isCopyPasteLookup && item.lookupType){
							let lookupItems = [];
							if(columnName.indexOf('costgroup_') !== -1){
								let costGroupCatId = columnName.substring(columnName.indexOf('_') + 1);
								lookupItems = costGroupCats[costGroupCatId];
							} else {
								switch (columnName) {
									case 'PrjLocationFk':
										cloudCommonGridService.flatten($injector.get('estimateMainLocationLookupService').getList(true), lookupItems, 'Locations');
										break;
									case 'PrcStructureFk':
										lookupItems = _.filter($injector.get('estimateMainProcurementStructureService').getList(), function (item) {
											return item.IsLive && item.AllowAssignment;
										});
										break;
									case 'MdcControllingUnitFk':
										lookupItems = _.filter($injector.get('estimateMainControllingService').getList(), function (item) {
											return !item.HasChildren;
										});
										break;
									case 'PsdActivityFk':
										lookupItems = _.filter($injector.get('estimateMainActivityService').getList(), function (item) {
											let isSelectable = true;
											if (angular.isString(item.Id) && item.Id.indexOf(/[a-z]/i) === -1) {
												isSelectable = false;
												return isSelectable;
											}
											if (item.ActivityTypeFk === 2 || item.HasChildren || !angular.isDefined(item.ActivityTypeFk)) {
												isSelectable = false;
											}
											return isSelectable;
										});
										break;
									default:
										lookupItems = basicsLookupdataLookupDescriptorService.getData(item.lookupType);
								}
							}
							if(lookupItems){
								let lookupItem = _.find(lookupItems, function (data) {
									return item.desiredValue === data[item.displayMember];
								});
								if(lookupItem){
									item.desiredValue = lookupItem.Id;
								} else {
									item.desiredValue = item.oldValue;
								}
							}
							item.isChanged = item.desiredValue !== item.oldValue;
						}
					});
					clearData();
					$injector.get('estimateCommonCopyPasteService').doCopyPaste(changeObjects, modifiedItems);
				}).catch(function (error) {
					$injector.get('estimateCommonCopyPasteService').reLoadData();
					clearData();
					return $q.reject(error);
				});
			}

			function clearData() {
				costGroupCatIds = [];
				costGroups = [];
			}

			return service;
		}]);
})(angular);
