import { IContactEntity } from '@libs/businesspartner/interfaces';
import { BaseValidationService, IEntitySelection } from '@libs/platform/data-access';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ContactSource } from '../../enums/contact-source.enum';
import { OptionallyAsyncResource } from '@libs/platform/common';

export interface IContactEntityInfoSetting {
	/*
	required
	 */
	gridUuid: string;
	/*
	required
	 */
	fromUuid: string;
	/*
	required
	 */
	permissionUuid:string;
	/*
	required,is new container please add in ContactSource enum
	 */
	source: ContactSource;
	/*
	required
	 */
	dataServiceToken: OptionallyAsyncResource<IEntitySelection<IContactEntity>>;
	behavior?: OptionallyAsyncResource<IEntityContainerBehavior<IGridContainerLink<IContactEntity>, IContactEntity>>;
	validationService?: OptionallyAsyncResource<BaseValidationService<IContactEntity>>;
}
