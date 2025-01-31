import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeService } from '../../services/time.service';
import { TimeSlot } from '../../time-slots';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent {
  public readonly timeSlot = input.required<TimeSlot>();

  protected readonly now$ = inject(TimeService).now$;
  protected readonly color = computed(() => this.timeSlot().color);
  protected readonly opacity = computed(() => (!this.timeSlot().dim ? 1 : 0.5));
}
