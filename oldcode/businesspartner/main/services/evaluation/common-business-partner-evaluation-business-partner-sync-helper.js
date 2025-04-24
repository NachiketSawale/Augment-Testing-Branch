/**
 * Created by wed on 1/10/2019.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationBusinessPartnerSyncHelper', [function () {

		function SyncProvider(syncOptions) {

			this._options = angular.extend({
				evaluationModificationKeeper: null,
				senderName: '',
				evaluationTreeService: null,
				createCompleteFn: angular.noop,
				updateCompleteFn: angular.noop,
				deleteCompleteFn: angular.noop,
				listLoadedFn: angular.noop,
				businessPartnerProvideFn: angular.noop
			}, syncOptions);

		}

		SyncProvider.prototype.__syncDelete = function (removeEntities, isRefreshGrid, isReappraise, completeInfo) {
			var removeResult = this._options.evaluationTreeService.syncDelete(removeEntities, isRefreshGrid, isReappraise);
			if (removeResult) {
				this._options.deleteCompleteFn(completeInfo);
			}
		};

		SyncProvider.prototype.__syncCreate = function (createEvaluation, isRefreshGrid, isReappraise, completeInfo) {
			var selectedItem = this._options.businessPartnerProvideFn();
			if (selectedItem && selectedItem.Id === createEvaluation.BusinessPartnerFk) {
				var createResult = this._options.evaluationTreeService.syncCreate(createEvaluation, isRefreshGrid, isReappraise);
				if (createResult) {
					this._options.createCompleteFn(completeInfo);
				}
			}
		};

		SyncProvider.prototype.__syncUpdate = function (updateEvaluation, isRefreshGrid, isReappraise, completeInfo) {
			var evaluations = this._options.evaluationTreeService.getList(), target = _.find(evaluations, function (item) {
				return item.Id === updateEvaluation.Id;
			});
			if (target) {
				var updateResult = this._options.evaluationTreeService.syncUpdate(updateEvaluation, isRefreshGrid, isReappraise);
				if (updateResult) {
					this._options.updateCompleteFn(completeInfo);
				}
			} else {
				var selectedItem = this._options.businessPartnerProvideFn();
				if (selectedItem && selectedItem.Id === updateEvaluation.BusinessPartnerFk) {
					this.__syncCreate(updateEvaluation, isRefreshGrid, isReappraise, completeInfo);
				}
			}
		};

		SyncProvider.prototype.evaluationChangedSyncHandler = function (args) {

			if (args.eventName === 'DELETE') {
				var removeEntities = args.data.entities;
				if (args.senderName === this._options.senderName) {
					this._options.evaluationModificationKeeper.delete(removeEntities);
					this._options.deleteCompleteFn({origin: 'EvaluationChanged'});
				} else {
					this.__syncDelete(removeEntities, true, true, {origin: 'EvaluationChanged'});
				}
			}

			if (args.eventName === 'CREATE') {
				var createEvaluation = args.data.evaluation;
				if (args.senderName === this._options.senderName) {
					this._options.evaluationModificationKeeper.create(createEvaluation);
					this._options.createCompleteFn({origin: 'EvaluationChanged'});
				} else {
					this.__syncCreate(createEvaluation, true, true, {origin: 'EvaluationChanged'});
				}
			}

			if (args.eventName === 'UPDATE') {
				var updateEvaluation = args.data.evaluation;
				if (args.senderName === this._options.senderName) {
					this._options.evaluationModificationKeeper.update(updateEvaluation);
					this._options.updateCompleteFn({origin: 'EvaluationChanged'});
				} else {
					this.__syncUpdate(updateEvaluation, true, true, {origin: 'EvaluationChanged'});
				}
			}
		};

		SyncProvider.prototype.listLoadedSyncHandler = function () {

			var context = this;
			var removeEntities = this._options.evaluationModificationKeeper.queryDelete(),
				createEntities = this._options.evaluationModificationKeeper.queryCreate(),
				updateEntities = this._options.evaluationModificationKeeper.queryUpdate();

			_.each(createEntities, function (item) {
				context.__syncCreate(item, false, false, {origin: 'ListLoaded'});
			});
			_.each(updateEntities, function (item) {
				context.__syncUpdate(item, false, false, {origin: 'ListLoaded'});
			});
			_.each(removeEntities, function (item) {
				context.__syncDelete([item], false, false, {origin: 'ListLoaded'});
			});

			this._options.evaluationTreeService.reappraise(true);
			this._options.listLoadedFn();
		};

		return {
			createSyncProvider: function (syncOptions) {
				return new SyncProvider(syncOptions);
			}
		};
	}]);

})(angular);