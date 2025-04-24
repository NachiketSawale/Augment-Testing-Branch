import { IApplicationModuleInfo } from '@libs/platform/common';
import { ExampleTopicOneModuleInfo } from './lib/model/example-topic-one-module-info.class';

export * from './lib/example-topic-one.module';

export {SampleWizard} from './lib/model/wizards/sample-wizard.class';

export * from './lib/model/circular1.class';


export function getModuleInfo(): IApplicationModuleInfo {
    return ExampleTopicOneModuleInfo.instance;
}