import { IWizard } from '@libs/platform/common';

export const UERMANAGEMENT_RIGHT_WIZARDS: IWizard[] = [
	{
		uuid: '4b341a72494f4c93a904d9b871f23147',
		name: 'Copy Role',
		execute: (context) => {
			return import('@libs/usermanagement/right').then((module) => new module.UsermanagementRightWizard().copyRoleWizard(context));
		},
	},
	{
		uuid: '12fdc3b060a940b5a85f24051063bdef',
		name: 'DeleteRights',
		execute: (context) => {
			return import('@libs/usermanagement/right').then((module) => new module.UsermanagementRightWizard().deleteRights(context));
		},
	},
    {
        uuid: 'dba9fb9cb13f4cd0b5dd7e9895d7db1b',
        name: 'assignCategory',
        execute: (context) => {
            return import('@libs/usermanagement/right').then((module) => new module.UsermanagementRightWizard().assignCategory(context));
        },
    }
];
