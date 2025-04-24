/*
 * Copyright(c) RIB Software GmbH
 */

import {IApplicationModuleInfo} from '@libs/platform/common';

export class BasicsCommonModuleInfo implements IApplicationModuleInfo {

    public static instance = new BasicsCommonModuleInfo();

    public readonly internalModuleName = 'basics.common';

    private constructor() {
    }
}