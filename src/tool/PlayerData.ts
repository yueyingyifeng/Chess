
export class PlayerData{
    public id : number;
    public name : string | null;

    constructor(){
        this.id = -1;
        this.name = prompt("输入您的名字",'五子侠')
        if(this.name != null && this.name.length >7)
        {
            this.name = this.name.substring(0,5);
        }
        
        if(this.name == null || this.name === '')
            this.name = "害羞鬼";
    }
}