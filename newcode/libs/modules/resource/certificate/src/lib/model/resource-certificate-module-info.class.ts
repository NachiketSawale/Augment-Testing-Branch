/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { RESOURCE_CERTIFICATE_PLANT_ENTITY_INFO } from './resource-certificate-plant-entity-info-model';
import { RESOURCE_CERTIFICATE_DOCUMENT_ENTITY_INFO } from './resource-certificate-document-entity-info-model';
import { RESOURCE_CERTIFICATE_ENTITY_INFO } from './resource-certificate-entity-info-model';
import { ResourceCertificateDataService } from '../services/resource-certificate-data.service';


/**
 * The module info object for the `resource.certificate` content module.
 */
export class ResourceCertificateModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ResourceCertificateModuleInfo();


	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'resource.certificate';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Certificate';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [RESOURCE_CERTIFICATE_ENTITY_INFO,
			     RESOURCE_CERTIFICATE_DOCUMENT_ENTITY_INFO,
			     RESOURCE_CERTIFICATE_PLANT_ENTITY_INFO,
			     this.BASICS_CHARACTERISTIC_DATA_ENTITY_INFO];
	}


	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : 'c354126f74754bbaade2b918d09b1f01',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}

	private readonly BASICS_CHARACTERISTIC_DATA_ENTITY_INFO: EntityInfo =  BasicsSharedCharacteristicDataEntityInfoFactory.create({
		permissionUuid: '7cd94188d15e45aea816296e28fcbf1b',
		sectionId:BasicsCharacteristicSection.Certificate,
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ResourceCertificateDataService);
		},
	 });

}
