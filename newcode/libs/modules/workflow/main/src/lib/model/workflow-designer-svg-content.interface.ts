import { NodeDimension } from '@swimlane/ngx-graph';
import { IWorkflowSVGAttribute } from './workflow-designer-svg-attribute.interface';

/**
 * IWorkflowSVGContent captures the shape and shape attribute details of each node based on its actionTypeId parameter.
 */
export interface IWorkflowSVGContent {
	attribute: IWorkflowSVGAttribute;
	dimension: NodeDimension
}

