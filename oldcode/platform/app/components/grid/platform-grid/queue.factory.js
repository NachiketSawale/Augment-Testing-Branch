(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGridApp.queue
	 * @description
	 * # queue
	 * Factory in the platformGridApp.
	 */
	angular
		.module('platform')
		.factory('queue', queue);

	queue.$inject = ['$log', '_'];

	function queue($log, _) {
		var jobs = [];

		var service = {
			add: add,
			remove: remove,
			process: process,
			shutdown: shutdown
		};
		return service;

		/**
		 * @name add
		 * @description Adds a new job into the job queue
		 * @param {object} data object
		 */
		function add(data) {
			jobs.push(data);
		}

		/**
		 * @name remove
		 * @description Remove jobs
		 * @param  {string} id   uuid
		 * @memberOf queue
		 */
		function remove(id, key) {
			jobs.forEach((job, idx) => {
				if (job.id === id && job.key === key) {
					jobs.splice(idx, 1);
				}
			});
		}

		/**
		 * @name process
		 * @description Process jobs and remove them from job queue
		 * @param {object} obj Object
		 * @memberOf queue
		 */
		function process(obj) {
			_.each(_.filter(jobs,
					function (job) {
						return job.id === obj.id;
					}), function (item) {
					obj[item.eventObject][item.key][item.type](item.fn);
				}
			);

			jobs = _.filter(jobs, function (job) {
				return job.id !== obj.id;
			});
		}

		/**
		 * shutdown
		 * @description shutdown job queue
		 * @memberOf queue
		 */
		function shutdown() {
			$log.info(queue.name + ': Method ' + shutdown.name + ' is not implemented yet.');
		}

	}
})();
