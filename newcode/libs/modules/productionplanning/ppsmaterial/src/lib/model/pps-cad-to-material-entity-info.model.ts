/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsCadToMaterialBehavior } from '../behaviors/pps-cad-to-material-behavior.service';
import { PpsCadToMaterialDataService } from '../services/cad-to-material/pps-cad-to-material-data.service';
import { PpsCadToMaterialValidationService } from '../services/cad-to-material/pps-cad-to-material-validation.service';
import { IPpsCad2mdcMaterialEntity } from './models';
import { PPS_CAD_TO_MATERIAL_LAYOUT } from './pps-cad-to-material-layout.model';

export const PPS_CAD_TO_MATERIAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsCad2mdcMaterialEntity>({
	grid: {
		title: { key: 'productionplanning.ppsmaterial.ppsCadToMaterial.listViewTitle' },
		behavior: ctx => ctx.injector.get(PpsCadToMaterialBehavior),
	},
	form: {
		title: { key: 'productionplanning.ppsmaterial.ppsCadToMaterial.detailViewTitle' },
		containerUuid: '7727ab5728gb492d8612gv47e73dgh97',
	},
	dataService: ctx => ctx.injector.get(PpsCadToMaterialDataService),
	validationService: ctx => ctx.injector.get(PpsCadToMaterialValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsMaterial', typeName: 'PpsCad2mdcMaterialDto' },
	layoutConfiguration: PPS_CAD_TO_MATERIAL_LAYOUT,
	permissionUuid: '6727ab5728gb492d8612gv47e73dgh90',

});