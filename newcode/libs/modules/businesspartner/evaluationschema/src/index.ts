import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinesspartnerEvaluationschemaModuleInfo } from './lib/model/businesspartner-evaluationschema-module-info.class';

export * from './lib/businesspartner-evaluationschema.module';
export * from './lib/lookup-services/evaluationschema-rubric-category-lookup.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return BusinesspartnerEvaluationschemaModuleInfo.instance;
}