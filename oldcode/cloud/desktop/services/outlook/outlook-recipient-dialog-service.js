/**
 * Created by miu on 10/24/2023.
 */
(function(angular){
	'use strict';

	let moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOutlookRecipientDialogService', cloudDesktopOutlookRecipientDialogService);

	cloudDesktopOutlookRecipientDialogService.$inject = ['_', '$q', '$http', 'globals', '$translate', 'cloudCommonGridService'];

	function cloudDesktopOutlookRecipientDialogService(_, $q, $http, globals, $translate, cloudCommonGridService) {
		let service = {};

		let lookupData = {
			recipients: []
		};

		service.setRecipients = setRecipients;
		service.getList = getList;
		service.getListAsync = getListAsync;
		service.getItemById = getItemById;
		service.getItemByIdAsync = getItemByIdAsync;
		service.getSearchList = getSearchList;
		service.loadData = loadData;
		service.clearData = clearData;
		return service;

		// ///////////////////////////
		function getList() {
			return lookupData.recipients || [];
		}

		function setRecipients(values) {
			lookupData.recipients = values;
		}

		function getListAsync(options, scope) {
			if (!lookupData.loadDatapromise) {
				lookupData.loadDatapromise = $http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/listoutlookrecipient');
			}
			return lookupData.loadDatapromise.then(function (response) {
				lookupData.loadDatapromise = null;
				lookupData.recipients = doProcessData(response.data);
				return lookupData.recipients;
			});
		}

		function getItemById(id) {
			return getById(id);
		}

		function getItemByIdAsync(id) {
			if (!lookupData.loadDatapromise) {
				lookupData.loadDatapromise = getListAsync();
			}

			return lookupData.packageBoqItemsPromise.then(function(){
				lookupData.packageBoqItemsPromise = null;
				return getById(id);
			});
		}

		function getById(id) {
			let item = {};
			let list = lookupData.recipients;
			if (list && list.length > 0) {
				item = _.find(list, {Id: id});
			}

			return item && angular.isDefined(item.Id) ? item : null;
		}

		function getSearchList(value, displayMember, scope, getSearchListSettings) {
			clearData();
			if (value && getSearchListSettings && !getSearchListSettings.searchString.endsWith(';')) {
				if (getSearchListSettings.searchString.indexOf(';') > -1) {
					let strList = getSearchListSettings.searchString.split(';');
					let searchString = strList[strList.length - 1];
					if (searchString) {
						value = value.replaceAll(getSearchListSettings.searchString, searchString);
					}
				}
				if (!lookupData.loadDatapromise) {
					lookupData.loadDatapromise = $http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/listoutlookrecipient?filterValue=' + value);
				}
				return lookupData.loadDatapromise.then(function (response) {
					lookupData.loadDatapromise = null;
					lookupData.recipients = doProcessData(response.data);
					return lookupData.recipients;
				});
			} else {
				return $q.when([]);
			}
		}

		function loadData(scope) {
			if (!lookupData.loadDatapromise) {
				lookupData.loadDatapromise = $http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/listoutlookrecipient');
			}
			return lookupData.loadDatapromise.then(function (response) {
				lookupData.loadDatapromise = null;
				lookupData.recipients = doProcessData(response.data);
				return lookupData.recipients;
			});
		}

		function clearData() {
			lookupData.recipients = [];
		}

		function doProcessData(data){
			return _.forEach(data, function (item, index) {
				item['Id'] = index + 1;
			});
		}

		function getList(){
			let result = lookupData.recipients && lookupData.recipients.length ? lookupData.recipients : [];
			return $q.when(angular.copy(result));
		}
	}
})(angular);