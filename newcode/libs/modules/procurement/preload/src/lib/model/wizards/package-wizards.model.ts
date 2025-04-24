import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_PACKAGE_WIZARDS: IWizard[] = [
	{
		uuid: '35ba6203ddcc4c66a4b22745735cf831',
		name: 'Enable Record',
		execute: (context): Promise<void> | undefined => {
			return import('@libs/procurement/package').then((m) => context.injector.get(m.ProcurementPackageEnableWizard).onStartEnableWizard());
		},
	},
	{
		uuid: '649da26570884f7bb05185f30dee3803',
		name: 'Disable Record',
		execute: (context): Promise<void> | undefined => {
			return import('@libs/procurement/package').then((m) => context.injector.get(m.ProcurementPackageDisableWizard).onStartDisableWizard());
		},
	},
	{
		uuid: '66c358a92af74007af06325899ed5d08',
		name: 'procurementPackageWizardService',
		execute: async (context: IInitializationContext) => {
			const m = await import('@libs/procurement/package');
			return context.injector.get(m.ProcurementPackageItemScopeReplacementWizardService).selectItemScopeReplacement();
		},
	},
	{
		uuid: '79714877d45b42a6b9cbbbd8ea7bb23d',
		name: 'renumberItem',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageRenumberItemWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '5cd6d6953fff45b0beb1c212acd50c8d',
		name: 'updateCashFlowProjection',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageUpdateCashFlowProjectionService).onStartWizard();
			});
		},
	},
	{
		uuid: '73a3fb7368404722af2a05eb34ced437',
		name: 'createRfq',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageCreateRfqWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '4402c87f9a4241668790348e622efe0a',
		name: 'changePackageStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementChangePackageStatusWizardService).startChangePackageStatusWizard();
			});
		},
	},

	{
		uuid: '7712428a4cf140868fdf7682e386e0c4',
		name: 'updateDate',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageUpdateDateWizardService).packageUpdateDate();
			});
		},
	},
	{
		uuid: '30fb687e677240b0bf627a57b908381f',
		name: 'createRequisition',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageCreateRequisitionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c9a74a2d880a4aeaa0f8d3e20ea717f8',
		name: 'changePackageCode',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageChangeCodeWizardService).changeCode(context);
			});
		},
	},
	{
		uuid: '7e3ce3d2620c4686a6028c571c06eae1',
		name: 'changeProcurementConfiguration',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '232d6f1c4064443381c20c0abb7b0159',
		name: 'packageImport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackagePackageImportWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '11c953bc997b485491e278d316ac3bdc',
		name: 'updateScheduling',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageUpdateSchedulingWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '73eaa0d7e3ec46b5ac08dc6ca38db5bc',
		name: 'maintainPaymentScheduleVersion',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageMaintainPaymentScheduleVersionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '5a614609167649ba98426b3067bdfc3f',
		name: 'generatePaymentSchedule',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageGeneratePaymentScheduleWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'a8a481250b7d4897abac5dd1375ac338',
		name: 'boqScopeReplacement',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageBoqScopeReplacementDialogService).show();
			});
		},
	},
	{
		uuid: '1b5247705bff4ae2861da35ce8c85da9',
		name: 'Change Status For Project document',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((module) => {
				return module.ProcurementPackageChangeProjectDocumentStatusWizardService.execute(context);
			});
		},
	},
	{
		uuid: 'bf6e907287014cd58117c2215136fd55',
		name: 'createPackage',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageCreatePackageFromTemplateWizardService).createPackage();
			});
		},
	},
	{
		uuid: 'ac5977da40644f7983c412c940a30fa4',
		name: 'Change Item Status',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageChangeItemStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '74c83273787f45b5a96d6e492531c15b',
		name: 'validateAndUpdateItemQuantity',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageValidateAndUpdateItemQuantityWizardService).showDialog();
			});
		},
	},
	{
		uuid: '12f9d13b74d54c438dc7cc660743141e',
		name: 'showEditor',
		execute: async (context: IInitializationContext) => {
			const m = await import('@libs/procurement/package');
			return new m.ProcurementPackageShowEditorWizardService().showEditor(context);
		},
	},
	{
		uuid: '7ac5c6fee61e42248804b77bfd1660ca',
		name: 'changePaymentScheduleStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageChangePaymentScheduleStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '64f10026e7ad407c9a929a0703e2ddce',
		name: 'generateItemDeliverySchedule',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageGenerateDeliveryScheduleWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'd189fb8db8e14b559ae332bf121d0006',
		name: 'exportMaterial',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageExportMaterialWizardService).export();
			});
		},
	},
	{
		uuid: 'f997d891a0cd4f70a258122cb1b9ce11',
		name: 'evaluateEvents',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageEvaluateEventsWizardService).packageEvaluateEvents();
			});
		},
	},
	{
		uuid: '9d1a371828c14b06954f6aafa4dafcd4',
		name: 'prcItemExcelImport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageItemExcelImportWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c909f50aab334f40a93f1ace51719835',
		name: 'prcItemExcelExport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/package').then((m) => {
				return context.injector.get(m.ProcurementPackageItemExcelExportWizardService).export(context);
			});
		},
	},
	{
		uuid: '1318b8cdac2348fdb75168138e67459e',
		name: 'createContract',
		execute: async (context: IInitializationContext): Promise<void> => {
			const m = await import('@libs/procurement/package');
			return context.injector.get(m.ProcurementPackageCreateContractWizardService).createContract();
		},
	},
];
