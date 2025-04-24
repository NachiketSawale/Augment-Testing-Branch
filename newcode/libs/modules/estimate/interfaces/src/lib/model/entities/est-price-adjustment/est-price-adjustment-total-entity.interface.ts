export interface IEstPriceAdjustmentTotalEntity {
    Id: string,
    AdjType: string,
    Quantity: number | null,
    EstimatedPrice: number | null,
    AdjustmentPrice: number | null,
    TenderPrice: number | null,
    DeltaA: number | null,
    DeltaB: number | null,
    Status?:number | null
}