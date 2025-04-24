import { IEntitySelection } from '@libs/platform/data-access';
import { BasicsMeetingSection, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { IInitializationContext, Translatable } from '@libs/platform/common';

/**
 * Provide the option to create the entity info instance.
 */
export interface ILink2MeetingEntityInfoOptions<PT extends object> {
	/**
	 * Meeting in other module.
	 */
	sectionId: BasicsMeetingSection;

	/**
	 * permission Uuid, it is also used for container Uuid if containerUuid is not provided.
	 */
	permissionUuid: string;

	/**
	 * Provide containerUuid if it is different from permissionUuid.
	 */
	containerUuid?: string;

	/**
	 * Grid title translation
	 */
	gridTitle?: Translatable;

	/**
	 * Provide formContainerUuid.
	 */
	formContainerUuid: string;

	/**
	 * Form title translation
	 */
	formTitle?: Translatable;

	/**
	 * Override the isParentFn
	 * @param parentKey
	 * @param entity
	 */
	isParentFn: (parentKey: PT, entity: IMtgHeaderEntity) => boolean;

	/**
	 * Parent service provide function.
	 * @param context
	 */
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;

	/**
	 * Parent service readonly state access provide function.
	 * @param parentService
	 * @param context
	 */
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>, context: IInitializationContext) => boolean;
}

/**
 * Service init options
 */
export interface ILink2MeetingDataServiceInitOptions<PT extends object> {
	sectionId: BasicsMeetingSection;
	parentService: IEntitySelection<PT>;
	isParentFnOverride: (parentKey: PT, entity: IMtgHeaderEntity) => boolean;
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>) => boolean;
}

/**
 * Behavior init options
 */
export interface ILink2MeetingEntityInfoBehaviorOptions<PT extends object> {
	sectionId: BasicsMeetingSection;
	dataService: IEntitySelection<IMtgHeaderEntity>;
	parentService: IEntitySelection<PT>;
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>) => boolean;
}
