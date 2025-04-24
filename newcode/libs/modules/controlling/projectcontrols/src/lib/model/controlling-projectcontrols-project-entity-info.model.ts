/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ControllingProjectControlsProjectDataService } from '../services/controlling-projectcontrols-project-main-data.service';
import { ControllingProjectControlsProjectBehavior } from '../behaviors/controlling-projectcontrols-project-behavior.service';
import {ControllingCommonProjectMainEntityInfo} from '@libs/controlling/common';
import {ControllingCommonProjectLayoutService}from  '@libs/controlling/common';


 export const CONTROLLING_PROJECTCONTROLS_PROJECT_ENTITY_INFO: EntityInfo = ControllingCommonProjectMainEntityInfo.create({
     permissionUuid: '3ebe043f5030408da9d856aae1886c83',
     formUuid: '3ebe043f5030408da9d856aae1886c83',
     dataServiceToken: ControllingProjectControlsProjectDataService,
     behavior: ControllingProjectControlsProjectBehavior,
     layoutServiceToken:ControllingCommonProjectLayoutService
 });