/*
 * Copyright(c) RIB Software GmbH
 */

import { set } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateResourceBaseLayoutService } from '@libs/estimate/shared';
import { createLookup, FieldType, ILookupFieldOverload } from '@libs/ui/common';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { EntityDomainType, IEntitySchema } from '@libs/platform/data-access';
import { ConstructionSystemMasterUomLookupService } from '../lookup/construction-system-master-uom-lookup.service';

/**
 * construction system master resource layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterResourceLayoutService extends EstimateResourceBaseLayoutService<IEstResourceEntity> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	private readonly schema: IEntitySchema<IEstResourceEntity> = { schema: 'IEstResourceEntity', properties: {} };

	public setEntitySchema(schema: IEntitySchema<IEstResourceEntity>) {
		const newProperties = {
			...schema.properties,
			EstResourceTypeFkExtend: { domain: EntityDomainType.Description, mandatory: false },
			Currency1Fk: { domain: EntityDomainType.Description, mandatory: false },
			Currency2Fk: { domain: EntityDomainType.Description, mandatory: false },
			BusinessPartner: { domain: EntityDomainType.Description, mandatory: false },
			ItemInfo: { domain: EntityDomainType.Description, mandatory: false },
			ExternalCode: { domain: EntityDomainType.Description, mandatory: false },
		};

		set(this.schema, 'properties', newProperties);
	}

	public getEntitySchema(): IEntitySchema<IEstResourceEntity> {
		return this.schema;
	}

	public override async generateLayout() {
		const layout = this.commonLayout();

		if (layout.groups) {
			const basicDataGroup = layout.groups.find((item) => {
				return item.gid === 'basicData';
			});
			basicDataGroup?.attributes.push(...['ExternalCode', 'WorkOperationTypeFk', 'PlantAssemblyTypeFk', 'GcBreakdownTypeFk']);
		}
		if (layout.labels) {
			set(layout.labels, 'ExternalCode', { key: 'boq.main.ExternalCode', text: 'External Code' });
			set(layout.labels, 'WorkOperationTypeFk', { text: 'Work Operation Type' }); // todo-allen: The translation not working.
			set(layout.labels, 'PlantAssemblyTypeFk', { text: 'Plant Assembly Type' }); // todo-allen: The translation not working.
			set(layout.labels, 'GcBreakdownTypeFk', { key: 'estimate.main.gcBreakdownTypeFk', text: 'GC Breakdown Type' });
			set(layout.labels, 'QuantityUnitTarget', { text: 'Quantity/Unit Item' }); // todo-allen: The translation not working. key: 'estimate.main.quantityUnitTarget'
		}

		if (layout.overloads) {
			// layout.overloads.EstResourceTypeShortKey; todo-allen: estimate-main-resource-type-lookup is not ready.
			layout.overloads.BasCurrencyFk = await this.provideBasCurrencyFkLookupOverload();
			// layout.overloads.RequisitionFk; // todo-allen: resource-requisition-lookup-dialog-new is not ready.
			layout.overloads.WorkOperationTypeFk = this.provideWorkOperationTypeFkLookupOverload();
			layout.overloads.PlantAssemblyTypeFk = this.providePlantAssemblyTypeFkLookupOverload();
			layout.overloads.PrcStructureFk = this.providePrcStructureFkLookupOverload();
			layout.overloads.BusinessPartner = { readonly: true };
			// layout.overloads.Code; // todo-allen: estimate-main-resource-code-lookup is not ready.
			// layout.overloads.DescriptionInfo; // todo-allen: estimate-main-resources-assembly-type-filter is not ready. The overload seems to not work.

			// todo-allen: estimate-main-detail-column-directive is not ready.
			// layout.overloads.QuantityDetail;
			// layout.overloads.QuantityFactorDetail1;
			// layout.overloads.QuantityFactorDetail2;
			// layout.overloads.ProductivityFactorDetail;
			// layout.overloads.CostFactorDetail1;
			// layout.overloads.CostFactorDetail2;
			// layout.overloads.EfficiencyFactorDetail1;
			// layout.overloads.EfficiencyFactorDetail2;

			layout.overloads.BasUomFk = this.provideBasUomFkLookupOverload();
			// layout.overloads.GcBreakdownTypeFk; // todo-allen: GcBreakdownTypeFk lookup is not ready. IEstResourceEntity does not contain the GcBreakdownTypeFk field.

			// todo-allen: Some fields overload are missing.
		}

		return layout;
	}

	private async provideBasCurrencyFkLookupOverload(): Promise<ILookupFieldOverload<IEstResourceEntity>> {
		const currencyLookupProvider = await this.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		const overload = currencyLookupProvider.provideCurrencyLookupOverload({ showClearButton: true });
		const lookupOptions = (overload as ILookupFieldOverload<IEstResourceEntity>).lookupOptions;

		return {
			readonly: false,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				...lookupOptions,
				descriptionMember: 'DescriptionInfo.Translated',
				showDescription: false,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.entityDescription', text: 'Currency-Description' },
					column: true,
				},
			],
		};
	}

	private provideWorkOperationTypeFkLookupOverload(): ILookupFieldOverload<IEstResourceEntity> {
		const overload = ResourceSharedLookupOverloadProvider.provideResourceWotFilterByPlantTypeLookupOverload(true, '', 'estimate-filter');
		const lookupOptions = (overload as ILookupFieldOverload<IEstResourceEntity>).lookupOptions;

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				...lookupOptions,
				descriptionMember: 'DescriptionInfo.Translated',
				showDescription: false,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.entityDescription', text: 'Work Operation Type-Description' },
					column: true,
				},
			],
		};
	}

	private providePlantAssemblyTypeFkLookupOverload(): ILookupFieldOverload<IEstResourceEntity> {
		const overload = BasicsSharedCustomizeLookupOverloadProvider.providePlantAssemblyTypeLookupOverload(false);
		const lookupOptions = (overload as ILookupFieldOverload<IEstResourceEntity>).lookupOptions;

		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				...lookupOptions,
				descriptionMember: 'DescriptionInfo.Translated',
				showDescription: true,
			}),
		};
	}

	private providePrcStructureFkLookupOverload(): ILookupFieldOverload<IEstResourceEntity> {
		const overload = BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(false);
		const lookupOptions = (overload as ILookupFieldOverload<IEstResourceEntity>).lookupOptions;
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: lookupOptions,
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.entityDescription', text: 'Procurement Structure-Description' },
					column: true,
				},
			],
		};
	}

	private provideBasUomFkLookupOverload(): ILookupFieldOverload<IEstResourceEntity> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ConstructionSystemMasterUomLookupService,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.entityDescription', text: 'UoM-Description' },
					column: true,
				},
			],
		};
	}
}
