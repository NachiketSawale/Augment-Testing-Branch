/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	/* global, _ */
	angular.module('estimate.main').directive('estimateMainDescriptionCriteriaComplexLookupOver', function (){
		return {
			restrict: 'A',
			template:
                '<div>' +
                '<div estimate-main-description-criteria-complex-lookup data-entity="entity" data-ng-model="entity.DescCriteriaOver"></div>' +
                '<input ng-model="entity.DescCriteria" title="{{entity.DescCriteria}}" style="position: relative;z-index: 100;background-color: white;width: calc(100% - 60px);height: 25px;line-height: 25px; padding-left: 5px; top: -26px; left: 2px; overflow:hidden;margin-bottom: -20px; border:0;outline: none"/>' +
                '</div>'
		};
	});

	angular.module('estimate.main').directive('estimateMainDescriptionCriteriaComplexLookup',
		['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainDescriptionCriteriaComplexService',
			function ($q, BasicsLookupdataLookupDirectiveDefinition, estimateMainDescriptionCriteriaComplexService){
				let configs = {
					lookupType: 'estimateMainDescriptionCriteriaComplexLookup',
					valueMember: 'Code',
					displayMember: 'Desc',
					showClearButton: true,
					events:[
						{
							name: 'onSelectedItemChanged',
							handler: function (e,args){
								let selectedDataItem = args.entity;
								if(args.selectedItem){
									selectedDataItem.DescCriteria = !selectedDataItem.DescCriteria ? args.selectedItem.Desc : selectedDataItem.DescCriteria + ' + ' + args.selectedItem.Desc;
								}
								else{
									selectedDataItem.DescCriteria = '';
								}
							}
						}
					]
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', configs, {
					dataProvider: {
						getList: function (){
							return $q.when(estimateMainDescriptionCriteriaComplexService.getList());
						},
						getItemByKey: function (key){
							return estimateMainDescriptionCriteriaComplexService.getItemByKey(key);
						},
						getSearchList: function (){
							return $q.when(estimateMainDescriptionCriteriaComplexService.getList());
						},
						getDisplayItem: function (value){
							return estimateMainDescriptionCriteriaComplexService.getItemByKey(value);
						}
					}
				});
			}]);

	angular.module('estimate.main').factory('estimateMainDescriptionCriteriaComplexService', ['_', '$translate',function (_, $translate){
		let list = [
			{Id:1, Code: 'wic', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.wicOutLineSpec'), groups:[1]},
			{Id:2, Code: 'lineItem', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.lineItemDesc'), groups:[0, 1, 16]},
			{Id:3, Code: 'structure', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.lineItemStruct'), groups:[16]},
			{Id:4, Code: 'sortCode01', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode01'), groups:[1]},
			{Id:6, Code: 'sortCode02', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode02'), groups:[1]},
			{Id:7, Code: 'sortCode03', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode03'), groups:[1]},
			{Id:8, Code: 'sortCode04', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode04'), groups:[1]},
			{Id:9, Code: 'sortCode05', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode05'), groups:[1]},
			{Id:10, Code: 'sortCode06', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode06'), groups:[1]},
			{Id:11, Code: 'sortCode07', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode07'), groups:[1]},
			{Id:12, Code: 'sortCode08', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode08'), groups:[1]},
			{Id:13, Code: 'sortCode09', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode09'), groups:[1]},
			{Id:14, Code: 'sortCode10', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortCode10'), groups:[1]},
			{Id:15, Code: 'sortDesc01', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc01'), groups:[1]},
			{Id:16, Code: 'sortDesc02', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc02'), groups:[1]},
			{Id:17, Code: 'sortDesc03', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc03'), groups:[1]},
			{Id:18, Code: 'sortDesc04', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc04'), groups:[1]},
			{Id:19, Code: 'sortDesc05', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc05'), groups:[1]},
			{Id:20, Code: 'sortDesc06', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc06'), groups:[1]},
			{Id:21, Code: 'sortDesc07', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc07'), groups:[1]},
			{Id:22, Code: 'sortDesc08', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc08'), groups:[1]},
			{Id:23, Code: 'sortDesc09', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc09'), groups:[1]},
			{Id:24, Code: 'sortDesc10', Desc: $translate.instant('estimate.main.generateProjectBoQsWizard.sortDesc10'), groups:[1]}
		];

		let service = {};

		service.getList = function (){
			// return _.filter(list, function (item){
			//     return item.groups.indexOf(groupType) >= 0;
			// });

			return list;
		};

		service.getItemByKey = function (key){
			return _.find(service.getList(), function (item){
				return item.Code.toLowerCase() === key.toLowerCase();
			});
		};

		service.getDescByKey = function (key){
			let item = service.getItemByKey(key);
			return item ? item.Desc : '';
		};

		service.convertDescStr2CodeStr = function (desc){
			if(!desc) {return '';}

			let all = service.getList();
			let descs = desc.split('+');
			_.forEach(descs, function (d){
				d = _.trim(d, ' ');
				let item = _.find(all, {Desc: d});
				if(!!item && !!item.Code){
					desc = desc.replace(d, '{'+item.Code+'}');
				}
			});

			return desc;
		};

		let groupType = 1;
		service.setCurrentGroupCriteria = function (type){
			groupType = type;
		};

		service.getCurrentGroupCriteria = function (){
			return groupType;
		};

		service.getDescDescByGroupCriteria = function (key){
			let descKey = key === 'SortCode1' ? 'sortDesc01'
				:key === 'SortCode2' ? 'sortDesc02'
					:key === 'SortCode3' ? 'sortDesc03'
						:key === 'SortCode4' ? 'sortDesc04'
							:key === 'SortCode5' ? 'sortDesc05'
								:key === 'SortCode6' ? 'sortDesc06'
									:key === 'SortCode7' ? 'sortDesc07'
										:key === 'SortCode8' ? 'sortDesc08'
											:key === 'SortCode9' ? 'sortDesc09'
												: key;
			
			return service.getDescByKey(descKey);
		};

		return service;

	}]);
})(angular);