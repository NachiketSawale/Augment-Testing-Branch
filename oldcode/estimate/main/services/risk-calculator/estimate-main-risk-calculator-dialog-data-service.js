/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainRiskCalulatorDialogDataService', [
		'$q', '$injector', '$http',
		'$translate', '$templateCache', 'platformUtilService',
		'PlatformMessenger',
		function ($q, $injector, $http, $translate, $templateCache, platformUtilService, PlatformMessenger) {

			let currentItem = {};
			let currentObject = {};

			let completeData = {};
			let isCurrentItemChangeFire = false;

			let service = {
				onCurrentItemChange: new PlatformMessenger(),
				onDataLoaded: new PlatformMessenger()
			};

			service.getCurrentItem = function () {
				return currentItem;
			};

			service.setCurrentItem = function (item) {
				currentItem = item;
			};

			service.getCurrentObject = function () {
				return currentObject;
			};
			service.setCurrentObject = function (item){
				service.currentItemChangeFire();
				currentObject = item;
				let qDefer = $q.defer();
				qDefer.resolve(currentObject);
				return qDefer.promise;
			};
			service.showDialog = function showDialog() {

			};
			service.getCompleteInitData = function() {
				return completeData;
			};

			service.currentItemChangeFire = function(){
				if(!isCurrentItemChangeFire && !(_.isEmpty(currentObject))) {
					service.onCurrentItemChange.fire(currentObject);
					isCurrentItemChangeFire = true;
				}
			};
			service.cleardata = function() {
				currentItem = {};
				completeData = {};
				currentObject = {};
				isCurrentItemChangeFire = false;
			};
			return service;
		}
	]);
})(angular);
