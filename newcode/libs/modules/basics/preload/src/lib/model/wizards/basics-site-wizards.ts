/*
 * Copyright(c) RIB Software GmbH
 */
import { IWizard } from '@libs/platform/common';

export const  BASICS_SITE_WIZARDS: IWizard[] = 
[
    {
        uuid: 'd2026477e01a494c8344d45b7e64c86c',
        name: 'enableSite',
        execute: async context => {
            const module = await import('@libs/basics/site');
            return new module.BasicsSiteWizard().enableSite(context);
        }
    },
    {
        uuid: '91c7614f5c8f4e518586ca6ebae4c7ee',
        name: 'disableSite',
        execute : async context => {
            const module = await import('@libs/basics/site');
            return new module.BasicsSiteWizard().disbleSite(context);
        }
    }
];

