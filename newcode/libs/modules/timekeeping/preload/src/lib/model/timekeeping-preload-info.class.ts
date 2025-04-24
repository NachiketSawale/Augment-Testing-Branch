import { Dictionary, IInitializationContext, ISubModuleRouteInfo, ITile, IWizard, LazyInjectableInfo, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

/**
 * Preloads the tiles, wizards and routes for timekeeping module.
 */
export class TimekeepingPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new TimekeepingPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public get internalModuleName(): string {
		return 'timekeeping';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'timekeeping.paymentgroup',
				tileSize: TileSize.Small,
				color: 4428614,
				opacity: 1,
				iconClass: 'ico-payment-groups',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Payment Group',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingPaymentGroup',
				},
				description: {
					text: 'Timekeeping Module',
					key: 'cloud.desktop.moduleDescriptionTimekeepingPaymentGroup',
				},
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 10,
				permissionGuid: 'cf3abae50ccb483b968f17a84447c36e',
				targetRoute: 'timekeeping/paymentgroup',
			},
			{
				id: 'timekeeping.employee',
				tileSize: TileSize.Small,
				color: 2324403,
				opacity: 1,
				iconClass: 'ico-employee',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Employee',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingEmployee',
				},
				description: {
					text: 'Timekeeping Module',
					key: 'cloud.desktop.moduleDescriptionTimekeepingEmployee',
				},
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 10,
				permissionGuid: '36caf6bb61a34c53af3a44dfc17f8abc',
				targetRoute: 'timekeeping/employee',
			},
			{
				id: 'timekeeping.timesymbols',
				displayName: {
					text: 'Time Symbols',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingTimeSymbols',
				},
				description: {
					text: 'Timekeeping Time Symbols',
					key: 'cloud.desktop.moduleDescriptionTimekeepingTimeSymbols',
				},
				iconClass: 'ico-time-symbols',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'timekeeping/timesymbols',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'a7b2ee64391f4626a5aa2c83e7f046ae',
			},
			{
				id: 'timekeeping.recording',
				displayName: {
					text: 'Time Keeping',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingRecording',
				},
				description: {
					text: 'Recording of Working Hours',
					key: 'cloud.desktop.moduleDescriptionTimekeepingRecording',
				},
				iconClass: 'ico-timekeeping',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'timekeeping/recording',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'acde094979f04e42b75566146c6174a5',
			},
			{
				id: 'timekeeping.timecontrolling',
				displayName: {
					text: 'Time Controlling',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingTimeControlling',
				},
				description: {
					text: 'Review times',
					key: 'cloud.desktop.moduleDescriptionTimekeepingTimeControlling',
				},
				iconClass: 'ico-time-controlling',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'timekeeping/timecontrolling',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'ed6d68cfb44d4637b3ffdd4695cb3303',
			},
			{
				id: 'timekeeping.worktimemodel',
				displayName: {
					text: 'Working Time Model',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingWorkTimeModel',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionTimekeepingWorkTimeModel',
				},
				iconClass: 'ico-working-time-model',
				color: 1992346,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'timekeeping/worktimemodel',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '9f26922ca7b7472abd74dd40f0bfff0c',
			},
			{
				id: 'timekeeping.period',
				displayName: {
					text: 'Timekeeping Period',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingPeriod',
				},
				description: {
					text: 'Managing Timekeeping Periods',
					key: 'cloud.desktop.moduleDescriptionTimekeepingPeriod',
				},
				iconClass: 'ico-timekeeping-period',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'timekeeping/period',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '27fbc8a5363042008ddc6791b729bd25',
			},
			{
				id: 'timekeeping.shiftmodel',
				displayName: {
					text: 'Shift Model',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingShiftModel',
				},
				description: {
					text: 'Shift Model',
					key: 'cloud.desktop.moduleDescriptionTimekeepingShiftModel',
				},
				iconClass: 'ico-shift-model',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'timekeeping/shiftmodel',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '023fcc0fb463437e8a3d304327e7a48d',
			},
			{
				id: 'timekeeping.timeallocation',
				displayName: {
					text: 'Time Allocation',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingTimeallocation',
				},
				description: {
					text: 'Allocation of productive hours',
					key: 'cloud.desktop.moduleDescriptionTimekeepingTimeallocation',
				},
				iconClass: 'ico-time-allocation',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'timekeeping/timeallocation',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: '53111731c5d748a7821660b91f5c6f5e',
			},
			{
				id: 'timekeeping.settlement',
				tileSize: TileSize.Small,
				color: 3704191,
				opacity: 0.9,
				iconClass: 'ico-timekeeping-settlement',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Timekeeping Settlement',
					key: 'cloud.desktop.moduleDisplayNameTimekeepingSettlement',
				},
				description: {
					text: 'Intercompany Settlements for Timekeeping',
					key: 'cloud.desktop.moduleDescriptionTimekeepingSettlement',
				},
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //Todo
				permissionGuid: 'c54fbb690eff4313b02d403ea6df2efe',
				targetRoute: 'timekeeping/settlement',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *	@protected
	 * @returns {ISubModuleRouteInfo[]} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('paymentgroup', () => import('@libs/timekeeping/paymentgroup').then((module) => module.TimekeepingPaymentGroupModule)),
			ContainerModuleRouteInfo.create('employee', () => import('@libs/timekeeping/employee').then((module) => module.TimekeepingEmployeeModule)),
			ContainerModuleRouteInfo.create('timesymbols', () => import('@libs/timekeeping/timesymbols').then((module) => module.TimekeepingTimesymbolsModule)),
			ContainerModuleRouteInfo.create('timecontrolling', () => import('@libs/timekeeping/timecontrolling').then((module) => module.TimekeepingTimecontrollingModule)),
			ContainerModuleRouteInfo.create('worktimemodel', () => import('@libs/timekeeping/worktimemodel').then((module) => module.TimekeepingWorktimemodelModule)),
			ContainerModuleRouteInfo.create('recording', () => import('@libs/timekeeping/recording').then((module) => module.TimekeepingRecordingModule)),
			ContainerModuleRouteInfo.create('period', () => import('@libs/timekeeping/period').then((module) => module.TimekeepingPeriodModule)),
			ContainerModuleRouteInfo.create('shiftmodel', () => import('@libs/timekeeping/shiftmodel').then((module) => module.TimekeepingShiftmodelModule)),
			ContainerModuleRouteInfo.create('timeallocation', () => import('@libs/timekeeping/timeallocation').then((module) => module.TimekeepingTimeallocationModule)),
			ContainerModuleRouteInfo.create('settlement', () => import('@libs/timekeeping/settlement').then((module) => module.TimekeepingSettlementModule))

		];
	}
	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: 'e7664f809aa442578263986b197a9f06',

				name: 'timekeeping.timesymbols.enableDone',
				execute: (context) => {
					return import('@libs/timekeeping/timesymbols').then((module) => new module.TimekeepingTimeSymbolWizardClass().enableTimeSymbols(context));
				},
			},
			{
				uuid: '4205c27f59144dd8ad638a99f650bff7',

				name: 'timekeeping.common.disabledTimeSymbolWizard',
				execute: (context) => {
					return import('@libs/timekeeping/timesymbols').then((module) => new module.TimekeepingTimeSymbolWizardClass().disableTimeSymbols(context));
				},
			},
			{
				uuid: '4833891d71fb4b978c8f5c8310c36450',
				name: 'Set Recording Status',
				execute: (context) => {
					return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().setRecordingStatus(context));
				},
			},
			{
				uuid: '67e70baabc0a4dedba0d499020078aa0',
				name: 'Set Report Status',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if ('timekeeping.recording' === internalModuleName) {
						return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().setReportStatus(context));
					} else {
						return import('@libs/timekeeping/timecontrolling').then((module) => new module.TimekeepingTimecontrollingWizardClass().setReportStatus(context));
					}
				}
			},
			{
				uuid: 'e25cba20c7c84b44a55734cb439d6e90',
				name: 'Set Sheet Status',
				execute: (context) => {
					return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().setSheetStatus(context));
				},
			},
			{
				uuid: 'ed0025985a164543914136124b9fa81a',
				name: 'Set Result Status',
				execute: (context) => {
					return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().setResultStatus(context));
				},
			},
			{
				uuid: '84a1e6ab3f5247bfb8eb26f08795a74c',
				name: 'Enable Reports',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if ('timekeeping.recording' === internalModuleName) {
						return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().enableReports(context));
					} else {
						return import('@libs/timekeeping/timecontrolling').then((module) => new module.TimekeepingTimecontrollingWizardClass().enableReports(context));
					}
				}
			},
			{
				uuid: '22df9c21008848df9b575f61540427b3',
				name: 'Disable Reports',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if ('timekeeping.recording' === internalModuleName) {
						return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().disableReports(context));
					} else {
						return import('@libs/timekeeping/timecontrolling').then((module) => new module.TimekeepingTimecontrollingWizardClass().disableReports(context));
					}
				}
			},
			{
				uuid: '8038db7bf72743c1a90fc6ad221f17de',
				name: 'Unlock Used For Transaction',
				execute: (context) => {
					return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().unlockUsedForTransaction(context));
				},
			},
			{
				uuid: '3c5afd7ff2c649839a8816266392571f',
				name: 'Calculate Other Derivations',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if ('timekeeping.recording' === internalModuleName) {
						return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().calculateOtherDerivations(context));
					} else {
						return import('@libs/timekeeping/timecontrolling').then((module) => new module.TimekeepingTimecontrollingWizardClass().calculateOtherDerivations(context));
					}
				},
			},
			{
				uuid: '270c41ffa65f42b896df5514d1a50014',
				name: 'Calculate Overtime',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if ('timekeeping.recording' === internalModuleName) {
						return import('@libs/timekeeping/recording').then((module) => new module.TimekeepingRecordingWizardClass().calculateOvertime(context));
					} else {
						return import('@libs/timekeeping/timecontrolling').then((module) => new module.TimekeepingTimecontrollingWizardClass().calculateOvertime(context));
					}
				},
			},
			{
				uuid: '8fdef7489ab7418f917f9286eb257d01',
				name: 'timekeeping.common.disableWorkTimeWizard',
				execute: (context) => {
					return import('@libs/timekeeping/worktimemodel').then((module) => new module.TimekeepingWorkTimeModelDisableWizardClass().disableWorkTimeModel(context));
				},
			},
			{
				uuid: '50964ae0506c461fb7099b8e1bc7eab8',
				name: 'timekeeping.common.enableWorkTimeWizard',
				execute: (context) => {
					return import('@libs/timekeeping/worktimemodel').then((module) => new module.TimekeepingWorkTimeModelDisableWizardClass().enableWorkTimeModel(context));
				},
			},
			{
				uuid: '7e9548a88f274be19fa6835155739ea8',
				name: 'timekeeping.common.setPeriodStatus',
				execute: (context) => {
					return import('@libs/timekeeping/period').then((module) => new module.TimekeepingPeriodWizardClass().setPeriodStatus(context));
				},
			},
			{
				uuid: '1e79a86fa23e4f298a6ecca95551ce8f',
				name: 'timekeeping.common.lockIsSuccess',
				execute: (context) => {
					return import('@libs/timekeeping/period').then((module) => new module.TimekeepingPeriodWizardClass().lockIsSuccess(context));
				},
			},
			{
				uuid: '50dfbe208ef2449b8ee5ac71ae55e523',
				name: 'timekeeping.common.generateTimeSheetRecords',
				execute(context: IInitializationContext,wizardParameters?: Dictionary<string, unknown>) {
					return import('@libs/timekeeping/period').then((m) => {
						if(wizardParameters){
							context.injector.get(m.TimekeepingGenerateTimesheetRecordsService).generateTimeSheetRecords(wizardParameters);
						}
					});
				}
			},
			{
				uuid: 'afd60abe173546089f30b09e9eee24fc',
				name: 'timekeeping.common.unlockIsSuccess',
				execute: (context) => {
					return import('@libs/timekeeping/period').then((module) => new module.TimekeepingPeriodWizardClass().unlockIsSuccess(context));
				},
			},
			{
				uuid: 'e0ae4ed1c9d240959a3c4e15bd2df2d2',
				name: 'timekeeping.common.createPeriodTransactions',
				execute(context: IInitializationContext) {
					return import('@libs/timekeeping/period').then((m) => {
						context.injector.get(m.TimekeepingCreatePeriodTransaction).createPeriodTransactions();
					});
				}
			},
			{
				uuid: '543cf5918f2b4fb0b9b0547c0aee7f02',
				name: 'timekeeping.settlement.setTimekeepingSettlementStatus',
				execute: (context) => {
					return import('@libs/timekeeping/settlement').then((module) => new module.TimekeepingSettlementWizardClass().changeStatusWizard(context));
				},
			},
			{
				uuid: '6106e416127d40a1a47da65ec62688df',
				name: 'Create Resource',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().createResources(context));
				},
			},
			{
				uuid: '27b4fcf125c54f3780c234e3a1aba5c7',
				name: 'timekeeping.employee.createResourcesByEmployeesWizard.title',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().generatePlannedAbsences(context));
				},
			},
			{
				uuid: '2f9936fd0ec641399cdffe45e975e5e1',
				name: 'timekeeping.timeallocation.timekeepingallocstatus',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().setTimeAllocationStatus(context));
				},
			},
			{
				uuid: '3648738db0f24eb08b67af4ce31c5f7a',
				name: 'timekeeping.timeallocation.translationKeySetReportStatus',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().setReportStatus(context));
				},
			},
			{
				uuid: '882667d0186f4138a1dd3d051003ab27',
				name: 'timekeeping.shiftmodel.createExceptionDaysFromCalendar',
				execute: context => {
					return import('@libs/timekeeping/shiftmodel').then((module) => new module.TimekeepingShiftmodelWizardClass().createExceptionDaysFromCalendar(context));
				}
			},
			{
				uuid: '5bf44f7c795c4564ba6e6479aba781ea',
				name: 'timekeeping.timeallocation.createTimekeepingResults',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().createResult(context));
				},
			},
			{
				uuid: '49167b7f96ee4ef3a104858eab3a3fb1',
				name: 'timekeeping.timeallocation.levelAllocatedTimes',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().levelAllocatedTimes(context));
				},
			},
			{
				uuid: 'e0fbd61d382c41ae8e9a6eb84224b931',
				name: 'timekeeping.timeallocation.createResultHeaders',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().createResultHeaders(context));
				},
			},
			{
				uuid: '00e8423f11724c9f943adbbe09e2d3f8',
				name: 'timekeeping.timeallocation.createDispatchingRecords',
				execute: (context) => {
					return import('@libs/timekeeping/timeallocation').then((module) => new module.TimeKeepingTimeallocationWizardClass().createDispatchingRecords(context));
				},
			},
			{
				uuid: 'c375c8caaa3644b4adfbf72e77256ff6',
				name: 'timekeeping.employee.employeeStatusWizard',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().setEmployeeStatus(context));
				},
			},
			{
				uuid: '9bc066326fae45e68798d99e314cac1b',
				name: 'basics.customize.plannedabsencestatus',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().setPlannedAbsenceStatus(context));
				},
			},
			{
				uuid: 'b893f83de69e4d0eac630df78eaf7c79',
				name: 'cloud.common.enableRecord',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().enableEmployee(context));
				},
			},
			{
				uuid: '6403dcc971c6460b8b5d9e42578fd14c',
				name: 'timekeeping.employee.employeeSkillStatusWizard',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().setEmployeeSkillStatus(context));
				},
			},
			{
				uuid: 'df9d5e1dd85c4af3a7618bf455cb2957',
				name: 'cloud.common.disableRecord',
				execute: (context) => {
					return import('@libs/timekeeping/employee').then((module) => new module.TimeKeepingEmployeeWizardClass().disableEmployee(context));
				},
			}
			//TODO createReservation (Update Planning Board Wizard) after JobLookup is created
		];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
