import { Injectable } from '@angular/core';
import { map, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  public readonly now$ = timer(0, 1000).pipe(map(() => new Date()));
}
