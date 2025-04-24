/*
 * $Id: timekeeping-recording-input-form-controller.js 550216 2019-07-05 09:23:27Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	angular.module(moduleName).service('timekeepingRecordingInputFormInitializeService', TimekeepingRecordingInputFormInitializeService);

	TimekeepingRecordingInputFormInitializeService.$inject = ['_', '$q', 'timekeepingRecordingInputFormCrewService', 'timekeepingRecordingInputFormLayoutService'];

	function TimekeepingRecordingInputFormInitializeService(_, $q, timekeepingRecordingInputFormCrewService, timekeepingRecordingInputFormLayoutService) {
		var self = this;
		var data = {
			crew: {
				service: timekeepingRecordingInputFormCrewService,
				loadingPromise: null,
				loaded: false
			},
			layout: {
				service: timekeepingRecordingInputFormLayoutService,
				loadingPromise: null,
				loaded: false
			}
		};

		function takeOver(entities, to) {
			to.loaded = true;
			to.loadingPromise = null;
		}

		function loadTo(to) {
			if(to.loaded) {
				return $q.when(true);
			}

			if(!_.isNil(to.loadingPromise)) {
				return to.loadingPromise;
			}

			to.loadingPromise = to.service.load().then(function(entities) {
				takeOver(entities, to);

				return entities;
			});

			return to.loadingPromise;
		}

		this.hasCrewLoaded = function hasCrewLoaded() {
			return data.crew.loaded;
		};

		this.loadCrew = function loadCrew() {
			return loadTo(data.crew);
		};

		this.loadLayouts = function loadLayouts() {
			return loadTo(data.layout);
		};

		this.hasLayoutsLoaded = function hasLayoutsLoaded() {
			return data.layout.loaded;
		};

		this.loadComplete = function loadComplete() {
			return $q.all([self.loadCrew(), self.loadLayouts()]);
		};
	}
})(angular);
