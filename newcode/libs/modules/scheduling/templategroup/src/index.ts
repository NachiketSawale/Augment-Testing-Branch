import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingTemplategroupModuleInfo } from './lib/model/scheduling-templategroup-module-info.class';
export * from './lib/activity-group/model/scheduling-activity-templategroup';
export * from './lib/model/entities/activity-tmpl-grp-2cugrp-entity.interface';
export * from './lib/scheduling-templategroup.module';
export * from './lib/model/entities/activity-template-group-entity.interface';
export * from './lib/model/entities/activity-template-group-complete-entity.interface';
export * from './lib/services/scheduling-template-activity-template-group-data.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return SchedulingTemplategroupModuleInfo.instance;
}