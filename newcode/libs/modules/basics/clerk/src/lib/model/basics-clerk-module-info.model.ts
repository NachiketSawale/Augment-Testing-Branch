/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { CLERK_PHOTO_CONTAINER_DEFINITION } from '../basics-clerk-photo-container-definition.class';
import { BASICS_CLERK_ENTITY_INFO } from './basics-clerk-entity-info.model';
import { BASICS_CLERK_ABSENCE_ENTITY_INFO } from './basics-clerk-absence-entity-info.model';
import { BASICS_CLERK_GROUP_ENTITY_INFO } from './basics-clerk-group-entity-info.model';
import { BASICS_CLERK_FOR_PACKAGE_ENTITY_INFO } from './basics-clerk-for-package-entity-info.model';
import { BASICS_CLERK_FOR_PROJECT_ENTITY_INFO } from './basics-clerk-for-project-entity-info.model';
import { BASICS_CLERK_FOR_SCHEDULE_ENTITY_INFO } from './basics-clerk-for-schedule-entity-info.model';
import { BASICS_CLERK_FOR_WIC_ENTITY_INFO } from './basics-clerk-for-wic-entity-info.model';
import { BASICS_CLERK_DOCUMENT_ENTITY_INFO } from './basics-clerk-document-entity-info.model';
import { BASICS_CLERK_ABSENCE_PROXY_ENTITY_INFO } from './basics-clerk-absence-proxy-entity-info.model';
import { BASICS_CLERK_MEMBERE_ENTITY_INFO } from './basics-clerk-member-entity-info.model';
import { BASICS_CLERK_ROLE_DEFAULT_VALUE_ENTITY_INFO } from './basics-clerk-role-default-vaules-entity-info.model';
import { BASICS_CLERK_FOR_ESTIMATE_ENTITY_INFO } from './basics-clerk-for-estimate-entity-info.model';
import { BASICS_CLERK_CHARACTERISTIC_ENTITY_INFO } from './basics-clerk-characteristic-entity-info.model';

export class BasicsClerkModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsClerkModuleInfo();

	private constructor(){
		super();
	}


	public override get internalModuleName(): string {
		return 'basics.clerk';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_CLERK_ENTITY_INFO,
			BASICS_CLERK_ABSENCE_ENTITY_INFO,
			BASICS_CLERK_GROUP_ENTITY_INFO,
			BASICS_CLERK_FOR_PACKAGE_ENTITY_INFO,
			BASICS_CLERK_FOR_PROJECT_ENTITY_INFO,
			BASICS_CLERK_FOR_SCHEDULE_ENTITY_INFO,
			BASICS_CLERK_FOR_WIC_ENTITY_INFO,
			BASICS_CLERK_DOCUMENT_ENTITY_INFO,
			BASICS_CLERK_ABSENCE_PROXY_ENTITY_INFO,
			BASICS_CLERK_MEMBERE_ENTITY_INFO,
			BASICS_CLERK_ROLE_DEFAULT_VALUE_ENTITY_INFO,
			BASICS_CLERK_FOR_ESTIMATE_ENTITY_INFO,
			BASICS_CLERK_CHARACTERISTIC_ENTITY_INFO
		];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'model.wdeviewer'];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			CLERK_PHOTO_CONTAINER_DEFINITION,
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'a44b1be797934e3d9df187c0452efbaf'
			})
		]);
	}
}
