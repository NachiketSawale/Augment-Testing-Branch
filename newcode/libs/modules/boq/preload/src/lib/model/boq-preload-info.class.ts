import { Dictionary, IInitializationContext, ISubModuleRouteInfo, ITile, IWizard, LazyInjectableInfo, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { BoqWizardRegisterService, BoqWizardUuidConstants, IBoqWizardService } from '@libs/boq/interfaces';


export class BoqPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new BoqPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'boq';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return the tiles
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'boq.wic',
				tileSize: TileSize.Small,
				color: 4365975,
				opacity: 0.9,
				iconClass: 'ico-boq',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					key: 'cloud.desktop.moduleDisplayNameBusinessWIC',
				},
				description: {
					key: 'cloud.desktop.moduleDescriptionWIC',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 10,
				permissionGuid: '40239db4f9d94e4b87afa66224d5767c',
				targetRoute: 'boq/wic',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('wic', () => import('@libs/boq/wic').then((module) => module.BoqWicModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/boq/main').then((module) => module.BoqMainModule)),
			ContainerModuleRouteInfo.create('project', () => import('@libs/boq/project').then((module) => module.BoqProjectModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		const executeWizard = (context: IInitializationContext, uuid: string, wizardParameters?: Dictionary<string, unknown>): Promise<void> | undefined => {
			const moduleName = context.moduleManager.activeModule!.internalModuleName;
			const feature = context.injector.get(BoqWizardRegisterService).getFeature(moduleName, uuid);
			return context.moduleManager.currentModuleFeatures.getFeature<IBoqWizardService>(feature)?.execute(context,wizardParameters);
		};

		return [
			{
				uuid: BoqWizardUuidConstants.ImportCrbNpkWizardUuid,
				name: 'importCrbNpk',
				execute: (context) => {
					return import('@libs/boq/wic').then((module) => new module.BoqWicWizardService().importCrbNpk(context));
				},
			},
			{
				uuid: BoqWizardUuidConstants.ImportOenOnlbWizardUuid,
				name: 'importOenOnlb',
				execute: (context) => {
					return import('@libs/boq/wic').then((module) => new module.BoqWicWizardService().importOenOnlb(context));
				},
			},
			{
				uuid: BoqWizardUuidConstants.FormatBoqSpecificationWizardUuid,
				name: 'formatBoqSpecification',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.FormatBoqSpecificationWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.EraseEmptyDivisionsWizardUuid,
				name: 'eraseEmptyDivisions',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.EraseEmptyDivisionsWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.RenumberFreeBoqWizardUuid,
				name: 'renumberFreeBoq',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.RenumberFreeBoqWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.GenerateWicNumberWizardUuid,
				name: 'generateWicNumber',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.GenerateWicNumberWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.UpdateDataFromWicWizardUuid,
				name: 'updateDatafromWIC',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.UpdateDataFromWicWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ResetServiceCatalogNoWizardUuid,
				name: 'resetServiceCatalogNo',
				execute: (context) => {
					return executeWizard(context, BoqWizardUuidConstants.ResetServiceCatalogNoWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.RenumberBoqWizardUuid,
				name: 'renumBoq',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.RenumberBoqWizardUuid);
				}
			},
			{
				uuid: BoqWizardUuidConstants.ExportGaebWizardUuid,
				name: 'exportGaeb',
				execute: (context, wizardParameters) => {
					return executeWizard(context, BoqWizardUuidConstants.ExportGaebWizardUuid, wizardParameters);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ScanBoqWizardUuid,
				name: 'scanBoq',
				execute: (context, wizardParameters) => {
					return executeWizard(context, BoqWizardUuidConstants.ScanBoqWizardUuid, wizardParameters);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ExcelExportWizardUuid,
				name: 'excelExport',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.ExcelExportWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ExcelImportWizardUuid,
				name: 'importExcel',
				execute: (context, wizardParameters) => {
					return executeWizard(context, BoqWizardUuidConstants.ExcelImportWizardUuid, wizardParameters);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ImportGaebWizardUuid,
				name: 'importGaeb',
				execute: (context, wizardParameters) => {
					return executeWizard(context, BoqWizardUuidConstants.ImportGaebWizardUuid, wizardParameters);
				},
			},
			{
				uuid: BoqWizardUuidConstants.UpdateBoqWizardUuid,
				name: 'updateBoq',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.UpdateBoqWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ImportOenOnlvWizardUuid,
				name: 'importOenOnlv',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.ImportOenOnlvWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ExportOenOnlvWizardUuid,
				name: 'exportOenOnlv',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.ExportOenOnlvWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.ExportOenOnlbWizardUuid,
				name: 'exportOenOnlb',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.ExportOenOnlbWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.CrbSiaImportWizardUuid,
				name: 'importCrbSia',
				execute: context => {
					return executeWizard(context, BoqWizardUuidConstants.CrbSiaImportWizardUuid);
				},
			},
			{
				uuid: BoqWizardUuidConstants.CrbSiaExportWizardUuid,
				name: 'exportCrbSia',
				execute: context=> {
					return executeWizard(context, BoqWizardUuidConstants.CrbSiaExportWizardUuid);
				},
			},
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
