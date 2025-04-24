import {IInitializationContext} from '@libs/platform/common';

export interface ICommonWizard {
	execute: (context: IInitializationContext) => Promise<void>;
}