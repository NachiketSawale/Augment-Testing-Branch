/**
 * Created by xia on 2/19/2016.
 */
(function(){
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainColumnDefineService',function(){
		let service = {};
		service.data = [
			{
				id : 1,
				name : 'quantity',
				field : 'Quantity',
				name$tr$ : 'estimate.main.quantity'
			},
			{
				id : 2,
				name : 'quantitydetail',
				field : 'QuantityDetail',
				name$tr$ : 'estimate.main.quantitydetail'
			},
			{
				id : 3,
				name : 'quantityfactordetail1',
				field : 'QuantityFactorDetail1',
				name$tr$ : 'estimate.main.quantityfactordetail1'
			},
			{
				id : 4,
				name : 'quantityfactordetail2',
				field : 'QuantityFactorDetail2',
				name$tr$ : 'estimate.main.quantityfactordetail2'
			},
			{
				id : 5,
				name : 'quantityfactor1',
				field : 'QuantityFactor1',
				name$tr$ : 'estimate.main.quantityfactor1'
			},
			{
				id : 6,
				name : 'quantityfactor2',
				field : 'QuantityFactor2',
				name$tr$ : 'estimate.main.quantityfactor2'
			},
			{
				id : 7,
				name : 'quantityfactor3',
				field : 'QuantityFactor3',
				name$tr$ : 'estimate.main.quantityfactor3'
			},
			{
				id : 8,
				name : 'quantityfactor4',
				field : 'QuantityFactor4',
				name$tr$ : 'estimate.main.quantityfactor4'
			},
			{
				id : 9,
				name : 'costfactordetail1',
				field : 'CostFactorDetail1',
				name$tr$ : 'estimate.main.costfactordetail1'
			},
			{
				id : 10,
				name : 'costfactordetail2',
				field : 'CostFactorDetail2',
				name$tr$ : 'estimate.main.costfactordetail2'
			},
			{
				id : 11,
				name : 'costfactor1',
				field : 'CostFactor1',
				name$tr$ : 'estimate.main.costfactor1'
			},
			{
				id : 12,
				name : 'costfactor2',
				field : 'CostFactor2',
				name$tr$ : 'estimate.main.costfactor2'
			},
			{
				id : 13,
				name : 'code',
				field : 'Code',
				name$tr$ : 'estimate.mian.code'
			},
			{
				id : 14,
				name : 'costunit',
				field : 'CostUnit',
				name$tr$ : 'estimate.main.costunit'
			},
			{
				id : 15,
				name : 'costunitlineitem',
				field : 'CostUnitLineItem',
				name$tr$ : 'estimate.main.costunitlineitem'
			},
			{
				id : 16,
				name : 'costunitsubitem',
				field : 'CostUnitSubItem',
				name$tr$ : 'estimate.main.costunitsubitem'
			}

		];
		service.getItemById = function(itemId){
			return _.find(service.data,{id:itemId});
		};
		service.getItemByName = function(itemName){
			return _.find(service.data,{name : itemName});
		};
		return service;
	});
})();
