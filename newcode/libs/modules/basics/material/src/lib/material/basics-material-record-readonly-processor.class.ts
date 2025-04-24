/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedMaterialTemplateTypeLookupService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { BasicsMaterialRecordDataService } from './basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { IBasicsMaterialTemplateFieldSettingEntity } from '../interfaces/basics-material-template-field-setting.interface';
import { inject } from '@angular/core';

export class BasicsMaterialRecordReadonlyProcessor extends EntityReadonlyProcessorBase<IMaterialEntity> {
	private readonly materialTemplateReadonlyFieldsMapping = new Map<number, IBasicsMaterialTemplateFieldSettingEntity>();
	private readonly materialTemplateTypeLookup = inject(BasicsSharedMaterialTemplateTypeLookupService);

	public constructor(private dataService: BasicsMaterialRecordDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IMaterialEntity> {
		return {
			MaterialTempFk: this.readyOnlyByMaterialTemplate,
		};
	}

	public override readonlyEntity(item: IMaterialEntity) {
		return this.dataService.isReadonlyMaterial(item);
	}

	public updateMaterialTemplateReadonlyFieldsMapping(mapping: IBasicsMaterialTemplateFieldSettingEntity[]) {
		mapping.forEach((item) => {
			this.materialTemplateReadonlyFieldsMapping.set(item.Id, item);
		});
	}

	private readyOnlyByMaterialTemplate(info: ReadonlyInfo<IMaterialEntity>) {
		if (info.item.MaterialTempTypeFk) {
			const templateType = this.materialTemplateTypeLookup.cache.getItem({ id: info.item.MaterialTempTypeFk });
			return templateType?.IsTemplate ?? false;
		}

		return false;
	}

	public override process(toProcess: IMaterialEntity) {
		super.process(toProcess);

		this.setReadonlyFieldByMaterialTemplate(toProcess);
	}

	private setReadonlyFieldByMaterialTemplate(item: IMaterialEntity) {
		//-1 is a magic number here means the default template setting. There will be always -1 id in the mapping
		//Better to optimize the design. Currently just copy the idea from AngularJs
		const templateId = item.MaterialTempFk ?? -1;
		const fieldSetting = this.materialTemplateReadonlyFieldsMapping.get(templateId);
		if (fieldSetting) {
			const readonlyFields = Object.keys(fieldSetting)
				//TODO: Ivy please have a check with the logic here. According to the database design, the field true here should be editable. But checked
				//the code logic in AngularJs, it means readonly. So just follow the old logic here. But please check with tester
				.filter((key) => fieldSetting[key as keyof IBasicsMaterialTemplateFieldSettingEntity] && key !== 'Id')
				.map((field) => {
					return {
						field: field,
						readOnly: true,
					};
				});
			this.runtime.setEntityReadOnlyFields(item, readonlyFields);
		}
	}
}
