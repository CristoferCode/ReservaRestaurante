import { cn, Validations } from '@/ultils';
import { Modal } from '../UI/common';
import { useState } from 'react';
import { useForm, useModalAsync } from '@/hook/common';
import { useReservation, useReservationFilter, useUserDetail } from '@/hook/dashboard';
import { AdminTableToasts } from '@/toasts';
import { DialogCancelReserve2 } from '../UI/dialog/DialigCancelReserve2';
import { UserToasts } from '@/toasts/UserToasts';
import {
   UserDetailHeader,
   UserDetailForm,
   UserDetailInfo,
   UserDetailMetrics,
   UserDetailTabs,
} from '.';
import { Card2 } from '../UI/card';
import { EditReservationModal } from '../calendar';


const initValidation = {
   name: [
      (value) => value && value?.length >= 3,
      'El nombre debe tener al menos 3 caracteres',
   ],
   email: [
      (value) => Validations.email(value),
      'El email debe tener al menos 3 caracteres',
   ],
   phone: [
      (value) => Validations.phone(value),
      'El telefono debe tener al menos 3 caracteres',
   ],
   address: [
      (value) => value && value?.length >= 3,
      'La direccion debe tener al menos 3 caracteres',
   ]
};

export const UserDetailModal = ({
   isOpen,
   onClose,
   selectUser,
   className
}) => {
   const [isEditing, setIsEditing] = useState(false);
   const [isEditReservation, setIsEditReservation] = useState(false);
   const [currentReservation, setCurrentReservation] = useState({})

   const { showAsyncModal } = useModalAsync();

   const {
      cancelFullReservation,
      confirmReservation,
      releasedReservation,
      isLoading,
   } = useReservation();

   const {
      updateProfile,
      loading,
   } = useUserDetail();

   const {
      filteredReservations,
      handleStatusFilter,
      selectedStatus
   } = useReservationFilter(selectUser.reservations);

   const {
      onSubmitForm,
      onValueChange,
      onInitialFrom,
      formState: {
         name,
         email,
         phone,
         address
      },
      formValidation: {
         nameValid,
         emailValid,
         phoneValid,
         addressValid
      },
   } = useForm({
      validations: initValidation,
      activeValidation: true,
      initialState: {
         name: selectUser.name,
         email: selectUser.email,
         phone: selectUser.phone,
         address: selectUser.address,
      },
   });

   const handleCancelReservation = async (reservation) => {
      const res = await showAsyncModal(({ onConfirm, onCancel }) => (
         <DialogCancelReserve2
            onCancel={onCancel}
            onConfirm={onConfirm}
            reservation={reservation}
         />
      ));
      if (!res) return;

      AdminTableToasts.cancelFullReservation(
         cancelFullReservation({
            idUser: reservation.idUser,
            tables: reservation.tables,
            idReservation: reservation.id,
            idRestaurant: reservation.idRestaurant,
            isNoShow: res.noShow || false,
            hour: reservation.hour,
            dateStr: reservation.dateStr
         })
      );
   };

   const handleConfirmReservation = (reservation) => {
      AdminTableToasts.confirmReserve(
         confirmReservation({
            idUser: reservation.idUser,
            hour: reservation.hour,
            idReservation: reservation.id,
            idRestaurant: reservation.idRestaurant,
            tablesReservation: reservation.tables,
            dateStr: reservation.dateStr,
         })
      );
   };

   const handleReleasedReservation = (reservation) => {
      AdminTableToasts.releaseReserve(
         releasedReservation({
            hour: reservation.hour,
            idUser: reservation.idUser,
            dateStr: reservation.dateStr,
            idRestaurant: reservation.idRestaurant,
            tablesReservation: reservation.tables,
            idReservation: reservation.id,
         })
      );
   };

   const handleEditReservetion = (reservation) => {
      setIsEditReservation(true);
      setCurrentReservation(reservation);
      console.log(currentReservation)
   };

   const onSubmit = onSubmitForm((value) => {
      UserToasts.updateProfile(
         updateProfile({
            ...value,
            idUser: selectUser.id
         }), {
         onSuccess: () => {
            setIsEditing(false);
            onInitialFrom({
               name: selectUser.name,
               email: selectUser.email,
               phone: selectUser.phone,
               address: selectUser.address,
            });
         }
      });
   });

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className=''
      >
         <Card2 className={cn('space-y-6', className)}>
            <UserDetailHeader
               isEditing={isEditing}
               loading={loading}
               selectUser={selectUser}
               setIsEditing={setIsEditing}
            />
            <div className='flex-1 space-y-4 flex flex-col items-start gap-4 p-0'>
               {isEditing ? (
                  <UserDetailForm
                     name={name}
                     email={email}
                     phone={phone}
                     address={address}
                     nameValid={nameValid}
                     emailValid={emailValid}
                     phoneValid={phoneValid}
                     addressValid={addressValid}
                     onValueChange={onValueChange}
                     onSubmit={onSubmit}
                  />
               ) : (
                  <UserDetailInfo selectUser={selectUser} />
               )}
            </div>
            <UserDetailMetrics selectUser={selectUser} />
            <UserDetailTabs
               isLoading={isLoading}
               selectUser={selectUser}
               selectedStatus={selectedStatus}
               handleStatusFilter={handleStatusFilter}
               filteredReservations={filteredReservations}
               handleEditReservetion={handleEditReservetion}
               handleCancelReservation={handleCancelReservation}
               handleConfirmReservation={handleConfirmReservation}
               handleReleasedReservation={handleReleasedReservation}
            />
         </Card2>
         {isEditReservation &&
            <EditReservationModal
               className={'w-xl'}
               activaBtns={['update']}
               isOpen={isEditReservation}
               onClose={() => setIsEditReservation(false)}
               reservation={currentReservation}
            />
         }
      </Modal>
   );
}

