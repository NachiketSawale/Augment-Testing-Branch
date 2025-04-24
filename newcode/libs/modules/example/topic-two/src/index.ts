import { OtherWizard } from './lib/model/wizards/other-wizard.class';
import { YetAnotherWizard } from './lib/model/wizards/yet-another-wizard.class';
import { IApplicationModuleInfo } from '@libs/platform/common';
import { ExampleTopicTwoModuleInfoClass } from './lib/model/example-topic-two-module-info.class';

export * from './lib/example-topic-two.module';

export {OtherWizard, YetAnotherWizard};

export * from './lib/model/circular2.class';

export function getModuleInfo(): IApplicationModuleInfo {
	return ExampleTopicTwoModuleInfoClass.instance;
}
