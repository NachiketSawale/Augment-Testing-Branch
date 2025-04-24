/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';
export const PROCUREMENT_RFQ_WIZARDS: IWizard[] = [
	{
		uuid: '56cade6fdbff4f06a1cc8f6875358e6b',
		name: 'Create Business Partner',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return new m.ProcurementRfqCreateBusinessPartnerWizard(context).createBusinessPartner();
			});
		},
	},
	{
		uuid: 'cf87fcc54d994dc686335be18bf11140',
		name: 'changeRfqCode',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqChangeCodeWizardService).changeCode(context);
			});
		},
	},
	{
		uuid: '2088a47f55f74e0982f7a6fbb5481273',
		name: 'Change Wizard Configuration',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '939178bf1667474099a1144b0eb7912c',
		name: 'Change Status For Project document',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((module) => {
				return module.ProcurementRfqChangeProjectDocumentStatusWizardService.execute(context);
			});
		},
	},
	{
		uuid: '8c835f6c71584346922221eb754b7944',
		name: 'Change Rfq Status',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqChangeStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '6ef1c38241b942ef87323fa2ff4d9a60',
		name: 'changeBiddersStatus',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqChangeBidderStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'e286c7686d82411eb5e65a1aefb4bb62',
		name: 'importBusinessPartner',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ImportBusinessPartnerWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '671faa84a48f4358ac746b6151ffc7c2',
		name: 'sendEmail',
		execute: async(context: IInitializationContext): Promise<void> =>{
			const m = await import('@libs/procurement/rfq');
			return new m.ProcurementRfqWizard().sendEmail(context);
		},
	},
	{
		uuid: '7139324429664f87894621de96b44f00',
		name: 'sendFax',
		execute:async(context: IInitializationContext): Promise<void> =>{
			const m = await import('@libs/procurement/rfq');
			return new m.ProcurementRfqWizard().sendFax(context);
		},
	},
	{
		uuid: '99d1567c83754ee9b178a4dc998fd225',
		name: 'changeBillingSchema',
		execute(context: IInitializationContext) {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqChangeBillingSchemaService).changeBillingSchema();
			});
		},
	},
	{
		uuid: '44dff0cafb0649128b2a4717cf95fc20',
		name: 'createQuote',
		execute(context: IInitializationContext) {
			return import('@libs/procurement/rfq').then((m) => {
				return context.injector.get(m.ProcurementRfqCreateQuoteWizardService).createQuote();
			});
		},
	},
];