const Scg = require('./ScgController');
class Serial extends Scg{
    constructor(){
        super();
    }

    calculate(msg){
        let msg_list = msg.split(",");
        if (msg_list.length < 4) {
            return 'less number';
        }
        let syntax = true;
        for (let v of msg_list) {
            let v_temp = parseInt(v);
            if (Number.isNaN(v_temp)) {
                syntax = false;
                break;
            }
        }
        if (syntax == false) {
            return 'wrong syntax';
        }
        msg_list.forEach((v,i) => {
            msg_list[i] = parseInt(msg_list[i]);
        });
        
        return this.cal(msg_list);
    }
}

module.exports = Serial;
