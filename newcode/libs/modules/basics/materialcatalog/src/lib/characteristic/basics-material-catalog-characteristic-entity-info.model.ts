/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';


/**
 * Entity info for the material catalog characteristic
 */
export const BASICS_MATERIAL_CATALOG_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'c22f79fb3d5641e38714267f9af3e672',
	sectionId: BasicsCharacteristicSection.MaterialCatalog,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsMaterialCatalogDataService);
	},	
},);