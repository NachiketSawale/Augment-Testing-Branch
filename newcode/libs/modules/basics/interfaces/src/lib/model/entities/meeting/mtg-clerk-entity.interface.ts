export interface IMtgClerkEntity {
    Id:number;
    Description?: string;
    FamilyName?: string;
    FirstName?: string;
    Code?: string;
    Company?: string;
    Title?: string;
    Department?: string;
    Signature?: string;
    Email?: string;
    TelephoneMobil?:string;
    TelephoneNumber?:string;
    FullName?:string;
    Address?:string;
    Remark?:string;
    Selected:boolean;
    Telephone1?:string;
    Telephone2?:string;
    Telefax?:string;
    Mobile?:string;
    Internet?:string;
    AddressLine?:string;
    ContactRoleFk?:number,
}