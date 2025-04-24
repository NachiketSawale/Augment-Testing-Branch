/**
 * Created by sandu on 26.08.2015.
 */
(function () {
	'use strict';

	var mod = new angular.module('usermanagement.user');
	var selectOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'usermanagementUserStateValues'
	};
	var logOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'usermanagementUserLogStateValues'
	};
	var enterPassword = 'usermanagement.user.enterPassword';
	var enterPasswordConfirmation = 'usermanagement.user.enterPasswordConfirmation';

	mod.factory('usermanagementUserDetailLayout', ['$translate', 'basicsLookupdataConfigGenerator', function ($translate, basicsLookupdataConfigGenerator) {
		return {
			fid: 'usermanagement.user.user.detailform',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'description', 'logonname', 'password', 'confirmpassword', 'domainsid', 'synchronizedate', 'email', 'state', 'lastlogin', 'integratedaccess', 'explicitaccess', 'isexternal', 'frmidentityproviderfk', 'provideruniqueidentifier', 'ispasswordchangeneeded', 'isprotected', 'failedlogon', 'disabledhint', 'loginallowedfrom', 'loginallowedto', 'isanonymized']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
			'translationInfos': {
				'extraModules': ['usermanagement.user'],
				'extraWords': {
					'GUID': {location: 'usermanagement.user', identifier: 'entityGUID', initial: 'GUID'},
					'Name': {location: 'usermanagement.user', identifier: 'userName', initial: 'Name'},
					'Description': {
						location: 'usermanagement.user',
						identifier: 'userDescription',
						initial: 'Description'
					},
					'LogonName': {location: 'usermanagement.user', identifier: 'userLogonName', initial: 'Logon Name'},
					'Lastlogin': {location: 'usermanagement.user', identifier: 'userLastLogin', initial: 'Last Login'},
					'PasswordHash': {
						location: 'usermanagement.user',
						identifier: 'userPasswordHash',
						initial: 'Password Hash'
					},
					'PasswordSalt': {
						location: 'usermanagement.user',
						identifier: 'userPasswordSalt',
						initial: 'Password Salt'
					},
					'DomainSID': {location: 'usermanagement.user', identifier: 'userDomainSID', initial: 'Domain SId'},
					'SynchronizeDate': {
						location: 'usermanagement.user',
						identifier: 'userSynchronizeDate',
						initial: 'Synchronize Date'
					},
					'Email': {location: 'usermanagement.user', identifier: 'userEmail', initial: 'Email'},
					'IntegratedAccess': {
						location: 'usermanagement.user',
						identifier: 'userIntegratedAccess',
						initial: 'Integrated Access'
					},
					'State': {location: 'usermanagement.user', identifier: 'userState', initial: 'State'},
					'ExplicitAccess': {
						location: 'usermanagement.user',
						identifier: 'userExplicitAccess',
						initial: 'Explicit Access'
					},
					'IsExternal': {
						location: 'usermanagement.user',
						identifier: 'userIsExternal',
						initial: 'Is External'
					},
					'PasswordExpiration': {
						location: 'usermanagement.user',
						identifier: 'userPasswordExpiration',
						initial: 'Password Expiration'
					},
					'Password': {
						location: 'usermanagement.user',
						identifier: 'userPassword',
						initial: 'Password',
						placeholder: '{{}}'
					},
					'ConfirmPassword': {
						location: 'usermanagement.user',
						identifier: 'userConfirmPassword',
						initial: 'Confirm Password'
					},
					'FrmIdentityproviderFk': {
						location: 'usermanagement.user',
						identifier: 'identityProvider',
						initial: 'Identityprovider'
					},
					'ProviderUniqueIdentifier': {
						location: 'usermanagement.user',
						identifier: 'providerUniqueIdentifier',
						initial: 'Provider Unique Identifier'
					},
					'IsPasswordChangeNeeded': {
						location: 'usermanagement.user',
						identifier: 'ispasswordchangeneeded',
						initial: 'Password Change Needed'
					},
					'IsProtected': {
						location: 'usermanagement.user',
						identifier: 'isprotected',
						initial: 'Is Protected'
					},
					'FailedLogon': {
						location: 'usermanagement.user',
						identifier: 'failedLogon',
						initial: 'Failed Logon Count'
					},
					'DisabledHint': {
						location: 'usermanagement.user',
						identifier: 'disabledHint',
						initial: 'Disable User Hint'
					},
					'LoginAllowedFrom': {
						location: 'usermanagement.user',
						identifier: 'loginAllowedFrom',
						initial: 'Login Allowed From'
					},
					'LoginAllowedTo': {
						location: 'usermanagement.user',
						identifier: 'loginAllowedTo',
						initial: 'Login Allowed To'
					},
					'IsAnonymized': {
						location: 'usermanagement.user',
						identifier: 'isAnonymized',
						initial: 'Is Anonymized'
					}
				}
			},

			'overloads': {
				'password': {
					'grid': {
						exclude: true
					},
					'detail': {
						placeholder: function (entity) {
							return entity.HasPassword ? '******' : $translate.instant(enterPassword);
						},
						maxLength: 64
					}
				},
				'name': {
					important: true
				},
				'logonname': {
					important: true,
					required: true,
					grid: {
						required: true
					}
				},
				'confirmpassword': {
					'grid': {
						exclude: true
					},
					'detail': {
						placeholder: function (entity) {
							return entity.HasPassword ? '******' : $translate.instant(enterPasswordConfirmation);
						},
						maxLength: 64
					}
				},
				'lastlogin': {
					readonly: true
				},
				'domainsid': {
					readonly: true
				},
				'synchronizedate': {
					readonly: true

				},
				'isprotected': {
					readonly: true
				},
				state: {
					grid: {
						editorOptions: selectOptions
					},
					detail: {options: selectOptions}
				},
				'isexternal': {
					'grid': {
						width: 80
					}
				},
				'explicitaccess': {
					'grid': {
						width: 80
					}
				},
				'integratedaccess': {
					'grid': {
						width: 80
					}
				},
				provideruniqueidentifier: {
					readonly: true
				},
				'failedlogon': {
					readonly: true,
					'grid': {
						width: 80
					}
				},
				'disabledhint': {
					readonly: true,
					'grid': {width: 200}
				},
				'isanonymized':{
					readonly: true
				},
				frmidentityproviderfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('usermanagement.main.user', 'Name')

			}
		};
	}]);

	mod.factory('usermanagementUserXGroupDetailLayout', [function () {
		return {
			fid: 'usermanagement.user.userXgroup.detailform',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['accessgroupfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {

				'extraModules': ['usermanagement.user'],

				'extraWords': {

					'AccessGroupFk': {location: 'usermanagement.user', identifier: 'accessGroupFK', initial: 'Group'}
				}

			},
			'overloads': {
				'accessgroupfk': {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'usermanagement-group-group-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'usermanagement-group-group-dialog',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'Name'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'AccessGroup',
							displayMember: 'Name'
						}
					}
				}
			}
		};
	}]);

	mod.factory('usermanagementUserLogDetailLayout', [function () {
		return {
			fid: 'usermanagement.user.log.detailform',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['jobstate', 'name', 'starttime', 'executionstarttime', 'executionendtime', 'log']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
			'translationInfos': {
				'extraModules': ['usermanagement.user'],
				'extraWords': {
					'JobState': {
						location: 'usermanagement.user',
						identifier: 'logContainer.jobstate',
						initial: 'Job State'
					},
					'StartTime': {
						location: 'usermanagement.user',
						identifier: 'logContainer.starttime',
						initial: 'Start Time'
					},
					'ExecutionStartTime': {
						location: 'usermanagement.user',
						identifier: 'logContainer.exstarttime',
						initial: 'Execution Start Time'
					},
					'ExecutionEndTime': {
						location: 'usermanagement.user',
						identifier: 'logContainer.exendtime',
						initial: 'Execution End Time'
					},
					'Log': {location: 'usermanagement.user', identifier: 'logContainer.log', initial: 'Logging Message'}
				}
			},

			'overloads': {
				jobstate: {
					grid: {
						formatterOptions: logOptions
					},
					'readonly': true
				},
				name: {'readonly': true},
				starttime: {'readonly': true},
				executionstarttime: {'readonly': true},
				executionendtime: {'readonly': true},
				loggingmessage: {'readonly': true}
			}
		};
	}]);

})();
