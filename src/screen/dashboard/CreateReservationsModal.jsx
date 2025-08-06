import { FromReservation } from '@/components/common';
import { Card2 } from '@/components/UI/card';
import { Modal } from '@/components/UI/common';
import { useReservation } from '@/hook/dashboard';
import { useModalReservationsCreate } from '@/hook/modals';
import { ReservationToast } from '@/toasts';
import { cn } from '@/ultils';

export const CreateReservationsModal = ({
   className
}) => {
   const { closeModal, isOpen } = useModalReservationsCreate();

   const {
      reserveTable,
      isLoading: isLoadingReservation,
   } = useReservation()

   const onSubmit = (({
      // selectedTables,
      formState,
      resetForm,
   }) => {
      ReservationToast(
         reserveTable(formState), {
         onSuccess: () => {
            window.requestAnimationFrame(() => resetForm());
         },
      });
   });

   return (
      <Modal
         isOpen={isOpen}
         onClose={closeModal}
      >
         <Card2 className={cn(
            className
         )}>
            <FromReservation
               isOpen={isOpen}
               onSubmit={onSubmit}
               isEdit={false}
               btns={[
                  {
                     name: 'reserve',
                     label: 'Reservar',
                     variant: 'default',
                     disabled: isLoadingReservation,
                     type: 'submit',
                     size: 'lg',
                  },
               ]}
            />
         </Card2>
      </Modal>
   )
}