// ReservationStepDate.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservationStepDate } from '../../src/components/reservation';

const reserveSetDateMock = vi.fn();
const nextStepMock = vi.fn();

vi.mock('@/hook/reservationFromStep', () => ({
   useReservationFromStep: () => ({
      reserveSetDate: reserveSetDateMock
   }),
   useStepFormContext: () => ({
      nextStep: nextStepMock
   })
}));

describe('ReservationStepDate', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('llama a reserveSetDate y nextStep cuando se selecciona una fecha desde DayPicker', async () => {
      const user = userEvent.setup();
      render(<ReservationStepDate />);

      const dayButton = screen.getAllByRole('button', { name: /Select Day/i })[0];

      await user.click(dayButton);

      expect(reserveSetDateMock).toHaveBeenCalledTimes(1);
      expect(nextStepMock).toHaveBeenCalledTimes(1);
   });

   it('llama a reserveSetDate y nextStep cuando se selecciona una fecha desde CalendarButton', async () => {
      const user = userEvent.setup();
      render(<ReservationStepDate />);

      const openCalendarBtn = screen.getByRole('button', { name: /Seleccione una fecha/i });
      await user.click(openCalendarBtn);

      const dayFromCalendar = screen.getAllByRole('button', { name: /\d+/ })[0];
      await user.click(dayFromCalendar);

      expect(reserveSetDateMock).toHaveBeenCalledTimes(1);
      expect(nextStepMock).toHaveBeenCalledTimes(1);
   });
});
