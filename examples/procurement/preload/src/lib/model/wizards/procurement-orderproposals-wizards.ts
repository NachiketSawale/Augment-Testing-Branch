/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_ORDERPROPOSALS_WIZARDS: IWizard[] = [
	{
		uuid: '006cc44ad01647f78818662a8cf4483d',
		name: 'CreateContract',
		execute: async (context: IInitializationContext) => {
			const m = await import('@libs/procurement/orderproposals');
			return context.injector.get(m.ProcurementOrderProposalsCreateContractRequisitionWizardService).createContract();
		},
	},
	{
		uuid: '8545a67d634242eda41b7f39cd041aa8',
		name: 'CreateRequisition',
		execute: async (context: IInitializationContext) => {
			const m = await import('@libs/procurement/orderproposals');
			return context.injector.get(m.ProcurementOrderProposalsCreateContractRequisitionWizardService).createRequisition();
		},
	},
];
