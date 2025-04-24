/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { getCustomDialogDataToken, IAccordionItem } from '@libs/ui/common';
import { IModifyResourceEntity } from '../../model/estimate-modify-resource-entity.interface';
import { ModifyResourceModuleEnum } from '../../enum/estimate-modify-resource-module.enum';
import { ModifyResourceBasicSettingComponent } from '../basic-setting/basic-setting.component';
import { ModifyResourceEstimateScopeComponent } from '../estimate-scope/estimate-scope.component';
import { ModifyResourceModifyDetailComponent } from '../modify-detail/modify-detail.component';
/**
 * Column config detail component
 */
@Component({
	selector: 'estimate-shared-modify-resource-dialog',
	templateUrl: './modify-resource-dialog.component.html',
	styleUrl: './modify-resource-dialog.component.scss',
})
export class ModifyResourceDialogComponent implements OnInit{
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IModifyResourceEntity, ModifyResourceDialogComponent>());

	private entity?: IModifyResourceEntity | null = this.dialogWrapper.value;

	public ngOnInit(): void {

	}

	private groupExpansionState: {
		[groupId: string | number]: boolean;
	} = {};

	public groupExpanded(item: IAccordionItem) {
		this.groupExpansionState[item.id] = true;
	}

	public groupCollapsed(item: IAccordionItem) {
		this.groupExpansionState[item.id] = false;
	}

	public get groups(): IAccordionItem[] {
		return [
			{
				id: 'g20',
				title: this.entity?.ModifyOptions.ModuleType === ModifyResourceModuleEnum.Assembly ? { key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.labelAssembly' } : { key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label' },
				expanded: true,
				children: [{
					id: 'form-section',
					component: ModifyResourceEstimateScopeComponent,
					// providers: [{
					// 	provide: FormGroupInfo,
					// 	useValue: new FormGroupInfo(g, this)
					// }]
				}]
			},
			{
				id: 'g21',
				title: { key: 'estimate.main.replaceResourceWizard.group1Name' },
				expanded: true,
				children: [{
					id: 'form-section',
					component: ModifyResourceBasicSettingComponent
				}]
			},
			{
				id: 'g22',
				title: { key: 'estimate.main.replaceResourceWizard.group2Name' },
				expanded: true,
				children: [{
					id: 'form-section',
					component: ModifyResourceModifyDetailComponent
				}]
			}
		];
	}
}
