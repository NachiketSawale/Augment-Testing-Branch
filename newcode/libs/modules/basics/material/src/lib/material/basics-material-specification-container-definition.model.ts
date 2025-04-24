/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { BasicsMaterialRecordDataService } from './basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { ContainerDefinition } from '@libs/ui/container-system';
import { BasicsMaterialSpecificationComponent } from './components/basics-material-specification.component';

/**
 * Basics material specification entity
 */
export const BASICS_MATERIAL_SPECIFICATION_CONTAINER_DEFINITION = new ContainerDefinition({
	uuid: 'e850ba1740c24c35907491f922a3716b',
	title: 'basics.material.specification.formatText',
	containerType: BasicsMaterialSpecificationComponent,
	id: 'basics.material.specification',
	providers:[
		{
			provide: new EntityContainerInjectionTokens<IMaterialEntity>().dataServiceToken ,
			useExisting: BasicsMaterialRecordDataService
		}
	]
});