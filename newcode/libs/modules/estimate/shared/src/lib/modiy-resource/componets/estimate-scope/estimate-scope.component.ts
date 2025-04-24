/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { EstimateModifyResourceDataService } from '../../services/estimate-modify-resource-data.service';
import { IModifyResourceEntity } from '../../model/estimate-modify-resource-entity.interface';
import { ModifyResourceDialogComponent } from '../modify-resource-dailog/modify-resource-dialog.component';
import { ModifyResourceModuleEnum } from '../../enum/estimate-modify-resource-module.enum';
import { getCustomDialogDataToken } from '@libs/ui/common';

@Component({
	templateUrl: './estimate-scope.component.html',
	styleUrls: ['./estimate-scope.component.scss'],
})
export class ModifyResourceEstimateScopeComponent implements OnInit {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly dataService = inject(EstimateModifyResourceDataService);

	private readonly dialogWrapper = inject(getCustomDialogDataToken<IModifyResourceEntity, ModifyResourceDialogComponent>());
	private entity?: IModifyResourceEntity | null = this.dialogWrapper.value;
	protected isOpenFromAssembly: boolean = this.entity?.ModifyOptions.ModuleType === ModifyResourceModuleEnum.Assembly;

    public ngOnInit(): void {

    }


	 protected label: string = this.translateService.instant('estimate.main.replaceResourceWizard.group1Name').text;

	 protected scopeList = this.dataService.getScopeList(this.isOpenFromAssembly);

	 protected scopeValue = '0';

}