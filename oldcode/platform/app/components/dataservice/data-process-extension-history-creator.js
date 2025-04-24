/*
 * $Id: data-process-extension-history-creator.js 575729 2020-02-07 18:42:43Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformDataProcessExtensionHistoryCreator
	 * @function
	 *
	 * @description
	 * The platformDataProcessExtensionHistoryCreator converts date strings into real date variables.
	 */
	angular.module('platform').factory('platformDataProcessExtensionHistoryCreator', platformDataProcessExtensionHistoryCreator);

	platformDataProcessExtensionHistoryCreator.$inject = ['moment', '_', '$timeout', '$q', 'platformUserInfoService'];

	function platformDataProcessExtensionHistoryCreator(moment, _, $timeout, $q, platformUserInfoService) {
		const processor = {};
		let workItems = [];
		let deferred = null;

		function applyHistory(item) {
			const insertDef = item.Version === 0 || item.InsertedBy === 0;
			const history = item.__rt$data.history;

			history.insertedAt = insertDef ? '' : moment(item.InsertedAt).format('L | LTS');
			history.inserted = insertDef ? '' : (history.insertedAt + ' (' + platformUserInfoService.logonName(item.InsertedBy) + ')');
			history.insertedBy = insertDef ? '' : platformUserInfoService.logonName(item.InsertedBy);
			history.updatedAt = !item.UpdatedAt ? '' : moment(item.UpdatedAt).format('L | LTS');
			history.updated = !item.UpdatedBy ? '' : (history.updatedAt + ' (' + platformUserInfoService.logonName(item.UpdatedBy) + ')');
			history.updatedBy = !item.UpdatedBy ? '' : platformUserInfoService.logonName(item.UpdatedBy);
		}

		processor.processItem = function processItem(item) {
			if (_.has(item, 'InsertedBy')) {
				if (!item.__rt$data) {
					item.__rt$data = {};
				}

				// if work items empty, register a timeout function that will be called after all items are inserted in work items array
				if (!workItems.length) {
					deferred = $q.defer();

					$timeout(function () {
						const items = workItems;

						workItems = [];

						// extract user ids from UpdatedBy and InsertedBy properties and remove duplicates
						const userIds = _.compact(_.union(_.map(items, 'InsertedBy'), _.map(items, 'UpdatedBy')));

						// load user's logon name for given user ids
						platformUserInfoService.loadUsers(userIds)
							.then(function () {
								// process items and set logon name in rt$data.history for binding in grid and form
								_.each(items, applyHistory);

								deferred.resolve();
							});
					}, 0);
				}

				item.__rt$data.history = {};

				if (platformUserInfoService.isLoaded(item.InsertedBy) && platformUserInfoService.isLoaded(item.UpdatedBy)) {
					applyHistory(item);
				} else {
					const insertDef = item.Version === 0 || item.InsertedBy === 0;
					const history = item.__rt$data.history;

					history.insertedAt = insertDef ? null : moment(item.InsertedAt).format('L | LTS');
					history.inserted = history.insertedAt;
					history.insertedBy = deferred.promise;
					history.updatedAt = !item.UpdatedAt ? '' : moment(item.UpdatedAt).format('L | LTS');
					history.updated = history.updatedAt;
					history.updatedBy = deferred.promise;
				}

				// push item to workitem list
				workItems.push(item);
			}
		};

		return processor;
	}
})(angular);