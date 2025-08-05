import { getAllUsersThunk, getByIdUserReservationThunk, setSelectedUserAction } from '@/doman/store/dashboard';
import { DateParser } from '@/ultils';
import { Users } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useLoadUsers = () => {
   const state = useSelector((state) => state.usersReducer)
   const dispatch = useDispatch();

   useEffect(() => {
      if (state.isRequest) return;
      dispatch(getAllUsersThunk());
   }, [state.isRequest]);

   const getByIdUserReservations = (idUser) => {
      const reservations = state.reservations.find((r) => r.idUser === idUser);
      if (reservations) {
         dispatch(setSelectedUser({
            idUser,
            reservations: reservations
         }))
         return;
      };
      dispatch(getByIdUserReservationThunk(idUser));
   }

   const calculateRate = (user) => {
      const rate = ((user.metrics?.released || 0) / (user.metrics?.total || 0) * 100).toFixed(1)

      let rateSuccess = ((user.metrics?.released / user.totalReservas) * 100).toFixed(1)
      rateSuccess = isNaN(rateSuccess) ? 0 : rateSuccess;

      return {
         rate: isNaN(rate) ? '0.0' : rate,
         rateSuccess
      }
   };

   const metrics = useMemo(() => {
      return [
         {
            id: 'clients',
            count: state.users.length,
            rate: 0,
            title: 'Total Clientes',
            icon: Users,
            color: 'text-muted-foreground',
            textColor: 'text-muted-foreground',
            description: 'Nuevos clientes',
         },
      ]
   }, [state.users]);

   const users = useMemo(() => {
      return state.users.map((user) => {
         // const rate = ((user.metrics?.released || 0) / (user.metrics?.total || 0) * 100).toFixed(1)

         // let rateSuccess = ((user.metrics?.released / user.totalReservas) * 100).toFixed(1)
         // rateSuccess = isNaN(rateSuccess) ? 0 : rateSuccess;
         const { rate, rateSuccess } = calculateRate(user);
         return {
            ...user,
            updatedAt: DateParser.toString(new Date(user.updatedAt)),
            rate: rate,
            rateSuccess
         };
      })
   }, [state.users])

   const selectedUser = useMemo(() => {
      if (!state.selectedUser) return {};
      const { rate, rateSuccess } = calculateRate(state.selectedUser);
      return {
         ...state.selectedUser,
         rate: rate,
         rateSuccess
      }
   }, [state.selectedUser]);

   const setSelectedUser = (user) => {
      dispatch(setSelectedUserAction(user));
   }

   return {
      users: users,
      metrics: metrics,
      reservations: state.reservations,
      selectedUser: selectedUser,
      loadings: {
         users: state.loadings.users,
         reservations: state.loadings.reservations
      },

      // FUNCTIONS
      getByIdUserReservations,
      setSelectedUser,
   }
}
