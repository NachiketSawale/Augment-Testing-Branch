/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IContextDialogProfileEntity, IPropertyConfig } from '../../model/IContextDialogProfileEntity';
import { IUniqueFieldDto, IUniqueFieldOption } from '@libs/basics/shared';
import { ContextConfigDataService } from '../../service/context-config-data.service';
import { FieldType, IAdditionalSelectOptions } from '@libs/ui/common';

@Component({
	selector: 'documents-centralquery-context-config-option.component',
	templateUrl: './documents-centralquery-context-config-option.component.html',
	styleUrl: './documents-centralquery-context-config-option.component.scss',
})
export class DocumentsCentralqueryContextConfigOptionComponent {
	protected readonly translateService = inject(PlatformTranslateService);
	@Input()
	protected readonly fieldType = FieldType;
	protected uniqueFields!: IUniqueFieldDto[];
	protected readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly identityName = 'documents.centralquery.context.config';
	protected readonly dialogId = '20E3EE2645A14E7E813DD787E9A17A4F';
	@Input()
	protected updateOptions = {
		uniqueFieldsProfile: '',
		radioValue: {
			selectedStructure: 'structure',
			selectedCusField: 'customize',
		},
		radioOption: '',
	};

	public optionSelectedValue: string;

	public options: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [
				{
					id: this.updateOptions.radioValue.selectedStructure,
					displayName: { key: 'documents.centralquery.fromDocStructureTitle' },
				},
				{
					id: this.updateOptions.radioValue.selectedCusField,
					displayName: { key: 'documents.centralquery.fromDocProjectTitle' },
				},
			],
		},
	};

	protected onOptionChanged(event: string) {
		this.optionSelectedValue = event;
	}

	private async loadModalInfo() {
		try {
			const params = {
				groupKey: this.identityName,
				appId: this.dialogId.toLowerCase(),
			};

			const url = 'basics/common/option/getprofile';
			const res = await this.httpService.get<IContextDialogProfileEntity[]>(url, { params });

			if (!res || res.length === 0) {
				return;
			}
			const { PropertyConfig } = res[0];
			const propertyConfig: IPropertyConfig = JSON.parse(PropertyConfig);

			this.optionSelectedValue = propertyConfig.radioOption;

			// todo--load default profile
		} catch (error) {
			console.error('Failed to load modal info:', error);
		}
	}

	public constructor() {
		this.loadModalInfo();
		this.optionSelectedValue = '';
	}

	public uniqueFieldOption: IUniqueFieldOption = {
		identityName: 'documents.centralquery.context.config',
		dynamicUniqueFieldService: inject(ContextConfigDataService),
	};

	public async onOKBntClicked() {
		//todo--save profile
	}
}
