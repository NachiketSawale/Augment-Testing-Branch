/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ConcreteFieldOverload, createLookup, FieldType, IFieldLookupOptions, ILookupContext } from '@libs/ui/common';
import { getCharacteristicCodeLookupOptionsToken } from '../../../characteristic-lookup/components/characteristic-code-dialog/characteristic-code-dialog.component';
import { ICharacteristicDataEntity, ICharacteristicValueEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicGroupCodeLookupService } from '../../../characteristic-lookup/services/basics-characteristic-group-code-lookup.service';
import { IEntityContext, ServiceLocator } from '@libs/platform/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { BasicsSharedCharacteristicTypeHelperService } from '../../../services/basics-shared-characteristic-type-helper.service';
import { BasicsSharedCharacteristicDataDiscreteValueLookupService } from '../../../characteristic-lookup/services/basics-characteristic-data-discrete-value-lookup.service';
import { ICharacteristicCodeLookupOptions } from '../../../characteristic-lookup/model/characteristic-code-lookup-options.interface';

/**
 * The characteristic data layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCharacteristicDataLayoutFieldService {
	private readonly typeHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService);

	public createCharacteristicFKLookup(options: ICharacteristicCodeLookupOptions): IFieldLookupOptions<ICharacteristicDataEntity> {
		return createLookup({
			dataServiceToken: BasicsSharedCharacteristicGroupCodeLookupService,
			dialogOptions: {
				providers: [
					{
						provide: getCharacteristicCodeLookupOptionsToken(),
						useValue: options,
					},
				],
				headerText: {
					text: 'Code Lookup',
					key: 'basics.characteristic.header.codeLookup',
				},
			},
			serverSideFilter: {
				key: '',
				execute() {
					return {
						sectionId: options.sectionId,
					};
				},
			},
			formatter: {
				//Used to format how data is displayed in lookup dropdown/grid
				format: (dataItem: ICharacteristicEntity, context: ILookupContext<ICharacteristicEntity, ICharacteristicDataEntity>) => {
					if (dataItem.Id) {
						if (context.entity ) {
							if(!context.entity.Description){
								context.entity.Description = dataItem.DescriptionInfo?.Translated ?? dataItem.DescriptionInfo?.Description;
							}
							if(context.entity.CharacteristicFk !== dataItem.Id){
								// update Characteristic data
								this.typeHelperService.merge2CharacteristicData(dataItem, context.entity);
							}
						}
						return dataItem.Code;
					}
					return dataItem.Id.toString();
				},
			},
		});
	}

	private readonly defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICharacteristicDataEntity>>({
		type: FieldType.Text,
	});

	/**
	 * create field overload according field type
	 * @param fieldType
	 * @private
	 */
	private createConcreteFieldOverload(fieldType: FieldType) {
		return { type: fieldType } as ConcreteFieldOverload<ICharacteristicDataEntity>;
	}

	/**
	 * Update overload when entity or type are changed
	 * @param entity
	 */
	private updateDefaultValueOverload(entity?: ICharacteristicDataEntity) {
		let value: ConcreteFieldOverload<ICharacteristicDataEntity> = {
			type: FieldType.Text,
		};
		let fieldType: FieldType;
		if (entity && entity.CharacteristicTypeFk) {
			if (this.typeHelperService.isLookupType(entity.CharacteristicTypeFk)) {
				value = {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCharacteristicDataDiscreteValueLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true,
						clientSideFilter: {
							execute(item: ICharacteristicValueEntity): boolean {
								return entity && entity.CharacteristicFk === item.CharacteristicFk;
							},
						},
					}),
				};
			} else {
				fieldType = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService).characteristicType2FieldType(entity?.CharacteristicTypeFk);
				value = this.createConcreteFieldOverload(fieldType);
			}
			entity.ValueText = this.typeHelperService.convertValue(entity.ValueText ?? null, entity.CharacteristicTypeFk);
		}

		this.defaultValueOverloadSubject.next(value);
	}

	public createValueTextOverload(ctx: IEntityContext<ICharacteristicDataEntity>): Observable<ConcreteFieldOverload<ICharacteristicDataEntity>> {
		this.updateDefaultValueOverload(ctx.entity);
		return this.defaultValueOverloadSubject;
	}
}
