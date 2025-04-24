/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstCostcodeAddSubtractComboboxService
	 * @function
	 * @requires $q, basicsLookupdataLookupDescriptorService
	 * @description
	 * #
	 *  data service for  add and subtract lookup.
	 */
	angular.module(moduleName).factory('estimateMainEstCostcodeAddSubtractComboboxService', [
		'$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, lookupDescriptorService) {

			let lookupType = 'getaddsubtracts';
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
					{'Id':1,'ShortKeyInfo':{'Description':'+addition','DescriptionTr':null,'DescriptionModified':false,'Translated':'+','VersionTr':0,'Modified':false,'OtherLanguages':null},'DescriptionInfo':{'Description':'addition','DescriptionTr':50,'DescriptionModified':false,'Translated':'addition','VersionTr':0,'Modified':false,'OtherLanguages':null},'Sorting':1,'IsDefault':true,'IsLive':true,'InsertedAt':'2015-01-14T00:00:00Z','InsertedBy':1,'UpdatedAt':null,'UpdatedBy':null,'Version':1},
					{'Id':2,'ShortKeyInfo':{'Description':'-subtraction','DescriptionTr':null,'DescriptionModified':false,'Translated':'-','VersionTr':0,'Modified':false,'OtherLanguages':null},'DescriptionInfo':{'Description':'subtraction','DescriptionTr':null,'DescriptionModified':false,'Translated':'subtraction','VersionTr':0,'Modified':false,'OtherLanguages':null},'Sorting':2,'IsDefault':false,'IsLive':true,'InsertedAt':'2015-01-14T00:00:00Z','InsertedBy':1,'UpdatedAt':null,'UpdatedBy':null,'Version':1}];

				let responseData = {};
				responseData = list;
				lookupDescriptorService.attachData({'getaddsubtracts':responseData});
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
