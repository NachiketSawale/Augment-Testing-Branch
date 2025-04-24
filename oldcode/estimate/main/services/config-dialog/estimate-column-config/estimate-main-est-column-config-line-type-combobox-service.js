/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstColumnConfigLineTypeComboboxService
	 * @function
	 * @requires $q, basicsLookupdataLookupDescriptorService
	 * @description
	 * #
	 *  data service for column config line type lookup.
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigLineTypeComboboxService', [
		'_', '$q', 'basicsLookupdataLookupDescriptorService',
		function (_, $q, lookupDescriptorService) {

			let lookupType = 'getlinetypes';
			let service = {
				setList: setList,
				getItemById: getItemById,
				getList: getList,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey: getItemByKey
			};

			function setList() {

				let list = [];

				list = [
					{'Id':1,'ShortKeyInfo':{'Description':'C','DescriptionTr':null,'DescriptionModified':false,'Translated':'C','VersionTr':0,'Modified':false,'OtherLanguages':null},'DescriptionInfo':{'Description':'CostCodes','DescriptionTr':50,'DescriptionModified':false,'Translated':'CostCodes','VersionTr':0,'Modified':false,'OtherLanguages':null},'Sorting':1,'IsDefault':true,'IsLive':true,'InsertedAt':'2015-01-14T00:00:00Z','InsertedBy':1,'UpdatedAt':null,'UpdatedBy':null,'Version':1,'EstResourceEntities':null},
					{'Id':2,'ShortKeyInfo':{'Description':'M','DescriptionTr':null,'DescriptionModified':false,'Translated':'M','VersionTr':0,'Modified':false,'OtherLanguages':null},'DescriptionInfo':{'Description':'Material','DescriptionTr':null,'DescriptionModified':false,'Translated':'Material','VersionTr':0,'Modified':false,'OtherLanguages':null},'Sorting':2,'IsDefault':false,'IsLive':true,'InsertedAt':'2015-01-16T00:00:00Z','InsertedBy':1,'UpdatedAt':null,'UpdatedBy':null,'Version':1,'EstResourceEntities':null}];

				let responseData = {};
				responseData = list;
				lookupDescriptorService.attachData({'getlinetypes':responseData});
			}
			function getList() {
				let defer = $q.defer();
				defer.resolve(_.values(lookupDescriptorService.getData(lookupType)));

				return defer.promise;
			}
			function getItemByKey(key) {
				return lookupDescriptorService.getLookupItem(lookupType, key);
			}

			function getItemById(id) {
				return getItemByKey(id);
			}
			function getItemByIdAsync(id) {
				let defer = $q.defer();
				defer.resolve(getItemByKey(id));
				return defer.promise;
			}

			// init
			setList();

			return service;

		}
	]);
})(angular);

