import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
const axios = require('axios');
@Injectable()
export class TaskshedulerService {

    /*

    @Cron('15 * * * * *')
    handleCron() {

        const params = new URLSearchParams({
            id:'33'

        }).toString();

        const url =
            'https://v3.football.api-sports.io/teams?'+
            params;


        const config = {
            method: 'get',
            url:url ,
            headers: {
                'x-rapidapi-key': 'be66855373830180b8e8830f1d86b677',
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        };

        axios(config)
            .then(function (response) {
                console.log(response.data.response);
            })
            .catch(function (error) {
                console.log(url)
                console.log("url -------------------------------------------------")
                console.log("suka ::::",error);
            });
    }

    @Interval(10000)
    handleInterval() {
        console.log('Called every 10 seconds');
    }*/


}
