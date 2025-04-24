/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject} from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import {IEstLineItemEntity} from '@libs/estimate/interfaces';
import { firstValueFrom } from 'rxjs';
import { GridComponent, IGridConfiguration, UiCommonModule } from '@libs/ui/common';
import { PlatformSchemaService } from '@libs/platform/data-access';
import { EstimateMainDissolveAssemblyLayoutService } from '../../services/estimate-main-dissolve-assembly-layout.service';

import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';

@Component({
	selector: 'estimate-main-dissolve-assembly-resource-dialog',
	templateUrl: './estimate-main-dissolve-assembly-resource-dialog.component.html',
	styleUrls: ['./estimate-main-dissolve-assembly-resource-dialog.component.scss'],
	standalone: true,
	imports: [ UiCommonModule, GridComponent],
})

/**
 * Dissolve assembly component which will render Dissolve Assembly wizard
 */
export default class EstimateMainDissolveAssemblyResourceDialogComponent {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly schemaService = inject(PlatformSchemaService);
	private readonly entityGridService = inject(EstimateMainDissolveAssemblyLayoutService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);
	private selectedLineitem = this.estimateMainService.getSelection();
	public dissolveAssembliesList: IEstLineItemEntity[] = [];

	public gridConfig: IGridConfiguration<IEstLineItemEntity>;

	public constructor() {

		this.gridConfig = {
		uuid: 'ac031b9c6160457096d878cfd4201d9e',
		columns: this.entityGridService.generateGridConfig(),
	   items:  this.onSearch(),
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false
		};
	}

	public  onSearch() : IEstLineItemEntity[] {
		let data: IEstLineItemEntity[] = [];
		if (this.selectedLineitem.length > 0) {
			const url = `${this.configService.webApiBaseUrl}estimate/main/wizard/getdissolveassemblies?projectFk=` + this.estimateMainContextService.getSelectedProjectId() + '&estHeaderFk=' + this.estimateMainContextService.getSelectedEstHeaderId() + '&selectedLineItemId=' + this.selectedLineitem[0].Id;
			firstValueFrom(this.http.post<IEstLineItemEntity[]>(url, {})).then(response => {
				this.gridConfig = {
					...this.gridConfig,
					items: response
				};
				data = response;
				this.dissolveAssembliesList = response;
			});
		}
		return data;
	}
}
