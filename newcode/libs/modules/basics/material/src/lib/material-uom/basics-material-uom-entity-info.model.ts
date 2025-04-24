/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialUomDataService } from '../material-uom/basics-material-uom-data.service';
import { BasicsMaterialUomLayoutService } from '../material-uom/basics-material-uom-layout.service';
import { IMdcMaterial2basUomEntity } from '../model/entities/mdc-material-2-bas-uom-entity.interface';
import { BasicsMaterialUomValidationService } from './basics-material-uom-validation.service';

export const BASICS_MATERIAL_UOM_ENTITY_INFO = EntityInfo.create<IMdcMaterial2basUomEntity>({
	grid: {
		title: { text: 'Uom', key: 'basics.material.basUom.listTitle' },
	},
	form: {
		containerUuid: 'caa04e7f99aa44fa850dbeab916eeebc',
		title: { text: 'Uom Detail', key: 'basics.material.basUom.formTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialUomDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MdcMaterial2basUomDto' },
	permissionUuid: '49f6e969068844539d3faa7cd155de24',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialUomLayoutService).generateConfig();
	},
	validationService: (context) => context.injector.get(BasicsMaterialUomValidationService),
});
