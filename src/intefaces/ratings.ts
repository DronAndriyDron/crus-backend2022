export interface IRatings {
  id: number;
  minutes: number;
  rating: number;
  goals: number;
  shotsTotal: number;
  shotsOnGoal:number;
  passesTotal:number;
  passesAccuracy: number;
  passesKey: number;
  dribblesTotal: number;
  dribblesSuccess:number;
  foulCommitted:number;
  foulDrawn: number;
  offsides:number;
  yellowCars: number;
  redCards: number;
}