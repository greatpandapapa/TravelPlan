export interface IPlan {
    title: string;
    name: string;
    deparure_date: string;
    members: number;
    purpose: string;
    status: string;
    create_date: string;
    update_date: string;
    rev: number;
    usd_rate: number;
    eur_rate: number;
    local_rate: number;
    local_currency_name: string;
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
    tz_ajust: number|null;
    fee: number|null;
    currency: string;
    dest_id: number|null;
    pre_id: number|null;
}
export interface IDestination extends IBaseListItem {
    id: number;
    type: string;
    name: string;
    address: string;
    tel_number: string;
    reservation: string;
    reservation_site: string;
    reservation_url: string;
    fee: number;
    currency: string;
    pay: string;
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
    actionitem: IActionItem[]
}

declare module '*.json' {
    const data: DataJson
  
    export default data;
}

export interface IScheduleRows extends ISchedule {
    no: number;
    grp_id: number;
    dayn: string;
    end_time: string|null;
}

export interface IScheduleTable  extends IScheduleRows {
    type_label: string,
    start_time_auto_label: string,
    currency_label: string;
    destination: IDestinationTable;
}

export interface IScheduleNestedTable {
    id: number;
    count: number;
    head_id: number;
    rows:IScheduleTable[];
}

export interface IDestinationTable extends IDestination {
    alert: string;
}

export interface IValueOptions {
    label: string,
    value: string,
}
 
export interface INumberValueOptions {
    label: string,
    value: number,
}

export interface IBringItem extends IBaseListItem {
    id: number;
    name: string;
    type: string;
    memo: string;
    checked: boolean;
} 

export interface IActionItem extends IBaseListItem {
    id: number;
    name: string;
    type: string;
    limit_date: Date|null;
    memo: string;
    done: boolean;
} 