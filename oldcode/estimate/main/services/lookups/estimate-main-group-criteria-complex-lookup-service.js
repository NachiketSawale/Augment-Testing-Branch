/**
 * Created by wul on 4/13/2018.
 */
(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainGroupCriteriaComplexLookupService
     * @function
     *
     */
	angular.module(moduleName).factory('estimateMainGroupCriteriaComplexLookupService', ['$q','$http', '$injector','$translate',
		function ($q, $http, $injector, $translate) {

			// Object presenting the service
			let service = {};

			service.onSelectionChange = function onSelectionChange(args){
				let entity = args.entity;
				if(entity.GroupCriteria === ''){
					entity.GroupCriteria = args.selectedItem.Code;
				}else{
					entity.GroupCriteria += ',' + args.selectedItem.Code;
				}
			};

			service.clearAllItems = function clearAllItems() {

			};

			service.getColumns = function getColumns(){
				return [
					{
						id: 'Select',
						field: 'Select',
						name: 'Select',
						width: 70,
						toolTip: 'Select',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: true,
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select'
					},
					{
						id: 'Code',
						field: 'Description',
						name: 'Code',
						width: 110,
						toolTip: 'code',
						name$tr$: 'cloud.common.entityCode'
					}
					// ,
					// {
					//     id: 'Structure',
					//     field: 'Structure',
					//     name: 'Structure',
					//     toolTip: 'Structure',
					//     width: 60,
					//     name$tr$: 'estimate.main.generateProjectBoQsWizard.structure',
					//     formatter: 'boolean',
					//     readonly: true
					// }
				];
			};

			service.getListAsync = function getListAsync(groupCriterias) {
				let list = [
					// {Id:0,Select:true,Code:$translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo'), Structure: true , Description: $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo'), __rt$data:{ readonly:[{field: 'Select', readonly: true}]}},
				];
				let sortCodeLookupItems = $injector.get('projectStructuresSortCodeLookupService').getLookupItems();
				_.forEach(sortCodeLookupItems, function (item) {
					item.Structure = false;
					list.push(item);
				});
				if(groupCriterias.length > 0){
					_.forEach(list, function(item){
						item.Select = !!_.find(groupCriterias, function(criteria){ return criteria.Code === item.Code || item.Code === $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo');});
					});
				}

				let defer = $q.defer();
				defer.resolve(list);
				return defer.promise;
			};

			service.getItemByIdAsync = function getItemByIdAsync() {
				let defer = $q.defer();
				defer.resolve({Id:1,Filter:1,Code:'SortCode1'});
				return defer.promise;
			};


			return service;
		}]);
})();
