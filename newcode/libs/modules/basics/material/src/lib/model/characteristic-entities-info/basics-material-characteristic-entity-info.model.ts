/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory} from '@libs/basics/shared'; 
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';

/**
 * Material characteristic entity info
 */
export const BASICS_MATERIAL_CHARACTERISTIC_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '66dfcac15d7b45928f80ae9e873b3bcc',
	sectionId: BasicsCharacteristicSection.Material,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsMaterialRecordDataService);
	}
});