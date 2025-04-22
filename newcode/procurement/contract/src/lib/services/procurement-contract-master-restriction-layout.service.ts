/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { IConMasterRestrictionEntity } from '../model/entities/con-master-restriction-entity.interface';
import { PrcCommonCopyTypeItems, PrcCommonVisibilityItems } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';

/**
 * Procurement Contract Master Restriction layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractMasterRestrictionLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	public async generateConfig(): Promise<ILayoutConfiguration<IConMasterRestrictionEntity>> {
		const parentService = ServiceLocator.injector.get(ProcurementContractHeaderDataService);
		return <ILayoutConfiguration<IConMasterRestrictionEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['MdcMaterialCatalogFk', 'BoqWicCatFk', 'ConHeaderBoqFk', 'ConBoqHeaderFk', 'Visibility', 'CopyType', 'ProjectFk', 'PrjBoqFk', 'PackageFk', 'PackageBoqHeaderFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.material.', {
					MdcMaterialCatalogFk: { key: 'materialCatalog', text: 'Material Catalog' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ProjectFk: { key: 'entityProjectNo', text: 'Project No' },
					PackageFk: { key: 'entityPackageCode', text: 'Package Code' },
				}),
				...prefixAllTranslationKeys('procurement.contract.', {
					BoqWicCatFk: { key: 'entityBoqWicCatFk', text: 'WIC Group' },
					ConHeaderBoqFk: { key: 'entityConHeaderFk', text: 'Procurement Contract' },
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					PackageBoqHeaderFk: { key: 'entityPackageBoqHeaderFk', text: 'Package BoQ' },
					ConBoqHeaderFk: { key: 'entityConBoqHeaderFk', text: 'Contract BoQ' },
					Visibility: { key: 'visibility', text: 'Visibility' },
					CopyType: { key: 'entityCopyType', text: 'Copy Type' },
					CopyTypeWicBoq: { key: 'copyTypeWicBoq', text: 'Project BoQ' },
					CopyTypePacBoq: { key: 'copyTypePacBoq', text: 'Package BoQ' },
					CopyTypeMaterial: { key: 'copyTypeMaterial', text: 'Material' },
					PrjBoqFk: { key: 'entityPrjBoqFk', text: 'Project BoQ' },
				}),
			},
			overloads: {
				ProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: this.projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							readonly: true,
						},
					}),
				},
				MdcMaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(true), //TODO navigator
				//BoqWicCatFk: {
				//	readonly: true,
				// TODO: waiting for estimate-wic-group-lookup
				//},
				//ConHeaderBoqFk: {
				//	readonly: true,
				// TODO: waiting for Con-Header-Boq-lookup
				//},
				//ConBoqHeaderFk: {
				//	readonly: true,
				// TODO: waiting for Con-Boq-Header-lookup
				//},
				Visibility: {
					type: FieldType.Select,
					itemsSource: {
						items: PrcCommonVisibilityItems,
					},
					sortable: true,
				},
				CopyType: {
					type: FieldType.Select,
					itemsSource: {
						items: PrcCommonCopyTypeItems,
					},
					sortable: true,
				},
				//PrjBoqFk: {
				// TODO: waiting for project-Boq-lookup
				//},
				PackageFk: ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'Description', {
					key: 'master-restriction-package-filter',
					execute: (context: ILookupContext<IProcurementPackageLookupEntity, IConMasterRestrictionEntity>) => {
						const parentItem = parentService.getSelectedEntity();
						if (!parentItem || !parentItem.ProjectFk) {
							return '';
						}
						return `ProjectFk=${parentItem.ProjectFk}`;
					},
				}),
				//PackageBoqHeaderFk: {
				//	readonly: true,
				// TODO: waiting for Package-Boq-header-lookup
				//}
			},
		};
	}
}
