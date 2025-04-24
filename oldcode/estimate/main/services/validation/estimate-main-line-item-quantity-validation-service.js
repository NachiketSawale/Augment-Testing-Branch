/**
 * Created by joshi on 14.03.2017.
 */

(function () {
	/* global moment, _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemQuantityValidationService
	 * @description provides validation methods for estimate lineitem quantity instances
	 */
	angular.module(moduleName).factory('estimateMainLineItemQuantityValidationService',
		['$http', '$q', '$injector', 'platformDataValidationService',
			'platformRuntimeDataService','estimateMainLineItemQuantityService',

			function ($http, $q, $injector, platformDataValidationService,
				platformRuntimeDataService, estimateMainLineItemQuantityService) {

				let service = {
					validateQuantityTypeFk : validateQuantityTypeFk,
					validateDate : validateDate,
					validateQuantity : validateQuantity
				};

				function validateQuantityTypeFk(entity, value, model) {
					if(!platformDataValidationService.isEmptyProp(value)){
						entity.QuantityTypeFk = value;
						$injector.get('estimateMainLineItemQuantityProcessor').processItem(entity);
						let date = moment.isMoment(entity.Date) ? entity.Date : moment.utc(entity.Date);
						return  date.isValid()? validateDate(entity, entity.Date, 'Date') : true;
					}else{
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainLineItemQuantityService);
					}
				}

				function validateDate(entity, value, model) {
					let date = moment.isMoment(value) ? value : moment.utc(value);
					if (!date.isValid()) {
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.ERROR_TYPE_DATE',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainLineItemQuantityService);
					}else {
						let list = estimateMainLineItemQuantityService.getList();
						let entityDate = moment(date).format('L');
						let matchItem = _.filter(list, function(item){
							let itemDate = moment(item.Date).format('L');
							return item.Id !== entity.Id && entityDate.indexOf(itemDate) >= 0 && item.QuantityTypeFk  === entity.QuantityTypeFk;
						});
						if(matchItem && matchItem.length){
							return platformDataValidationService.finishValidation({
								valid: false,
								apply: true,
								error: '...',
								error$tr$: 'cloud.common.entityDateRejected',
								error$tr$param: {}
							}, entity, value, model, service, estimateMainLineItemQuantityService);
						}else{
							return platformDataValidationService.finishValidation({
								valid: true
							}, entity, value, model, service, estimateMainLineItemQuantityService);
						}
					}
				}

				function validateQuantity(entity, value, model) {
					if(!platformDataValidationService.isEmptyProp(value)){
						if(entity.QuantityTypeFk){
							let date = moment.isMoment(entity.Date) ? entity.Date : moment.utc(entity.Date);
							return  date.isValid()? validateDate(entity, entity.Date, 'Date') : true;
						}else{
							return platformDataValidationService.finishValidation({
								valid: true,
								apply: true
							}, entity, value, model, service, estimateMainLineItemQuantityService);
						}

					}else{
						return platformDataValidationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param: {}
						}, entity, value, model, service, estimateMainLineItemQuantityService);
					}
				}

				return service;
			}
		]);
})();
