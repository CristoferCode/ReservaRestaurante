// ReservationStepInfo.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservationStepInfo } from '../../src/components/reservation';

const mockRestaurants = [
   { id: 1, name: 'Lima Centro' },
   { id: 2, name: 'Miraflores' },
];

vi.mock('@/data', () => ({
   reasonData: [
      { id: 1, name: 'Cumpleaños' },
      { id: 2, name: 'Aniversario' },
   ]
}));

const reserveSetInfoMock = vi.fn();
const nextStepMock = vi.fn();

vi.mock('@/hook/reservationFromStep', () => ({
   useReservationFromStep: () => ({
      reserveSetInfo: reserveSetInfoMock,
      from: { info: {} }
   }),
   useGetAllRestaurants: () => ({
      restaurants: mockRestaurants
   }),
   useStepFormContext: () => ({
      nextStep: nextStepMock
   })
}));

describe('ReservationStepInfo - flujo real con shadcn Select', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('envía correctamente los datos al hacer submit', async () => {
      const user = userEvent.setup();

      render(<ReservationStepInfo />);

      //* Seleccionar restaurante
      const restaurantTrigger = screen.getByRole('button', {
         name: /Seleccione una localidad/i
      });
      await user.click(restaurantTrigger);
      await user.click(screen.getByRole('option', { name: 'Lima Centro' }));

      //* Seleccionar motivo
      const reasonTrigger = screen.getByRole('button', {
         name: /Seleccione un motivo/i
      });
      await user.click(reasonTrigger);
      await user.click(screen.getByRole('option', { name: 'Cumpleaños' }));

      //* Cambiar número de comensales
      const dinersInput = screen.getByRole('spinbutton', { name: /Personas/i });
      await user.clear(dinersInput);
      await user.type(dinersInput, '4');

      //* Hacer submit
      await user.click(screen.getByRole('button', { name: /Siguiente/i }));

      //* Verificaciones despues de submit
      expect(reserveSetInfoMock).toHaveBeenCalledWith({
         restaurant: 'Lima Centro',
         reason: 'Cumpleaños',
         diners: 4,
         restaurantId: 1
      });

      expect(nextStepMock).toHaveBeenCalled();
   });
});
