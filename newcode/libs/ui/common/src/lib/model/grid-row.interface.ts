/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * nodeInfo from grid row data of tree
 */
interface INodeInfo {
	/**
	 * level of tree
	 */
	level: number;
 }

 /**
  * Grid row data
  */
 export interface IRowData {
	/**
	 * node information of tree
	 */
	nodeInfo?: INodeInfo;
 }
