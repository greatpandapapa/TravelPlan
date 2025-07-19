export interface IPlan {
    title: string;
    name: string;
    deparure_date: string;
    members: number;
    purpose: string;
}
export interface IBaseListItem {
    id: number;
}
export interface IReference extends IBaseListItem {
    id: number;
    site: string;
    url: string;  
    memo: string;
}
export interface ISchedule extends IBaseListItem {
    id: number;
    start_time_auto: string;
    start_time: string|null;
    type: string;
    name: string;
    stay_minutes: number;
    dest_id: number|null;
    pre_id: number|null;
}
export interface IDestination extends IBaseListItem {
    id: number;
    type: string;
    name: string;
    address: string;
    reservation: string;
    reservation_site: string;
    reservation_url: string;
    fee: number;
    currency: string;
    source: string;
    url: string;
    url2: string;
    map_url: string;
    memo: string;
    hd_sun: boolean;
    hd_mon: boolean;
    hd_tue: boolean;
    hd_wed: boolean;
    hd_thu: boolean;
    hd_fri: boolean;
    hd_sat: boolean;
}

export interface DataJson {
    plan: IPlan,
    reference: IReference[],
    schedule: ISchedule[],
    destination: IDestination[],
    bringitem: IBringItem[]
}

declare module '*.json' {
    const data: DataJson
  
    export default data;
}

export interface IScheduleRows extends ISchedule {
    no: number;
    grp_id: number;
    dayn: string;
    end_time: string,
}

export interface IScheduleTable  extends IScheduleRows {
    type_label: string,
    start_time_auto_label: string,
    destination: IDestinationTable;
}

export interface IScheduleNestedTable {
    id: number;
    count: number;
    head_id: number;
    rows:IScheduleTable[];
}

export interface IDestinationTable extends IDestination {
    currency_label: string;
    alert: string;
}

export interface IValueOptions {
    label: string,
    value: string,
}
 
export interface IBringItem extends IBaseListItem {
    id: number;
    name: string;
    memo: string;
    checked: boolean;
} 
