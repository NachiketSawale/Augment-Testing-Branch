/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject, Output, ViewChild } from '@angular/core';
import { IEntityFieldTreeSelectionOptions } from '../../model/representation/entity-field-tree-selection-option.interface';
import { SchemaGraphNode } from '../../model/schema-graph-node/schema-graph-node.class';
import { RuleEditorSchemaGraphService } from '../../services/rule-editor-schema-graph.service';
import { IDdStateConfig } from '../../model/representation/dd-state-config.interface';
import { FIELD_SELECTION_DLG_MODEL_TOKEN } from '../../model/data/field-selection-dialog-model.model';
import { SchemaGraphProvider } from '../../model/schema-graph-node/schema-graph-provider.class';
import { FieldType } from '../../../model/fields/field-type.enum';
import { ConcreteMenuItem, IMenuItemEventInfo, IMenuItemsList } from '../../../model/menu-list/interface';
import { GridComponent, IGridConfiguration, TreeNodeEvent, TreeNodeEventType } from '../../../grid';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';


@Component({
	selector: 'ui-common-entity-field-tree-selection',
	templateUrl: './entity-field-tree-selection.component.html',
	styleUrls: ['./entity-field-tree-selection.component.css']
})
export class EntityFieldTreeSelectionComponent implements AfterViewInit {
	private readonly options: IEntityFieldTreeSelectionOptions;
	private schemaGraphService = inject(RuleEditorSchemaGraphService);
	private readonly model = inject(FIELD_SELECTION_DLG_MODEL_TOKEN);
	private graphProvider!: SchemaGraphProvider;
	private rootNode: SchemaGraphNode[] | null = null;
	private toolBarItems: ConcreteMenuItem[] = [];
	/**
	 * A wrapper around a native element inside of a View.
	 */
	private elementRef = inject(ElementRef);

	@ViewChild('tableSelectionGrid')
	public tableSelectionGrid?: GridComponent<SchemaGraphNode>;

	/***
	 * Flag dataLoaded
	 */
	public dataLoaded = false;

	/***
	 * the selected node on the list to the left
	 */
	public selectedNode?: SchemaGraphNode;

	/***
	 * The selected child field on the list to the right
	 */
	@Output()
	public selectedField?: SchemaGraphNode;

	/**
	 * Tools
	 */
	public tools!: IMenuItemsList;

	/**
	 * Field selection grid config
	 */
	public visibleFieldsGridConfig: IGridConfiguration<SchemaGraphNode> = {
		uuid: '98aba2b09eb6406499defb024fdf89b1',
		skipPermissionCheck: true,
		enableCopyPasteExcel: true,
		enableColumnReorder: true,
		idProperty: 'id',
		columns: [
			{
				id: 'image',
				model: 'image',
				type: FieldType.Image,
				pinned: true,
				visible: true,
				sortable: true,
				readonly: true,
				headerChkbox: false,
				width: 30,
				label: ''
			},
			{
				id: 'item',
				model: 'name',
				type: FieldType.Description,
				pinned: true,
				visible: true,
				sortable: true,
				readonly: true,
				headerChkbox: false,
				width: 200,
				label: {key: 'Item'}
			},
			{
				id: 'path',
				model: 'path',
				type: FieldType.Description,
				pinned: true,
				visible: true,
				sortable: true,
				readonly: true,
				headerChkbox: false,
				width: 300,
				label: {key: 'Path'}
			},
		],
		items: []
	};

	/**
	 * Table selection grid config
	 */
	public tableSelectionGridConfig: IGridConfiguration<SchemaGraphNode> = {
		uuid: '623a8f7c280740d292b2764767485158',
		skipPermissionCheck: true,
		enableCopyPasteExcel: true,
		enableColumnReorder: true,
		idProperty: 'id',
		columns: [
			{
				id: 'parentElement',
				model: 'name',
				type: FieldType.Description,
				pinned: true,
				visible: true,
				sortable: true,
				readonly: true,
				headerChkbox: false,
				width: 200,
				label: 'Parent Element'
			},
			{
				id: 'selector',
				model: 'selector',
				type: FieldType.Description,
				pinned: true,
				visible: true,
				sortable: true,
				readonly: true,
				headerChkbox: false,
				width: 80,
				label: 'Selector'
			}
		],
		treeConfiguration: {
			width: 80,
			collapsed: true,
			rootEntities: () => {
				return this.rootNode ?? [];
			},
			parent: (entity) => {
				if (entity.parent) {
					return entity.parent as SchemaGraphNode;
				}
				return null;
			},
			children: (entity) => {
				return this.getVisibleChildren(entity);
			}
		},
		items: []
	};


	private addToolbarItems() {
		this.toolBarItems.push(
			{
				id: 'add',
				sort: 1,
				caption: 'Add',
				iconClass: 'tlb-icons ico-add',
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo) => {
					// ToDo
				},

				disabled: (info: IMenuItemEventInfo) => {
					return true; // ToDo
				},
			},
			{
				id: 'delete',
				sort: 2,
				caption: 'Delete',
				iconClass: 'tlb-icons ico-delete2',
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo) => {
					// ToDo
				},

				disabled: (info: IMenuItemEventInfo) => {
					return true; // ToDo
				},
			},
		);
	}

	private setTools() {
		this.addToolbarItems();
		this.tools = {
			cssClass: 'tools',
			showImages: true,
			showTitles: false,
			isVisible: true,
			activeValue: '',
			overflow: false,
			iconClass: '',
			layoutChangeable: false,
			items: this.toolBarItems,
		};
	}

	private loadGrandchildrenOfNode(targetNode: SchemaGraphNode) {
		targetNode.children?.forEach(node => {
			this.graphProvider.addChildrenDynamically(node);
			if (node.nodeInfo) {
				node.nodeInfo.children = this.getVisibleChildren(node).length > 0;
			}
		});
	}

	private selectNodesInTableSelectionGrid(nodes: SchemaGraphNode[]) {
		if (this.tableSelectionGrid) {
			this.tableSelectionGrid.selection = nodes;
			this.onTableSelectionChanged(nodes);
		}
	}

	/***
	 * Select field handler
	 * @param fields
	 */
	public onVisibleFieldSelectionChanged(fields: SchemaGraphNode[]) {
		this.selectedField = fields.length > 0 ? fields[fields.length - 1] : undefined;
		this.model.selectedNode = this.selectedField;
	}

	/**
	 * Select table grid initialized handler
	 * @param initialized
	 */
	public onTableSelectionGridInitialized(initialized: boolean) {
		setTimeout(() => {
			if (this.rootNode) {
				this.selectNodesInTableSelectionGrid(this.rootNode);
			}

		}, 500);
	}

	/**
	 * Select table handler
	 * @param nodes
	 */
	public onTableSelectionChanged(nodes: SchemaGraphNode[]) {
		this.selectedNode = nodes.length > 0 ? nodes[nodes.length - 1] : undefined;
		if (this.selectedNode) {
			this.graphProvider.addChildrenDynamically(this.selectedNode);
		}
		this.visibleFieldsGridConfig = {
			...this.visibleFieldsGridConfig,
			items: this.getVisibleFields()
		};
	}

	/**
	 * onTableSelectionExpansionChanging
	 * @param nodeEvent
	 */
	public onTableSelectionExpansionChanging(nodeEvent: TreeNodeEvent<SchemaGraphNode>) {
		if (nodeEvent.eventType === TreeNodeEventType.Expand) {
			this.loadGrandchildrenOfNode(nodeEvent.entity);
			this.selectNodesInTableSelectionGrid([nodeEvent.entity]);
		}
	}

	/**
	 * It is invoked only once when the view is instantiated.
	 */
	public ngAfterViewInit() {
		this.removeSplitterGutterHeight();
	}

	//TODO: Below function is just added to make splitter working.
	//TODO: This function will be removed when height issue from splitter get resolved.
	public removeSplitterGutterHeight(): void {
		const ele = (this.elementRef.nativeElement as HTMLElement).querySelector('#sp0') as HTMLElement;
		if (ele) {
			ele.style.setProperty('height', 'auto');
		}
	}

	/***
	 * Gets the children of a node
	 * @param node
	 */
	public getVisibleChildren(node: SchemaGraphNode) {

		if (node.children) {
			const children = node.children.filter(child => {
				return child.onlyStructural || (child.targetId && !child.targetKind);
			});
			if(node.name === 'Characteristics' || node.name === 'Resource') {
				console.group();
				console.log('getting children of node',node.name, node);
				console.log(node.parent);
				console.log(children);
				console.groupEnd();
			}
			return children;
		}
		return [];
	}

	/***
	 * Gets the visible child nodes of selected node
	 */
	public getVisibleFields(): SchemaGraphNode[] {
		if (!this.selectedNode || !this.selectedNode.children) {
			return [];
		}

		return this.selectedNode.children.filter((field: SchemaGraphNode) => !field.onlyStructural);
	}

	/**
	 * Constructor
	 */
	public constructor() {
		this.options = this.model.options;
		const schemaConfig: IDdStateConfig = {
			focusTableName: this.options.tableName,
			moduleName: this.options.moduleName,
		};

		this.schemaGraphService.getSchemaGraphProvider(schemaConfig).subscribe(graphProvider => {
			console.log('loading complete');
			this.graphProvider = graphProvider;
			this.rootNode = graphProvider.getLoadedTree();
			this.dataLoaded = true;
		});

		this.setTools();
	}

}
