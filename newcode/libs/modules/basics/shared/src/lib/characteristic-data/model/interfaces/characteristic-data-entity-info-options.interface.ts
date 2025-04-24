/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySelection } from '@libs/platform/data-access';
import { IInitializationContext, Translatable } from '@libs/platform/common';
import { BasicsCharacteristicSection, ICharacteristicDataEntity } from '@libs/basics/interfaces';
import { Observable } from 'rxjs';

/**
 * Options to initialize Characteristic Data Group Data Service.
 */
export interface ICharacteristicDataGroupServiceInitializeOptions<PT extends object> {
	/**
	 * Characteristic section id.
	 */
	sectionId: BasicsCharacteristicSection;

	/**
	 * Parent service.
	 */
	parentService: IEntitySelection<PT>;

	/**
	 * a function to check parent item is readOnly or not
	 */
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>) => boolean;

	/**
	 * Retrieve all parents, check them can create/delete or not
	 * @param parentService
	 */
	areParentsCanCreateOrDeleteFn?: (parentService: IEntitySelection<PT>) => boolean;

	/**
	 * set entity to readonly if root entity is readonly function
	 * @param parentService
	 */
	setEntityToReadonlyIfRootEntityIsFn?:(parentService: IEntitySelection<PT>,entity:ICharacteristicDataEntity) => void;

	/**
	 * a function to get default list once parent entity is created function
	 * @param parentService
	 */
	getDefaultListForParentEntityCreateFn?:(parentEntity: PT,sectionId:number,configurationSectionId?:number,structureSectionId?:number) => Observable<ICharacteristicDataEntity[]>;

	/**
	 * a function to get default list once parent entity is created by section function
	 * @param parentService
	 */
	getDefaultListForParentEntityCreatePerSectionFn?:(parentEntity: PT,sectionId:number) => Observable<ICharacteristicDataEntity[]>;

	/**
	 * Check weather need to subscribe to parent entity created
	 */
	isAddSubscriptionForParentEntityCreated?:boolean;

	/**
	 * pKey1 field.
	 */
	pKey1Field?:  (keyof PT);

	/**
	 * pKey2 field.
	 */
	pKey2Field?:  (keyof PT);

	/**
	 * pKey3 field.
	 */
	pKey3Field?:  (keyof PT);
	/**
	 * parentField field
	 */
	parentField?:  (keyof PT);
}

/**
 * Options to initialize Characteristic Data Service.
 */
export interface ICharacteristicDataServiceInitializeOptions<ICharacteristicGroupEntity, PT extends object> extends ICharacteristicDataGroupServiceInitializeOptions<PT> {
	/**
	 *  Characteristic group service.
	 */
	groupService?: IEntitySelection<ICharacteristicGroupEntity> & IBasicsCharacteristicGroupService;
}

export interface IBasicsCharacteristicGroupService {
	/**
	 * refresh characteristic group data
	 */
	refreshGroup(): void;
}
/**
 *
 */
export interface ICharacteristicDataEntityInfoOptions<PT extends object> {
	/**
	 * Characteristic section id.
	 */
	sectionId: BasicsCharacteristicSection;

	/**
	 * permission Uuid, it is also used for container Uuid if containerUuid is not provided.
	 */
	permissionUuid: string;

	/**
	 * Provide containerUuid if it is different from permissionUuid.
	 */
	containerUuid?: string;

	/**
	 * Title.
	 */
	gridTitle?: Translatable;

	/**
	 * Parent service initialize function.
	 */
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;

	/**
	 * a function to check parent item is readOnly or not
	 */
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>) => boolean;

	/**
	 * Retrieve all parents, check them can create/delete or not
	 * @param parentService
	 */
	areParentsCanCreateOrDeleteFn?: (parentService: IEntitySelection<PT>) => boolean;

	/**
	 * set entity to readonly if root entity is readonly function
	 * @param parentService
	 */
	setEntityToReadonlyIfRootEntityIsFn?:(parentService: IEntitySelection<PT>,entity:ICharacteristicDataEntity) => void;

	/**
	 * a function to get default list once parent entity is created function
	 * @param parentService
	 */
	getDefaultListForParentEntityCreateFn?:(parentEntity: PT,sectionId:number,configurationSectionId?:number,structureSectionId?:number) => Observable<ICharacteristicDataEntity[]>;

	/**
	 * a function to get default list once parent entity is created by section function
	 * @param parentService
	 */
	getDefaultListForParentEntityCreatePerSectionFn?:(parentEntity: PT,sectionId:number) => Observable<ICharacteristicDataEntity[]>;

	/**
	 * Check weather need to subscribe to parent entity created
	 */
	isAddSubscriptionForParentEntityCreated?:boolean;

	/**
	 * pKey1 field.
	 */
	pKey1Field?: (keyof PT);

	/**
	 * pKey2 field.
	 */
	pKey2Field?: (keyof PT);

	/**
	 * pKey3 field.
	 */
	pKey3Field?: (keyof PT);

	/**
	 * parentField field
	 */
	parentField?: (keyof PT);
}
