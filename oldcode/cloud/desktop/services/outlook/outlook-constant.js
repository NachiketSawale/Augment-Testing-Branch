/**
 * Created by wed on 8/17/2023.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').constant('cloudDesktopOutlookConstant', {
		toolbars: {
			id: {
				new: 'new',
				refresh: 'refresh',
				save: 'save-draft',
				attachReport: 'attach-report',
				attachFile: 'attach-file',
				delete: 'delete',
				send: 'send'
			}
		},
		views: {
			id: {
				login: 'login',
				sendBox: 'sendBox',
				mailbox: 'mailbox',
				detail: 'detail'
			}
		},
		actions: {
			draft: {
				create: 'create',
				send: 'send',
				delete: 'delete'
			}
		},
		folders: {
			inbox: {
				name: 'Inbox',
				displayName: 'cloud.desktop.outlook.inbox'
			},
			drafts: {
				name: 'Drafts',
				displayName: 'cloud.desktop.outlook.draft'
			}
		}
	});

})(angular);