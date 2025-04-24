import { DataServiceFlatRoot, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPropertyFilterEntity } from '../../model/entities/selection-statement/property-filter-entity.interface';
import { CompleteIdentification, ServiceLocator } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { ConstructionSystemCommonPropertyFilterValidationService } from '../validations/construction-system-common-property-filter-validation.service';
import { ReplaySubject } from 'rxjs';
class PropertyFilterComplete implements CompleteIdentification<IPropertyFilterEntity> {}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonPropertyFilterGridDataService extends DataServiceFlatRoot<IPropertyFilterEntity, PropertyFilterComplete> {
	public onPropertyFilterChanged$ = new ReplaySubject<IPropertyFilterEntity | IPropertyFilterEntity[]>(1);
	public constructor() {
		const options: IDataServiceOptions<IPropertyFilterEntity> = {
			apiUrl: '',
			roleInfo: <IDataServiceRoleOptions<IPropertyFilterEntity>>{
				role: ServiceRole.Root,
				itemName: '',
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};
		super(options);
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}
	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ConstructionSystemCommonPropertyFilterValidationService, { moduleSubModule: 'ConstructionSystem.Common', typeName: 'PropertyFilter' }); /// does not work
	}

	/**
	 * create propertyFilter
	 */
	public override create(): Promise<IPropertyFilterEntity> {
		return new Promise((resolve) => {
			let id = 1;
			if (this.getList().length > 0) {
				id = this.getList().reduce((maxId, item) => Math.max(maxId, item.Id), 0) + 1;
			}
			const newItem: IPropertyFilterEntity = {
				Id: id,
				PropertyId: null,
				PropertyName: '',
				ValueType: 0,
				Operation: 1,
				PropertyValue: '',
				Version: 0,
			};
			const validationService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyFilterValidationService);
			validationService.validateEntity(newItem);
			this.append(newItem);
			this.select(newItem);
			this.setModified(newItem);
			resolve(newItem);
		});
	}

	public override delete(entities: IPropertyFilterEntity[] | IPropertyFilterEntity) {
		const deleteEntities: IPropertyFilterEntity[] = !Array.isArray(entities) ? [entities] : entities;
		const Ids = deleteEntities.map((e) => e.Id);
		const newList = this.getList().filter((item) => !Ids.includes(item.Id));
		this.setList(newList); /// todo this should use remove function, but it is not ready now
		this.onPropertyFilterChanged.next(entities);
	}

	public override createUpdateEntity(modified: IPropertyFilterEntity | null): PropertyFilterComplete {
		return new PropertyFilterComplete();
	}

	public get onPropertyFilterChanged() {
		return this.onPropertyFilterChanged$;
	}
	public override setModified(entities: IPropertyFilterEntity[] | IPropertyFilterEntity) {
		super.setModified(entities);
		this.onPropertyFilterChanged.next(entities);
	}
}
