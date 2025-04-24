/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformCommonModule, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedMaterialCatalogLookupService, BasicsSharedInheritCodeLookupService, BasicsSharedMaterialTemplateTypeLookupService } from '@libs/basics/shared';
import { /*FieldType,*/ GridComponent, IGridConfiguration, UiCommonMessageBoxService, UiCommonModule } from '@libs/ui/common';
import { IBasicsCustomizeInheritCodeEntity } from '@libs/basics/interfaces';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { get } from 'lodash';
// Directly accessing files from other sub-modules is not allowed.
// If you require access to internal members of another module, please request a publicly
// accessible way to those members by creating a ticket to the team responsible for the
// referenced module.
//TODO: current can't find a good way in dialog to reuse the grid layout of material.
// Workaround solution to use the UiBusinessBaseEntityGridService to generate the column definition
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
//import { UiBusinessBaseEntityGridService } from '../../../../../../../ui/business-base/src/lib/entities/services/ui-business-base-entity-grid.service';
import { BasicsMaterialRecordLayoutService } from '../../material/basics-material-record-layout.service';
import { PlatformSchemaService } from '@libs/platform/data-access';

interface IMaterialEntitySelectable extends IMaterialEntity{
	IsSelected?: boolean;
}

@Component({
	selector: 'basics-material-basics-material-create-material-from-template-wizard',
	standalone: true,
	imports: [CommonModule, PlatformCommonModule, UiCommonModule, GridComponent],
	templateUrl: './basics-material-create-material-from-template-wizard.component.html',
	styleUrl: './basics-material-create-material-from-template-wizard.component.scss',
})
export class BasicsMaterialCreateMaterialFromTemplateWizardComponent {

	public templateSearchParam = {
		SearchValue: '',
		MaterialCatalogFk : null,
		TemplateTypeFk: null
	};


	public materialTemplateList: IMaterialEntitySelectable[] = [];

	public InheritCodeFk?: IBasicsCustomizeInheritCodeEntity;
	public Quantity: number = 1;

	public readonly lookups ={
		materialCatalog : inject(BasicsSharedMaterialCatalogLookupService),
		materialTemplateType: inject(BasicsSharedMaterialTemplateTypeLookupService),
		inheritCode: inject(BasicsSharedInheritCodeLookupService),
	};

	private readonly http = inject(HttpClient);
	//private readonly entityGridService = inject(UiBusinessBaseEntityGridService);
	private readonly schemaService = inject(PlatformSchemaService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);

	private readonly configService = inject(PlatformConfigurationService);
	private readonly materialLayoutService = inject(BasicsMaterialRecordLayoutService);
	public gridConfig: IGridConfiguration<IMaterialEntitySelectable> = {
		uuid: '2423020f04f944e6a511c0f831c8d684',
		columns: [],
		items: [],
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false
	};



	public constructor(){
		this.schemaService.getSchema( { moduleSubModule: 'Basics.Material', typeName: 'MaterialDto' }).then(schema => {

			//TODO: the column header check box is not supported yet. Select all or de-select all is not supported currently
/*
			const columns = this.entityGridService.generateGridConfig(schema, this.materialLayoutService.generateLayout()).map(col => {
				return {
					...col,
					readonly: true
				};
			});
			this.gridConfig = {
				...this.gridConfig,
				columns:[
					{
						id: 'MaterialCatalogFk',
						label: {key: 'basics.material.entityIsSelected', text: 'Is Selected'},
						model: 'IsSelected',
						readonly: false,
						required: false,
						sortable: true,
						tooltip:	undefined,
						type:	FieldType.Boolean,
						visible:	true
					},
					...columns
				]
			};*/
		});
	}


	public async onSearch() {
		const resp = await firstValueFrom(this.http.post(
			`${this.configService.webApiBaseUrl}basics/material/template/getMaterialByTemplate`,
			this.templateSearchParam));

		this.materialTemplateList = get(resp, 'Main')! as IMaterialEntity[];
		this.gridConfig = {
			...this.gridConfig,
			items: this.materialTemplateList
		};

	}

	public async onCreateBtnClicked() {

		//TODO: because currently the check box in grid can't really change the field can't do the testing for this button

		if(this.Quantity < 1){
			await this.dialogService.showMsgBox(
				this.translateService.instant('basics.material.createMaterialByTemplate.quantityOfCopyMustIntegerGreater').text,
				this.translateService.instant('basics.material.wizard.createMaterialByTemplate').text,
				'ico-error'
			);
			return ;
		}

		const resp = await firstValueFrom(this.http.post(
			`${this.configService.webApiBaseUrl}basics/material/template/createByTemplate`,
			{
				Quantiy: this.Quantity,
				InheritCodeFk: this.InheritCodeFk,
				SelectedItems: this.materialTemplateList.filter(material => material.IsSelected)
			}));

		const createdMaterials = get(resp, 'Main')! as IMaterialEntity[];
		if (createdMaterials && createdMaterials.length > 0) {
			await this.dialogService.showMsgBox(
				this.translateService.instant('basics.material.createMaterialByTemplate.createTemplateSuccess').text,
				this.translateService.instant('basics.material.wizard.createMaterialByTemplate').text,
				'ico-info'
			);



			//to tester: in previous implementation it will show the created material list.
			// But if there is already materials shown the loaded material will be removed.
			// it is not a good behavior. In the future if is required show something similar as goto is better solution.
		}
	}

	public okCreateBtnDisabled() {

		//TO tester: this is different from angualrjs code, But disable the create button if there is no item selected made the UX better.
		return this.materialTemplateList.every(item => !item.IsSelected);
	}
}
