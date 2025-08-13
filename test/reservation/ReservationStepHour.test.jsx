import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReservationStepHour } from '../../src/components/reservation';
import { useReservationFromStep, useStepFormContext } from '@/hook/reservationFromStep';

const mockUseReservationFromStep = vi.mocked(useReservationFromStep);
const mockUseStepFormContext = vi.mocked(useStepFormContext);

vi.mock('../UI/common', () => ({
   Button: ({ children, ...props }) => (
      <button {...props}>{children}</button>
   )
}));

vi.mock('@/hook/reservationFromStep', () => ({
   useReservationFromStep: vi.fn(),
   useStepFormContext: vi.fn()
}));

describe('ReservationStepHour', () => {
   const reserveSetHourMock = vi.fn();
   const nextStepMock = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();

      mockUseReservationFromStep.mockReturnValue({
         isLoading: { hour: false },
         availableHour: [],
         reserveSetHour: reserveSetHourMock
      });

      mockUseStepFormContext.mockReturnValue({
         nextStep: nextStepMock
      });
   });

   it('muestra las horas disponibles y llama a reserveSetHour y nextStep al seleccionar una', async () => {
      const user = userEvent.setup();
      const availableHour = [
         { id: 1, name: '10:00', tablesAvailable: 3 },
         { id: 2, name: '12:00', tablesAvailable: 5 }
      ];

      mockUseReservationFromStep.mockReturnValue({
         isLoading: { hour: false },
         availableHour,
         reserveSetHour: reserveSetHourMock
      });

      render(<ReservationStepHour />);

      expect(screen.getByRole('button', { name: /10:00/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /12:00/i })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /10:00/i }));

      expect(reserveSetHourMock).toHaveBeenCalledWith({
         id: 1,
         name: '10:00',
         tablesAvailable: 3
      });
      expect(nextStepMock).toHaveBeenCalled();
   });

   it('muestra mensaje si no hay horas disponibles', () => {
      render(<ReservationStepHour />);

      expect(screen.getByText(/No hay horas disponibles/i)).toBeInTheDocument();
   });

   it('muestra loader cuando isLoading.hour es true', () => {
      mockUseReservationFromStep.mockReturnValue({
         isLoading: { hour: true },
         availableHour: [],
         reserveSetHour: reserveSetHourMock
      });

      render(<ReservationStepHour />);

      expect(document.querySelector('.flame')).toBeInTheDocument();
   });
});
