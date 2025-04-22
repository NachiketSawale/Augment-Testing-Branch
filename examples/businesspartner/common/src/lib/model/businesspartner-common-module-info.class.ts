/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '../model/entity-info/module-info-common.model';

export class BusinesspartnerCommonModuleInfoClass extends BusinessModuleInfoBase {
    public static readonly instance = new BusinesspartnerCommonModuleInfoClass();

    private constructor() {
        super();
    }

    public override get internalModuleName(): string {
        return MODULE_INFO_BUSINESSPARTNER.businesspartnerCommonModuleName;
    }
}
