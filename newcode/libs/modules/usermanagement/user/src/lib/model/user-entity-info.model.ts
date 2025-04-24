/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { UsermanagementUserDataService } from '../services/usermanagement-user-data.service';
import { IUserEntity } from '@libs/usermanagement/interfaces';
import { UserManagementUserListBehavior } from '../behaviors/user-list-behavior.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

export const USER_ENTITY_INFO: EntityInfo = EntityInfo.create<IUserEntity>({
	grid: {
		title: {key: 'usermanagement.user.userContainerTitle'},
		behavior: ctx => ctx.injector.get(UserManagementUserListBehavior)
	},
	form: {
		title: {key: 'usermanagement.user.usermanagementUserDetailsContainerTitle'},
		containerUuid: 'FB4FB1A7754C4A69B6634AD9C98BCFF9',
	},
	dataService: ctx => ctx.injector.get(UsermanagementUserDataService),
	dtoSchemeId: {moduleSubModule: 'UserManagement.Main', typeName: 'UserDto'},
	permissionUuid: 'DFDD06A581624D11AB1E6AA1103E76E2',
	layoutConfiguration: {
		fid: 'usermanagement.user.user.detailform',
		groups: [{
			gid: 'basicData',
			attributes: ['Name', 'Description', 'LogonName', 'Password', 'ConfirmPassword',
				'DomainSID', 'SynchronizeDate', 'Email', 'State', 'LastLogin', 'IntegratedAccess',
				'ExplicitAccess', 'IsExternal', 'FrmIdentityproviderFk', 'ProviderUniqueIdentifier',
				'IsPasswordChangeNeeded', 'IsProtected', 'FailedLogon', 'DisabledHint',
				'LoginAllowedFrom', 'LoginAllowedTo', 'IsAnonymized']
		}],
		overloads: {
			Password: {
				grid: {
					exclude: true
				},
				form: {
					maxLength: 64
				}
				// TODO: add placeholder when DEV-7255 is done
			},
			ConfirmPassword: {
				grid: {
					exclude: true
				},
				form: {
					maxLength: 64
				}
				// TODO: add placeholder when DEV-7255 is done
			},
			Lastlogin: {
				readonly: true
			},
			DomainSID: {
				readonly: true
			},
			SynchronizeDate: {
				readonly: true
			},
			ProviderUniqueIdentifier: {
				readonly: true
			},
			FailedLogon: {
				readonly: true
			},
			DisabledHint: {
				readonly: true
			},
			IsAnonymized: {
				readonly: true
			},
			FrmIdentityproviderFk: BasicsSharedCustomizeLookupOverloadProvider.provideFrmIdentityProviderReadonlyLookupOverload<IUserEntity>()
			// TODO: IsProtected should be read-only
			// TODO: state: select options
		},
		labels: {
			...prefixAllTranslationKeys('usermanagement.user.', {
				DomainSID: {key: 'userDomainSID'},
				Email: {key: 'userEmail'},
				ExplicitAccess: {key: 'userExplicitAccess'},
				FrmIdentityproviderFk: {key: 'identityProvider'},
				GUID: {key: 'entityGUID'},
				HasPassword: {key: 'IsAnonymized'},
				IntegratedAccess: {key: 'userIntegratedAccess'},
				IsExternal: {key: 'userIsExternal'},
				IsPasswordChangeNeeded: {key: 'ispasswordchangeneeded'},
				IsProtected: {key: 'isprotected'},
				Lastlogin: {key: 'userLastLogin'},
				LoginAllowedFrom: {key: 'loginAllowedFrom'},
				LoginAllowedTo: {key: 'loginAllowedTo'},
				LogonName: {key: 'userLogonName'},
				Name: {key: 'userName'},
				Password: {key: 'userPassword'},
				ConfirmPassword: {key: 'userConfirmPassword'},
				PasswordExpiration: {key: 'userPasswordExpiration'},
				State: {key: 'userState'},
				SynchronizeDate: {key: 'userSynchronizeDate'},
			})
		}
	}
});