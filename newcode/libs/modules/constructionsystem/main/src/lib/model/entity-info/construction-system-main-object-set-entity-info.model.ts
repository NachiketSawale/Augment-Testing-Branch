import { EntityInfo } from '@libs/ui/business-base';
import { ICosMainObjectSetEntity } from '../entities/cos-main-object-set-entity.interface';
import { ConstructionSystemMainObjectSetDataService } from '../../services/construction-system-main-object-set-data.service';
import { ConstructionSystemMainObjectSetLayoutService } from '../../services/layouts/construction-system-main-object-set-layout.service';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT_SET_ENTITY_INFO = EntityInfo.create<ICosMainObjectSetEntity>({
	grid: {
		title: { key: 'model.main.objectSet.listTitle' },
		containerUuid: 'bfefaf4dc2274e1abe88e1e573766399',
	},
	form: {
		title: { key: 'model.main.objectSet.detailTitle' },
		containerUuid: '4726a70bb41b4e069a210f499f267cf1',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainObjectSetDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectSetDto' },
	permissionUuid: 'a358f29d65c74a0f955ed5c1a1a57651',
	layoutConfiguration: (context) => context.injector.get(ConstructionSystemMainObjectSetLayoutService).generateLayout(context),
});