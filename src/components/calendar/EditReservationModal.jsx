import { useReservation, useReservationActions } from '@/hook/dashboard';
import { AdminTableToasts } from '@/toasts';
import { cn, DateParser, typeStatusTable } from '@/ultils';
import { Card2 } from '../UI/card';
import { Badge, CardTitle, Modal } from '../UI/common';
import { Label } from '../UI/from';
import { FromReservation, StateReservationButtons } from '../common';

export const EditReservationModal = ({
   className,
   isOpen,
   onClose,
   reservation,
}) => {
   const {
      updateReservation,
   } = useReservation()

   const {
      isLoading,
      releaseReservationWithToast,
      confirmReservationWithToast,
      cancelReservationWithToastSimple,
   } = useReservationActions();

   const isPending = reservation?.status === typeStatusTable.PENDING;

   const onSubmit = (({
      formState,
   }) => {
      if (!isPending) return;
      AdminTableToasts.updateReservation(
         updateReservation(formState),
      );
   });

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
      >
         <Card2 className={cn(
            className
         )}>
            <CardTitle className={'flex justify-center items-center gap-4 mb-2'}>
               <Label>
                  Estado de la reserva
               </Label>

               {reservation?.status &&
                  <Badge
                     className={'h-5'}
                     state={reservation.status}
                  />
               }
            </CardTitle>

            <FromReservation
               isEdit={true}
               isOpen={isOpen}
               isReadOnly={!isPending}
               onSubmit={onSubmit}
               initialValues={{
                  ...reservation,
                  date: DateParser.toDate(reservation?.dateStr),
               }}
               btns={[
                  {
                     name: 'update',
                     label: 'Actualizar',
                     variant: 'default',
                     disabled: isLoading,
                     disabledBySelected: true,
                     type: 'submit',
                     size: 'lg',
                  },
               ]}
            >
               <StateReservationButtons
                  showButtons={['cancel', 'confirm', 'release']}
                  reservation={reservation}
                  onCancelReservation={cancelReservationWithToastSimple}
                  onConfirmReservation={confirmReservationWithToast}
                  onReleasedReservation={releaseReservationWithToast}
                  isLoading={isLoading}
               />
            </FromReservation>
         </Card2>
      </Modal>
   )
}