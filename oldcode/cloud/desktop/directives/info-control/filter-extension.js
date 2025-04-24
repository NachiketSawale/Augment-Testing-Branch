/**
 * Created by wui on 7/7/2015.
 * @description used in info-control, filter data from data service.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').factory('CloudDesktopInfoFilterExtension', [
		function () {
			return function CloudDesktopInfoFilterExtension(dataSource, filterFn) {

				var self = this, dataList = [], selectedItem = null, onSelectionChanged = new Platform.Messenger();

				self.getSelected = function () {
					return selectedItem;
				};

				self.setSelected = function (dataItem) {
					selectedItem = dataItem;
					onSelectionChanged.fire();
				};

				self.setData = function (data) {
					dataList = data.filter(filterFn); // do filter.
					self.setSelected(dataList.length ? dataList[0] : null);
				};

				self.getData = function () {
					return dataList;
				};

				self.registerSelectionChanged = function (fn) {
					onSelectionChanged.register(fn);
				};

				self.unregisterSelectionChanged = function (fn) {
					onSelectionChanged.unregister(fn);
				};

				self.goToPrev = function () {
					if (!dataList.length) { // not array or empty array
						return;
					}
					var index = dataList.indexOf(selectedItem) - 1;
					if (index >= 0 && index < dataList.length) {
						self.setSelected(dataList[index]);
					}
				};

				self.goToNext = function () {
					if (!dataList.length) { // not array or empty array
						return;
					}
					var index = dataList.indexOf(selectedItem) + 1;
					if (index >= 0 && index < dataList.length) {
						self.setSelected(dataList[index]);
					}
				};

				self.disablePrev = function () {
					if (!dataList.length) { // not array or empty array
						return true;
					}
					var index = dataList.indexOf(selectedItem) - 1;
					return !(index >= 0 && index < dataList.length);
				};

				self.disableNext = function () {
					if (!dataList.length) { // not array or empty array
						return true;
					}
					var index = dataList.indexOf(selectedItem) + 1;
					return !(index >= 0 && index < dataList.length);
				};

				if (angular.isArray(dataSource)) { // data source is an array.
					self.setData(dataSource);
				} else { // data source is data service.
					dataSource.registerListLoaded(function () {
						self.setData(dataSource.getList());
					});
				}
			};
		}
	]);

})(angular);