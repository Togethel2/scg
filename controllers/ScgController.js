class Scg {
    constructor() {

    }

    cal(data) {
        let raw_result = this.calculate_child(data);
        let true_result = this.check_results(data, raw_result);
        let res = {};
        switch (true_result) {
            case 'is_plus': //minus
                res = this.plus_nextvalue(data, raw_result);
                break;
            case 'is_multiply':
                res = this.multiply_nextvalue(data, raw_result / 2);
                break;
            case 'is_multiply_glow':
                res = this.multiplyglow_nextvalue(data, raw_result);
                break;
            default:
                res = 'Data not match!';
                break;
        }
        return res;
    }

    calculate_child(data) {
        var sub_data = [];
        var data_length = data.length;
        var check_data_equal = true;
        for (let i = 0; i < data_length - 1; i++) {
            if (data[0] != data[i + 1]) {
                check_data_equal = false;
            }
            sub_data[i] = data[i + 1] - data[i];
        }

        if (check_data_equal) {
            return data[0];
        } else {
            console.log(sub_data);
            return this.calculate_child(sub_data);
        }
    }

    check_results(data, raw_result) {
        var data_length = data.length;

        //check plus and minus
        let is_plus = false;
        for (let i = 0; i < data_length - 1; i++) {
            let ans = data[i] + raw_result
            if (ans != data[i + 1]) {
                is_plus = false;
                break;
            } else {
                is_plus = true;
            }
        }
        console.log('is_plus', is_plus);
        if (is_plus) {
            return 'is_plus';
        }

        // multiply
        let is_multiply = false;
        for (let i = 0; i < data_length - 1; i++) {
            let ans = data[i] * (raw_result / 2)
            if (ans != data[i + 1]) {
                is_multiply = false;
                break;
            } else {
                is_multiply = true;
            }
        }
        console.log('is_multiply', is_multiply);
        if (is_multiply) {
            return 'is_multiply'
        }

        // is_multiply_glow
        let is_multiply_glow = false;
        for (let i = 1; i < data_length; i++) {
            let ans = data[i - 1] + (raw_result * i)
            if (ans != data[i]) {
                is_multiply_glow = false;
                break;
            } else {
                is_multiply_glow = true;
            }
        }
        console.log('is_multiply_glow', is_multiply_glow)
        if (is_multiply_glow) {
            return 'is_multiply_glow'
        }
    }

    plus_nextvalue(data, raw_result) {
        var data_length = data.length;
        for (let i = 0; i < 3; i++) {
            data[data_length + i] = data[data_length - 1 + i] + raw_result;
        }
        return data;
    }

    multiply_nextvalue(data, raw_result) {
        var data_length = data.length;
        for (let i = 0; i < 3; i++) {
            data[data_length + i] = data[data_length - 1 + i] * raw_result;
        }
        return data;
    }

    multiplyglow_nextvalue(data, raw_result) {
        var data_length = data.length;
        for (let i = 1; i <= 3; i++) {
            data[data_length + i - 1] = data[data.length - 1] + (raw_result * data.length);
        }
        return data;
    }

    formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

}
module.exports = Scg