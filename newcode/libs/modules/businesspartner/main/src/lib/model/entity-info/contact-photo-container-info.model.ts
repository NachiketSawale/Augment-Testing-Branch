import {ContainerDefinition} from '@libs/ui/container-system';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {BasicsSharedPhotoEntityViewerComponent, PHOTO_ENTITY_VIEWER_OPTION_TOKEN} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {BusinesspartnerContactPhotoDataService} from '../../services/contact-photo-data.service';
import { IContactPhotoEntity } from '@libs/businesspartner/interfaces';

export const BP_MAIN_CONTACT_PHOTO_CONTAINER_INFO = new ContainerDefinition({
	uuid: '3d4ec8d837f049eda2e7d92e051d9351',
	id: 'businesspartner.main.contactphoto',
	title: {
		text: 'Contact Photo',
		key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.contactPhotoContainerTitle'
	},
	containerType: BasicsSharedPhotoEntityViewerComponent,
	permission: '3d4ec8d837f049eda2e7d92e051d9351',
	providers: [{
		provide: new EntityContainerInjectionTokens<IContactPhotoEntity>().dataServiceToken,
		useExisting: BusinesspartnerContactPhotoDataService
	}, {
		provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
		useValue: {
			isSingle: true,
			hasCommentTextField: true
		}
	}]
});