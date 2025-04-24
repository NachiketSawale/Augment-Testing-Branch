import { Component, inject } from '@angular/core';
import { FieldType, getCustomDialogDataToken, IAdditionalCustomComponentOptions, IAdditionalLookupOptions, IFormConfig } from '@libs/ui/common';
import { ExportOptions, ExportOptionsEx } from '../../models/types/export-options.type';

export type ExportFormConfig = {
	formConfiguration: IFormConfig<ExportOptions & ExportOptionsEx>;
	entity: ExportOptions & ExportOptionsEx;
};

@Component({
	selector: 'basics-shared-export',
	templateUrl: './basics-shared-export.component.html',
	styleUrl: './basics-shared-export.component.scss',
})
export class BasicsSharedExportComponent {
	private readonly dlgWrapper = inject(getCustomDialogDataToken<ExportFormConfig, BasicsSharedExportComponent>());

	private value = this.dlgWrapper.value as ExportFormConfig;

	public get rows() {
		return this.value.formConfiguration.rows;
	}

	public get entity() {
		return this.value.entity;
	}

	public get entity1() {
		return this.dlgWrapper.value?.entity.excelProfileId;
	}

	public get options0() {
		return this.dlgWrapper.value?.formConfiguration.rows[0] as IAdditionalCustomComponentOptions;
	}

	public get options1() {
		return this.dlgWrapper.value?.formConfiguration.rows[1] as IAdditionalLookupOptions<ExportOptions & ExportOptionsEx>;
	}

	protected readonly FieldType = FieldType;

	public excelProfileIdChange($event: number) {
		this.entity.excelProfileId = $event;
	}

	public justifyPropertyNamesChange($event: boolean) {
		this.entity.justifyPropertyNames = $event;
	}
}
