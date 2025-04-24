/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainAddressDataService } from '../services/project-main-address-data.service';
import { IProjectAddressEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedAddressDialogComponent, BasicsSharedCustomizeLookupOverloadProvider, createFormDialogLookupProvider } from '@libs/basics/shared';
import { FieldType } from '@libs/ui/common';
import { ProjectMainAddressValidationService } from '../services/project-main-address-validation.service';


 export const PROJECT_MAIN_ADDRESS_ENTITY_INFO: EntityInfo = EntityInfo.create({
	 grid: {
		 title: {key: 'project.main.addressList'},
	 },
	 form: {
		 title: { key: 'project.main.addressDetail' },
		 containerUuid: 'caa64e99b7d449bd981e798331c458f9',
	 },
	 dataService: ctx => ctx.injector.get(ProjectMainAddressDataService),
	 validationService: ctx => ctx.injector.get(ProjectMainAddressValidationService),
	 dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectAddressDto'},
	 permissionUuid: '130eb724690c429aa4e359ed0c53115b',
	 layoutConfiguration: {
		 groups: [
			 {
				 gid: 'baseGroup',
				 attributes: ['Description', 'CommentText', 'AddressFk', 'AddressTypeFk']
			 }
		 ],
		 overloads: {
			 AddressFk: {
				 type: FieldType.CustomComponent,
				 componentType: BasicsSharedAddressDialogComponent,
				 providers: createFormDialogLookupProvider({
					 objectKey: 'AddressEntity',
					 displayMember: 'Address',
					 showClearButton: true,
					 showPopupButton: false
				 })
			 },
			 AddressTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideAddressTypeLookupOverload(true),

		 },
		 labels: {
			 ...prefixAllTranslationKeys('cloud.common.', {
				 Description: {key: 'entityDescription'},
				 CommentText: {key: 'entityCommentText'},
				 AddressFk: {key: 'entityAddress'},
			 }),
			 ...prefixAllTranslationKeys('project.main.', {
				 AddressTypeFk: {key: 'AddressTypeFk'},
			 }),
		 }
	 }
} as IEntityInfo<IProjectAddressEntity>);