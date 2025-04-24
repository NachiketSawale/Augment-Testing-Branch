/**
 * Created by wed on 1/9/2019.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('commonBusinessPartnerEvaluationModificationKeeper', [
		'_',
		function (_) {

			function Keeper(configOptions) {

				this._options = angular.extend({
					equals: function (a, b) {
						return a === b;
					}
				}, configOptions);

				this._modifications = [];

			}

			Keeper.prototype.__add = function (action, entities) {
				var modifications = this._modifications,
					mergeEntities = _.concat([], entities);
				_.each(mergeEntities, function (item) {
					modifications.push({
						action: action,
						value: item
					});
				});
			};

			Keeper.prototype.__query = function (predict) {
				var result = this._modifications;
				if (predict && angular.isFunction(predict)) {
					result = _.filter(this._modifications, predict);
				}
				return _.map(result, function (item) {
					return item.value;
				});
			};

			Keeper.prototype.create = function (entities) {
				this.__add('CREATE', entities);
			};

			Keeper.prototype.update = function (entities) {
				this.__add('UPDATE', entities);
			};

			Keeper.prototype.delete = function (entities) {
				this.__add('DELETE', entities);
			};

			Keeper.prototype.queryCreate = function () {
				return this.__query(function (item) {
					return item.action === 'CREATE';
				});
			};

			Keeper.prototype.queryUpdate = function () {
				return this.__query(function (item) {
					return item.action === 'UPDATE';
				});
			};

			Keeper.prototype.queryDelete = function () {
				return this.__query(function (item) {
					return item.action === 'DELETE';
				});
			};

			Keeper.prototype.clear = function () {
				this._modifications.length = 0;
			};

			Keeper.prototype.has = function (value) {
				var equalsFn = this._options.equals;
				return !!_.find(this._modifications, function (item) {
					return equalsFn(value, item);
				});
			};

			return {
				createKeeper: function (configOptions) {
					return new Keeper(configOptions);
				}
			};

		}]);
})(angular);