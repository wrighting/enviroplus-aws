import { Component } from '@angular/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import { APIService, GetMonitorQuery, ListMonitorsQuery } from '../API.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [
    APIService
  ],
})
export class HomePage {

  public startTime;
  public limit = 150;
  maxLimit = 150;
  readingTypes: any[] = [
    {
      id: 1,
      label: 'temperature'
    },
    {
      id: 2,
      label: 'pm'
    },
    {
      id: 3,
      label: 'humidity'
    },
    {
      id: 4,
      label: 'pressure'
    },
    {
      id: 5,
      label: 'gases'
    }
  ];

  ranges: any[] = [
    {
      value: 150,
      label: 'day'
    },
    {
      value: 1000,
      label: 'week'
    },
    {
      value: 4000,
      label: 'month'
    },
    {
      value: 52000,
      label: 'year'
    }
  ];

  public readingType = "temperature";
  public ident = [];

  public results = {};

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<Color> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'green',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  dataTypes: { key: string; label: string; }[];

  constructor(/*private amplifyService: AmplifyService*/) {

  }
  ngOnInit() {
    let now = new Date();
    now.setMinutes(now.getMinutes() - 20);
    this.startTime = now.toISOString()
    this.getMonitors();
  }




  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }

  async ListMonitors(): Promise<ListMonitorsQuery> {
    const statement = `query listMonitors {
      listMonitors {
        items {
          id
          ident
        }
      }
    }`;
    const gqlAPIServiceArguments: any = {};

    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListMonitorsQuery>response.data.listMonitors;
  }

  public getMonitors() {
    const response = this.ListMonitors();

    response.then(res => {
      this.ident = res.items;
      this.refresh();
    });

  }
  async GetMonitorReadings(id: string, start_time, limit?: number): Promise<GetMonitorQuery> {
    const statement = `query GetMonitor($id: ID!, $limit: Int, $start_time: String) {
        getMonitor(id: $id) {
          id
          readingsByDate (limit: $limit, collection_time: { gt: $start_time } ) {
            items {
              collection_time
              humidity
              light
              nh3
              oxidised
              pm1
              pm10
              pm25
              pressure
              reduced
              temperature
              raw_temperature
              comp_factor
              volume
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {};

    gqlAPIServiceArguments.id = id;

    gqlAPIServiceArguments.start_time = start_time;

    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }

    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetMonitorQuery>response.data.getMonitor;
  }

  setDataTypes() {

    let keys = [
      {
        key: this.readingType,
        label: this.readingType
      }
    ]
    if (this.readingType == "temperature") {
      keys.push(
        {
          key: 'raw_temperature',
          label: 'Raw Temperature'
        });
    } else if (this.readingType == "pm") {
      keys = [
        {
          key: 'pm1',
          label: 'pm1'
        },
        {
          key: 'pm10',
          label: 'pm10'
        },
        {
          key: 'pm25',
          label: 'pm25'
        }
      ];
    } else if (this.readingType == "gases") {
      keys = [
        {
          key: 'oxidised',
          label: 'oxidised'
        },
        {
          key: 'reduced',
          label: 'reduced'
        },
        {
          key: 'nh3',
          label: 'nh3'
        }
      ];
    }

    this.dataTypes = keys;
  }
  refresh(): void {

    this.setDataTypes();

    this.ident.forEach((ident) => {
      const response = this.GetMonitorReadings(ident['id'], this.startTime, this.limit);

      response.then(res => {
        const items = res.readingsByDate.items;
        if (items.length > 0) {

          let lineChartData: Array<ChartDataSets> = [
            { data: [], label: this.readingType },
          ];
          let lineChartLabels: Array<Label> = [];

          lineChartData = [];
          this.dataTypes.forEach(line => {
            lineChartData.push({ data: [], label: line.label });
          });
          lineChartLabels = [];

          items.forEach(element => {
            let i = 0;
            this.dataTypes.forEach(line => {
              if (i == 0) {
                lineChartLabels.push(element.collection_time);
              }
              lineChartData[i++].data.push(element[line.key]);
            });
          });
          this.results[res.id] = {};
          this.results[res.id]['chartData'] = lineChartData;
          this.results[res.id]['chartLabels'] = lineChartLabels;
        }
      });
    });
  }
}
