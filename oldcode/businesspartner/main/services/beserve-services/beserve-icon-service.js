/**
 * Created by rei on 10.2.2016
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * baseService function, this functions the derived service with common functionality.
	 * @param icons           array of icosn with {id, url, tooltip} property
	 * @param derivedService  the service to be extened with functionality
	 * @param $translate      translation service
	 */
	function baseService(icons, derivedService, $translate) {

		/**
		 * return the property from the item, default we return status
		 * can be overriden
		 * @param item
		 * @returns {*}
		 */
		function getItem(item) {
			return item.status;
		}

		/**
		 * @ngdoc function
		 * @name select
		 * @function
		 * @methodOf derived service
		 * @description get the specified icon url via icon id. Just for the compatibility to the old services
		 * @param {object} item indicates the identifier of image
		 * @return {string} image resource, that means css class or URL
		 */
		function select(item) {
			if (item) {
				var f = _.find(icons, {id: derivedService.getItem(item)});
				return f ? f.url : '';
			}
			return '';
		}

		/**
		 * @ngdoc function
		 * @name selectTooltip
		 * @function
		 * @methodOf derived service
		 * @description get the specified tooltip to an item
		 * @param {object} item represents the entity containing preoperty status
		 * @return {string} tooltip
		 */
		function selectTooltip(item) {
			if (item) {
				var f = _.find(icons, {id: derivedService.getItem(item)});
				return f ? $translate.instant(f.tooltip) : '';
			}
			return '';
		}

		derivedService.getItem = getItem;
		derivedService.select = select;
		derivedService.selectTooltip = selectTooltip;
	}

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).service('businesspartnerMainBeserveAddIconService', businesspartnerMainBeserveAddIconService);
	businesspartnerMainBeserveAddIconService.$inject = ['$translate'];

	function businesspartnerMainBeserveAddIconService($translate) {
		// resulttype
		// 1 new         not already retrieved/bought
		// 2 exists      as business partner (100% match)
		// 3 historical  previous entry of this company
		// 4 exists/historicals business partner (100% match)
		var icons = [
			{
				id: 1,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo4-1',
				tooltip: 'businesspartner.main.crefostatusicon.importok'
			},
			{
				id: 2,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo5-1',
				tooltip: 'businesspartner.main.crefostatusicon.alreadythere'
			},
			{
				id: 3,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo4-3',
				tooltip: 'businesspartner.main.crefostatusicon.historical'
			},
			{
				id: 4,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo5-3',
				tooltip: 'businesspartner.main.crefostatusicon.historicalinactive'
			},
			{
				id: 5,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo6-1',
				tooltip: 'businesspartner.main.crefostatusicon.alreadytherematchbycrefo'
			},
			{
				id: 6,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo6-1',
				tooltip: 'businesspartner.main.crefostatusicon.otherduplicatedatafound'
			}
		];

		/**
		 * return the property from the item, default we return status my overriden function
		 * @param item
		 * @returns {*}
		 */
		function getMyItem(item) {
			return item.resulttype;
		}

		baseService(icons, this, $translate);// jshint ignore:line
		this.getItem = getMyItem;// jshint ignore:line

		return this;// jshint ignore:line
	}

	/**
	 * @ngdoc service
	 * @name businesspartnerMainBeserveResultIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('businesspartnerMainBeserveResultIconService', businesspartnerMainBeserveResultIconService);
	businesspartnerMainBeserveResultIconService.$inject = ['$translate'];

	function businesspartnerMainBeserveResultIconService($translate) {
		var icons = [
			{
				id: 1,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo2',
				tooltip: 'businesspartner.main.crefostatusicon.nochanges'
			},
			{
				id: 2,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo3',
				tooltip: 'businesspartner.main.crefostatusicon.changes'
			},
			{
				id: 3,
				url: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-crefo1',
				tooltip: 'businesspartner.main.crefostatusicon.notfound'
			}
		];

		/**
		 * return the property from the item, default we return status my overriden function
		 * @param item
		 * @returns {*}
		 */
		function getMyItem(item) {
			return item.resulttype;
		}

		baseService(icons, this, $translate); // jshint ignore:line
		this.getItem = getMyItem;// jshint ignore:line

		return this;// jshint ignore:line
	}

})();
