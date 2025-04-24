/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input, OnInit } from '@angular/core';
import { FieldType, getMultiStepDialogDataToken, IDialog, IGridConfiguration, IMenuItemsList, ItemType } from '@libs/ui/common';
import { ProcurementReplaceNeutralMaterialCatalogFilter, ProcurementReplaceNeutralMaterialCriteria, ProcurementReplaceNeutralMaterialOption } from '../../../model/enums';
import { IProcurementCommonReplaceCriteriaDto } from '../../../model/dtoes';
import { PlatformTranslateService } from '@libs/platform/common';
import { IProcurementCommonReplaceNeutralBasicOption, IProcurementCommonReplaceNeutralMaterialComplete } from '../../../model/interfaces/wizard/procurement-common-replace-neutral-material-wizard.interface';
import { BasicsSharedMaterialCatalogLookupService } from '@libs/basics/shared';

@Component({
	selector: 'procurement-common-replace-neutral-material-basic-option',
	templateUrl: './replace-neutral-material-basic-option.component.html',
	styleUrl: './replace-neutral-material-basic-option.component.scss'
})
export class ReplaceNeutralMaterialBasicOptionComponent implements OnInit {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IProcurementCommonReplaceNeutralMaterialComplete>());

	@Input()
	protected optionItem!: IProcurementCommonReplaceNeutralBasicOption;
	@Input()
	protected replaceCriteria!: IProcurementCommonReplaceCriteriaDto[];

	public readonly materialCatalogLookup = inject(BasicsSharedMaterialCatalogLookupService);

	public scopeOptions = [{
		value: ProcurementReplaceNeutralMaterialOption.HighlightedMaterial,
		label: this.translateService.instant('procurement.common.wizard.replaceNeutralMaterial.highlightedMaterial').text,
		isActive: this.dialogData.dataItem.hasMaterial
	}, {
		value: ProcurementReplaceNeutralMaterialOption.CurrentLeadRecord,
		label: this.dialogData.dataItem.currentModuleText,
		isActive: true
	}, {
		value: ProcurementReplaceNeutralMaterialOption.AllLeadRecordsByCurrentProject,
		label: this.dialogData.dataItem.leadOptionText,
		isActive: this.dialogData.dataItem.hasProject
	}
	];

	protected readonly allCatalog = ProcurementReplaceNeutralMaterialCatalogFilter.AllCatalog;
	protected readonly specificCatalog = ProcurementReplaceNeutralMaterialCatalogFilter.SpecificCatalog;

	protected tools: IMenuItemsList<IDialog> = {
		cssClass: 'tools',
		items: [{
			type: ItemType.Item,
			caption: {key: 'cloud.common.toolbarMoveUp', text: 'row up'},
			iconClass: 'tlb-icons ico-grid-row-up',
			id: 'up',
			fn: () => {
				//todo up grid
			}
		}, {
			type: ItemType.Item,
			caption: {key: 'cloud.common.toolbarMoveDown', text: 'row down'},
			iconClass: 'tlb-icons ico-grid-row-down',
			id: 'down',
			fn: () => {
				//todo down grid
			}
		}]
	};

	public replaceCriteriaConfig: IGridConfiguration<IProcurementCommonReplaceCriteriaDto> = {
		uuid: 'c10dde19ed424a19af345abcd5785686',
		items: this.replaceCriteria,
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		columns: [{
			id: 'selected',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.checked', text: 'Checked'},
			model: 'Selected',
			readonly: false,
			sortable: true,
			type: FieldType.Boolean,
			visible: true
		}, {
			id: 'name',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.replaceCriteria', text: 'Replace Criteria'},
			model: 'Name',
			width: 200,
			readonly: false,
			sortable: true,
			type: FieldType.Text,
			visible: true
		}]
	};

	public ngOnInit() {
		this.replaceCriteria = [
			{
				Id: ProcurementReplaceNeutralMaterialCriteria.NeutralMaterialAssignment,
				Selected: true,
				Name: this.translateService.instant('procurement.common.wizard.replaceNeutralMaterial.byNeutralMaterialAssignment').text
			},
			{
				Id: ProcurementReplaceNeutralMaterialCriteria.IdenticalMaterialCode,
				Selected: true,
				Name: this.translateService.instant('procurement.common.wizard.replaceNeutralMaterial.byIdenticalMaterialCode').text
			},
			{
				Id: ProcurementReplaceNeutralMaterialCriteria.ProcurementStructure,
				Selected: true,
				Name: this.translateService.instant('procurement.common.wizard.replaceNeutralMaterial.byProcurementStructure').text
			}
		];
		this.replaceCriteriaConfig = {
			...this.replaceCriteriaConfig,
			items: this.replaceCriteria
		};
		this.dialogData.dataItem.basicOption.replaceCriteria = this.replaceCriteria;

	}

}
