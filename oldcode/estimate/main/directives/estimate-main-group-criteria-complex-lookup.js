/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainGroupCriteriaComplexLookupService
     */
	angular.module(moduleName).directive('estimateMainGroupCriteriaComplexLookup', ['$q', '_', '$translate','estimateMainGroupCriteriaComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, _, $translate,estimateMainGroupCriteriaComplexLookupService, BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'estimateMainGroupCriteriaComplexLookup',
				valueMember: 'Code',
				displayMember: 'Description',
				columns:estimateMainGroupCriteriaComplexLookupService.getColumns(),
				showCustomInputContent: true,
				formatter: function displayFormatter(data) {
					return _.map(data, function (item) {
						return item.Description;
					}).join(', ');
					// if(!str || str === ''){ return $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo');}
					// else {return  $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo')+ ', ' + str;}
				},
				popupOptions:{
					templateUrl: 'grid-popup-lookup.html',
					controller: 'estimateMainGroupCriteriaFilterController',
					width: 250, height: 300
				},
				onDataRefresh: function ($scope) {
					$scope.settings.dataView.dataProvider.getList($scope.entity.GroupCriteria).then(function(data){
						// update filters from server
						let arrayData = [];
						_.forEach(data, function(item){
							if (_.findIndex($scope.entity.GroupCriteria, { Code: item.Code }) !== -1){
								arrayData.push(item);
							}
							// if(item.Code === $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo')){
							//     item.Select = true;
							// }
						});
						$scope.entity.GroupCriteria = arrayData;
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {

					getList: function (groupCriterias) {
						return estimateMainGroupCriteriaComplexLookupService.getListAsync(groupCriterias);
					},

					getItemByKey: function () {
						return $q.when([]);
					}
				}
			});
		}
	]);
})(angular);
