import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClockComponent } from './components/clock/clock.component';
import { TimeSlot } from './time-slots';
import { distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { TimeService } from './services/time.service';
import { CommonModule } from '@angular/common';
import { FullscreenService } from './services/fullscreen.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ClockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly fullscreenService = inject(FullscreenService);
  private readonly timeSlots: TimeSlot[] = [
    { color: 'red', hours: 6, minutes: 30, dim: true },
    { color: 'yellow', hours: 7, minutes: 0 },
    { color: 'green', hours: 20, minutes: 0 },
  ];

  protected onClick() {
    this.fullscreenService.toggle();
  }

  private readonly timeSlots$ = of(this.timeSlots);

  private readonly now$ = inject(TimeService).now$;

  protected readonly activeTimeSlot$ = this.timeSlots$.pipe(
    map((timeSlots) =>
      [...timeSlots].sort((a, b) => a.hours - b.hours || a.minutes - b.minutes),
    ),
    switchMap((timeSlots) =>
      this.now$.pipe(
        map(
          (date) =>
            timeSlots.find((x) => this.isBefore(date, x.hours, x.minutes)) ??
            timeSlots[0],
        ),
      ),
    ),
    distinctUntilChanged(),
  );

  private isBefore(date: Date, hour: number, minute: number) {
    return (
      date.getHours() < hour ||
      (date.getHours() === hour && date.getMinutes() < minute)
    );
  }
}
