/*
 create by lnb
 2015/09/06
 TODO:for add an interceptor to dataService.
 When we call create and the generate default items(load default total(prc common), load default package2header(package))
 after created event fired.
 data-service-factory always call the selected changed event twice and call the list http method
 at the same time we call the created, we can't stop the list call, and do not known when the list call finished, when the
 list call returned by the server with an empty list, our created default will removed.
 Create this service just a workaround to make a solution to stop the list call to replace our created default with an empt
 list, it will be removed later only when there is a better solution or the list call not clear our new created items.
 */

(function (angular) {
	'use strict';

	var modelName = 'procurement.common';
	angular.module(modelName).factory('procurementCommonReadDataInterceptor', [
		function () {
			var service = {};
			service.init = function init(service, data) {
				var readDataQueue = [], lockReadData = false;
				var doReadData = data.doReadData;
				data.doReadData = function () {
					var promise = doReadData.apply(this, arguments);
					readDataQueue.push(promise);
					var removePromise = function () {
						var index = readDataQueue.indexOf(promise);
						readDataQueue.splice(index, 1);
					};
					var readDataDone = function readDataDone() {
						removePromise();
					};
					promise.then(readDataDone, readDataDone);
					setTimeout(function () {
						// always remove the promise from queue 5 second after
						removePromise();
					}, 5000);
				};
				var checkIsReadLock = function checkIsReadLock() {
					return lockReadData && readDataQueue.length;
				};
				var readSucceededHandler = data.onReadSucceeded;
				data.onReadSucceeded = function onReadSucceeded() {
					if (checkIsReadLock()) {
						return;
					}

					return readSucceededHandler.apply(this, arguments);
				};

				service.lockDataRead = function lockDataRead() {
					lockReadData = true;
					setTimeout(function () {
						// always remove lock after 2 seconds
						lockReadData = false;
					}, 5000);
				};
			};
			return service;
		}]);
})(angular);