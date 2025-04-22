/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { ProcurementCommonItemDataService } from '../procurement-common-item-data.service';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { IPrcItemEntity } from '../../model/entities';
import { IPrcCommonReadonlyService, IPrcHeaderDataService } from '../../model/interfaces';
import { IProcurementCommonReplaceNeutralMaterialSimulationDto } from '../../model/dtoes';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { CustomStep, IEditorDialogResult, MultistepDialog, UiCommonMultistepDialogService } from '@libs/ui/common';
import { ReplaceNeutralMaterialBasicOptionComponent } from '../../components/replace-neutral-material/replace-neutral-material-basic-option/replace-neutral-material-basic-option.component';
import { ReplaceNeutralMaterialReplaceItemComponent } from '../../components/replace-neutral-material/replace-neutral-material-replace-item/replace-neutral-material-replace-item.component';
import { IProcurementCommonReplaceNeutralMaterialComplete } from '../../model/interfaces/wizard/procurement-common-replace-neutral-material-wizard.interface';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { ProcurementReplaceNeutralMaterialResponseStatus, ProcurementReplaceNeutralMaterialOption, ProcurementReplaceNeutralMaterialCatalogFilter } from '../../model/enums';
import { ProjectSharedLookupService } from '@libs/project/shared';

interface IProcurementCommonReplaceNeutralMaterialWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>, IT extends IPrcItemEntity, IU extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends IProcurementCommonWizardConfig<T, U> {
	moduleNameTranslationKey: string;
	currentModuleTranslationKey: string;
	leadsFromProjectTranslationKey: string;
	rootDataService: IPrcHeaderDataService<T, U> & IPrcCommonReadonlyService<T> & (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>);
	prcItemService: ProcurementCommonItemDataService<IT, IU, PT, PU>;
	module: number;
	getCompanyFk: (entity: T) => number | undefined;
	getTaxCodeFk: (entity: T) => number | undefined;
	getBpdVatGroupFk: (entity: T) => number | undefined;
}

export abstract class IProcurementCommonReplaceNeutralMaterialWizardService<
	T extends IEntityIdentification,
	U extends CompleteIdentification<T>,
	IT extends IPrcItemEntity,
	IU extends PrcCommonItemComplete,
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>
> extends ProcurementCommonWizardBaseService<T, U, IProcurementCommonReplaceNeutralMaterialComplete> {
	private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);

	public constructor(protected override readonly config: IProcurementCommonReplaceNeutralMaterialWizardConfig<T, U, IT, IU, PT, PU>) {
		super(config);
	}

	protected override async showWizardDialog() {
		const stepTitle = this.translateService.instant('procurement.common.wizard.replaceNeutralMaterial.title');
		const basicSetting = new CustomStep('scopeOption', stepTitle, ReplaceNeutralMaterialBasicOptionComponent, [], 'basicOption');
		const replaceItems = new CustomStep('replaceItem', stepTitle, ReplaceNeutralMaterialReplaceItemComponent, [], 'replaceItem');
		const headerContext = this.config.rootDataService.getHeaderContext();
		const projectId = headerContext.projectFk;
		let projectName: string = '';
		let hasProject: boolean = false;
		if (projectId) {
			const project = await firstValueFrom(this.projectLookupService.getItemByKey({id: projectId}));
			if (project) {
				hasProject = true;
				projectName = project.ProjectName;
			}
		}
		const currentModuleText = this.translateService.instant(this.config.currentModuleTranslationKey).text;
		const leadOptionText = this.translateService.instant(this.config.leadsFromProjectTranslationKey, {projectName: projectName}).text;
		const selectedPrcItem = this.config.prcItemService.getSelectedEntity();
		const hasMaterial = !!(selectedPrcItem && selectedPrcItem.MdcMaterialFk);
		const dataItem: IProcurementCommonReplaceNeutralMaterialComplete = {
			basicOption: {
				optionItem: {
					scopeSetting: ProcurementReplaceNeutralMaterialOption.CurrentLeadRecord,
					fromCatalog: ProcurementReplaceNeutralMaterialCatalogFilter.AllCatalog,
				},
				replaceCriteria: [],
			},
			currentModuleText: currentModuleText,
			leadOptionText: leadOptionText,
			hasMaterial: hasMaterial,
			hasProject: hasProject,
			replaceItem: {
				simulationItems: [],
				resultItems: [],
			},
		};

		const multistepDialog = new MultistepDialog(dataItem, [basicSetting, replaceItems]);
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'refresh',
				caption: {key: 'procurement.common.wizard.replaceNeutralMaterial.refresh'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 1;
				},
				fn: (event, info) => {
					if (info.dialog.value && info.dialog.value.dataItem) {
						this.getSimulationItems(info.dialog.value.dataItem);
					}
				},
			},
			{
				id: 'previousStep',
				caption: {key: 'cloud.common.previousStep'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex !== 0;
				},
				fn: (event, info) => {
					info.dialog.value?.goToPrevious();
				},
			},
			{
				id: 'nextBtn',
				caption: {key: 'basics.common.button.nextStep'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 0;
				},
				fn: (event, info) => {
					if (info.dialog.value && info.dialog.value.dataItem) {
						const selectCriterials = info.dialog.value.dataItem.basicOption.replaceCriteria.filter((item) => item.Selected);
						if (selectCriterials.length == 0) {
							this.messageBoxService.showMsgBox('procurement.common.wizard.replaceNeutralMaterial.errorNoReplaceCriteriaSelected', 'cloud.common.informationDialogHeader', 'ico-info');
						} else {
							info.dialog.value?.goToNext();
							this.getSimulationItems(info.dialog.value.dataItem);
						}
					}
				},
			},
			{
				id: 'replace',
				caption: {key: 'procurement.common.wizard.replaceNeutralMaterial.replace'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 1;
				},
			},
			{
				id: 'closeWin',
				caption: {key: 'basics.common.button.cancel'},
				autoClose: true,
			},
		];
		return this.multistepService.showDialog(multistepDialog);
	}

	protected override isExecuteButtonClicked(result: IEditorDialogResult<IProcurementCommonReplaceNeutralMaterialComplete> | undefined): boolean {
		return result?.closingButtonId === 'replace';
	}

	public async getSimulationItems(dataItem: IProcurementCommonReplaceNeutralMaterialComplete) {
		const requestParam = dataItem.basicOption;
		const criteriaChooseArr = requestParam.replaceCriteria.filter((item) => item.Selected).map((item) => item.Id);
		const headerEntity = this.config.rootDataService.getSelectedEntity()!;
		const headerContext = this.config.rootDataService.getHeaderContext();
		const fromFlg = this.config.module;
		const prcItemEntity = this.config.prcItemService.getSelectedEntity();
		const prcItemId = prcItemEntity != null ? prcItemEntity.Id : -1;
		const resp = await this.http.post('procurement/common/replaceNeutralMaterial/getSimulationDatas', {
			resultFlg: requestParam.optionItem.scopeSetting,
			Id: headerEntity.Id,
			projectId: headerContext.projectFk,
			catalogFlg: requestParam.optionItem.fromCatalog,
			specificCatalogFk: !requestParam.optionItem.fromCatalog ? requestParam.optionItem.specificCatalogFk : 0,
			criteriaChooseArr: criteriaChooseArr,
			companyId: this.config.getCompanyFk(headerEntity),
			fromFlg: fromFlg,
			prcItemId: prcItemId,
		});
		if (resp) {
			const responseData = resp as { main: IProcurementCommonReplaceNeutralMaterialSimulationDto[]; status: number };
			if (responseData.status === ProcurementReplaceNeutralMaterialResponseStatus.NoLead) {
				const name = this.translateService.instant(this.config.moduleNameTranslationKey).text;
				this.messageBoxService.showMsgBox(this.translateService.instant('procurement.common.wizard.noLeadFound', {leadName: name}).text, 'cloud.common.informationDialogHeader', 'ico-info');
			} else if (responseData.status === ProcurementReplaceNeutralMaterialResponseStatus.NoItem) {
				this.messageBoxService.showMsgBox('procurement.common.wizard.replaceNeutralMaterial.noItemFound', 'cloud.common.informationDialogHeader', 'ico-info');
			} else if (responseData.main.length === 0) {
				this.messageBoxService.showMsgBox('procurement.common.wizard.replaceNeutralMaterial.noNeutralFound', 'cloud.common.informationDialogHeader', 'ico-info');
			} else if (responseData.main.length > 0) {
				dataItem.replaceItem.simulationItems = responseData.main;
			}
		}
	}

	protected override async doExecuteWizard(dataItem: IProcurementCommonReplaceNeutralMaterialComplete) {
		const fromFlg = this.config.module;
		const headerContext = this.config.rootDataService.getHeaderContext();
		const selectedEntity = this.config.rootDataService.getSelectedEntity();
		const selectGridDatas = dataItem.replaceItem.simulationItems
			.filter((item) => {
				return item.Selected;
			})
			.map((item) => {
				return {
					Id: item.Id,
					MathingMaterialCode: item.MathingMaterialCode,
					Status: item.Status,
				};
			});

		const resp = await this.http.post('procurement/common/replaceNeutralMaterial/replaceSimulationDatas', {
			fromFlg: fromFlg,
			companyCurrencyId: headerContext.currencyFk,
			projectId: headerContext.projectFk,
			gridDatas: selectGridDatas,
			ParentTaxCodeFk: this.config.getTaxCodeFk(selectedEntity!),
			ParentVatGroupFk: this.config.getBpdVatGroupFk(selectedEntity!),
		});
		await this.messageBoxService.showMsgBox(`procurement.common.wizard.replaceNeutralMaterial.${resp ? 'replaceSuccess' : 'replaceFailure'}`, 'cloud.common.informationDialogHeader', 'ico-info');
		return true;
	}

	public execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}
