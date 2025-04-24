/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const CLOUD_TRRANSLATION_WIZARDS: IWizard[] =
    [
        {
            uuid: '0a50c634b7e74d5da40019496d259992',
            name: 'exportToExcel',
            execute: context => {
                return import('@libs/cloud/translation').then((module) => new module.CloudTranslationWizard().exportToExcel(context));
            }
        },

        {
            uuid: '6d6d39e3a4e04f0ba98531a669ae0a79',
            name: 'importFromExcel',
            execute: context => {
                return import('@libs/cloud/translation').then((module) => new module.CloudTranslationWizard().importFromExcel(context));
            }
        }
    ];