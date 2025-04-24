/**
 * Created by lja on 2015/11/25.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,Platform,_ */
	/**
	 * provide dataService for dependent data in sidebar info
	 *
	 * it need to provide the goToPrev goToNext disablePrev disablePrev function,
	 * if you want to use the slide in sidebar info
	 */
	angular.module(moduleName).factory('procurementCommonSideBarInfoDataServiceFactory', [function () {
		var Create = function (list) {

			if (!angular.isArray(list)) {
				throw new Error('dataSource type must be array!');
			}

			// noinspection JSUnresolvedVariable
			var dataSource, len, index, selectedItem,
				selectionChangedMessenger = new Platform.Messenger(),
				context,childrenData,dataSize;

			init(list);

			this.setContext = function (scope) {
				context = scope || this;
			};

			function init(list) {
				dataSource = distinctList(list);
				dataSize = list.length;
				len = dataSource.length;
				index = 0;
				selectedItem = dataSource[index];
			}
			function distinctList(list){
				var newlist = [];
				list.forEach(function(item){
					if(!_.find(newlist, {Targetfk: item.Targetfk})) {
						newlist.push(item);
					}
				});
				return newlist;
			}

			this.getSelected = function () {
				return selectedItem;
			};

			this.size = function () {
				return dataSize;
			};

			this.selectionChangedRegister = function (fn) {
				selectionChangedMessenger.register(fn);
			};

			this.unRegisterSelectionChanged = function (fn) {
				selectionChangedMessenger.unregister(fn);
			};

			this.goToPrev = function () {
				if (index - 1 < 0) {
					return;
				}

				index--;
				selectedItem = dataSource[index];
				selectionChangedMessenger.fire(null, null, context);
			};

			this.disablePrev = function () {
				return index <= 0;
			};

			this.goToNext = function () {
				if (index + 1 >= len) {
					return;
				}

				index++;
				selectedItem = dataSource[index];
				selectionChangedMessenger.fire(null, null, context);
			};

			this.disableNext = function () {
				return index >= (len - 1);
			};

			this.init = init;

			this.initChildren = function (childrenList) {
				childrenData = childrenList;
			};
			this.getChildrenData = function(){
				return _.filter(childrenData,function(item){ return item.TargetParentFk === selectedItem.Targetfk;});
			};
		};


		return {
			Create: Create
		};
	}]);
})(angular);