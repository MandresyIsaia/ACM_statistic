export class Month{
    month_num: number;
    month_name: string;

    constructor(init?: Partial<Month>) {
        Object.assign(this, init);
    }

}