/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityField } from '../representation/entity-field.interface';
import { IEntityInfo } from '../representation/entity-info.interface';

/***
 * Represents a node in the Schema Graph Tree UI
 */
export class SchemaGraphNode {

	/**
	 * The parent node
	 */
	public parent?: string | number | SchemaGraphNode | null;

	/***
	 * The Logical Parent Node
	 */
	public logicalParentNode?: SchemaGraphNode;

	/**
	 * The node id
	 */
	public id: string | number;

	/**
	 * The ui type of associated entity field
	 */
	public uiTypeId?: string;

	/**
	 * The target id
	 */
	public targetId?: number;

	/**
	 * Name of the node
	 */
	public name: string;

	/**
	 * Path of the associated entity field
	 */
	public path: string;

	/**
	 * The child node list
	 */
	public children?: SchemaGraphNode[];

	/**
	 * The user label name
	 */
	public userLabelName?: string;

	/**
	 * The sort value
	 */
	public sorting?: number;

	/**
	 * The icon class
	 */
	public image?: string;

	/***
	 * The selected field data
	 */
	public fieldData?: IEntityInfo | IEntityField;

	/**
	 * Flag mightHaveChildren
	 */
	public mightHaveChildren: boolean;

	/**
	 * Target Kind
	 */
	public targetKind?: string;

	/**
	 * Flag isExpanded
	 */
	public isExpanded: boolean;

	/**
	 * Flag isRootItem
	 */
	public isRootItem: boolean = false;

	/**
	 * Flag onlyStructural
	 */
	public onlyStructural: boolean;

	/**
	 * Flag isEnum
	 */
	public isEnum: boolean;

	/**
	 * Flag isVirtual
	 */
	public isVirtual: boolean = false;

	/**
	 * Flag isNullable
	 */
	public isNullable: boolean = false;

	/**
	 * Flag isFilteredAttribute
	 */
	public isFilteredAttribute: boolean = false;

	/**
	 * nodeInfo
	 */
	public nodeInfo?: {
		level: number,
		collapsed: boolean,
		lastElement?: boolean,
		children?: boolean | null
	} | null;

	/**
	 * Default constructor
	 * @param id
	 * @param uiTypeId
	 * @param targetId
	 * @param name
	 * @param parent
	 * @param userLabelName
	 * @param isEnum
	 * @param isForeignKey
	 */
	public constructor(id: string, uiTypeId: string, targetId: number | null, name: string, parent?: string | number | SchemaGraphNode | null, isEnum?: boolean, isForeignKey?: boolean, userLabelName?: string) {
		this.id = id;
		this.uiTypeId = uiTypeId;
		if (targetId) {
			this.targetId = targetId;
		}
		this.name = name;
		this.parent = parent;
		this.isEnum = !!isEnum;
		this.userLabelName = userLabelName;
		this.path = (this.parent instanceof SchemaGraphNode) ? (this.parent?.getChildrenPath() ?? '') : '';
		this.mightHaveChildren = false;
		this.isExpanded = false;
		this.onlyStructural = false;

		this.setIconClass(isForeignKey);
	}

	// public removeTreeExpand(parentLevel: number|null|undefined) {
	// 	if(!this.nodeInfo) {
	// 		this.nodeInfo = {
	// 			level: (parentLevel) ? parentLevel + 1 : 1,
	// 			collapsed: true,
	// 			lastElement: true
	// 		}
	// 	}
	//
	// 	this.nodeInfo.children = false;
	// }

	/***
	 * Gets the children path
	 */
	public getChildrenPath() {
		if (!this.path || this.path === '') {
			return this.name;
		} else {
			//return this.path + $translate.instant('basics.common.fieldSelector.levelSeparator') + this.name;
			return this.path + '.' + this.name;
		}
	}

	private setIconClass(isForeignKey?: boolean) {
		if (typeof this.targetId === 'number') {
			if (this.isEnum) {
				this.image = 'control-icons ico-criterion-lookup';
			} else if (isForeignKey) {
				this.image = 'control-icons ico-criterion-1n';
			} else {
				this.image = 'control-icons ico-criterion-n1';
			}
		} else if (this.uiTypeId) {
			this.image = this.pickIconTypeUiTypeId(this.uiTypeId);
		}
	}

	private pickIconTypeUiTypeId(uiTypeId: string) {
		switch (uiTypeId) {
			case'number':
			case'quantity':
				return 'control-icons ico-domain-decimal';
			case 'factor':
				return 'control-icons ico-domain-factor';
			case 'money':
				return 'control-icons ico-domain-money';
			case 'exchangerate':
				return 'control-icons ico-domain-exchangerate';

			case'integer':
				return 'control-icons ico-domain-integer';
			case'percent':
				return 'control-icons ico-domain-percent';

			case'date':
			case'dateutc':
				return 'control-icons ico-domain-date';

			case'datetime':
			case'datetimeutc':
				return 'control-icons ico-domain-date-time';

			case'code':
			case'string':
			case'description':
			case'remark':
			case 'remarkString':
			case'comment':
			case'text':
				return 'control-icons ico-domain-text';

			case'translation':
				return 'control-icons ico-domain-translation';

			case'boolean':
				return 'control-icons ico-domain-boolean';

			case 'lookup':
				return 'control-icons ico-domain-lookup';
			case'email':
				return 'control-icons ico-domain-email';
			case'color':
				return 'control-icons ico-domain-color';
			case 'imageselect':
				return 'control-icons ico-domain-imageselect';
			case 'relationset':
				return 'control-icons ico-domain-lookup';

			case 'characteristics':
				return 'control-icons ico-criterion-at-fo';
			default:
				return 'control-icons ico-domain-text';
		}
	}
}