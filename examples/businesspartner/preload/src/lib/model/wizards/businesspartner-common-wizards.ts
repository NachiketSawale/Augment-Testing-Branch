/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinessPartnerCommonFeatureKeyManagement } from '@libs/businesspartner/common';
import { IWizard } from '@libs/platform/common';
/**
 * business Partner Contact wizards.
 */
export const BUSINESSPARTNER_COMMON_WIZARDS: IWizard[] = [
    {
        uuid: '825af4a1bfc649e69cd2cb5f9581024c',
        name: 'portalUserManagement',
        execute: (context) => {
            const currentModule = context.moduleManager.activeModule!;
            const moduleName = currentModule.internalModuleName;
            const featureKey = context.injector.get(BusinessPartnerCommonFeatureKeyManagement).getFeatureKey(moduleName, 'portalUserManagement');
            if (featureKey) {
                return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
            } else {
                return;
            }
        },
    }
];