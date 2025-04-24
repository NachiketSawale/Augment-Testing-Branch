import { IEstimateEntity } from './estimate-entity.interface';
import { IEstProjectInfo } from './est-project-info.interface';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { IClobsEntity } from '@libs/basics/shared';

// An interface that represents a composite estimate entity
export interface IEstimateCompositeEntity {
	// Optional: The project information object. It can be of type IEstProjectInfo or null.
	projectInfo?: IEstProjectInfo | null;

	displayMember?: string | null;

	/*
	 * DefaultFilterOfRelatedAssembliesValue
	 */
	DefaultFilterOfRelatedAssembliesValue?: number | null;

	/*
	 * DoChangeActiveEstimate
	 */
	DoChangeActiveEstimate?: boolean;

	/*
	 * EstHeader
	 */
	EstHeader: IEstHeaderEntity;

	/*
	 * EstHeaderId
	 */
	EstHeaderId: number;

	/*
	 * EstHeaderTextToSave
	 */
	EstHeaderTextToSave?: IClobsEntity | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsGCOrder
	 */
	IsGCOrder?: boolean;

	/*
	 * IsHeaderStatusReadOnly
	 */
	IsHeaderStatusReadOnly?: boolean;

	/*
	 * IsReLoad
	 */
	IsReLoad?: boolean;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string;

	/*
	 * PrjEstimate
	 */
	PrjEstimate: IEstimateEntity;

	/*
	 * ClobsFk
	 */
	ClobsFk?: number | null;
}
