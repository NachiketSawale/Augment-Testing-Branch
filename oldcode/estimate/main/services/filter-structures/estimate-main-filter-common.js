/**
 * Created by janas on 23.09.2015.
 */

(function () {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainFilterCommon
	 * @description
	 * service for all common filter structure services functions and tasks.
	 */
	angular.module(moduleName).factory('estimateMainFilterCommon', [
		'$injector',

		function ($injector) {


			return {
				collectItems: collectItems,
				getAllFilterConditions: getAllFilterConditions
			};
			function collectItems(item, childProp, resultArr) {
				resultArr = resultArr || [];
				resultArr.push(item);
				_.each(item[childProp], function (item) {
					collectItems(item, childProp, resultArr);
				});
				return resultArr;
			}



			function getAllFilterConditions() {

				let conditions = {};

				let getRestrictedIds = function(markedItems, childProp) {
					let treeIds = [];
					markedItems.map(function (item) {
						let Ids = _.map(collectItems(item, childProp), 'Id');
						treeIds = treeIds.concat(Ids);
					});
					return treeIds;
				};
				let getActivityRestrictedIds = function(markedItems, childProp) {
					childProp = childProp || 'Activities';
					let allIds = [];
					markedItems.map(function (item) {
						// ActivityTypes: 1=(Regular)Activity, 2=SummaryActivity, 3=Milestone, 4=SubSchedule
						if (item.ActivityTypeFk === 1) { // (Regular)Activity
							allIds.push(item.Id);
						} else if (item.ActivityTypeFk === 2 || item.ActivityTypeFk === undefined) { // SummaryActivity
							// get all child activities
							let items = collectItems(item, childProp);
							let Ids = _.map(_.filter(items, function (i) { return i.ActivityTypeFk === 1; }), 'Id');
							allIds = allIds.concat(Ids);
						}
					});
					return allIds;
				};

				let getCondition = function (filterMarker) {
					let cond = {};
					let dataService = $injector.get(filterMarker.dataServiceName),
						fnGetRestrictedIds = filterMarker.fnGetRestrictedIds || getRestrictedIds,
						markedItems = _.filter(dataService.getList(), {IsMarked: true});

					cond[filterMarker.lineItemField] = fnGetRestrictedIds(markedItems, filterMarker.childProp);
					return cond;

				};

				let filterMarkerData = [
					{
						filterId: 'costGroupStructureController',
						dataServiceName: 'costGroupStructureDataServiceFactory',
						childProp: 'CostGroupChildren',
						lineItemField: 'CostGroupFk'
					},
					{
						filterId: 'estimateMainActivityListController',
						dataServiceName: 'estimateMainActivityService',
						childProp: 'Activities',
						lineItemField: 'PsdActivityFk',
						fnGetRestrictedIds: getActivityRestrictedIds
					},
					{
						filterId: 'estimateMainAssemblyCategoryTreeController',
						dataServiceName: 'estimateMainAssembliesCategoryService',
						childProp: 'AssemblyCatChildren',
						lineItemField: 'EstAssemblyCatFk'
					},
					{
						filterId: 'estimateMainBoqListController',
						dataServiceName: 'estimateMainBoqService',
						childProp: 'BoqItems',
						lineItemField: 'BoqItemFk'
					},
					{
						filterId: 'estimateMainWicBoqListController',
						dataServiceName: 'estimateMainWicBoqService',
						childProp: 'BoqItems',
						lineItemField: 'WicBoqItemFk'
					},
					{
						filterId: 'estimateMainControllingListController',
						dataServiceName: 'estimateMainControllingService',
						childProp: 'ControllingUnits',
						lineItemField: 'MdcControllingUnitFk'
					},

					{
						filterId: 'estimateMainLocationListController',
						dataServiceName: 'estimateMainLocationService',
						childProp: 'Locations',
						lineItemField: 'PrjLocationFk'
					},

					{
						filterId: 'estimateMainProcurementStructureService',
						dataServiceName: 'estimateMainProcurementStructureService',
						childProp: 'ChildItems',
						lineItemField: 'PrcStructureFk'
					},
					{
						filterId: 'estimateMainConfidenceCheckController',
						dataServiceName: 'estimateMainConfidenceCheckService',
						childProp: 'EstConfidenceCheckChildrens',
						lineItemField: 'Id'
					},
				];

				filterMarkerData.map(function(filterMarker){
					conditions = angular.extend(conditions, getCondition(filterMarker));
				});

				return conditions;
			}


		}]);
})();
