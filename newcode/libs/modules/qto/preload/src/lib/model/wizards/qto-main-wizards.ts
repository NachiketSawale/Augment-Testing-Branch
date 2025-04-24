/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

/**
 * qto main wizards
 */
export const QTO_MAIN_WIZARDS: IWizard[] = [
	{
		uuid: 'D8247B7259AB49DAA9FB2DE6534251D3',
		name: 'change QtoStatus',
		description: 'change QtoStatus.',
		execute(context: IInitializationContext) {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainChangeStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'EF9D526175D0474EA980E93BD3048F05',
		name: 'changeDetailQtoStatus',
		execute(context: IInitializationContext) {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainDetailChangeStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'c7bc361bf0454bbebcfe192f4e2965de',
		name: 'QTO Document Export',
		//description: 'QTO Document Export',
		execute(context: IInitializationContext) {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainWizardRebExportService).exportREB();
			});
		},
	},
	{
		uuid: '18b83d1f31874b04aaed0867a64a457e',
		name: 'QTO Document Import',
		//description: 'QTO Document Import',
		execute(context: IInitializationContext) {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainWizardRebImportService).importREB();
			});
		},
	},
	{
		uuid: '084269094DED41F690D67457D5ED8E18',
		name: 'Disable Record',
		execute: (context) => {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainEnableDisableRecordWizardService).onStartDisableWizard();
			});
		},
	},
	{
		uuid: '3AA5200BABEE45BB834485AF159780D0',
		name: 'Enable Record',
		execute: (context) => {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainEnableDisableRecordWizardService).onStartEnableWizard();
			});
		},
	},
	{
		uuid: 'BBA0722907CC40EE8C49B29F68DB036C',
		name: 'Update WQ and AQ quantities to BoQ',
		execute: (context) => {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QtoMainUpdateAqWqToBoqWizardService).UpdateBoqWqAq();
			});
		},
	},
	{
		uuid: '6A57335CC29649E6A323570E20061696',
		name: 'Create/Update Pes',
		execute: (context) => {
			return import('@libs/qto/main').then((m) => {
				context.injector.get(m.QToMainCreateUpdateUpdatePesWizardService).createPes();
			});
		},
	},
];
