/**
 * Created by nitsche on 19.06.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordRuntimeService
	 * @description provides validation methods for logistic dispatching record entities
	 */
	angular.module(moduleName).service('logisticDispatchingRecordRuntimeService', LogisticDispatchingRecordRuntimeService);

	LogisticDispatchingRecordRuntimeService.$inject = ['_'];

	function LogisticDispatchingRecordRuntimeService(_) {
		var self = this;
		self.lockProductFk = function lockProductFk (entity) {
			if(!_.isUndefined(entity.__rt$data)){
				entity.__rt$data.DoNotDeleteProductFk = true;
			}
			else{
				entity.__rt$data = {DoNotDeleteProductFk : true};
			}
		};
		self.isProductFkRemaining = function isProductFkRemaining(entity) {
			var isProductFkRemaining = !_.isUndefined(entity.__rt$data)&&!_.isUndefined(entity.__rt$data.DoNotDeleteProductFk)? entity.__rt$data.DoNotDeleteProductFk : false;
			self.unreleaseProductFk(entity);
			return isProductFkRemaining;
		};

		self.unreleaseProductFk = function unreleaseProductFk(entity) {
			if(!_.isUndefined(entity.__rt$data)&&!_.isUndefined(entity.__rt$data.DoNotDeleteProductFk)){
				entity.__rt$data.DoNotDeleteProductFk = false;
			}
		};
	}
})(angular);