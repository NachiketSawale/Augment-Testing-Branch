/*
 * Copyright(c) RIB Software GmbH
 */


import { IQtoMainHeaderGridEntity } from './qto-main-header-grid-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { QtoMainDetailGridComplete } from './qto-main-detail-grid-complete.class';
import {IQtoMainDetailGridEntity} from './qto-main-detail-grid-entity.class';
import {IQtoSheetEntity} from './entities/qto-sheet-entity.interface';
import {IQtoDetailBoqCalculateInfo} from './interfaces/qto-detail-boq-calculate-info.interface';

export class QtoMainHeaderGridComplete implements CompleteIdentification<IQtoMainHeaderGridEntity> {

	/*
  * AffectedQtoDetails
  */
	public AffectedQtoDetails?: IQtoMainDetailGridEntity[] | null = [];

	/*
     * BoqItemToDelete
     */
	// public BoqItemToDelete?: IBoqItemEntity[] | null = [];

	/*
     * BoqItemToSave
     */
	// public BoqItemToSave?: BoqItemComplete[] | null = [];

	/*
     * Goniometer
     */
	public Goniometer?: number | null = 10;

	/*
     * IsCalculate
     */
	public IsCalculate?: boolean | null = true;

	/*
     * IsCopy
     */
	public IsCopy?: boolean | null = true;

	/*
     * LocationsToDelete
     */
	// public LocationsToDelete?: IIIdentifyable[] | null = [];

	/*
     * LocationsToSave
     */
	// public LocationsToSave?: IIIdentifyable[] | null = [];

	/*
     * MainItemId
     */
	public MainItemId?: number | null = 10;

	/*
     * NoDecimals
     */
	public NoDecimals?: number | null = 10;

	/*
     * PrjQtoCommentToDelete
     */
	// public PrjQtoCommentToDelete?: IQtoCommentEntity[] | null = [];

	/*
     * PrjQtoCommentToSave
     */
	// public PrjQtoCommentToSave?: IQtoCommentEntity[] | null = [];

	/*
     * QtoDetailToDelete
     */
	public QtoDetailToDelete?: IQtoMainDetailGridEntity[] | null = [];

	/*
     * QtoDetailToSave
     */
	public QtoDetailToSave?: QtoMainDetailGridComplete[] | null = [];

	/*
     * QtoHeader
     */
	public QtoHeader?: IQtoMainHeaderGridEntity | null = null;

	/*
     * QtoHeaderId
     */
	public QtoHeaderId?: number | null = 10;

	/*
     * QtoSheetsToDelete
     */
	public QtoSheetsToDelete?: IQtoSheetEntity[] | null = [];

	/*
     * QtoSheetsToSave
     */
	public QtoSheetsToSave?: IQtoSheetEntity[] | null = [];

	/*
     * RemovedQtoDetailCostGroups
     */
	// public RemovedQtoDetailCostGroups?: IMainItem2CostGroupEntity[] | null = [];

	/*
     * WarningInfo
     */
	public WarningInfo?: string | null = '' ;

	/*
     * qtoDetialsOfAffectedBoq
     */
	 public qtoDetialsOfAffectedBoq?: IQtoDetailBoqCalculateInfo[] | null = [];

	/*
     * timeStr
     */
	public timeStr?: string | null = '' ;
}
