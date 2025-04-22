/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IClosingDialogButtonEventInfo, ISimpleMenuItem, ItemType, StandardDialogButtonId } from '@libs/ui/common';
import { ServiceLocator, Translatable } from '@libs/platform/common';
import { ICompositeBaseEntity } from '../model/entities/composite-base-entity.interface';
import { IconCssClass } from '../model/constants/icon-css-class';
import { ICompareGridState } from '../model/entities/compare-grid-state.interface';
import { ICompareTreeResponseBase } from '../model/entities/compare-tree-response-base.interface';
import { ProcurementPricecomparisonCompareDataBaseService } from '../services/compare-data-base.service';
import { ProcurementPricecomparisonCompareSettingDialogService } from '../services/compare-setting-dialog.service';
import { ICompareSettingBase } from '../model/entities/compare-setting-base.interface';
import { ICompareSettingDialogOptions } from '../model/entities/compare-setting-dialog-options.inteface';
import { ProcurementPricecomparisonConfigurationService } from '../services/configuration.service';
import { ProcurementPricecomparisonUtilService } from '../services/util.service';
import { ProcurementPricecomparisonComparePrintDialogService } from '../services/print/dialog/compare-print-dialog.service';
import { IComparePrintDialogEvents, IComparePrintDialogOptions, IComparePrintEditorDialog } from '../model/entities/print/compare-print-dialog-options.interface';
import { IComparePrintBase } from '../model/entities/print/compare-print-base.interface';
import { ComparePrintSettingServiceBase } from '../model/entities/print/compare-print-setting-service-base.class';
import { IComparePrintGenericProfile } from '../model/entities/print/compare-print-generic-profile.interface';
import { IComparePrintRfqProfile } from '../model/entities/print/compare-print-rfq-profile.interface';
import { ComparePrintServiceBase } from '../model/entities/print/compare-print-service-base.class';
import { CompareDataSaveTypes } from '../model/enums/compare-data-save-types.enum';
import { ProcurementPricecomparisonCompareEventManagerService } from '../services/compare-event-manager.service';
import { ProcurementPricecomparisonCompareCommonDialogService } from '../services/compare-common-dialog.service';
import { ICompareDataSaveResult } from '../model/entities/compare-data-save-result.interface';
import { CompareEvents } from '../model/enums/compare-events.enum';
import { ICompareDataManager } from '../model/entities/compare-data-manager.interface';
import { ComparePrintConstants } from '../model/constants/print/compare-print-constats';
import { IComparePrintProfileEntity } from '../model/entities/print/compare-print-profile-entity.interface';
import { CompareProfileSaveTypes } from '../model/enums/compare-profile-save-types.enum';
import { ComparePrintProfileServiceBase } from '../model/entities/print/compare-print-profile-service-base.class';
import { CompareProfileSaveLocations } from '../model/enums/compare-profile-save-locations.enum';
import { CompareGridColumn, GridFormatter } from '../model/entities/compare-grid-column.interface';

export abstract class ProcurementPricecomparisonCompareBehaviorBaseService<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>,
> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	protected readonly utilSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly configSvc = ServiceLocator.injector.get(ProcurementPricecomparisonConfigurationService);
	protected readonly settingDlgSvc = ServiceLocator.injector.get(ProcurementPricecomparisonCompareSettingDialogService);
	protected readonly printDlgSvc = ServiceLocator.injector.get(ProcurementPricecomparisonComparePrintDialogService);
	protected readonly eventMgr = ServiceLocator.injector.get(ProcurementPricecomparisonCompareEventManagerService);
	protected readonly commonDlgSvc = ServiceLocator.injector.get(ProcurementPricecomparisonCompareCommonDialogService);

	protected constructor(
		protected dataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>,
		protected printSettingSvc: ComparePrintSettingServiceBase<T, RT>,
		protected printProfileSvc: ComparePrintProfileServiceBase<T, RT>,
		protected printSvc: ComparePrintServiceBase<T, RT>
	) {

	}

	private containerLink!: IGridContainerLink<T>;

	private createToolbar(id: string, caption: Translatable, sort: number, cssClass: string, fn?: () => void): ISimpleMenuItem {
		return {
			id: id,
			caption: caption,
			type: ItemType.Item,
			hideItem: false,
			sort: sort,
			iconClass: cssClass,
			fn: fn ? fn.bind(this) : undefined
		};
	}

	private handleToolbars(containerLink: IGridContainerLink<T>) {
		containerLink.uiAddOns.toolbar.addItems([
			this.createToolbar('t104', {text: 'Reload Latest Quotes', key: 'procurement.pricecomparison.reload'}, 140, IconCssClass.toolbar.reload, this.reloadLatestQuotes),
			this.createToolbar('t105', {text: 'Settings', key: 'cloud.common.toolbarSetting'}, 141, IconCssClass.toolbar.settings, this.showSettingDialog),
			this.createToolbar('t106', {text: 'Print', key: 'platform.formContainer.print'}, 142, IconCssClass.toolbar.print, this.showPrintDialog),
			this.createToolbar('t107', {text: 'Save to original', key: 'procurement.pricecomparison.saveToOriginal'}, 143, IconCssClass.toolbar.save, this.saveToOriginal),
			this.createToolbar('t108', {text: 'Save to new version', key: 'procurement.pricecomparison.saveToNewVersion'}, 144, IconCssClass.toolbar.saveAs, this.saveToNew)
		]);

		containerLink.uiAddOns.toolbar.deleteItems([
			EntityContainerCommand.CreationGroup,
			EntityContainerCommand.DeletionGroup
		]);
	}

	private initialized: boolean = false;
	private attached: boolean = false;

	private refreshGrid(gridState: ICompareGridState<T>) {
		this.containerLink.gridData = [...gridState.data];

		if (gridState.columns) {
			if (this.containerLink.grid && !this.initialized) {
				const linkGrid = this.containerLink.grid as unknown as {
					gridHostApi: {
						grid: {
							onHeaderCellRendered: {
								subscribe: (fn: () => void) => void
							},
							getColumns(): Array<{
								id: string,
								formatter: GridFormatter<T>
							}>
						},
						dataView: {
							setFilterExtension: (filterFn: (node: T) => boolean) => void
						}
					}
				};

				linkGrid.gridHostApi.grid.onHeaderCellRendered.subscribe(() => {
					if (this.attached) {
						return;
					}

					const columns = linkGrid.gridHostApi.grid.getColumns();

					this.containerLink.grid.columns.forEach(col => {
						const gridCol = col as CompareGridColumn<T>;
						const target = columns.find(e => e.id === col.id);
						if (target && gridCol && gridCol.customFormatter) {
							const customFormatter = gridCol.customFormatter as GridFormatter<T>;
							if (target.formatter) {
								const originalFormatter = target.formatter;
								target.formatter = (row: number, col: number, value: unknown, column: CompareGridColumn<T>, dataContext: T) => {
									const originalValue = originalFormatter(row, col, value, column, dataContext);
									return customFormatter(row, col, originalValue, column, dataContext);
								};
							} else {
								target.formatter = customFormatter;
							}
						}
					});

					// TODO-DRIZZLE: To be checked.
					this.utilSvc.removeDataRowsRecursively(this.containerLink.gridData as T[], item => {
						return !!item._rt$Deleted;
					}, false);
					/*linkGrid.gridHostApi.dataView.setFilterExtension((node) => {
						node.HasChildren = !_.isNil(node.Children) && _.filter(node.Children, (item) => {
							return !item._rt$Deleted;
						}).length > 0;
						if (node.nodeInfo) {
							node.nodeInfo.children = node.HasChildren;
							node.nodeInfo.lastElement = !node.HasChildren;
						}
						return node._rt$Deleted !== true;
					});*/

					this.attached = true;
				});

				this.initialized = true;
			}

			this.containerLink.gridConfig.columns = [...gridState.columns];
		}
	}

	// Toolbar handlers

	protected async compareSettings(): Promise<ICompareSettingBase<T>> {
		const quoteColumns = await this.dataSvc.loadQuoteColumns();
		const gridColumns = await this.dataSvc.loadGridColumns();
		const settings: ICompareSettingBase<T> = {
			gridColumns: gridColumns,
			quoteColumns: quoteColumns,
			quoteFields: this.dataSvc.getCompareQuoteRows(),
			billingSchemaFields: this.dataSvc.getCompareBillingSchemaRows(),
			compareFields: this.dataSvc.getCompareRows(),
			isFinalShowInTotal: this.dataSvc.isFinalShowInTotal(),
			isVerticalCompareRows: this.dataSvc.isVerticalCompareRows(),
			isShowLineValueColumn: this.dataSvc.isFinalShowInTotal()
		};
		return Promise.resolve(settings);
	}

	protected abstract printSettings(genericProfile: IComparePrintGenericProfile, rfqProfile: IComparePrintRfqProfile): Promise<IComparePrintBase<T>>;

	protected async settingDialogOptions(): Promise<ICompareSettingDialogOptions<T, ICompareSettingBase<T>>> {
		return Promise.resolve({});
	}

	protected async printDialogOptions(): Promise<IComparePrintDialogOptions<T, IComparePrintBase<T>>> {
		return Promise.resolve({
			buttons: [{
				id: 'saveAs',
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IComparePrintEditorDialog<T, IComparePrintBase<T>>, void>) => {
					const type = await this.printDlgSvc.showSaveAs();
					if (!type) {
						return;
					}

					const profileType = this.printProfileSvc.getProfileType();
					const profiles = type === CompareProfileSaveTypes.generic ? info.dialog.value?.genericProfiles : info.dialog.value?.rfqProfiles;
					await this.printDlgSvc.showSaveAsProfile(this.dataSvc.getParentSelectedIdElse(), profileType, type, profiles ?? [], {
						toPropertyConfig: (item: IComparePrintProfileEntity) => {
							return type === CompareProfileSaveTypes.generic
								? this.printProfileSvc.toGenericProfile(info.dialog.value as IComparePrintBase<T>, item.PropertyConfig as IComparePrintGenericProfile)
								: this.printProfileSvc.toRfqProfile(info.dialog.value as IComparePrintBase<T>, item.PropertyConfig as IComparePrintRfqProfile);
						},
						delete: (item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => {
							return this.printProfileSvc.deleteProfile(item.Id);
						},
						setDefault: (location: CompareProfileSaveLocations, item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => {
							return this.printProfileSvc.setDefault(item.Id, location);
						},
						save: async (location: CompareProfileSaveLocations, item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => {
							const r = await this.printProfileSvc.saveProfile(location, [item]);
							return r.length > 0;
						}
					});
				}
			}, {
				id: 'preview',
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IComparePrintEditorDialog<T, IComparePrintBase<T>>, void>) => {
					info.dialog.loading = true;
					await this.printSvc.checkQuoteModifiedState();
					await this.printSvc.preview();
					info.dialog.loading = false;
				}
			}, {
				id: 'print',
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IComparePrintEditorDialog<T, IComparePrintBase<T>>, void>) => {
					info.dialog.loading = true;
					await this.printSvc.checkQuoteModifiedState();
					await this.printSettingSvc.saveCurrentSetting(info.dialog.value as IComparePrintBase<T>);
					await this.printSvc.print();
					info.dialog.loading = false;
					info.dialog.close();
				}
			}, {
				id: 'save',
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IComparePrintEditorDialog<T, IComparePrintBase<T>>, void>) => {
					info.dialog.loading = true;
					await this.printSettingSvc.saveCurrentSetting(info.dialog.value as IComparePrintBase<T>);
					// TODO-DRIZZLE: To be checked, is clear cache necessary?
					// clear all cache
					//this.printSettingSvc.clearCache();
					//this.profileService.clearCache();
					info.dialog.loading = false;
					info.dialog.close();
				}
			}]
		});
	}

	private async reloadLatestQuotes() {
		this.dataSvc.reloadLatestQuotes().then();
	}

	private async showSettingDialog() {
		const dialogOptions = await this.settingDialogOptions();
		return this.settingDlgSvc.show(() => {
			return this.compareSettings();
		}, dialogOptions).then(result => {
			if (result) {
				this.dataSvc.saveCustomSettings2DB({
					RfqHeaderFk: this.dataSvc.parentService.getSelectedBaseRfqId(),
					CompareType: this.dataSvc.compareType,
					CompareColumns: result.quoteColumns,
					compareBaseColumns: this.utilSvc.getBaseColumns(result.quoteColumns),
					DeletedColumns: result.quoteDeletedColumns ? result.quoteDeletedColumns : [],
					compareRows: result.compareFields,
					compareQuoteRows: result.quoteFields,
					compareBillingSchemaRows: result.billingSchemaFields,
					isVerticalCompareRows: result.isVerticalCompareRows,
					isLineValueColumn: result.isShowLineValueColumn,
					isFinalShowInTotal: result.isFinalShowInTotal,
					gridColumns: result.gridColumns,
				}).then(() => {
					// TODO-DRIZZLE: To be checked.
				});
			}
		});
	}

	private async showPrintDialog() {
		const events: IComparePrintDialogEvents<T, IComparePrintBase<T>> = {
			loadModeChanged: (value: string, settings: IComparePrintBase<T>) => {
				this.printSettingSvc.setLoadMode(value);

				if (value === ComparePrintConstants.loadMode.default) {
					const generic = this.printSettingSvc.getDefaultProfileItem(settings.genericProfiles);
					const rfq = this.printSettingSvc.getDefaultProfileItem(settings.rfqProfiles);

					if (generic && generic.Id && generic.PropertyConfig) {
						settings.genericProfileSelectedValue = generic.Id;
						this.printProfileSvc.toGenericSetting(generic.PropertyConfig as IComparePrintGenericProfile, settings);
					}

					if (rfq && rfq.Id && rfq.PropertyConfig) {
						settings.rfqProfileSelectedValue = rfq.Id;
						this.printProfileSvc.toRfqSetting(rfq.PropertyConfig as IComparePrintRfqProfile, settings);
					}
				} else {
					const rfqHeaderId = this.dataSvc.getParentSelectedIdElse();
					const generic = settings.genericProfiles.find(e => e.Id === ComparePrintConstants.currentView.generic);
					const rfq = settings.rfqProfiles.find(e => e.Id === ComparePrintConstants.currentView.rfq);

					settings.genericProfileSelectedValue = ComparePrintConstants.currentView.generic;
					settings.rfqProfileSelectedValue = ComparePrintConstants.currentView.rfq;

					this.printSettingSvc.getCurrentView(rfqHeaderId).then(profiles => {
						if (generic) {
							generic.PropertyConfig = _.cloneDeep(profiles[0]);
							this.printProfileSvc.toGenericSetting(generic.PropertyConfig as IComparePrintGenericProfile, settings);
						}

						if (rfq) {
							rfq.PropertyConfig = _.cloneDeep(profiles[1]);
							this.printProfileSvc.toRfqSetting(rfq.PropertyConfig as IComparePrintRfqProfile, settings);
						}
					});
				}
			},
			genericProfileChanged: (value: IComparePrintProfileEntity, settings: IComparePrintBase<T>) => {
				const generic = value.PropertyConfig as IComparePrintGenericProfile;
				this.printProfileSvc.toGenericSetting(generic, settings);
			},
			rfqProfileChanged: (value: IComparePrintProfileEntity, settings: IComparePrintBase<T>) => {
				const rfq = value.PropertyConfig as IComparePrintRfqProfile;
				this.printProfileSvc.toRfqSetting(rfq, settings);
			}
		};

		const dialogOptions = await this.printDialogOptions();
		return this.printDlgSvc.show(async () => {
			const loadModeValue = await this.printSettingSvc.getSystemOptions();
			const genericProfile = await this.printSettingSvc.getCurrentGenericSetting(true, true);
			const rfqProfile = await this.printSettingSvc.getCurrentRfqSetting(true, true);
			const settings = await this.printSettings(genericProfile, rfqProfile);

			settings.loadModeValue = loadModeValue;

			switch (loadModeValue) {
				case ComparePrintConstants.loadMode.current:
					settings.genericProfileSelectedValue = ComparePrintConstants.currentView.generic;
					settings.rfqProfileSelectedValue = ComparePrintConstants.currentView.rfq;
					break;
				case ComparePrintConstants.loadMode.default:
				case ComparePrintConstants.loadMode.latest: {
					const genericDef = this.printSettingSvc.getDefaultProfileItem(settings.genericProfiles);
					const rfqDef = this.printSettingSvc.getDefaultProfileItem(settings.rfqProfiles);
					settings.genericProfileSelectedValue = genericDef?.Id;
					settings.rfqProfileSelectedValue = rfqDef?.Id;
					break;
				}
			}

			return settings;
		}, dialogOptions, events).then(result => {
			// TODO-DRIZZLE: To be checked.
		});
	}

	private async saveToOriginal() {
		return this.dataSvc.saveToQuote(CompareDataSaveTypes.Original);
	}

	private async saveToNew() {
		return this.commonDlgSvc.showSaveNewVersionDialog()?.then((result) => {
			if (result && result.closingButtonId !== StandardDialogButtonId.Ok) {
				return;
			}
			return this.dataSvc.saveToQuote(CompareDataSaveTypes.New, null, false, result?.value);
		});
	}

	protected registerDataSavedEvent(
		event: CompareEvents.BoqSaved | CompareEvents.ItemSaved,
		currSvc: ICompareDataManager,
		siblingSvcFn?: () => ICompareDataManager | undefined,
		callback?: (response: ICompareDataSaveResult) => void
	) {
		this.eventMgr.subscribe<ICompareDataSaveResult>(event, (currResult) => {
			if (callback) {
				callback(currResult);
			}

			this.utilSvc.reloadNewVersionData(this.dataSvc.parentService.getSelectedBaseRfqId(), this.dataSvc.compareType, currResult, currSvc, siblingSvcFn, currResult.hasCommonChanged, false);
		});
	}

	public onInit(containerLink: IGridContainerLink<T>) {
		this.containerLink = containerLink;

		this.handleToolbars(containerLink);

		const tree = this.dataSvc.getTree();
		if (tree) {
			const columns = this.dataSvc.columnBuilder.buildColumns();
			this.refreshGrid({
				columns: columns,
				data: tree
			});
		}
	}

	public onCreate(containerLink: IGridContainerLink<T>) {
		this.containerLink = containerLink;
		containerLink.registerSubscription(this.dataSvc.gridStateChanged.subscribe(gridState => {
			this.refreshGrid(gridState);
		}));
	}

	public onDestroy(containerLink: IGridContainerLink<T>) {

	}
}