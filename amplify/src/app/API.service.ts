/* tslint:disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreateReadingInput = {
  collection_time: string;
  humidity?: number | null;
  id?: string | null;
  monitorID: string;
  light?: number | null;
  nh3?: number | null;
  oxidised?: number | null;
  pm1?: number | null;
  pm10?: number | null;
  pm25?: number | null;
  pressure?: number | null;
  reduced?: number | null;
  temperature?: number | null;
  raw_temperature?: number | null;
  comp_factor?: number | null;
  volume?: number | null;
};

export type UpdateReadingInput = {
  collection_time?: string | null;
  humidity?: number | null;
  id: string;
  monitorID?: string | null;
  light?: number | null;
  nh3?: number | null;
  oxidised?: number | null;
  pm1?: number | null;
  pm10?: number | null;
  pm25?: number | null;
  pressure?: number | null;
  reduced?: number | null;
  temperature?: number | null;
  raw_temperature?: number | null;
  comp_factor?: number | null;
  volume?: number | null;
};

export type DeleteReadingInput = {
  id?: string | null;
};

export type CreateMonitorInput = {
  id?: string | null;
  ident: string;
  comp_factor?: number | null;
  target_temp?: number | null;
};

export type UpdateMonitorInput = {
  id: string;
  ident?: string | null;
  comp_factor?: number | null;
  target_temp?: number | null;
};

export type DeleteMonitorInput = {
  id?: string | null;
};

export type ModelReadingFilterInput = {
  collection_time?: ModelStringFilterInput | null;
  humidity?: ModelFloatFilterInput | null;
  id?: ModelIDFilterInput | null;
  monitorID?: ModelIDFilterInput | null;
  light?: ModelFloatFilterInput | null;
  nh3?: ModelFloatFilterInput | null;
  oxidised?: ModelFloatFilterInput | null;
  pm1?: ModelFloatFilterInput | null;
  pm10?: ModelFloatFilterInput | null;
  pm25?: ModelFloatFilterInput | null;
  pressure?: ModelFloatFilterInput | null;
  reduced?: ModelFloatFilterInput | null;
  temperature?: ModelFloatFilterInput | null;
  raw_temperature?: ModelFloatFilterInput | null;
  comp_factor?: ModelFloatFilterInput | null;
  volume?: ModelFloatFilterInput | null;
  and?: Array<ModelReadingFilterInput | null> | null;
  or?: Array<ModelReadingFilterInput | null> | null;
  not?: ModelReadingFilterInput | null;
};

export type ModelStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelFloatFilterInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  contains?: number | null;
  notContains?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIDFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelMonitorFilterInput = {
  id?: ModelIDFilterInput | null;
  ident?: ModelStringFilterInput | null;
  comp_factor?: ModelFloatFilterInput | null;
  target_temp?: ModelFloatFilterInput | null;
  and?: Array<ModelMonitorFilterInput | null> | null;
  or?: Array<ModelMonitorFilterInput | null> | null;
  not?: ModelMonitorFilterInput | null;
};

export type CreateReadingMutation = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type UpdateReadingMutation = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type DeleteReadingMutation = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type CreateMonitorMutation = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type UpdateMonitorMutation = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type DeleteMonitorMutation = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type GetReadingQuery = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type ListReadingsQuery = {
  __typename: "ModelReadingConnection";
  items: Array<{
    __typename: "Reading";
    collection_time: string;
    humidity: number | null;
    id: string;
    monitorID: string;
    light: number | null;
    nh3: number | null;
    oxidised: number | null;
    pm1: number | null;
    pm10: number | null;
    pm25: number | null;
    pressure: number | null;
    reduced: number | null;
    temperature: number | null;
    raw_temperature: number | null;
    comp_factor: number | null;
    volume: number | null;
  } | null> | null;
  nextToken: string | null;
};

export type GetMonitorQuery = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type ListMonitorsQuery = {
  __typename: "ModelMonitorConnection";
  items: Array<{
    __typename: "Monitor";
    id: string;
    ident: string;
    comp_factor: number | null;
    target_temp: number | null;
    readingsByDate: {
      __typename: "ModelReadingConnection";
      nextToken: string | null;
    } | null;
  } | null> | null;
  nextToken: string | null;
};

export type OnCreateReadingSubscription = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type OnUpdateReadingSubscription = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type OnDeleteReadingSubscription = {
  __typename: "Reading";
  collection_time: string;
  humidity: number | null;
  id: string;
  monitorID: string;
  light: number | null;
  nh3: number | null;
  oxidised: number | null;
  pm1: number | null;
  pm10: number | null;
  pm25: number | null;
  pressure: number | null;
  reduced: number | null;
  temperature: number | null;
  raw_temperature: number | null;
  comp_factor: number | null;
  volume: number | null;
};

export type OnCreateMonitorSubscription = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnUpdateMonitorSubscription = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnDeleteMonitorSubscription = {
  __typename: "Monitor";
  id: string;
  ident: string;
  comp_factor: number | null;
  target_temp: number | null;
  readingsByDate: {
    __typename: "ModelReadingConnection";
    items: Array<{
      __typename: "Reading";
      collection_time: string;
      humidity: number | null;
      id: string;
      monitorID: string;
      light: number | null;
      nh3: number | null;
      oxidised: number | null;
      pm1: number | null;
      pm10: number | null;
      pm25: number | null;
      pressure: number | null;
      reduced: number | null;
      temperature: number | null;
      raw_temperature: number | null;
      comp_factor: number | null;
      volume: number | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateReading(
    input: CreateReadingInput
  ): Promise<CreateReadingMutation> {
    const statement = `mutation CreateReading($input: CreateReadingInput!) {
        createReading(input: $input) {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateReadingMutation>response.data.createReading;
  }
  async UpdateReading(
    input: UpdateReadingInput
  ): Promise<UpdateReadingMutation> {
    const statement = `mutation UpdateReading($input: UpdateReadingInput!) {
        updateReading(input: $input) {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateReadingMutation>response.data.updateReading;
  }
  async DeleteReading(
    input: DeleteReadingInput
  ): Promise<DeleteReadingMutation> {
    const statement = `mutation DeleteReading($input: DeleteReadingInput!) {
        deleteReading(input: $input) {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteReadingMutation>response.data.deleteReading;
  }
  async CreateMonitor(
    input: CreateMonitorInput
  ): Promise<CreateMonitorMutation> {
    const statement = `mutation CreateMonitor($input: CreateMonitorInput!) {
        createMonitor(input: $input) {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateMonitorMutation>response.data.createMonitor;
  }
  async UpdateMonitor(
    input: UpdateMonitorInput
  ): Promise<UpdateMonitorMutation> {
    const statement = `mutation UpdateMonitor($input: UpdateMonitorInput!) {
        updateMonitor(input: $input) {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateMonitorMutation>response.data.updateMonitor;
  }
  async DeleteMonitor(
    input: DeleteMonitorInput
  ): Promise<DeleteMonitorMutation> {
    const statement = `mutation DeleteMonitor($input: DeleteMonitorInput!) {
        deleteMonitor(input: $input) {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteMonitorMutation>response.data.deleteMonitor;
  }
  async GetReading(id: string): Promise<GetReadingQuery> {
    const statement = `query GetReading($id: ID!) {
        getReading(id: $id) {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetReadingQuery>response.data.getReading;
  }
  async ListReadings(
    filter?: ModelReadingFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListReadingsQuery> {
    const statement = `query ListReadings($filter: ModelReadingFilterInput, $limit: Int, $nextToken: String) {
        listReadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            collection_time
            humidity
            id
            monitorID
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
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListReadingsQuery>response.data.listReadings;
  }
  async GetMonitor(id: string): Promise<GetMonitorQuery> {
    const statement = `query GetMonitor($id: ID!) {
        getMonitor(id: $id) {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetMonitorQuery>response.data.getMonitor;
  }
  async ListMonitors(
    filter?: ModelMonitorFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListMonitorsQuery> {
    const statement = `query ListMonitors($filter: ModelMonitorFilterInput, $limit: Int, $nextToken: String) {
        listMonitors(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            ident
            comp_factor
            target_temp
            readingsByDate {
              __typename
              nextToken
            }
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListMonitorsQuery>response.data.listMonitors;
  }
  OnCreateReadingListener: Observable<
    OnCreateReadingSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateReading {
        onCreateReading {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`
    )
  ) as Observable<OnCreateReadingSubscription>;

  OnUpdateReadingListener: Observable<
    OnUpdateReadingSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateReading {
        onUpdateReading {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`
    )
  ) as Observable<OnUpdateReadingSubscription>;

  OnDeleteReadingListener: Observable<
    OnDeleteReadingSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteReading {
        onDeleteReading {
          __typename
          collection_time
          humidity
          id
          monitorID
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
      }`
    )
  ) as Observable<OnDeleteReadingSubscription>;

  OnCreateMonitorListener: Observable<
    OnCreateMonitorSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateMonitor {
        onCreateMonitor {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
      }`
    )
  ) as Observable<OnCreateMonitorSubscription>;

  OnUpdateMonitorListener: Observable<
    OnUpdateMonitorSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateMonitor {
        onUpdateMonitor {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
      }`
    )
  ) as Observable<OnUpdateMonitorSubscription>;

  OnDeleteMonitorListener: Observable<
    OnDeleteMonitorSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteMonitor {
        onDeleteMonitor {
          __typename
          id
          ident
          comp_factor
          target_temp
          readingsByDate {
            __typename
            items {
              __typename
              collection_time
              humidity
              id
              monitorID
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
      }`
    )
  ) as Observable<OnDeleteMonitorSubscription>;
}
