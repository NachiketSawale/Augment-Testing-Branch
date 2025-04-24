import { EntityInfo } from '@libs/ui/business-base';
import { IObjectSet2ObjectEntity } from '../entities/object-set-2-object-entity.interface';
import { ConstructionSystemMainObjectSet2ObjectDataService } from '../../services/construction-system-main-object-set2-object-data.service';
import { ConstructionSystemMainObjectSet2ObjectLayoutService } from '../../services/layouts/construction-system-main-object-set2-object-layout.service';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO = EntityInfo.create<IObjectSet2ObjectEntity>({
	grid: {
		title: { key: 'model.main.objectSet2ObjectListTitle' },
		containerUuid: 'a01aa7c4e8834505abce5b87f28c7e47',
	},
	form: {
		title: { key: 'model.main.objectSet2ObjectDetailTitle' },
		containerUuid: '43d723645ef841cab0d26318edb83ebc',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainObjectSet2ObjectDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectSet2ObjectDto' },
	permissionUuid: 'de6317b8a309450485e28addd88f3577',
	layoutConfiguration: (context) => context.injector.get(ConstructionSystemMainObjectSet2ObjectLayoutService).generateLayout(),
});