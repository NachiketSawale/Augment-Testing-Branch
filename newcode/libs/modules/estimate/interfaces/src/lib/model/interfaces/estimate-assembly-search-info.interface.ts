/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for estimate assembly search info data
 */

export interface IEstAssemblySearchInfo {

 /**
     * Job Id
     * Represents the identifier for the job header.
     */
 HeaderJobFk: number | null;

 /**
  * LGM Job Id
  * Represents the identifier for the LGM job.
  */
 LgmJobFk: number | null;

 /**
  * Project Id
  * Represents the identifier for the project.
  */
 ProjectId: number | null;

 /**
  * Filter
  * Represents the filter string used for searching.
  */
 filter: string;

 /**
  * Filter by Category Structure
  * Represents the filter string used for searching by category structure.
  */
 filterByCatStructure: string;

 /**
  * Items Per Page
  * Represents the number of items to display per page.
  */
 itemsPerPage: number;
}