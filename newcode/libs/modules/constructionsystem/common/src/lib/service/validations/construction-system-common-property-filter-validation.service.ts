import { Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPropertyFilterEntity } from '../../model/entities/selection-statement/property-filter-entity.interface';
import { ConstructionSystemCommonPropertyFilterGridDataService } from '../selection-statement/construction-system-common-property-filter-grid-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemCommonPropertyNameLookupService } from '../lookup/constuction-system-common-property-name-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonPropertyFilterValidationService extends BaseValidationService<IPropertyFilterEntity> {
	private readonly dataService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyFilterGridDataService);
	private readonly propertyNameLookupService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyNameLookupService);

	protected generateValidationFunctions(): IValidationFunctions<IPropertyFilterEntity> {
		return {
			PropertyId: this.validatePropertyId,
			PropertyValue: this.validatePropertyValue,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPropertyFilterEntity> {
		return this.dataService;
	}

	protected validatePropertyId(info: ValidationInfo<IPropertyFilterEntity>): ValidationResult {
		const id = (info.value as number) ?? 0;
		if (id) {
			this.propertyNameLookupService.getItemByKey({ id: id }).subscribe((property) => {
				if (property) {
					info.entity.ValueType = property.ValueType;
					info.entity.PropertyName = property.PropertyName;
				}
			});
		}
		return this.validateIsMandatory(info);
	}

	protected validatePropertyValue(info: ValidationInfo<IPropertyFilterEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	public validateEntity(entity: IPropertyFilterEntity) {
		this.validatePropertyValue(new ValidationInfo(entity, entity.PropertyValue ?? undefined, 'PropertyValue'));
		this.validatePropertyId(new ValidationInfo(entity, entity.PropertyId ?? undefined, 'PropertyId'));
	}
}
