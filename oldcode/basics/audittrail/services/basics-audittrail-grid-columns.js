/**
 * Created by reimer on 29.03.2016.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.audittrail';
	var mod = angular.module(moduleName);

	mod.value('basicsAuditTrailGridColumns', {

		'fid': 'basicsAuditTrailGridColumns',
		'version': '1.0.0',
		'showGrouping': false,
		// 'validatorService': 'basicsUserformFieldValidationService',
		// 'validator': 'validateEntity',
		// 'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['dateandtime', 'action', 'description', 'oldvalue', 'newvalue', 'column', 'container', 'username']
			}
		],

		'translationInfos': {

			'extraModules': [moduleName],

			'extraWords': {
				'DateAndTime': {location: moduleName, identifier: 'entityDateAndTime', initial: 'Date'},
				'Action': {location: moduleName, identifier: 'entityAction', initial: 'Action'},
				'Description': {location: moduleName, identifier: 'entityDescription', initial: 'Description'},
				'OldValue': {location: moduleName, identifier: 'entityOldValue', initial: 'Old Value'},
				'NewValue': {location: moduleName, identifier: 'entityNewValue', initial: 'New Value'},
				'Column': {location: moduleName, identifier: 'entityColumn', initial: 'Column'},
				'Container': {location: moduleName, identifier: 'entityContainer', initial: 'Container'},
				'UserName': {location: moduleName, identifier: 'entityUserName', initial: 'User Name'}
			}
		},

		'overloads': {
			'dateandtime': {'readonly': true},
			'action': {'readonly': true},
			'description': {'readonly': true},
			'oldvalue': {'readonly': true},
			'newvalue': {'readonly': true},
			'column': {'readonly': true},
			'container': {'readonly': true},
			'username': {'readonly': true}
		}
	});
})(angular);


