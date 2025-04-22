/*
 * Copyright(c) RIB Software GmbH
 */

export interface IModelHeaderEntityGenerated {

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DocumentTypeFk
	 */
	DocumentTypeFk?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsComposite
	 */
	IsComposite?: boolean | null;

	/*
	 * Kind
	 */
	Kind?: 'Unknown' | 'Model2D' | 'Model3D' | null;

	/*
	 * ModelFamilyFk
	 */
	ModelFamilyFk?: number | null;

	/*
	 * ModelRevision
	 */
	ModelRevision?: string | null;

	/*
	 * ModelVersion
	 */
	ModelVersion?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * RevisionId
	 */
	RevisionId?: number | null;

	/*
	 * StatusFk
	 */
	StatusFk?: number | null;

	/*
	 * TypeFk
	 */
	TypeFk?: number | null;
}
