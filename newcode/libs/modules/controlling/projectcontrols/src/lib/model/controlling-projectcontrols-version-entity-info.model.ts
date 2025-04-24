/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
    ControllingProjectControlsVersionDataService
} from '../services/controlling-projectcontrols-version-data.service';
import {
    ControllingProjectControlsVersionBehaviorService
} from '../behaviors/controlling-projectcontrols-version-behavior.service';
import {ControllingCommonVersionEntityInfoModel} from '@libs/controlling/common';


export const CONTROLLING_PROJECTCONTROLS_VERSION_ENTITY_INFO: EntityInfo = ControllingCommonVersionEntityInfoModel.create({
    permissionUuid: '493916e729b1456c84f3b1f3034c4426',
    dataServiceToken: ControllingProjectControlsVersionDataService,
    behavior:ControllingProjectControlsVersionBehaviorService
});