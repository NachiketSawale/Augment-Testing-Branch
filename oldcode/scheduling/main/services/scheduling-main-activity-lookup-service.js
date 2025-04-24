/**
 * Created by sprotte on 09.06.2016.
 */
/**
 *
 * @ngdoc service
 * @name scheduling.main.ActivityLookupService
 * @function
 * @requires platformSchemaService
 *
 * @description
 * #ActivityLookupService
 * Provides data for the activity property lookup control. The module needs to be loaded first before using this lookup.
 */
/* jshint -W072 */ // many parameters because of dependency injection
angular.module('scheduling.main').factory('schedulingMainActivityLookupService', ['$q', '$injector', 'platformSchemaService', 'platformLookupDataServiceFactory',
	function ($q, $injector, schemaservice, servicefactory) {
		'use strict';

		var domainSchema;

		var service = servicefactory.createInstance({dataAlreadyLoaded: true}).service;

		service.getList = getList;

		service.getSearchList = getList;

		service.getDefault = function () {
			if (!domainSchema) {
				getList();
			}
			return domainSchema[0];
		};

		service.getItemByKey = function () {

		};

		service.instantList = instantList;

		function instantList() {
			var info = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
			return info.layout.columns
				.filter(function (item) { // filter out types we do not handle anyway
					return item.formatter !== 'action' &&
						item.formatter !== 'colorpicker' &&
						item.formatter !== 'color' &&
						item.formatter !== 'image' &&
						item.formatter !== 'select' &&
						item.formatter !== 'imageselect';
				})
				.map(function (item) {
					return {
						'key': item.field,
						'formatter': item.formatter,
						'description': item.name,
						'id': item.id
					};
				});
		}

		// do NOTHING to disable refresh
		service.resetCache = function () {
			var deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		};

		return service;

		function getList() { // some consumers may expect a promise
			var deferred = $q.defer();
			deferred.resolve(instantList());
			return deferred.promise;
		}
	}]);

