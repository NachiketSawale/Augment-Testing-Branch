/**
 * Created by sandu on 05.11.2015.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.user').factory('usermanagementUserModifyProcessor', usermanagementUserModifyProcessor);
	usermanagementUserModifyProcessor.$inject = ['platformRuntimeDataService', 'moment', '$translate'];

	function usermanagementUserModifyProcessor(platformRuntimeDataService, moment, $translate) {
		var fieldsDefault = [
			{field: 'Password', readonly: true},
			{field: 'ConfirmPassword', readonly: true},
			{field: 'IsPasswordChangeNeeded', readonly: true}
		];

		var fieldsDefaultFalse = [
			{field: 'Password', readonly: false},
			{field: 'ConfirmPassword', readonly: false},
			{field: 'IsPasswordChangeNeeded', readonly: false}
		];

		var service = {};
		var getPropertiesWithReadonly = function (readonly) {
			var properties = [
				{
					field: 'Name',
					readonly: readonly
				},
				{
					field: 'Description',
					readonly: readonly
				},
				{
					field: 'LogonName',
					readonly: readonly
				},
				{
					field: 'Email',
					readonly: readonly
				},
				{
					field: 'State',
					readonly: readonly
				},
				{
					field: 'IntegratedAccess',
					readonly: readonly
				},
				{
					field: 'ExplicitAccess',
					readonly: readonly
				},
				{
					field: 'Password',
					readonly: readonly
				},
				{
					field: 'ConfirmPassword',
					readonly: readonly
				},
				{
					field: 'IsPasswordChangeNeeded',
					readonly: readonly
				}
			];

			return properties;
		};

		var getReadonlyPropertiesWithIsProtected = function (readonly) {
			return [
				{
					field: 'IntegratedAccess',
					readonly: readonly
				},
				{
					field: 'LogonName',
					readonly: readonly
				},
				{
					field: 'IsExternal',
					readonly: readonly
				},
				{
					field: 'State',
					readonly: readonly
				}
			];
		};

		function hasWhiteSpace(text) {
			return text.indexOf(' ') >= 0;
		}

		service.processItem = function processItem(items) {

			if (items.IsExternal) {
				items.ExplicitAccess = false;
				items.IsPasswordChangeNeeded = false;
				var properties = getPropertiesWithReadonly(true);
				platformRuntimeDataService.readonly(items, properties);
			} else {
				var properties = getPropertiesWithReadonly(false);
				platformRuntimeDataService.readonly(items, properties);
			}

			if (items.ExplicitAccess === false) {
				platformRuntimeDataService.readonly(items, fieldsDefault);
			} else {
				platformRuntimeDataService.readonly(items, fieldsDefaultFalse);
			}
			if (items.SynchronizeDate) {
				items.SynchronizeDate = moment(items.SynchronizeDate);// format not finished
			}
			if(items.LoginAllowedFrom){
				items.LoginAllowedFrom = moment(items.LoginAllowedFrom);
			}
			if(items.LoginAllowedTo){
				items.LoginAllowedTo = moment(items.LoginAllowedTo);
			}
			if (items.DomainSID) {
				var fields = [{
					field: 'LogonName',
					readonly: true
				}];
				platformRuntimeDataService.readonly(items, fields);
			}

			if (items.DisabledHint) {
				if (items.DisabledHint !== '' && !hasWhiteSpace(items.DisabledHint)) {
					items.DisabledHint = $translate.instant(items.DisabledHint);
				}
			}

			var protectedProperties = getReadonlyPropertiesWithIsProtected(items.IsProtected);
			platformRuntimeDataService.readonly(items, protectedProperties);

			if(items.IsAnonymized) {
				platformRuntimeDataService.readonly(items, true);
			}

		};
		return service;
	}
})(angular);
