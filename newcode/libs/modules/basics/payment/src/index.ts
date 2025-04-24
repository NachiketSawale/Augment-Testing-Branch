import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsPaymentModuleInfo } from './lib/model/basics-payment-module-info.class';
export * from './lib/modules-basics-payment.module';
export * from './lib/model/wizards/wizard.class';


export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsPaymentModuleInfo.instance;
}